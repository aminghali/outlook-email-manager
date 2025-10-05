# 🚀 Deployment Guide - Email Manager Pro

## Quick Deployment Checklist

- [ ] Customize `config.js` with your projects and email types
- [ ] Update `manifest.xml` with your domain
- [ ] Deploy files to web server (HTTPS required)
- [ ] Test the add-in locally
- [ ] Deploy to users via Microsoft 365 Admin Center

---

## 1️⃣ Pre-Deployment: Customize Configuration

### Edit config.js

```javascript
// 1. Add your company name
company: {
    name: "Acme Corporation",
    supportEmail: "it@acme.com",
    website: "https://acme.com"
},

// 2. Configure your projects
projects: [
    { code: "ACME-2025-Q1", name: "Q1 Initiative", active: true },
    { code: "CLIENT-WIDGETS", name: "Widgets Inc Project", active: true },
    // ... add all your projects
],

// 3. Customize email types (optional)
emailTypes: [
    // Keep defaults or customize
]
```

### Update manifest.xml

Find and replace ALL instances of `https://yourdomain.com` with your actual domain:

```xml
<!-- Before -->
<SourceLocation DefaultValue="https://yourdomain.com/taskpane.html"/>

<!-- After -->
<SourceLocation DefaultValue="https://email-manager.acme.com/taskpane.html"/>
```

**Also update:**
- `<ProviderName>` - Your company name
- `<Id>` - Generate a new GUID at https://guidgenerator.com
- Icon URLs (optional)

---

## 2️⃣ Deployment Option A: Azure Static Web Apps (Recommended)

### Prerequisites
- Azure account (free tier works)
- Azure CLI installed

### Steps

**1. Install Azure CLI** (if not already installed)
```bash
# Windows (PowerShell)
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi
Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'

# macOS
brew install azure-cli

# Linux
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

**2. Login to Azure**
```bash
az login
```

**3. Create Resource Group**
```bash
az group create \
  --name EmailManagerPro \
  --location eastus
```

**4. Create Static Web App**
```bash
az staticwebapp create \
  --name email-manager-pro \
  --resource-group EmailManagerPro \
  --source . \
  --location eastus \
  --branch main \
  --app-location "/" \
  --output-location "/"
```

**5. Note the URL**
Azure will provide a URL like: `https://email-manager-pro-xxxxx.azurestaticapps.net`

**6. Update manifest.xml**
Replace `https://yourdomain.com` with your Azure URL

**7. Upload files to Azure**
```bash
# Create a zip of all files
zip -r email-manager-pro.zip . -x "*.git*" "node_modules/*"

# Upload via portal or CLI
az staticwebapp upload \
  --name email-manager-pro \
  --resource-group EmailManagerPro \
  --source email-manager-pro.zip
```

**Total Cost:** $0 (Free tier includes 100GB bandwidth/month)

---

## 3️⃣ Deployment Option B: GitHub Pages (Free)

### Prerequisites
- GitHub account
- Git installed

### Steps

**1. Create GitHub Repository**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourcompany/email-manager-pro.git
git push -u origin main
```

**2. Enable GitHub Pages**
- Go to repository Settings
- Navigate to "Pages" section
- Select source: Branch `main`, folder `/ (root)`
- Click "Save"

**3. Wait 2-5 minutes** for deployment

**4. Note the URL**
GitHub will provide: `https://yourcompany.github.io/email-manager-pro/`

**5. Update manifest.xml**
Replace all `https://yourdomain.com` with GitHub Pages URL

**Total Cost:** $0

---

## 4️⃣ Deployment Option C: Your Company's Web Server

### Prerequisites
- Web server with HTTPS (Apache, Nginx, IIS)
- FTP or SSH access
- SSL certificate installed

### Steps

**1. Upload Files**
```bash
# Via SCP
scp -r * user@your-server.com:/var/www/email-manager/

# Via FTP
# Use FileZilla or similar FTP client
```

**2. Configure Web Server**

**Apache (.htaccess):**
```apache
# Enable CORS
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type"

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

**Nginx:**
```nginx
location /email-manager/ {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'Content-Type';
}
```

**3. Test HTTPS Access**
```bash
curl https://your-server.com/email-manager/taskpane.html
```

**4. Update manifest.xml** with your server URL

---

## 5️⃣ Deployment Option D: Local Testing (Development)

### For Testing Only - Not for Production

**1. Install Node.js** (if not already installed)
Download from: https://nodejs.org/

**2. Install http-server**
```bash
npm install -g http-server
```

**3. Generate SSL Certificate**
```bash
openssl req -newkey rsa:2048 -new -nodes -x509 -days 365 -keyout key.pem -out cert.pem
```

**4. Start HTTPS Server**
```bash
http-server -p 8080 -S -C cert.pem -K key.pem
```

**5. Use ngrok for Public URL**
```bash
# Install ngrok
npm install -g ngrok

# Start tunnel
ngrok http 8080

# Use the HTTPS URL provided
```

**6. Update manifest.xml** with ngrok URL (changes each time)

---

## 6️⃣ Installing Add-in to Outlook

### Method 1: Centralized Deployment (Recommended for Companies)

**For IT Administrators:**

1. **Go to Microsoft 365 Admin Center**
   https://admin.microsoft.com

2. **Navigate to Settings > Integrated apps**

3. **Click "Upload custom apps"**

4. **Choose "Upload manifest file"**

5. **Upload your customized `manifest.xml`**

6. **Assign to users/groups**
   - All users in organization
   - Specific departments
   - Test group first

7. **Click "Deploy"**

**Deployment Time:** 2-24 hours for all users

### Method 2: Sideloading (Individual Users)

**For End Users:**

1. **Open Outlook Web** (https://outlook.office.com)

2. **Click Settings gear** (top right)

3. **Select "View all Outlook settings"**

4. **Go to General > Manage add-ins**

5. **Click "+ My add-ins"**

6. **Select "Add from file"**

7. **Upload `manifest.xml`**

8. **Click "Install"**

9. **Refresh Outlook**

---

## 7️⃣ Testing the Deployment

### Verification Checklist

- [ ] Add-in appears in Outlook ribbon
- [ ] Clicking add-in button opens pane
- [ ] All projects load in dropdown
- [ ] All email types load in dropdown
- [ ] Preview updates when selections change
- [ ] "Apply Template" button works
- [ ] Subject line is set correctly
- [ ] Email header is added to body
- [ ] No console errors in browser

### Test Steps

1. **Open Outlook Web** and compose a new email

2. **Click "Email Manager Pro"** button in ribbon

3. **Select a project** from dropdown

4. **Select an email type**

5. **Add custom subject** (optional)

6. **Verify preview** looks correct

7. **Click "Apply Template"**

8. **Check subject line** is formatted correctly

9. **Check email body** has header

10. **Send test email** to yourself

### Common Issues

**Add-in doesn't appear:**
- Wait 15 minutes after deployment
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check manifest.xml URLs are correct

**CORS errors:**
- Ensure web server allows CORS
- Check browser console for specific errors
- Verify HTTPS is enabled

**Office.js not loading:**
- Check internet connection
- Verify CDN is not blocked
- Check browser console

---

## 8️⃣ Post-Deployment

### User Training

**Create a quick reference guide:**
1. How to open the add-in
2. How to select project and type
3. What the subject line will look like
4. How to customize subject

**Email announcement template:**
```
Subject: New Email Template Tool Available in Outlook

Hi Team,

We've deployed a new Outlook add-in to help standardize our emails.

What it does:
✅ Automatically formats email subjects with project codes
✅ Adds professional headers to emails
✅ Ensures consistent communication

How to use:
1. Compose a new email
2. Click "Email Manager Pro" in the ribbon
3. Select your project and email type
4. Click "Apply Template"

Questions? Contact IT Support

Thanks,
IT Team
```

### Monitoring

**Track adoption:**
- Survey users after 1 week
- Check for support tickets
- Monitor feedback

**Gather feedback:**
- What projects are missing?
- What email types should be added?
- Any usability issues?

### Maintenance

**Monthly tasks:**
- Review project list
- Add new projects as needed
- Remove inactive projects
- Update email types based on feedback

**Updating the add-in:**
1. Make changes to files
2. Upload new files to web server
3. Users get updates automatically (no reinstall needed)
4. Only update manifest.xml if changing permissions

---

## 9️⃣ Rollback Plan

If issues arise:

**Quick rollback:**
1. Go to Microsoft 365 Admin Center
2. Navigate to Integrated apps
3. Find "Email Manager Pro"
4. Click "Remove"
5. Confirm removal

**Users can also remove individually:**
1. Settings > Manage add-ins
2. Click "..." next to add-in
3. Select "Remove"

---

## 🎯 Success Metrics

After deployment, track:
- **Adoption rate**: % of users who use the add-in
- **Email compliance**: % of emails using standard format
- **Time saved**: Survey users on time savings
- **User satisfaction**: NPS score from users
- **Support tickets**: Reduction in email formatting questions

---

## 📞 Support Resources

**For IT Administrators:**
- Microsoft 365 Admin Center: https://admin.microsoft.com
- Office Add-ins Documentation: https://docs.microsoft.com/office/dev/add-ins/

**For Developers:**
- Office.js API Reference: https://docs.microsoft.com/javascript/api/office
- Outlook Add-ins: https://docs.microsoft.com/outlook/add-ins/

**For End Users:**
- Company IT Support: [Your support contact]
- Quick Start Guide: [Link to internal wiki]

---

## ✅ Deployment Complete!

Your organization now has enterprise-grade email standardization.

**Next steps:**
1. Monitor adoption
2. Gather feedback
3. Iterate on projects/types
4. Train new employees
5. Expand to mobile (Outlook mobile supports add-ins)

**Questions?** Open an issue or contact your IT administrator.