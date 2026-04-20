# Web Analytics & Business Profile Setup

**Goal:** Track visitor behavior, optimize conversions, build authority

## 1. Google Analytics 4 (GA4)

### A. Create GA4 Property

1. **Sign in:** https://analytics.google.com
2. **Create new property:**
   - Property name: `Levent Marine Tech`
   - Reporting timezone: Turkey (UTC+3)
   - Currency: USD
3. **Create data stream:**
   - Platform: Web
   - Website URL: `https://www.leventmarinetech.com`
   - Stream name: `Main Website`
4. **Copy Measurement ID:** `G-XXXXXXXXXX`

### B. Add GA4 Tag to index.html

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'page_path': window.location.pathname,
    'send_page_view': true
  });
</script>
```

**Replace `G-XXXXXXXXXX` with your Measurement ID**

Place in `<head>` section of `index.html`, `blog/index.html`, `blog/[posts]/index.html`.

### C. Enable Enhanced Measurement

In GA4 Dashboard:
1. Admin → Data Streams → Web
2. Scroll down → "Enhanced measurement"
3. Enable:
   - ✅ Page views and scrolls
   - ✅ Outbound clicks
   - ✅ Site search
   - ✅ Form interactions
   - ✅ Video engagement
   - ✅ File downloads

### D. Create Custom Events

In `app.js`, add:

```javascript
// Track service drawer opens
function trackServiceOpen(serviceName) {
  gtag('event', 'service_view', {
    'service_name': serviceName,
    'event_category': 'engagement'
  });
}

// Track contact form submissions
function trackFormSubmit(formType) {
  gtag('event', 'form_submit', {
    'form_type': formType,
    'event_category': 'conversion'
  });
}

// Track blog post views
function trackBlogView(postTitle) {
  gtag('event', 'blog_view', {
    'post_title': postTitle,
    'event_category': 'content'
  });
}
```

### E. Create Conversions (Goals)

In GA4 Dashboard:
1. Admin → Conversions
2. Create new conversion events:
   - `form_submit` (Contact form)
   - `service_view` (Service drawer open)
   - `blog_view` (Blog post read)
   - `whatsapp_click` (WhatsApp CTA)

### F. Custom Reports

Create dashboard for:
- **Traffic:** Page views, sessions, bounce rate
- **Engagement:** Average session duration, pages per session
- **Conversions:** Contact form submits, service view rate
- **Blog:** Top posts, read time, scroll depth
- **Geographic:** Visitor location (shipping companies worldwide)
- **Device:** Mobile vs. desktop split

---

## 2. Google Search Console

### A. Add Domain to Search Console

1. **Sign in:** https://search.google.com/search-console
2. **Property:** URL prefix
3. **Enter:** `https://www.leventmarinetech.com`
4. **Verify domain:**

#### Verification Method: HTML file (Recommended for GitHub Pages)

1. Download verification file
2. Upload to root directory: `/verification-file.html`
3. Verify in Search Console

**OR:** Meta tag method:
```html
<!-- Add to index.html <head> -->
<meta name="google-site-verification" content="VERIFICATION_CODE_HERE">
```

### B. Submit Sitemap

1. Search Console → Sitemaps
2. Add new sitemap: `https://leventmarinetech.com/sitemap.xml`
3. Verify submission

### C. Monitor Core Web Vitals

Dashboard shows:
- **LCP (Largest Contentful Paint):** < 2.5s ✅ target
- **FID (First Input Delay):** < 100ms ✅ target
- **CLS (Cumulative Layout Shift):** < 0.1 ✅ target

### D. Fix Issues

Common issues:
- [ ] Mobile usability errors
- [ ] Crawl errors (404s)
- [ ] AMP errors (N/A for static site)
- [ ] Structured data warnings (check schema.org markup)

### E. Manual Actions Check

Admin → Manual actions → Review for any penalties

---

## 3. Bing Webmaster Tools (Bonus)

1. **Sign in:** https://www.bing.com/webmasters
2. **Add site:** `https://www.leventmarinetech.com`
3. **Submit sitemap:** `sitemap.xml`
4. **Monitor:** In Bing search results

---

## 4. LinkedIn Business Profile

### A. Create Company Page

1. **Go to:** https://www.linkedin.com/company/new/
2. **Fill in:**
   - Company name: `Levent Marine Electro Technical Services`
   - Official website: `https://leventmarinetech.com`
   - Industry: `Maritime & Shipping`
   - Company size: `2-10`
   - Headquarters: `Istanbul, Turkey` + `Sheridan, Wyoming, USA`
3. **Logo:** Upload company logo (100x100px PNG)
4. **Cover photo:** 1200x627px banner

### B. Profile Settings

- [ ] Description: "Class-ready electrotechnical partner for bulker fleets — 24/7 onboard + remote ETO support"
- [ ] Website: https://leventmarinetech.com
- [ ] Phone: +90 537 650 7776
- [ ] Email: info@leventmarinetech.com
- [ ] HQ Location: Pendik, Istanbul, Turkey
- [ ] Specialties: Marine electrical, class surveys, ETO, testing & certification

### C. Post Strategy

1. **Weekly posts (1x/week):**
   - Monday: Blog post announcement
   - Wednesday: Service spotlight
   - Friday: Industry news/insight

2. **Content calendar (30 days):**
   - Week 1: "Class Survey Preparation Checklist"
   - Week 2: "ACB/MCCB Testing Best Practices"
   - Week 3: "Bulker Electrical Faults: Diagnosis & Solutions"
   - Week 4: "CII Rating: How Electrical Efficiency Improves Your Carbon Score"

3. **Post format:**
   ```
   [Image] 
   Title: "Class Survey Electrical Checklist — 25 Points for DNV/BV/ABS"
   
   Your next class survey is critical. Missing even one electrical item can delay your 
   vessel and cost thousands in off-hire.
   
   Our 25-point checklist covers:
   ✅ Main switchboard & ACB testing
   ✅ Generator & UPS systems
   ✅ Navigation (ECDIS, radar, GMDSS)
   ✅ Safety systems & fire detection
   ✅ Emergency lighting & backup power
   
   Download free: leventmarinetech.com/assets/leadmagnets/class-survey-checklist.html
   
   #MarineElectrical #ClassSurvey #Shipping #DNV #BV #ETO
   ```

### D. LinkedIn Ads (Optional)

Target audience:
- **Title:** Technical Superintendent, Master, Chief Officer, Fleet Manager
- **Industry:** Shipping & Maritime
- **Company size:** Medium-large
- **Location:** Global
- **Budget:** $500-1000/month

Campaign types:
- Sponsored content (blog post links)
- Lead generation ads (contact form)
- Brand awareness

---

## 5. Email Newsletter (Optional)

### Use Mailchimp (free tier: 500 contacts)

1. **Sign up:** https://mailchimp.com
2. **Create list:** Levent Marine Tech
3. **Add signup form:**
   ```html
   <!-- Add to contact section or footer -->
   <form action="https://leventmarinetech.us10.list-manage.com/subscribe/post?u=...&id=..." method="POST">
     <input type="email" name="EMAIL" placeholder="Your email">
     <button type="submit">Subscribe</button>
   </form>
   ```

4. **Monthly campaign:**
   - Industry updates
   - New blog posts
   - Service highlights
   - Client testimonials

---

## 6. Social Media Profiles

### Twitter/X
- Handle: @leventmarine (or similar)
- Bio: "Marine electrotechnical services for bulker fleets. ETO certified. Pendik + Wyoming. 24/7 support."
- Link: leventmarinetech.com
- Post frequency: 2x/week industry news + blog

### Instagram
- Handle: @levent_marine_tech
- Bio: Behind-the-scenes vessel work, technical tidbits
- Post frequency: 1x/week
- Focus: Project photos, crew photos, vessel shots

### Facebook
- Page: Levent Marine Electro Technical Services
- Follow from LinkedIn content (repurpose posts)
- Post frequency: 1x/week

---

## 7. Implementation Checklist

### Week 1: Core Analytics
- [ ] GA4 property created
- [ ] GA4 tag added to index.html + blog pages
- [ ] Enhanced measurement enabled
- [ ] Custom events tracked (service_view, form_submit)
- [ ] Search Console verified
- [ ] Sitemap submitted
- [ ] Core Web Vitals monitored

### Week 2: Business Profiles
- [ ] LinkedIn company page created
- [ ] LinkedIn content calendar drafted
- [ ] Twitter profile set up
- [ ] Instagram profile set up
- [ ] Facebook page created

### Week 3: Analytics Deep Dive
- [ ] Custom reports created (traffic, engagement, conversions)
- [ ] Conversion funnels set up
- [ ] Attribution model configured
- [ ] Audience segments created

### Week 4: Ongoing Optimization
- [ ] Weekly report review (GA4 dashboard)
- [ ] Blog performance tracked
- [ ] Contact form conversion rate monitored
- [ ] LinkedIn posts engagement tracked
- [ ] Organic search traffic monitored

---

## 8. KPIs to Track

| Metric | Target | Frequency |
|--------|--------|-----------|
| **Traffic** | 500+ sessions/month | Monthly |
| **Blog views** | 60% of traffic | Monthly |
| **Contact form conversions** | 3-5 submissions/month | Monthly |
| **LinkedIn engagement** | 10+ interactions/post | Weekly |
| **Bounce rate** | < 50% | Monthly |
| **Avg. session duration** | > 2 min | Monthly |
| **Mobile traffic** | > 60% | Monthly |

---

## 9. Tools & Integrations

| Tool | Purpose | Cost |
|------|---------|------|
| **Google Analytics 4** | Traffic + conversions | Free |
| **Google Search Console** | SEO + indexing | Free |
| **LinkedIn Business** | B2B networking | Free (ads optional) |
| **Mailchimp** | Email newsletter | Free (up to 500) |
| **Hotjar** | Heatmaps + recordings | Free (100 sessions/month) |
| **Semrush** | SEO + competitor analysis | $99-399/month |
| **Ahrefs** | Backlink analysis | $99-999/month |

---

## 10. Next Steps

1. ✅ Create GA4 property (today)
2. ✅ Add GA4 tag to all HTML files (today)
3. ✅ Verify Search Console (today)
4. ✅ Create LinkedIn company page (today)
5. ⏳ Publish first LinkedIn post (tomorrow)
6. ⏳ Monitor analytics for 1 week baseline (next week)
7. ⏳ Create monthly analytics report template

---

**Status:** 📊 Analytics framework ready. **Implementation time: 2-3 hours.**

**Next:** Start with GA4 tag + Search Console verification, then LinkedIn company page.
