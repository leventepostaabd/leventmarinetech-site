# Git Workflow & Code Quality Standards

**Goal:** Maintain clean commit history, code consistency, prevent errors

## 1. Commit Message Convention (Conventional Commits)

### Format

```
<type>(<scope>): <subject>

<body (optional)>

<footer (optional)>
```

### Types

- **feat:** New feature (blog post, service)
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code formatting (no logic change)
- **refactor:** Code restructuring
- **perf:** Performance improvement
- **test:** Test additions
- **chore:** Build, CI/CD, dependencies
- **ci:** CI/CD configuration

### Examples

✅ Good:
```
feat(blog): add insulation testing guide post

- Includes Megger procedure and case study
- Internal linking to class survey post
- Schema.org Article markup + OG tags

Closes #15
```

❌ Bad:
```
fixed stuff
updated files
new blog post
```

### Subject Line Rules

- Start with lowercase (except proper nouns)
- Imperative mood: "add" not "added" or "adds"
- No period at end
- Max 50 characters
- Reference issue: `Closes #123`

### Body Rules (Optional)

- Explain **what** and **why**, not **how**
- Wrap at 72 characters
- Separate from subject with blank line
- Use bullet points for multiple changes

---

## 2. Branch Strategy (Git Flow)

### Main Branches

- **`main`:** Production-ready code (auto-deploys to GitHub Pages)
- **`develop`:** Integration branch (staging)

### Feature Branches

Name pattern: `feature/slug-description`

Examples:
```bash
git checkout -b feature/add-blog-post-4
git checkout -b feature/lighthouse-optimization
git checkout -b feature/analytics-setup
```

### Workflow

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# 2. Make changes, commit
git add [files]
git commit -m "feat(scope): description"

# 3. Push to GitHub
git push origin feature/my-feature

# 4. Create Pull Request (PR)
# → GitHub web UI: Compare & pull request
# → Title: "feat: description"
# → Description: Explain changes, link issues
# → Request review (optional)

# 5. Merge to develop after review
# → Squash commits if needed
git checkout develop
git pull origin develop
git merge --squash feature/my-feature
git commit -m "feat(scope): description (#PR_NUMBER)"

# 6. Delete feature branch
git branch -d feature/my-feature
git push origin --delete feature/my-feature

# 7. Merge develop → main (release)
git checkout main
git pull origin main
git merge develop
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin main --tags
```

---

## 3. ESLint Setup (Code Quality)

### Install

```bash
npm install --save-dev eslint eslint-config-airbnb-base eslint-plugin-import
npx eslint --init
```

### .eslintrc.json

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": ["airbnb-base"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn"],
    "prefer-const": "warn",
    "no-var": "error"
  }
}
```

### Run

```bash
npm run lint              # Check files
npm run lint -- --fix    # Auto-fix issues
```

### Add to package.json

```json
{
  "scripts": {
    "lint": "eslint js/",
    "lint:fix": "eslint js/ --fix",
    "format": "prettier --write js/ css/"
  }
}
```

---

## 4. Pre-Commit Hooks (Prevent Bad Commits)

### Install Husky

```bash
npm install --save-dev husky
npx husky install
```

### Create .husky/pre-commit

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npm run build  # if applicable
```

**Effect:** Git commit fails if lint errors exist

### Create .husky/commit-msg

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check commit message format
echo "$1" | grep -E '^(feat|fix|docs|style|refactor|perf|test|chore|ci)(\(.+\))?!?: ' || exit 1
```

---

## 5. Pull Request Template

Create `.github/pull_request_template.md`:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Feature (new functionality)
- [ ] Bug fix
- [ ] Documentation
- [ ] Performance improvement

## Related Issues
Closes #[issue number]

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Lighthouse audit OK (if frontend)

## Checklist
- [ ] Code follows style guidelines
- [ ] Commit messages follow convention
- [ ] No breaking changes
- [ ] Documentation updated
```

---

## 6. Code Review Checklist

**Reviewer should check:**

- [ ] **Correctness:** Does code do what PR claims?
- [ ] **Performance:** Any unnecessary loops or database queries?
- [ ] **Security:** Any injection risks, credential leaks?
- [ ] **Style:** Follows project conventions?
- [ ] **Testing:** Adequate test coverage?
- [ ] **Documentation:** Clear comments, updated README?
- [ ] **Accessibility:** Changes don't break a11y?
- [ ] **Responsiveness:** Mobile-friendly?

**Example comment:**
```
Great PR! Few suggestions:
1. Line 45: Use `const` instead of `let` (immutable preference)
2. Consider extracting this loop into a separate function
3. Add JSDoc comment explaining parameters

Otherwise looks good! 👍
```

---

## 7. Versioning (Semantic Versioning)

### Format: MAJOR.MINOR.PATCH

- **MAJOR:** Breaking changes
- **MINOR:** New features (backward compatible)
- **PATCH:** Bug fixes

### Examples

```
v1.0.0  →  Initial release
v1.1.0  →  Added blog posts (backward compatible)
v1.1.1  →  Fixed mobile nav bug
v2.0.0  →  Redesigned contact form (breaking)
```

### Create Git Tag

```bash
git tag -a v1.1.0 -m "Release version 1.1.0 — Blog posts + analytics"
git push origin v1.1.0
```

---

## 8. .gitignore (Don't commit secrets!)

```
# Environment
.env
.env.local
.env.*.local

# Dependencies
node_modules/
package-lock.json

# IDE
.vscode/
.idea/
*.swp
*.swo

# Build
dist/
build/
*.min.js
*.min.css

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Sensitive
secrets/
credentials.json
```

---

## 9. Code Style Guide (CSS/JS)

### CSS

```css
/* Use CSS variables (already established) */
:root {
  --c-primary: #0B1F3A;
  --c-accent: #F5A524;
}

/* Naming convention: kebab-case */
.service-card {
  background: var(--c-surface);
}

.service-card.is-active {
  border-color: var(--c-accent);
}

/* Mobile-first responsive */
@media (min-width: 768px) {
  .service-card {
    grid-column: span 2;
  }
}
```

### JavaScript

```javascript
// Use const by default, let if needed, never var
const MAX_RETRIES = 3;
let attemptCount = 0;

// Use meaningful names
const fetchUserData = async (userId) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
};

// Arrow functions for callbacks
array.map((item) => item.value);

// Template literals for strings
const message = `Hello, ${name}!`;
```

---

## 10. Deployment Checklist

Before pushing to `main`:

- [ ] All tests pass locally
- [ ] Lighthouse audit ≥ 90 (performance)
- [ ] No console errors in DevTools
- [ ] Mobile responsive tested
- [ ] Accessibility (axe DevTools) OK
- [ ] Commit messages follow convention
- [ ] PR reviewed and approved
- [ ] Feature branch deleted after merge

---

## 11. Team Collaboration (If applicable)

### Issue Templates

Create `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
## Bug Description
Clear description of bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
Add screenshots if possible

## Environment
- Browser: Chrome 110
- Device: MacBook Pro
```

---

## 12. Local Development Setup

```bash
# Clone repo
git clone https://github.com/YourOrg/leventmarinetech-site
cd leventmarinetech-site

# Install dependencies
npm install

# Set up git hooks
npx husky install

# Create feature branch
git checkout -b feature/my-feature

# Start development
npm run dev          # if applicable
npm run lint         # check code quality
npm run build        # build if needed

# Commit changes
git add [files]
git commit -m "feat(scope): description"

# Push and create PR
git push origin feature/my-feature
```

---

**Status:** 📋 Git workflow + code quality standards ready. **Implement pre-commit hooks + PR template immediately.**
