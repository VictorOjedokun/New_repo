# README 1: Connect an Azure VM to a Storage Account Using Managed Identity

## Overview

This project demonstrates how to securely connect an Azure Virtual Machine to an Azure Storage Account using a System-Assigned Managed Identity.

Instead of storing Storage Account keys, connection strings, or SAS tokens on the VM, Azure handles authentication automatically through Microsoft Entra ID (formerly Azure AD).

## Architecture

```text
Azure VM
    │
    ▼
Managed Identity
    │
    ▼
Azure RBAC
    │
    ▼
Storage Account
    │
    ▼
Blob Container
```

## Prerequisites

* Azure Subscription
* Azure Virtual Machine (Ubuntu)
* Azure Storage Account
* Blob Container with at least one file
* SSH access to the VM
* Azure CLI installed on the VM

---

## Step 1: Enable Managed Identity on the VM

1. Navigate to Azure Portal.
2. Open the Virtual Machine.
3. Select **Identity**.
4. Under **System Assigned**, change **Status** to **On**.
5. Click **Save**.

Azure automatically creates a Managed Identity for the VM.

---

## Step 2: Grant Storage Permissions

1. Open the Storage Account.
2. Navigate to **Access Control (IAM)**.
3. Select **Add Role Assignment**.

Choose:

```text
Storage Blob Data Reader
```

Click **Next**.

---

## Step 3: Assign the VM Identity

1. Select:

```text
Managed Identity
```

2. Click **Select Members**.
3. Choose:

```text
Virtual Machine
```

4. Select your VM.
5. Click **Review + Assign**.

Allow a few minutes for permissions to propagate.

---

## Step 4: Connect to the VM

```bash
ssh azureuser@<PUBLIC_IP>
```

---

## Step 5: Authenticate Using Managed Identity
1. Install azure CLI
2. Check identity
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

az login --identity
```

Expected result:

```text
Login succeeded.
```

No username, password, key, or browser authentication is required.

---

## Step 6: Verify Storage Access

List containers:

```bash
az storage container list \
  --account-name rhema \
  --auth-mode login
```

List blobs:

```bash
az storage blob list \
  --account-name rhema \
  --container-name files \
  --auth-mode login \
  --output table
```

Download a blob:

```bash
az storage blob download \
  --account-name rhema \
  --container-name files \
  --name welcome.txt \
  --file welcome.txt \
  --auth-mode login
```

View contents:

```bash
cat welcome.txt
```


