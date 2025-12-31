# Post-Deployment Checklist

After your first GitHub Actions deployment, follow these steps:

## ✅ Step 1: Verify Application is Running

```bash
# Check PM2 status
pm2 status

# Should show "portfolio" process as "online"
# If not, check logs:
pm2 logs portfolio --lines 50
```

## ✅ Step 2: Test Local Connection

```bash
# Test if app responds on port 3001
curl http://localhost:3001

# Should return HTML (not error)
```

**Note:** The app runs on port **3001** (not 3000) to avoid conflicts with system services.

## ✅ Step 3: Configure Environment Variables

```bash
# Edit environment file
nano /var/www/portfolio/.env
```

Add your configuration:
```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
CONTACT_EMAIL=your-contact@email.com

# Cloudflare Turnstile (Bot Protection)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
TURNSTILE_SECRET_KEY=your-turnstile-secret-key

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Next.js
NODE_ENV=production
PORT=3001
```

After editing, restart the app:
```bash
pm2 restart portfolio
```

## ✅ Step 4: OpenLiteSpeed Reverse Proxy

The GitHub Actions workflow automatically verifies and configures the OpenLiteSpeed reverse proxy for port 3001. No manual action required.

**Note:** The app runs on port **3001** (not 3000) to avoid conflicts with system services.

## ✅ Step 5: Verify Domain Access

```bash
# Test domain
curl https://abdeljawad.com

# Should return your Next.js app HTML
```

Or open in browser: `https://abdeljawad.com`

## ✅ Step 6: Test Contact Form

1. Go to `https://abdeljawad.com`
2. Fill out the contact form
3. Submit and verify:
   - Success message appears
   - Email is sent (check your configured email)
   - WhatsApp button works (if clicked)

## ✅ Step 7: Setup PM2 Auto-Start

```bash
# Save current PM2 processes
pm2 save

# Setup PM2 to start on boot (if not already done)
pm2 startup
# Follow the instructions it provides
```

## 🔍 Troubleshooting

### App Not Starting?

```bash
# Check PM2 logs
pm2 logs portfolio --lines 100

# Check for errors in logs
# Common issues:
# - Missing .env file
# - Port 3000 already in use
# - Missing dependencies
```

### Port 3001 Already in Use?

The deployment workflow automatically handles port conflicts. The app runs on port **3001** (not 3000) to avoid system service conflicts.

If manual intervention is needed:
```bash
pm2 stop portfolio
pm2 delete portfolio
PORT=3001 pm2 start npm --name "portfolio" -- start
```

### OpenLiteSpeed Not Proxying?

```bash
# Check OpenLiteSpeed status
/usr/local/lsws/bin/lswsctrl status

# Check error logs
tail -f /home/abdeljawad.com/logs/abdeljawad.com.error_log

# Verify config
cat /usr/local/lsws/conf/vhosts/abdeljawad.com/vhost.conf | grep -A 5 "proxy"
```

### Domain Not Loading?

1. Check DNS: `dig abdeljawad.com`
2. Check OpenLiteSpeed: `/usr/local/lsws/bin/lswsctrl status`
3. Check PM2: `pm2 status`
4. Check firewall: `ufw status`

### Restore WordPress Config (Emergency)

```bash
cp /usr/local/lsws/conf/vhosts/abdeljawad.com/vhost.conf.wordpress_backup /usr/local/lsws/conf/vhosts/abdeljawad.com/vhost.conf
/usr/local/lsws/bin/lswsctrl reload
```

## 📊 Monitoring Commands

```bash
# PM2 monitoring dashboard
pm2 monit

# Check system resources
htop

# Check disk space
df -h

# Check recent deployments
ls -la /var/www/portfolio.backup.*
```

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ `pm2 status` shows portfolio as "online"
- ✅ `curl http://localhost:3001` returns HTML
- ✅ `curl https://abdeljawad.com` returns your app
- ✅ Website loads in browser (defaults to Arabic locale)
- ✅ Contact form submits successfully with bot protection
- ✅ WhatsApp button works and tracks events in GTM
- ✅ SSL certificate works (green lock in browser)

## 📝 Next Steps

After successful deployment:
1. Monitor logs for first 24 hours: `pm2 logs portfolio`
2. Test all features (contact form, navigation, etc.)
3. Set up monitoring/alerting (optional)
4. Configure backups (PM2 already saves state)

---

**Need Help?** Check the main `DEPLOYMENT.md` file for detailed instructions.
