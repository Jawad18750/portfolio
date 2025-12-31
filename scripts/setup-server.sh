#!/bin/bash

# Server Setup Script for Portfolio Deployment
# Run this on your VPS as root

set -e

echo "🚀 Setting up server for portfolio deployment..."

# Update system
echo "📦 Updating system packages..."
apt-get update
apt-get upgrade -y

# Install Node.js 20
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "✅ Node.js already installed: $(node --version)"
fi

# Install PM2
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
else
    echo "✅ PM2 already installed: $(pm2 --version)"
fi

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /var/www/portfolio
chown -R $SUDO_USER:$SUDO_USER /var/www/portfolio

# Setup firewall
echo "🔥 Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    echo "✅ Firewall rules added (run 'ufw enable' to activate)"
else
    echo "⚠️  UFW not found, skipping firewall setup"
fi

# Setup PM2 startup
echo "⚙️  Configuring PM2 startup..."
pm2 startup systemd -u $SUDO_USER --hp /home/$SUDO_USER || true

echo ""
echo "✅ Server setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your SSH public key to authorized_keys"
echo "2. Configure GitHub secrets (VPS_HOST, VPS_USER, VPS_SSH_KEY)"
echo "3. Create .env file in /var/www/portfolio/"
echo "4. Push to main branch to trigger deployment"
echo ""
