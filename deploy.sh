#!/bin/bash

# Quick Deploy Script
# This script pushes to main branch, which triggers GitHub Actions deployment
# Usage: ./deploy.sh [commit message]

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting deployment...${NC}"

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}⚠️  Warning: You're on branch '$CURRENT_BRANCH', not 'main'${NC}"
    read -p "Do you want to switch to main branch? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout main
    else
        echo -e "${YELLOW}Deployment cancelled.${NC}"
        exit 1
    fi
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes.${NC}"
    git status --short
    echo ""
    read -p "Do you want to commit and push? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Get commit message
        if [ -z "$1" ]; then
            COMMIT_MSG="Deploy: $(date +'%Y-%m-%d %H:%M:%S')"
        else
            COMMIT_MSG="$1"
        fi
        
        echo -e "${BLUE}📝 Committing changes...${NC}"
        git add .
        git commit -m "$COMMIT_MSG"
    else
        echo -e "${YELLOW}Deployment cancelled.${NC}"
        exit 1
    fi
fi

# Push to main branch
echo -e "${BLUE}📤 Pushing to main branch...${NC}"
git push origin main

echo ""
echo -e "${GREEN}✅ Code pushed successfully!${NC}"
echo ""
echo -e "${BLUE}GitHub Actions will now:${NC}"
echo "  1. Build the Next.js app"
echo "  2. Deploy to VPS"
echo "  3. Restart PM2 process"
echo "  4. Configure OpenLiteSpeed (if needed)"
echo ""
echo -e "${BLUE}📊 Monitor deployment:${NC}"
echo "  https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions"
echo ""
echo -e "${GREEN}🎉 Deployment initiated!${NC}"
