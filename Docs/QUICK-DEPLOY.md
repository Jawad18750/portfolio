# Quick Deploy Guide

## 🚀 One-Command Deployment

After initial setup, deploying is as simple as:

```bash
./deploy.sh
```

Or with a custom commit message:

```bash
./deploy.sh "Your commit message here"
```

That's it! The script will:
1. ✅ Check you're on main branch
2. ✅ Commit any uncommitted changes (if you confirm)
3. ✅ Push to GitHub
4. ✅ GitHub Actions automatically:
   - Builds the app
   - Deploys to VPS
   - Restarts PM2
   - Activates OpenLiteSpeed reverse proxy (if needed)
   - Verifies deployment

## 📋 What Happens Automatically

When you push to `main`, GitHub Actions will:

1. **Build** - Compiles your Next.js app
2. **Deploy** - Transfers files to `/var/www/portfolio/`
3. **Install** - Installs production dependencies
4. **Start** - Restarts PM2 process
5. **Verify** - Health checks the application
6. **Configure** - Automatically activates OpenLiteSpeed reverse proxy (first time only)

## 🔧 Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
git add .
git commit -m "Your message"
git push origin main
```

## 📊 Monitor Deployment

After pushing, check GitHub Actions:
- Go to: **Actions** tab in your GitHub repo
- Watch the deployment progress in real-time
- See logs if anything fails

## ✅ Verify Deployment

After deployment completes:

```bash
# SSH into server
ssh root@102.213.180.241

# Check app status
pm2 status

# View logs
pm2 logs portfolio

# Test locally
curl http://localhost:3000

# Test domain
curl https://abdeljawad.com
```

## 🐛 Troubleshooting

**Deployment failed?**
- Check GitHub Actions logs
- Verify SSH key is correct in GitHub secrets
- Check server disk space: `df -h`
- Check PM2 logs: `pm2 logs portfolio`

**App not responding?**
```bash
pm2 restart portfolio
pm2 logs portfolio --lines 50
```

**OpenLiteSpeed not working?**
```bash
# Check config
cat /usr/local/lsws/conf/vhosts/abdeljawad.com/vhost.conf | grep proxy

# Reload if needed
/usr/local/lsws/bin/lswsctrl reload
```

## 🎯 First Time Setup

If this is your first deployment, make sure:

1. ✅ GitHub secrets are configured (VPS_HOST, VPS_USER, VPS_SSH_KEY)
2. ✅ `.env` file exists on server at `/var/www/portfolio/.env`
3. ✅ Server has Node.js, npm, and PM2 installed
4. ✅ OpenLiteSpeed config is prepared at `/usr/local/lsws/conf/vhosts/abdeljawad.com/vhost.conf.nextjs`

See `DEPLOYMENT.md` for detailed first-time setup instructions.

---

**That's it!** Just run `./deploy.sh` and your site will be updated automatically. 🎉
