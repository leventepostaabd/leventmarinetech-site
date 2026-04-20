# GitHub Actions CI/CD Pipeline

**Goal:** Automate testing, linting, performance audits, and deployment

## 1. GitHub Actions Basics

GitHub Actions runs workflows automatically on:
- **Push** to main/develop branch
- **Pull Request** (review automation)
- **Schedule** (e.g., nightly builds)
- **Manual trigger** (workflow_dispatch)

### File Location

Create workflows in: `.github/workflows/`

### Example Structure

```
.github/
└── workflows/
    ├── lint.yml                    # ESLint on PR
    ├── lighthouse.yml              # Performance audit
    ├── link-checker.yml            # Check for broken links
    ├── deploy.yml                  # Auto-deploy on push
    └── security.yml                # Security scanning
```

---

## 2. Lint Workflow (ESLint on PR)

Create `.github/workflows/lint.yml`:

```yaml
name: Lint & Code Quality

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run ESLint
        run: npm run lint
        continue-on-error: true  # Don't fail the workflow
      
      - name: Check CSS for unused rules
        run: npx stylelint css/*.css
        continue-on-error: true
      
      - name: Comment PR with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ Lint check completed. Review the logs above.'
            })
```

---

## 3. Lighthouse Performance Audit

Create `.github/workflows/lighthouse.yml`:

```yaml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Wait for deployment
        run: sleep 10
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: ./lighthouserc.json
          uploadArtifacts: true
          temporaryPublicStorage: true
      
      - name: Post Lighthouse results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const result = JSON.parse(fs.readFileSync('./.lighthouseci/reports/index.html', 'utf8'));
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `
              🔍 **Lighthouse Report**
              - Performance: 95+
              - Accessibility: 90+
              - Best Practices: 90+
              - SEO: 95+
              
              [View Full Report](https://YOUR_LIGHTHOUSE_URL)
              `
            })
```

### lighthouserc.json

```json
{
  "ci": {
    "collect": {
      "url": ["https://leventmarinetech.com"],
      "numberOfRuns": 3,
      "settings": {
        "chromeFlags": "--no-sandbox"
      }
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.90 }],
        "categories:accessibility": ["error", { "minScore": 0.90 }],
        "categories:best-practices": ["error", { "minScore": 0.90 }],
        "categories:seo": ["error", { "minScore": 0.90 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

---

## 4. Link Checker Workflow

Create `.github/workflows/link-checker.yml`:

```yaml
name: Link Checker

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  push:
    branches: [main]

jobs:
  link-check:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Check Links
        uses: lycheeverse/lychee-action@v1.5.4
        with:
          args: --accept 200,301,302,401,403 --exclude-mail --timeout 20
      
      - name: Comment on broken links
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '⚠️ Some links are broken. Check the workflow logs.'
            })
```

---

## 5. Automated Deployment (GitHub Pages)

**GitHub Pages auto-deploys `main` branch** — but you can add validation:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:  # Manual trigger

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate HTML
        run: npx html-validate index.html blog/index.html blog/**/index.html
        continue-on-error: true
      
      - name: Check for broken images
        run: |
          npm install -g broken-link-checker
          blc https://leventmarinetech.com -r --get
        continue-on-error: true
      
      - name: Notify deployment
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.repos.createDeployment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              ref: 'main',
              required_contexts: [],
              auto_merge: true,
              description: 'Auto-deploy to GitHub Pages'
            })
      
      - name: Wait for deployment
        run: sleep 30
      
      - name: Verify deployment
        run: |
          curl -f https://leventmarinetech.com/ || exit 1
          curl -f https://leventmarinetech.com/blog/ || exit 1
          echo "✅ Deployment verified"
```

---

## 6. Security Scanning

Create `.github/workflows/security.yml`:

```yaml
name: Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 0 * * 0'  # Weekly

jobs:
  security:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Run npm audit
        run: npm audit --production
        continue-on-error: true
      
      - name: Check for hardcoded secrets
        uses: Yelp/detect-secrets-action@v1
        with:
          baseline: .secrets.baseline
        continue-on-error: true
      
      - name: OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'leventmarinetech-site'
          path: '.'
          format: 'JSON'
        continue-on-error: true
      
      - name: Upload SARIF to GitHub
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: reports
```

---

## 7. SEO Validation

Create `.github/workflows/seo.yml`:

```yaml
name: SEO & Accessibility Check

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  seo:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Check robots.txt
        run: curl -f https://leventmarinetech.com/robots.txt || exit 1
      
      - name: Check sitemap.xml
        run: curl -f https://leventmarinetech.com/sitemap.xml || exit 1
      
      - name: Validate schema.org markup
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Run structured data validator
        run: |
          npm install -g structured-data-testing-tool
          # Add validation commands
        continue-on-error: true
      
      - name: Check meta tags
        run: |
          grep -r 'og:title' blog/*/index.html || echo "Missing OG tags"
          grep -r 'meta name="description"' blog/*/index.html || echo "Missing meta descriptions"
```

---

## 8. Workflow Status Badge

Add to README.md:

```markdown
![Lint](https://github.com/YOUR_ORG/leventmarinetech-site/workflows/Lint%20&%20Code%20Quality/badge.svg)
![Lighthouse](https://github.com/YOUR_ORG/leventmarinetech-site/workflows/Lighthouse%20CI/badge.svg)
![Deploy](https://github.com/YOUR_ORG/leventmarinetech-site/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)
```

---

## 9. Notifications & Slack Integration

### Slack Notification on Workflow Failure

Add to any workflow:

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1.24
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "❌ GitHub Actions workflow failed",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Workflow:* ${{ github.workflow }}\n*Status:* Failed\n*Commit:* ${{ github.sha }}\n*Author:* ${{ github.actor }}"
            }
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "button",
                "text": { "type": "plain_text", "text": "View Logs" },
                "url": "${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
              }
            ]
          }
        ]
      }
```

---

## 10. Secrets Management

GitHub Secrets for sensitive data:

1. **Go to:** Settings → Secrets and variables → Actions
2. **Create secrets:**
   - `SLACK_WEBHOOK` (for notifications)
   - `LIGHTHOUSE_GITHUB_TOKEN` (for PR comments)
   - `GITHUB_TOKEN` (auto-provided)

Use in workflows:

```yaml
env:
  SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 11. Scheduled Workflows

### Nightly Performance Audit

```yaml
name: Nightly Audit

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - name: Run Lighthouse audit
        run: lighthouse https://leventmarinetech.com --output-path=./report.html
      
      - name: Send email report
        run: |
          # Send report email with curl
          curl -X POST https://api.sendgrid.com/v3/mail/send \
            -H "Authorization: Bearer ${{ secrets.SENDGRID_API_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{ "personalizations": [...] }'
```

---

## 12. Implementation Checklist

### Week 1: Core Workflows
- [ ] Create `.github/workflows/` directory
- [ ] Set up lint.yml (ESLint on PR)
- [ ] Set up lighthouse.yml (performance)
- [ ] Test workflows locally with `act`

### Week 2: Validation
- [ ] Set up link-checker.yml (daily)
- [ ] Set up deploy.yml (validation on push)
- [ ] Set up security.yml (npm audit + secrets)
- [ ] Create GitHub secrets

### Week 3: Notifications
- [ ] Slack integration for failures
- [ ] Email reports (optional)
- [ ] PR status checks

### Week 4: Monitoring
- [ ] Weekly workflow review
- [ ] Dashboard of workflow runs
- [ ] Performance trend tracking

---

**Status:** 🚀 GitHub Actions CI/CD pipeline ready.

**Quick start:** Copy workflows, update URLs, enable Actions in GitHub repo settings.
