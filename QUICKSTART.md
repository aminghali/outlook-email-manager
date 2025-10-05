# ⚡ Quick Start Guide - 5 Minutes to Deployment

Get Email Manager Pro running in your Outlook in just 5 minutes.

---

## 🎯 For Non-Technical Users

### Step 1: Get the Files (1 minute)
Download all files from this folder to your computer.

### Step 2: Edit Your Projects (2 minutes)
1. Open `config.js` in any text editor (Notepad, TextEdit, etc.)
2. Find the `projects:` section (around line 30)
3. Replace the example projects with your actual projects:

```javascript
projects: [
    { code: "YOUR-PROJECT-CODE", name: "Your Project Name", active: true },
    { code: "ANOTHER-CODE", name: "Another Project", active: true },
    // Add as many as you need
]
```

**Example for a Marketing Team:**
```javascript
projects: [
    { code: "SOCIAL-2025", name: "Social Media Campaign 2025", active: true },
    { code: "EMAIL-BLAST", name: "Email Marketing", active: true },
    { code: "WEB-REDESIGN", name: "Website Redesign", active: true },
]
```

4. Save the file

### Step 3: Upload to GitHub Pages (FREE) (2 minutes)

**Option A: GitHub Desktop (Easiest)**
1. Download GitHub Desktop: https://desktop.github.com/
2. Create new repository
3. Drag and drop all files
4. Click "Publish repository"
5. Go to repository settings > Pages
6. Enable GitHub Pages (select "main" branch)
7. Your URL will be: `https://YOUR-USERNAME.github.io/REPO-NAME/`

**Option B: Web Upload**
1. Go to https://github.com/new
2. Create a new repository (name it "email-manager-pro")
3. Click "uploading an existing file"
4. Drag all files from this folder
5. Click "Commit changes"
6. Go to Settings > Pages
7. Enable Pages (source: main branch, folder: / root)

### Step 4: Update manifest.xml (30 seconds)
1. Open `manifest.xml` in a text editor
2. Press Ctrl+H (Find & Replace)
3. Find: `https://yourdomain.com`
4. Replace with: `https://YOUR-GITHUB-USERNAME.github.io/email-manager-pro`
5. Replace All
6. Save the file
7. Upload the updated manifest.xml to GitHub (drag and drop, then commit)

### Step 5: Install in Outlook (30 seconds)
1. Open Outlook Web (https://outlook.office.com)
2. Click the Settings gear icon (top right)
3. Click "View all Outlook settings"
4. Go to: General > Manage add-ins
5. Click: "+ My add-ins"
6. Select: "Add from file"
7. Upload your `manifest.xml`
8. Click "Install"
9. Refresh Outlook

### Step 6: Test It! (30 seconds)
1. Click "New email"
2. Look for "Email Manager Pro" button in the ribbon
3. Click it
4. Select a project
5. Select an email type
6. Click "Apply Template"
7. ✅ Done!

---

## 💻 For Technical Users

### Ultra-Fast Deploy (using Azure Static Web Apps)

```bash
# 1. Install Azure CLI (if not already)
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# 2. Login
az login

# 3. Deploy (all in one command)
az staticwebapp create \
  --name email-manager-pro \
  --resource-group EmailManagerPro \
  --source . \
  --location eastus \
  --branch main

# 4. Note the URL it provides

# 5. Update manifest.xml with the Azure URL
sed -i 's|https://yourdomain.com|https://your-azure-url.azurestaticapps.net|g' manifest.xml

# 6. Install in Outlook (see above)
```

**Total time: 2-3 minutes**

---

## 🚀 Deploy to Your Company Server

If your company has a web server:

```bash
# 1. Upload all files via FTP/SCP
scp -r * user@your-server.com:/var/www/email-manager/

# 2. Update manifest.xml with your server URL
# Replace https://yourdomain.com with https://your-server.com/email-manager/

# 3. Install in Outlook (see above)
```

---

## 🎨 Quick Customizations

### Change the Color
In `taskpane.html`, find this line (around line 50):
```css
color: #0078d4;  /* Change this to your company's color */
```

### Add More Projects
In `config.js`, add to the `projects` array:
```javascript
{ code: "NEW-PROJECT", name: "New Project Name", active: true },
```

### Add More Email Types
In `config.js`, add to the `emailTypes` array:
```javascript
{ code: "CUSTOM", label: "Custom Type", priority: "Normal", icon: "📌" },
```

---

## 🆘 Troubleshooting

**Add-in doesn't appear?**
- Wait 5-10 minutes after installing
- Hard refresh Outlook (Ctrl+Shift+R)
- Clear browser cache
- Check manifest.xml URLs are correct

**"Can't load add-in" error?**
- Make sure all files are uploaded to the same location
- Verify your hosting URL uses HTTPS (not HTTP)
- Check browser console for errors (F12)

**GitHub Pages not working?**
- Wait 2-5 minutes after enabling
- Check Settings > Pages shows "Your site is published at..."
- Make sure repository is public

---

## ✅ Success Checklist

- [ ] Files downloaded
- [ ] Projects customized in config.js
- [ ] Files uploaded to web host
- [ ] manifest.xml updated with correct URLs
- [ ] Add-in installed in Outlook
- [ ] Tested by creating a new email
- [ ] Template applies successfully

---

## 📧 Sharing with Your Team

### IT Admin Deployment
1. Follow steps above to deploy to a web server
2. Go to Microsoft 365 Admin Center
3. Upload manifest.xml under "Integrated apps"
4. Assign to all users or specific groups
5. Users will see add-in automatically within 24 hours

### Individual User Installation
1. Share the `manifest.xml` file with your team
2. Send them these instructions:
   - Open Outlook Web
   - Settings > Manage add-ins
   - "+ My add-ins" > "Add from file"
   - Upload manifest.xml
   - Refresh Outlook

---

## 🎓 User Training (30 seconds)

Send this to your team:

```
Hi team! We have a new email tool:

1. When composing email, click "Email Manager Pro"
2. Pick your project from dropdown
3. Pick email type (Update, Request, etc.)
4. Click "Apply Template"
5. Email gets professional subject + header

Questions? Reply to this email.
```

---

## 🔗 Resources

- **Full Documentation**: See README.md
- **Customization Options**: See CUSTOMIZATION-GUIDE.md
- **Deployment Guide**: See DEPLOYMENT.md
- **Microsoft Docs**: https://docs.microsoft.com/office/dev/add-ins/

---

## 💡 Pro Tips

1. **Test First**: Install for yourself before rolling out to team
2. **Start Small**: Begin with 3-5 projects, add more later
3. **Get Feedback**: Ask users what projects/types they need
4. **Iterate**: Update config.js monthly based on usage
5. **Monitor Adoption**: Check how many people use it

---

## 🎉 You're Ready!

That's it! You now have enterprise-grade email standardization.

**Questions?** Check the full README.md or open an issue.

**Working great?** Share it with other departments!