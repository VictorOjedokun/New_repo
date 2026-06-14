sudo apt update
sudo apt install cifs-utils -y
ls -lah /media/storage
cat /media/storage/index.html

# Azure Files Storage Lab: Mount a Cloud File Share on a Linux VM

## Overview

This lab demonstrates how to create an Azure File Share and mount it on a Linux Virtual Machine.

Unlike Azure Blob Storage, which stores files as objects, Azure Files provides a traditional shared file system that multiple machines can access simultaneously using the SMB protocol.

## Objectives

By the end of this lab, you will be able to:

* Create an Azure Storage Account
* Create an Azure File Share
* Upload files to the share
* Mount the share on a Linux VM
* Read and write files from the VM
* Configure persistent mounts across reboots

---

## Architecture

```text
Azure Storage Account
        │
        ▼
   Azure File Share
        │
        ▼
    SMB Protocol
        │
        ▼
     Linux VM
```

---

# Prerequisites

* Azure Subscription
* Azure Storage Account
* Ubuntu Linux Virtual Machine
* SSH access to the VM
* Storage Account Key

---

# Step 1: Create a Storage Account

1. Sign in to the Azure Portal.
2. Navigate to **Storage Accounts**.
3. Click **Create**.
4. Configure:

| Setting              | Value       |
| -------------------- | ----------- |
| Resource Group       | beginner-rg |
| Storage Account Name | unique name |
| Performance          | Standard    |
| Redundancy           | LRS         |

5. Click **Review + Create**.
6. Click **Create**.

---

# Step 2: Create an Azure File Share

1. Open the Storage Account.
2. Navigate to:

```text
Data Storage → File Shares
```

3. Click:

```text
+ File Share
```

4. Configure:

| Setting | Value                 |
| ------- | --------------------- |
| Name    | storage               |
| Tier    | Transaction Optimized |

5. Click **Create**.

---

# Step 3: Upload a Test File

Create a local file:

```text
welcome.txt
```

Contents:

```text
Welcome to Azure Files Storage
```

Upload it to the File Share using the Azure Portal.

---

# Step 4: Create or Reuse a Linux VM

Create an Ubuntu VM or use an existing one.

Connect:

```bash
ssh azureuser@<PUBLIC_IP>
```

---

# Step 5: Install Required Packages

Update the system:

```bash
sudo apt update
```

Install CIFS utilities:

```bash
sudo apt install cifs-utils -y
```

Verify installation:

```bash
mount -V
```

---

# Step 6: Retrieve Storage Account Credentials

1. In your file storage, navigate to uploads, then select linux suystem, then copy the code
2. Run the code in your VM
```

Example:

```bash
sudo mount -t cifs //xahavisa.file.core.windows.net/storage \
/media/storage \
-o credentials=/etc/smbcredentials/xahavisa.cred,dir_mode=0755,file_mode=0755,serverino,nosharesock,mfsymlinks,actimeo=30
```

---

# Step 10: Verify the Mount

Check mounted filesystems:

```bash
df -h
```

Check CIFS mounts:

```bash
mount | grep cifs
```

List files:

```bash
ls -lah /media/storage
```

Expected:

```text
welcome.txt
```

Read the file:

```bash
cat /media/storage/welcome.txt
```

Output:

```text
Welcome to Azure Files Storage
```

---

# Step 11: Create Files from the VM

Create a test file:

```bash
echo "Created from Azure VM" > /media/storage/vm-test.txt
```

Verify:

```bash
ls -lah /media/storage
```

Return to the Azure Portal and confirm that `vm-test.txt` appears in the File Share.

---

# Step 12: Configure Automatic Mounting

Edit:

```bash
sudo nano /etc/fstab
```

Add:

```text
//xahavisa.file.core.windows.net/storage /media/storage cifs credentials=/etc/smbcredentials/xahavisa.cred,dir_mode=0755,file_mode=0755,serverino,nosharesock,mfsymlinks,actimeo=30,_netdev 0 0
```

Save the file.

Reload systemd:

```bash
sudo systemctl daemon-reload
```

Test:

```bash
sudo mount -a
```

No output indicates success.

---

# Step 13: Verify Persistence

Create a file:

```bash
echo "Persistence Test" > /media/storage/persistence.txt
```

Reboot:

```bash
sudo reboot
```

Reconnect:

```bash
ssh azureuser@<PUBLIC_IP>
```

Verify:

```bash
ls -lah /media/storage
```

Expected:

```text
persistence.txt
vm-test.txt
welcome.txt
```
