# Contact Form Backend Setup — leventmarinetech-api

**Status:** Backend deployment için talimatlar ve örnek kod

## Genel Bakış

- **URL:** https://api.leventmarinetech.com (veya Vercel/Railway public URL)
- **Endpoint:** `POST /api/contact`
- **Frontend:** index.html contact form → app.js → `/api/contact` endpoint
- **Email:** SendGrid veya NodeMailer ile info@leventmarinetech.com + customer email

## Repo Setup

### 1. GitHub'da yeni repo oluştur

```bash
# Clone or create: leventmarinetech-api
git clone https://github.com/YOUR_ORG/leventmarinetech-api
cd leventmarinetech-api
npm init -y
```

### 2. Dependencies

```bash
npm install express dotenv cors nodemailer axios joi helmet compression
npm install --save-dev nodemon
```

### 3. .env Dosyası (GİZLİ)

```
NODE_ENV=production
PORT=3000

# Email Config (seçenekler: SendGrid veya NodeMailer)
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM=noreply@leventmarinetech.com
EMAIL_TO=info@leventmarinetech.com

# CORS
FRONTEND_URL=https://leventmarinetech.com,https://www.leventmarinetech.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
```

### 4. server.js (Node/Express)

```javascript
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const Joi = require('joi');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL?.split(',') || ['https://leventmarinetech.com'],
  credentials: true
}));

// Rate limiting (basit)
const requestCounts = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - (process.env.RATE_LIMIT_WINDOW_MS || 900000);
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }
  
  const requests = requestCounts.get(ip).filter(t => t > windowStart);
  requestCounts.set(ip, requests);
  
  if (requests.length >= (process.env.RATE_LIMIT_MAX_REQUESTS || 5)) {
    return false;
  }
  
  requests.push(now);
  return true;
}

// Email config (NodeMailer + Gmail örneği, ya da SendGrid)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD // Gmail App Password
  }
});

// Validation schema
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  company: Joi.string().max(150).optional().allow(''),
  email: Joi.string().email().required(),
  phone: Joi.string().max(20).optional().allow(''),
  vessel: Joi.string().max(100).optional().allow(''),
  class: Joi.string().max(50).optional().allow(''),
  service: Joi.string().max(100).optional().allow(''),
  urgency: Joi.string().valid('high', 'medium', 'low').optional(),
  message: Joi.string().max(2000).optional().allow('')
});

// Contact endpoint
app.post('/api/contact', async (req, res) => {
  try {
    // Rate limiting
    const ip = req.ip;
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ message: 'Too many requests. Please try again later.' });
    }

    // Validation
    const { error, value } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, company, email, phone, vessel, class: shipClass, service, urgency, message } = value;

    // Email template (HTML)
    const customerEmailHtml = `
      <h2>Talebiniz Alındı</h2>
      <p>Merhaba ${name},</p>
      <p>Levent Marine'a başvurunuz başarıyla alınmıştır. 24 saat içinde size dönüş yapacağız.</p>
      <hr />
      <h3>Talebinizin Özeti:</h3>
      <ul>
        <li><strong>Hizmet:</strong> ${service || '-'}</li>
        <li><strong>Gemi/IMO:</strong> ${vessel || '-'}</li>
        <li><strong>Class:</strong> ${shipClass || '-'}</li>
        <li><strong>Aciliyet:</strong> ${urgency === 'high' ? '🔴 Yüksek (24h)' : urgency === 'medium' ? '🟡 Orta (7 gün)' : '🟢 Düşük (Planlı)'}</li>
      </ul>
      <p><strong>Mesajınız:</strong></p>
      <p>${message || '(Boş)'}</p>
      <hr />
      <p><strong>İletişim Bilgileriniz:</strong></p>
      <ul>
        <li>Telefon: ${phone || '(Belirtilmedi)'}</li>
        <li>Firma: ${company || '(Belirtilmedi)'}</li>
      </ul>
      <p>Sorularınız için: <a href="mailto:info@leventmarinetech.com">info@leventmarinetech.com</a></p>
      <p>WhatsApp: <a href="https://wa.me/905376507776">+90 537 650 7776</a></p>
    `;

    const internalEmailHtml = `
      <h2>🚨 YENİ MÜŞTERI TALEBİ</h2>
      <p><strong>Ad:</strong> ${name}</p>
      <p><strong>E-posta:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Telefon:</strong> ${phone || '-'}</p>
      <p><strong>Firma:</strong> ${company || '-'}</p>
      <p><strong>Gemi/IMO:</strong> ${vessel || '-'}</p>
      <p><strong>Class:</strong> ${shipClass || '-'}</p>
      <p><strong>Hizmet:</strong> ${service || '-'}</p>
      <p><strong>Aciliyet:</strong> ${urgency || 'Belirtilmedi'}</p>
      <hr />
      <h3>Mesaj:</h3>
      <p>${message || '(Boş)'}</p>
      <hr />
      <p>IP: ${ip}</p>
      <p>Timestamp: ${new Date().toISOString()}</p>
    `;

    // Send email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '✅ Talebiniz Alındı — Levent Marine',
      html: customerEmailHtml
    });

    // Send email to company
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `🚨 YENİ TALEP: ${name} — ${service || 'Hizmet belirtilmedi'}`,
      html: internalEmailHtml
    });

    // Log to database (opsiyonel)
    // await db.contact.create({ ...value, ip, timestamp: new Date() });

    res.status(200).json({
      success: true,
      message: 'Talebiniz başarıyla kaydedildi. 24 saat içinde dönüş yapacağız.'
    });

  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({
      success: false,
      message: 'Sunucuda hata oluştu. Lütfen daha sonra tekrar deneyin.'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Contact API running on port ${PORT}`);
});
```

## Deployment Options

### Option A: Vercel (Recommended)

1. **vercel.json** oluştur:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "EMAIL_FROM": "@vercel/env",
    "EMAIL_PASSWORD": "@vercel/env",
    "SENDGRID_API_KEY": "@vercel/env",
    "EMAIL_TO": "@vercel/env"
  }
}
```

2. **Deploy:**
```bash
npm i -g vercel
vercel
# Log in with GitHub, select leventmarinetech-api repo
# Set environment variables in Vercel Dashboard
```

3. **Test:**
```bash
curl -X POST https://leventmarinetech-api.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello"}'
```

### Option B: Railway.app

1. Link GitHub repo
2. Set environment variables in Railway dashboard
3. Deploy

### Option C: Docker + Self-hosted

1. **Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

2. **Build & run:**
```bash
docker build -t leventmarinetech-api .
docker run -p 3000:3000 --env-file .env leventmarinetech-api
```

## Frontend Integration (app.js)

Contact form'unuzda halihazırda bu kod var:

```javascript
// CONTACT FORM (app.js satırı ~550)
setupForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    
    try {
      const resp = await fetch('/api/contact', {  // <-- LOCAL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      // ... handle response
    } catch (err) {
      // Fallback: WhatsApp
      window.open(`https://wa.me/905376507776?text=...`, '_blank');
    }
  });
}
```

**Frontend URL'ini güncelle:**

```javascript
// Production: /api/contact → https://api.leventmarinetech.com/api/contact
const apiUrl = window.location.hostname === 'leventmarinetech.com' 
  ? 'https://api.leventmarinetech.com/api/contact'
  : '/api/contact';
```

Veya proxy setup (localhost test için):
```bash
npm run dev  # Vite/webpack proxy kullan
```

## Email Service Options

### SendGrid (Recommended)

1. SendGrid account oluştur (free tier: 100 email/day)
2. API key al
3. `.env` dosyasına ekle
4. `server.js` kodu güncelleyin (sgMail library yerine nodemailer ile uyumlu)

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: email,
  from: process.env.EMAIL_FROM,
  subject: '✅ Talebiniz Alındı',
  html: customerEmailHtml
});
```

### Gmail (Free, basit setup)

1. [Google App Passwords](https://support.google.com/accounts/answer/185833) oluştur
2. `EMAIL_PASSWORD` olarak `.env`'ye ekle
3. Kod yukarıda zaten hazır

## Testing

### Local Test:
```bash
npm run dev

curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmet Yilmaz",
    "email": "ahmet@example.com",
    "company": "TP Offshore",
    "phone": "+90 537 650 7776",
    "vessel": "MV Aegean Trader",
    "class": "DNV",
    "service": "testing-certification",
    "urgency": "high",
    "message": "ACB testi talep ediyorum"
  }'
```

### Expected Response:
```json
{
  "success": true,
  "message": "Talebiniz başarıyla kaydedildi. 24 saat içinde dönüş yapacağız."
}
```

## Checklist

- [ ] leventmarinetech-api repo oluşturuldu
- [ ] Node.js server kodu yazıldı
- [ ] Email transporter ayarlandı (SendGrid/Gmail)
- [ ] .env dosyası oluşturuldu (GİZLİ)
- [ ] Local test yapıldı
- [ ] Vercel/Railway'e deploy edildi
- [ ] Frontend API URL güncellendi
- [ ] Production DNS: api.leventmarinetech.com → Vercel CNAME
- [ ] Rate limiting + validation aktif
- [ ] Database logging (opsiyonel): MongoDB/PostgreSQL integration

## Next Steps (Prompt 6+)

- [ ] Lighthouse 95+ optimization
- [ ] Google Analytics setup
- [ ] Admin panel (authorized.html) ← contact form submission tracker
- [ ] Webhook logging (Slack notification)
- [ ] Email template customization (logo + branding)

---

**Status:** ✅ Backend setup talimatları hazır. Deployment: Vercel önerilir (free tier, automatic scaling).
