# Quick Deployment Setup

## 1. Server Initial Setup (One-time)

SSH into your VPS and run:

```bash
# Download and run setup script
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/scripts/setup-server.sh | bash

# Or manually:
bash <(curl -s https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/scripts/setup-server.sh)
```

Or manually install:

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Create app directory
sudo mkdir -p /var/www/portfolio
sudo chown -R $USER:$USER /var/www/portfolio
```

## 2. Generate SSH Key for GitHub Actions

On your **local machine**:

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy

# Copy public key to server
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@102.213.180.241

# Display private key (copy the entire output)
cat ~/.ssh/github_actions_deploy
```

## 3. Configure GitHub Secrets

Go to: **GitHub Repo → Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

| Secret Name | Value |
|------------|-------|
| `VPS_HOST` | `102.213.180.241` or `abdeljawad.com` |
| `VPS_USER` | `root` |
| `VPS_SSH_KEY` | (Paste the entire private key from step 2) |
| `VPS_SSH_PORT` | `22` (optional, defaults to 22) |

## 4. Create Environment File on Server

SSH into server and create `.env`:

```bash
nano /var/www/portfolio/.env
```

Add your configuration:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
CONTACT_EMAIL=your-contact@email.com
NODE_ENV=production
```

## 5. Deploy!

Push to `main` branch:

```bash
git push origin main
```

GitHub Actions will automatically:
- ✅ Build the app
- ✅ Deploy to VPS
- ✅ Restart with PM2

## 6. Activate OpenLiteSpeed Reverse Proxy

After deployment and confirming the app runs on port 3000:

```bash
# Apply the prepared Next.js config
cp /usr/local/lsws/conf/vhosts/abdeljawad.com/vhost.conf.nextjs /usr/local/lsws/conf/vhosts/abdeljawad.com/vhost.conf

# Reload OpenLiteSpeed
/usr/local/lsws/bin/lswsctrl reload
```

**Note:** The OpenLiteSpeed reverse proxy config is already prepared on your server at:
`/usr/local/lsws/conf/vhosts/abdeljawad.com/vhost.conf.nextjs`

## 7. SSL Certificate

SSL certificate is already configured and will continue working after the config change.

## Useful Commands

```bash
# Check app status
pm2 status

# View logs
pm2 logs portfolio

# Restart app
pm2 restart portfolio

# Check if app is responding
curl http://localhost:3000

# View PM2 monitoring
pm2 monit
```

## Troubleshooting

**App not starting?**
```bash
pm2 logs portfolio --lines 50
```

**Port 3000 not accessible?**
```bash
# Check if app is running
pm2 status

# Check port
netstat -tulpn | grep 3000
```

**Deployment failed?**
- Check GitHub Actions logs
- Verify SSH key is correct
- Ensure server has enough disk space: `df -h`
- Check PM2 logs: `pm2 logs portfolio`
