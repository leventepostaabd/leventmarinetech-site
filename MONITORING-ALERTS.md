# Monitoring & Error Tracking Setup

**Goal:** Detect issues, track performance, proactive alerting

## 1. Error Tracking (Sentry)

### Setup

1. **Create account:** https://sentry.io
2. **Create project:**
   - Platform: JavaScript
   - Environment: Production
3. **Get DSN key:** (looks like `https://key@sentry.io/project`)

### Add to index.html

```html
<script>
  Sentry.init({
    dsn: "https://YOUR_DSN@sentry.io/PROJECT_ID",
    environment: "production",
    tracesSampleRate: 0.1,  // 10% of transactions
    release: "1.1.0",  // Your version
    beforeSend(event, hint) {
      // Filter out errors you want to ignore
      if (event.message && event.message.includes('ad blocked')) {
        return null;
      }
      return event;
    }
  });
</script>

<!-- Sentry script -->
<script src="https://browser.sentry-cdn.com/7.80.0/bundle.min.js"></script>
```

### Custom Event Tracking

```javascript
// app.js
function trackContactFormSubmit(data) {
  Sentry.captureMessage('Contact form submitted', 'info', {
    tags: {
      form_type: 'contact',
      service: data.service,
      urgency: data.urgency
    },
    extra: {
      company: data.company,
      email: data.email
    }
  });
}

// Track errors
try {
  // risky code
} catch (error) {
  Sentry.captureException(error, {
    tags: { component: 'form_handler' }
  });
}
```

### Alerting

In Sentry Dashboard:
1. **Alerts** → Create new alert
2. **Condition:** When `error.level` is `error` or `fatal`
3. **Action:** Send email to `info@leventmarinetech.com`
4. **Slack integration** (optional): `#alerts` channel

---

## 2. Performance Monitoring (Web Vitals)

### Track Core Web Vitals

```javascript
// Add to app.js (after Sentry init)
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(metric => {
  Sentry.captureMessage('CLS: ' + metric.value, 'info');
  console.log('CLS:', metric.value);  // Goal: < 0.1
});

getFID(metric => {
  Sentry.captureMessage('FID: ' + metric.value, 'info');
  console.log('FID:', metric.value);  // Goal: < 100ms
});

getFCP(metric => {
  console.log('FCP:', metric.value);  // Goal: < 1.8s
});

getLCP(metric => {
  console.log('LCP:', metric.value);  // Goal: < 2.5s
});

getTTFB(metric => {
  console.log('TTFB:', metric.value);  // Goal: < 600ms
});
```

### User Performance Metrics

```javascript
// Calculate custom metrics
function trackPageLoadTime() {
  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  
  Sentry.captureMessage(`Page load: ${pageLoadTime}ms`, 'info');
  console.log('Page load time:', pageLoadTime, 'ms');
}

// Call on page load
window.addEventListener('load', trackPageLoadTime);
```

---

## 3. Uptime Monitoring (Pingdom / Better Uptime)

### Setup (Better Uptime - recommended)

1. **Sign up:** https://betteruptime.com
2. **Add monitor:**
   - Name: `leventmarinetech.com`
   - URL: `https://www.leventmarinetech.com`
   - Check interval: 5 minutes
   - Locations: Multiple regions (USA, EU, Asia)

3. **Alerts:**
   - [ ] Email when down
   - [ ] Slack notification
   - [ ] SMS (high priority)

### Status Page (Optional)

Better Uptime provides public status page:
- URL: `https://status.leventmarinetech.com`
- Shows last 90 days uptime
- Share with customers/stakeholders

---

## 4. Log Aggregation (Papertrail / LogRocket)

### LogRocket (Frontend Logging)

1. **Sign up:** https://logrocket.com
2. **Create project:** JavaScript
3. **Add snippet:**

```html
<script src="https://cdn.lr-ingest.io/LogRocket.min.js" crossorigin="anonymous"></script>
<script>
  window.LogRocket && window.LogRocket.init('your-project-id', {
    console: {
      shouldAggregateConsoleErrors: true
    },
    dom: {
      inputSanitizer: true,
      inputCersorPosition: true
    }
  });
  
  // Integrate with Sentry
  LogRocket.getSessionURL(sessionURL => {
    Sentry.captureMessage('LogRocket session URL: ' + sessionURL);
  });
</script>
```

**Features:**
- Session replay (video playback of user actions)
- Console log capture
- Network request tracking
- Redux/Vuex action tracking
- Performance monitoring

---

## 5. Alerting Rules & Thresholds

### Performance Alerts

| Metric | Threshold | Action |
|--------|-----------|--------|
| LCP | > 3s | Investigate image optimization |
| FID | > 150ms | Check JavaScript blocking |
| CLS | > 0.15 | Fix layout shifts |
| Page load | > 4s | Minify assets |
| 404 errors | > 5/hour | Check links |
| 5xx errors | Any | Immediate action |

### Error Alerts

```javascript
// Example: Alert on form submission failure
fetch('/api/contact', { /* ... */ })
  .catch(error => {
    Sentry.captureException(error, {
      level: 'fatal',  // High severity
      tags: { component: 'contact_form' }
    });
    // Also send email alert
    sendAdminAlert('Contact form API failed', error);
  });
```

---

## 6. Dashboard Setup (Grafana / Datadog)

### Simple DIY Dashboard (Google Sheets)

Create spreadsheet to track:
- Weekly organic sessions
- Blog post views (top 5)
- Contact form conversions
- Error rate (%)
- Lighthouse score
- Uptime (%)

**Update weekly** from:
- Google Analytics 4
- Sentry
- Better Uptime
- Search Console

---

## 7. Notification Channels

### Email Alerts

- **To:** info@leventmarinetech.com
- **Types:** 
  - 5xx errors (immediate)
  - Uptime down (immediate)
  - Daily digest (6 AM)

### Slack Integration

1. **Create Slack workspace:** `leventmarinetech.slack.com`
2. **Channels:**
   - `#alerts` (errors, uptime)
   - `#analytics` (daily metrics)
   - `#deployments` (GitHub Actions)

3. **Connect Sentry:**
   - Sentry → Integrations → Slack
   - Select `#alerts` channel

4. **Connect Google Analytics:**
   - GA4 → Admin → Alerts
   - New alert on traffic spike/drop

---

## 8. Monthly Monitoring Report

### Template

```
MONTHLY MONITORING REPORT — [MONTH]

UPTIME
- Website uptime: [99.X%]
- Downtime incidents: [N]
- Longest downtime: [X min]
- Status: ✅ / ⚠️ / ❌

PERFORMANCE
- Avg. LCP: [X.Xs] (Goal: < 2.5s)
- Avg. FID: [Xms] (Goal: < 100ms)
- Avg. CLS: [X] (Goal: < 0.1)
- Page load time: [Xs]

ERRORS
- Total errors: [N]
- Critical errors: [N]
- Error rate: [X%]
- Top error: [Error description]

TRAFFIC & CONVERSIONS
- Sessions: [N]
- Users: [N]
- Bounce rate: [X%]
- Contact form submissions: [N]
- Form conversion rate: [X%]

ACTIONS TAKEN
- [ ] Fixed error: [Description]
- [ ] Optimized: [Component]
- [ ] Investigated: [Issue]

RECOMMENDATIONS
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

STATUS: ✅ All metrics within target / ⚠️ Action needed / 🔴 Critical
```

---

## 9. Quick Win Checklist

- [ ] Set up Sentry (free tier: 5k errors/month)
- [ ] Add Sentry script to index.html + blog pages
- [ ] Enable Better Uptime monitoring
- [ ] Create Slack #alerts channel
- [ ] Link Sentry → Slack
- [ ] Create Google Analytics alerts (traffic spike/drop)
- [ ] Weekly manual dashboard update

---

**Status:** 📊 Monitoring & error tracking roadmap ready.

**Priority:** Sentry + Better Uptime (most important for production).
