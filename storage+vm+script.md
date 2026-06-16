# README 2: Deploy a Static Website from Azure Blob Storage to an Azure VM

## Overview

This project demonstrates how to host a website on an Azure Virtual Machine by downloading website files from Azure Blob Storage using a Managed Identity.

The VM retrieves files from Blob Storage and serves them using Nginx.

## Architecture

```text
Blob Storage
    │
    ▼
Managed Identity
    │
    ▼
Azure VM
    │
    ▼
Nginx
    │
    ▼
Website
```

## Prerequisites

* Azure Virtual Machine
* Azure Storage Account
* Blob Container
* Managed Identity enabled on the VM
* Storage Blob Data Reader role assigned
* Nginx installed
* Azure CLI installed

---

## Step 1: Upload Website Files

Create a simple website:

### index.html

```html
<!DOCTYPE html>
<html>
<head>
    <title>Azure Demo</title>
</head>
<body>
    <h1>Hello from Azure Blob Storage!</h1>
    <p>This website was deployed from Blob Storage.</p>
</body>
</html>
```

Upload the file to your Blob Container.

Example structure:

```text
files/
└── index.html
```

---

## Step 2: Create the Deployment Script

Create:

```bash
nano deploy-site.sh
```

Paste:

```bash
#!/bin/bash

set -e

STORAGE_ACCOUNT="rhemapath"
CONTAINER_NAME="files"

echo "======================================"
echo "Azure Blob Website Deployment"
echo "======================================"

echo "Updating packages..."
sudo apt update

# Install Nginx if missing
if ! command -v nginx &> /dev/null
then
    echo "Installing Nginx..."
    sudo apt install nginx -y
fi

# Install Azure CLI if missing
if ! command -v az &> /dev/null
then
    echo "Installing Azure CLI..."
    curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
fi

echo "Starting Nginx..."
sudo systemctl enable nginx
sudo systemctl start nginx

echo "Authenticating with Managed Identity..."
az login --identity --output none

echo "Preparing deployment directory..."
rm -rf /tmp/site
mkdir -p /tmp/site

echo "Downloading website files..."

az storage blob download-batch \
    --account-name $STORAGE_ACCOUNT \
    --source $CONTAINER_NAME \
    --destination /tmp/site \
    --auth-mode login

echo "Downloaded files:"
ls -lah /tmp/site

echo "Creating web root..."
sudo mkdir -p /var/www/html

echo "Deploying files..."
sudo rm -rf /var/www/html/*
sudo cp -r /tmp/site/* /var/www/html/

echo "Setting permissions..."
sudo chown -R www-data:www-data /var/www/html

echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "======================================"
echo "Deployment completed successfully"
echo "======================================"

echo "Files deployed:"
ls -lah /var/www/html

PUBLIC_IP=$(curl -s ifconfig.me || true)

echo ""
echo "Website URL:"
echo "http://$PUBLIC_IP"

---

## Step 3: Make the Script Executable

```bash
chmod +x deploy-site.sh
```

---

## Step 4: Run the Deployment

```bash
./deploy-site.sh
```

---

## Step 5: Verify Deployment

Check website files:

```bash
ls -lah /var/www/html
```

Verify Nginx:

```bash
systemctl status nginx
```

Retrieve public IP:

```bash
curl ifconfig.me
```

Visit:

```text
http://<VM_PUBLIC_IP>
```

