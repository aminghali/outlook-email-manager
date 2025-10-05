# 📧 Email Manager Pro for Outlook Web

Enterprise-grade Outlook Web Add-in for standardizing email subjects, headers, and templates across your organization.

## 🌟 Features

- **Dropdown Project Selection**: Choose from predefined projects with unique codes
- **Email Type Classification**: Standardize email types (Updates, Requests, Approvals, etc.)
- **Automatic Subject Line Formatting**: Consistent `[PROJECT-CODE] Type - Custom Subject` format
- **Professional Email Headers**: Auto-generated headers with project info, date, and priority
- **Real-time Preview**: See your subject line and header before applying
- **Enterprise Standards**: Follow best practices used by Fortune 500 companies
- **Fully Customizable**: Easy configuration file for your company's needs
- **Priority Management**: Automatic priority setting for urgent emails
- **Clean UI**: Modern, professional interface integrated into Outlook

## 📋 Prerequisites

- Microsoft 365 account with Exchange Online
- Access to Outlook Web (outlook.office.com)
- Web server or hosting service (Azure, AWS, shared hosting, etc.)
- Admin access to deploy add-in (or developer mode for testing)

## 🚀 Quick Start

### Option 1: Deploy to Azure (Recommended for Production)

1. **Clone or download this repository**

2. **Customize your configuration**
   Edit `config.js` to add your projects and email types

3. **Deploy to Azure Static Web Apps**
   ```bash
   # Install Azure CLI
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   
   # Login to Azure
   az login
   
   # Create resource group
   az group create --name EmailManagerPro --location eastus
   
   # Deploy static web app
   az staticwebapp create \
       --name email-manager-pro \
       --resource-group EmailManagerPro \
       --source . \
       --location eastus \
       --branch main
   ```

4. **Update manifest.xml**
   Replace all `https://yourdomain.com` with your Azure URL:
   `https://email-manager-pro.azurestaticapps.net`

5. **Deploy the add-in**
   - Go to Microsoft 365 Admin Center
   - Navigate to Settings > Integrated apps
   - Upload `manifest.xml`
   - Deploy to users/groups

### Option 2: Deploy to GitHub Pages (Free Option)

1. **Create a GitHub repository** and push these files

2. **Enable GitHub Pages**
   - Go to Settings > Pages
   - Select branch: main
   - Select folder: / (root)
   - Save

3. **Update manifest.xml**
   Replace `https://yourdomain.com` with:
   `https://your-username.github.io/your-repo-name`

4. **Upload manifest** to Outlook (see "Installing the Add-in" below)

### Option 3: Test Locally (Development Only)

1. **Install a local web server**
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js http-server
   npm install -g http-server
   http-server -p 8000
   ```

2. **Enable sideloading in Outlook**
   - Open Outlook Web
   - Go to Settings > View all Outlook settings
   - Navigate to General > Manage add-ins
   - Click "+ Add a custom add-in"
   - Choose "Add from URL" or "Add from file"

3. **Use ngrok for HTTPS tunneling** (required for Office.js)
   ```bash
   npm install -g ngrok
   ngrok http 8000
   ```
   Use the HTTPS URL provided by ngrok in your manifest.xml

## 📦 Installation

### Installing the Add-in (End Users)

**Method 1: Centralized Deployment (IT Admin)**
1. Admin uploads manifest.xml to Microsoft 365 Admin Center
2. Add-in appears automatically in users' Outlook

**Method 2: Personal Installation**
1. Download the `manifest.xml` file
2. In Outlook Web, click Settings (gear icon)
3. Go to "View all Outlook settings"
4. Navigate to "General > Manage add-ins"
5. Click "+ My add-ins"
6. Choose "Add from file"
7. Upload `manifest.xml`
8. Click "Install"

**Method 3: AppSource (For Published Add-ins)**
- Search for "Email Manager Pro" in Office Store
- Click "Add"

## 🎨 Customization

### Configuring Your Projects

Edit `config.js` to add your company's projects:

```javascript
projects: [
    { code: "PROJ-2025-001", name: "Q1 Initiative", active: true },
    { code: "CLIENT-ACME", name: "Acme Corporation", active: true },
    { code: "INTERNAL", name: "Internal Communication", active: true }
]
```

### Configuring Email Types

Customize email categories in `config.js`:

```javascript
emailTypes: [
    { 
        code: "UPDATE", 
        label: "Status Update", 
        priority: "Normal",
        icon: "📊",
        headerText: "Status Update"
    },
    // Add more types...
]
```

### Customizing Subject Format

Change the subject line format in `config.js`:

```javascript
// Default: [PROJECT-001] Status Update - Details
subjectFormat: "[{project}] {type}{custom}",

// Alternative formats:
// "{project} | {type} | {custom}"
// "{type}: {project} - {custom}"
// "[{type}] {project} {custom}"
```

### Customizing Email Headers

Modify header appearance in `config.js`:

```javascript
header: {
    includeDividers: true,
    dividerChar: "━",  // or "─", "═", "-"
    includeProject: true,
    includeType: true,
    includePriority: true,
    includeDate: true,
    dateFormat: 'long'  // 'short', 'long', or 'iso'
}
```

### Branding

Update colors in `config.js`:

```javascript
ui: {
    primaryColor: "#0078d4",  // Your company's brand color
    showEmojis: true,
    showPreview: true
}
```

## 📖 User Guide

### Using the Add-in

1. **Open a new email** in Outlook Web

2. **Click the "Email Manager Pro" button** in the ribbon

3. **Select your project** from the dropdown

4. **Choose an email type** (Update, Request, Meeting, etc.)

5. **Add custom subject** (optional) for additional context

6. **Preview** the generated subject and header

7. **Click "Apply Template"** to add the template to your email

8. **Compose your email** below the header

9. **Send** as normal

### Example Output

**Subject Line:**
```
[PROJECT-001] Action Required - Budget Approval Needed
```

**Email Header:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 ACTION REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project: PROJECT-001: Alpha Initiative
Type: Action Required
Priority: Normal
Date: October 4, 2025

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Your email content here]
```

## 🔧 Advanced Configuration

### Adding Custom Fields to Headers

```javascript
customFields: [
    { label: "Department", value: "Engineering" },
    { label: "Cost Center", value: "CC-12345" },
    { label: "Region", value: "North America" }
]
```

### Email Validation Rules

```javascript
validation: {
    requireCustomSubjectFor: ["URGENT", "APPROVAL"],
    maxCustomSubjectLength: 100,
    warnOnEmptyBody: true
}
```

### Integration with Other Systems

```javascript
integration: {
    teamsEnabled: true,      // Send notifications to Teams
    sharePointEnabled: true, // Link to SharePoint docs
    crmEnabled: true         // Sync with CRM system
}
```

## 🌐 Browser Compatibility

- ✅ Microsoft Edge (Chromium)
- ✅ Google Chrome
- ✅ Mozilla Firefox
- ✅ Safari 14+
- ✅ Outlook Web App
- ✅ Outlook Desktop (with add-in support)

## 🔐 Security & Privacy

- No data is transmitted to external servers
- All processing happens client-side in your browser
- Add-in only accesses subject and body of emails being composed
- Complies with Microsoft Office Add-in security standards
- No PII (Personally Identifiable Information) is collected

## 🐛 Troubleshooting

### Add-in doesn't appear in Outlook

- **Solution**: Check that manifest is uploaded correctly
- Verify URLs in manifest.xml are correct and accessible
- Clear browser cache and reload Outlook
- Check if add-in is enabled in Settings > Manage add-ins

### "Unable to load add-in" error

- **Solution**: Ensure all files are hosted with HTTPS
- Check browser console for JavaScript errors
- Verify Office.js is loading correctly
- Check CORS settings on your server

### Template not applying

- **Solution**: Make sure both dropdown menus are selected
- Check browser console for errors
- Verify you're composing a new email (not reply/forward)
- Try refreshing the add-in pane

### Preview not updating

- **Solution**: Wait 1-2 seconds after selecting options
- Clear form and try again
- Reload the add-in pane
- Check JavaScript console for errors

## 📊 Benefits for Enterprise

### For Employees
- ✅ Faster email composition
- ✅ Consistent formatting
- ✅ Professional appearance
- ✅ Easy project tracking

### For Managers
- ✅ Better email filtering and sorting
- ✅ Quick identification of priority items
- ✅ Project-based email organization
- ✅ Standardized communication

### For IT/Compliance
- ✅ Enforced email standards
- ✅ Easier email archiving
- ✅ Better searchability
- ✅ Audit trail improvements

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Project dropdown selection
- Email type categorization
- Subject line auto-generation
- Email header templates
- Real-time preview
- Customizable configuration

## 📞 Support

For issues, questions, or feature requests:
- Create an issue in this repository
- Contact your IT administrator
- Email: support@yourcompany.com

## 📄 License

[Your License Here - MIT, Apache 2.0, Proprietary, etc.]

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🙏 Acknowledgments

Built with:
- [Office.js](https://docs.microsoft.com/office/dev/add-ins/)
- Microsoft Office Add-in framework
- Modern JavaScript ES6+

---

**Made with ❤️ for Enterprise Email Management**

For more information on Office Add-ins, visit:
https://docs.microsoft.com/office/dev/add-ins/