# Deployment Guide

This guide explains how to set up automated deployment to your VPS using GitHub Actions.

## Prerequisites

1. VPS with Ubuntu 24 LTS
2. Root SSH access
3. Node.js 20+ installed on VPS
4. PM2 installed on VPS
5. GitHub repository with Actions enabled

## Initial Server Setup

### 1. Install Node.js and PM2 on VPS

SSH into your server and run:

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Verify installations
node --version
npm --version
pm2 --version
```

### 2. Create Application Directory

```bash
sudo mkdir -p /var/www/portfolio
sudo chown -R $USER:$USER /var/www/portfolio
```

### 3. Configure Firewall (if needed)

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

## GitHub Secrets Configuration

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

1. **VPS_HOST**: `102.213.180.241` (or `abdeljawad.com`)
2. **VPS_USER**: `root`
3. **VPS_SSH_KEY**: Your private SSH key (see below)
4. **VPS_SSH_PORT**: `22` (default, optional)

### Generate SSH Key Pair

On your local machine:

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy

# Copy public key to server
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@102.213.180.241

# Display private key (copy this to GitHub secret VPS_SSH_KEY)
cat ~/.ssh/github_actions_deploy
```

**Important**: Never commit the private key to your repository!

## Environment Variables

### On the Server

Create `.env` file in `/var/www/portfolio/`:

```bash
sudo nano /var/www/portfolio/.env
```

Add your environment variables:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
CONTACT_EMAIL=your-contact@email.com

# Next.js
NODE_ENV=production
```

### First Deployment

For the first deployment, you may need to manually create the `.env` file on the server before running the workflow.

## PM2 Setup

After first deployment, PM2 should be running. To manage it:

```bash
# Check status
pm2 status

# View logs
pm2 logs portfolio

# Restart app
pm2 restart portfolio

# Stop app
pm2 stop portfolio

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
pm2 save
```

## OpenLiteSpeed Configuration (for CyberPanel)

CyberPanel uses OpenLiteSpeed, not Nginx. The reverse proxy configuration is already prepared on your server.

### Activate OpenLiteSpeed Reverse Proxy

After confirming the Next.js app is running on port 3000:

```bash
# Backup current config (if not already done)
cp /usr/local/lsws/conf/vhosts/abdeljawad.com/vhost.conf /usr/local/lsws/conf/vhosts/abdeljawad.com/vhost.conf.backup

# Apply Next.js reverse proxy config
cp /usr/local/lsws/conf/vhosts/abdeljawad.com/vhost.conf.nextjs /usr/local/lsws/conf/vhosts/abdeljawad.com/vhost.conf

# Reload OpenLiteSpeed to apply changes
/usr/local/lsws/bin/lswsctrl reload
```

### Verify OpenLiteSpeed Configuration

```bash
# Check OpenLiteSpeed status
/usr/local/lsws/bin/lswsctrl status

# View error logs
tail -f /home/abdeljawad.com/logs/abdeljawad.com.error_log

# View access logs
tail -f /home/abdeljawad.com/logs/abdeljawad.com.access_log
```

### Restore WordPress Config (if needed)

If you need to revert back:

```bash
cp /usr/local/lsws/conf/vhosts/abdeljawad.com/vhost.conf.wordpress_backup /usr/local/lsws/conf/vhosts/abdeljawad.com/vhost.conf
/usr/local/lsws/bin/lswsctrl reload
```

## SSL Certificate (Let's Encrypt)

Via CyberPanel:
1. Go to SSL → Issue SSL
2. Select your domain
3. Choose Let's Encrypt
4. Issue SSL

SSL certificate is already configured for `abdeljawad.com` and will continue working after the OpenLiteSpeed config change.

## Deployment Process

1. Push to `main` branch
2. GitHub Actions automatically:
   - Builds the Next.js app
   - Transfers files to VPS
   - Installs dependencies
   - Restarts PM2 process

## Troubleshooting

### Check PM2 Logs

```bash
pm2 logs portfolio --lines 50
```

### Check Application Status

```bash
pm2 status
curl http://localhost:3000
```

### Manual Restart

```bash
cd /var/www/portfolio
pm2 restart portfolio
```

### Check Disk Space

```bash
df -h
```

### View Recent Deployments

```bash
ls -la /var/www/portfolio.backup.*
```

## Security Notes

1. **SSH Key**: Keep your private key secure and never commit it
2. **Environment Variables**: Don't commit `.env` file
3. **Firewall**: Only open necessary ports
4. **Updates**: Keep server and dependencies updated
5. **Backups**: The workflow keeps last 3 backups automatically

## Monitoring

Monitor your application:

```bash
# PM2 monitoring
pm2 monit

# System resources
htop

# OpenLiteSpeed logs
tail -f /home/abdeljawad.com/logs/abdeljawad.com.error_log
tail -f /home/abdeljawad.com/logs/abdeljawad.com.access_log
```
