# 🚀 Libni.co Website Go-Live Guide

## Current Status ✅
- **Website**: Complete (Home, About, Services, Liberate, Contact)
- **Backend**: Fully integrated (Payments, CRM, Onboarding)
- **Liberate Sales Page**: Built & styled (ready for images)
- **Deployment**: Vercel configured with cron jobs

---

## Pre-Launch Checklist

### 1. **Environment Setup** (5 min)
```bash
# Your .env.local should have:
NEXT_PUBLIC_FIREBASE_CONFIG={"..."}  # Firebase config
NEXT_PUBLIC_XENDIT_KEY=xnd_public_...  # Xendit test/live keys
GHL_TOKEN=...  # GoHighLevel API token
GHL_LOCATION_ID=...  # Your GHL location
OPENAI_API_KEY=...  # If using AI features
```

### 2. **Images & Assets** (Required)
Add to `/public/`:
- ✅ `/public/liberate-hero.jpg` - Hero background image (landscape, ~1920x1080)
- ✅ `/public/liberate-logo-white.png` - Liberate logo (white version)
- Check other pages for any placeholder images

### 3. **Content Review** (15 min)
- [ ] Home page: Update hero tagline if needed
- [ ] About page: Finalize bio and story
- [ ] Liberate page: All copy is from design-reference ✅
- [ ] Contact page: Verify contact info
- [ ] Update footer with current year (2026)

### 4. **Database & Integrations** (10 min)
- [ ] Firestore rules are set (firestore.rules ✅)
- [ ] Xendit: Switch from test → live keys (or stay in test mode)
- [ ] GHL: Verify webhook configuration
- [ ] Email: Set up SPF/DKIM for `hello@libni.co` domain

### 5. **Domain Setup** (15 min)
```bash
# In Vercel Dashboard:
1. Add custom domain: libni.co
2. Update DNS records:
   - A record: points to Vercel
   - CNAME: www → libni.co
3. Set as production domain

# In your registrar (GoDaddy, Namecheap, etc.):
1. Update nameservers to Vercel's
   OR
2. Add Vercel DNS records manually
```

### 6. **SSL Certificate** (Automatic)
- Vercel provides free SSL ✅
- Check: All pages load over HTTPS

### 7. **Performance & Security**
- [ ] Run: `npm run build` (verify no errors)
- [ ] Run: `npm run typecheck` (verify types)
- [ ] Run: `npm test` (verify tests pass)
- [ ] Check Core Web Vitals in Vercel dashboard

---

## Deployment Steps

### **Step 1: Push to GitHub**
```bash
cd /Users/libni/Downloads/libni-fortuna-system
git add .
git commit -m "Ready for production: Liberate page + full website live"
git push origin main
```

### **Step 2: Connect to Vercel**

**If not already connected:**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import from GitHub: `libni-fortuna-system`
4. Select `main` branch
5. Add environment variables from `.env.local`
6. Click "Deploy"

**If already connected:**
1. Push to main branch
2. Vercel auto-deploys
3. Check deployment at: [libni-fortuna-system.vercel.app](https://libni-fortuna-system.vercel.app)

### **Step 3: Set Production Domain**

In Vercel Dashboard → Settings → Domains:
```
libni.co → Production
www.libni.co → Redirect to libni.co
```

### **Step 4: Verify Live Site**

```bash
# Test all pages:
- https://libni.co/ (Home)
- https://libni.co/liberate (Liberate sales page)
- https://libni.co/liberate/apply (Application form)
- https://libni.co/about (About page)
- https://libni.co/contact (Contact)
- https://libni.co/resources (Resources)

# Test flows:
- Apply → Payment → Welcome page
- Newsletter signup
- Contact form
```

### **Step 5: Monitor & Alerts**

Set up in Vercel Dashboard:
- [ ] Deployment notifications (Slack/Email)
- [ ] Performance alerts
- [ ] Error tracking

---

## What Goes Live

### **Public Pages** (SEO-optimized)
- `/` - Home
- `/liberate` - Sales page
- `/about` - About Libni
- `/contact` - Contact form
- `/resources` - Blog/resources
- `/programs/*` - Program pages

### **User Flows** (Private, auth-protected)
- `/start` - Assessment quiz
- `/apply/[offer]` - Application form
- `/pay/[id]` - Payment checkout
- `/welcome/[offer]` - Onboarding

### **Admin Pages** (Protected)
- `/admin` - Dashboard
- `/admin/liberate` - Photo management
- `/admin/liberate/analytics` - Metrics

---

## Post-Launch Checklist

### **First 24 Hours**
- [ ] Monitor Vercel logs for errors
- [ ] Test payment flow (test mode)
- [ ] Verify emails are sending
- [ ] Check mobile responsiveness
- [ ] Google indexing (submit sitemap)

### **First Week**
- [ ] Monitor analytics
- [ ] Collect feedback
- [ ] Fix any bugs
- [ ] Update social links to new domain

### **First Month**
- [ ] Monitor Core Web Vitals
- [ ] Review application data
- [ ] Update content as needed
- [ ] Set up email sequences in GHL

---

## Switching to Live Mode

### **Xendit (Payments)**
```env
# Test mode (current):
NEXT_PUBLIC_XENDIT_KEY=xnd_public_test_...

# Switch to LIVE (⚠️ Real money):
NEXT_PUBLIC_XENDIT_KEY=xnd_public_live_...
```

### **Data Migration**
- Current test data stays in Firestore
- No migration needed (same database)
- Create new collections for live data or filter by environment

---

## Rollback Plan

If something breaks:
```bash
# Vercel auto-keeps last 10 deployments
1. Go to Vercel Dashboard
2. Find working deployment
3. Click "Redeploy"
4. Done (takes ~2 min)
```

---

## Support & Monitoring

### **Logs & Debugging**
- Vercel Dashboard → Deployments → Logs
- Check real-time logs: Vercel CLI → `vercel logs`

### **Performance**
- Vercel Analytics: https://vercel.com/docs/analytics
- Check response times, CLS, LCP

### **Errors**
- Set up Sentry (optional): `npm install @sentry/nextjs`

---

## Troubleshooting

### **Domain not resolving**
- DNS changes take 24-48 hours
- Check Vercel DNS settings
- Clear browser cache (Cmd+Shift+Delete)

### **Pages showing 404**
- Check routes exist in `/app` directory
- Verify Next.js build passed (`npm run build`)
- Check `.next` folder exists

### **Payments not working**
- Verify Xendit keys in `.env.local`
- Check GHL webhooks configured
- Test with Xendit test card: `4111 1111 1111 1111`

### **Images not showing**
- Ensure files exist in `/public/`
- Check image paths (case-sensitive on Linux servers)
- Optimize images (under 500KB each)

---

## Timeline

| Step | Time | Status |
|------|------|--------|
| Add images to `/public/` | 5 min | ⏳ Pending |
| Review content | 15 min | ⏳ Pending |
| Push to GitHub | 2 min | ⏳ Pending |
| Deploy to Vercel | 5 min | ⏳ Pending |
| Set domain | 10 min | ⏳ Pending |
| Test all flows | 15 min | ⏳ Pending |
| **Total** | **~1 hour** | 🚀 Ready |

---

## Quick Reference

```bash
# Local development
npm run dev  # http://localhost:4310

# Before deploying
npm run build
npm run typecheck
npm test

# View logs
vercel logs --tail

# Open production
vercel open
```

---

**Questions?** Check README.md, HANDOFF.md, or CLAUDE.md for detailed docs.

**Ready to launch!** 🎉
