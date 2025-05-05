#!/bin/bash

# Build the backend
echo "Building backend..."
npm install
npm run build

# Create deployment package
echo "Creating deployment package..."
zip -r ../deployment.zip . -x "node_modules/*" ".git/*" "*.gitignore" "*.env"

# Deploy to Elastic Beanstalk
echo "Deploying to Elastic Beanstalk..."
eb deploy matclassifier-prod

# Check deployment status
echo "Checking deployment status..."
eb status matclassifier-prod 