# Email Manager Pro - Complete Feature Guide

## 🎯 Overview

Email Manager Pro is a comprehensive Outlook Web Add-in that automates email standardization, categorization, and recipient management for enterprise workflows.

---

## ✨ New Features (Major Upgrade)

### 1. **Dual Mode Interface**

#### **Compose Mode** (When composing/replying to emails)
- Full template application with subject and header
- Auto-add recipients based on project
- Auto-categorization
- Custom properties tracking

#### **Read Mode** (When viewing received emails)
- Quick categorization
- Smart project detection from subject
- Bulk category management
- Remove categories

---

## 📧 Compose Mode Features

### **Template System**
- **Subject Generation**: `[PROJECT-001] Status Update - Custom Text`
- **Header Template**: Professional formatted header with project info, date, priority
- **Live Preview**: See subject and header before applying

### **Auto-Categorization**
- ✅ Automatically applies **Project Category** (e.g., "PROJECT-001")
- ✅ Automatically applies **Email Type Category** (e.g., "Status Update", "Urgent")
- ✅ Creates categories in Outlook if they don't exist
- ✅ Color-coded categories for easy visual identification

### **Smart Recipient Management**

#### **Project Manager to CC**
- Auto-adds project manager to CC field
- Pulled from `project-config.json`
- Example: Sarah Johnson <sarah.johnson@company.com>

#### **Team Members to CC**
- Auto-adds all team members to CC
- Multiple team members supported
- Shows names and roles in preview

#### **Client Group to Recipients**
- Auto-adds client distribution list or group email
- Goes to TO field (primary recipients)
- Example: Alpha Client Team <alpha-client@clientcompany.com>

#### **Contractors to CC**
- Auto-adds contractor emails to CC
- Supports multiple contractors per project
- Example: Tech Solutions Inc <contact@techsolutions.com>

### **Custom Properties Tracking**
Metadata saved with each email:
- `ProjectCode`: PROJECT-001
- `ProjectName`: Alpha Initiative
- `EmailType`: UPDATE
- `EmailTypeName`: Status Update
- `Priority`: High/Normal/Low

---

## 📨 Read Mode Features

### **Email Information Display**
- Shows sender name and email
- Shows current subject
- Displays all applied categories

### **Smart Project Detection**
Automatically suggests project based on:
- Subject line contains `[PROJECT-XXX]`
- Subject mentions project name keywords
- Shows suggestion with "Apply Suggestion" button

### **Quick Categorization**
- Select project from dropdown → Apply category
- Select email type from dropdown → Apply category
- Preview categories before applying
- One-click application

### **Category Management**
- **Apply Categories**: Add project/type categories to email
- **Remove All Categories**: Clear all categories from email
- **View Current Categories**: See what's already applied

---

## 📋 Configuration System

### **Project Configuration** (`project-config.json`)

Each project includes:
```json
{
  "code": "PROJECT-001",
  "name": "Alpha Initiative",
  "displayName": "PROJECT-001: Alpha Initiative",
  "category": "PROJECT-001",
  "categoryColor": "Preset0",
  "projectManager": {
    "name": "Sarah Johnson",
    "email": "sarah.johnson@company.com"
  },
  "teamMembers": [
    {
      "name": "Michael Chen",
      "email": "michael.chen@company.com",
      "role": "Lead Developer"
    }
  ],
  "clientGroup": {
    "name": "Alpha Client Team",
    "email": "alpha-client@clientcompany.com"
  },
  "contractors": [
    {
      "name": "Tech Solutions Inc",
      "email": "contact@techsolutions.com"
    }
  ]
}
```

### **Email Types Configuration**
```json
{
  "code": "UPDATE",
  "name": "Status Update",
  "category": "Status Update",
  "priority": "Normal"
}
```

---

## 🚀 How to Use

### **Composing a New Email**

1. Open new email in Outlook Web
2. Click **"Email Manager Pro"** button in ribbon
3. Select **Project** from dropdown
4. Select **Email Type** from dropdown
5. (Optional) Add custom subject text
6. **Check recipient options:**
   - ☑ Add Project Manager to CC
   - ☑ Add Team Members to CC
   - ☑ Add Client Group to Recipients
   - ☑ Add Contractors to CC
7. Review preview (subject, header, categories)
8. Click **"Apply Template"**

**Result:**
- ✅ Subject updated with project code and type
- ✅ Header added to email body
- ✅ Categories applied (visible in Outlook)
- ✅ Recipients added to TO/CC fields
- ✅ Custom properties saved

---

### **Reading a Received Email**

1. Open email in Outlook Web
2. Click **"Email Manager Pro"** button in ribbon
3. **Check for smart suggestions** (auto-detected project)
4. Or manually select project/email type
5. Review categories to be applied
6. Click **"Apply Categories"**

**Result:**
- ✅ Email categorized for easy filtering
- ✅ Can now use Outlook rules to auto-file emails

**Tip:** Set up Outlook rules like:
- "If category = PROJECT-001 → Move to PROJECT-001 folder"
- "If category = Urgent → Flag for follow-up"

---

## 🎨 Categories Explained

### **Why Categories?**
- **Organization**: Filter inbox by project or type
- **Automation**: Outlook rules can move/flag based on categories
- **Visibility**: Color-coded labels in email list
- **Search**: Find all emails for a project instantly

### **Category Types**
1. **Project Categories**: PROJECT-001, PROJECT-002, etc.
2. **Email Type Categories**: Status Update, Urgent, Approval Required, etc.

### **Category Colors**
Automatically assigned when created:
- Project categories get unique colors
- Email type categories get consistent colors across all projects

---

## 💡 Real-World Workflows

### **Workflow 1: Project Email Workflow**
1. Compose email for PROJECT-001
2. Select "PROJECT-001: Alpha Initiative"
3. Select "Status Update"
4. Check "Add Project Manager to CC"
5. Check "Add Team Members to CC"
6. Apply template
7. Write email content
8. Send

**Recipient List Automatically Includes:**
- TO: (your original recipients)
- CC: Sarah Johnson (PM), Michael Chen, Emma Williams (team)

**Categories Applied:**
- PROJECT-001
- Status Update

---

### **Workflow 2: Received Email Categorization**
1. Receive email from client about "Alpha Initiative"
2. Open email
3. Email Manager detects "Alpha" in subject
4. Suggests "PROJECT-001: Alpha Initiative"
5. Click "Apply Suggestion"
6. Click "Apply Categories"
7. Email now tagged with PROJECT-001

**Outlook Rule (set up once):**
- If category = PROJECT-001
- Move to "Projects/Alpha Initiative" folder

---

### **Workflow 3: Urgent Client Issue**
1. Compose new email
2. Select "CLIENT: Client Relations"
3. Select "🔴 URGENT"
4. Check "Add Client Group"
5. Apply template

**Result:**
- Subject: [CLIENT] 🔴 URGENT - Issue Description
- Categories: Client Relations, Urgent
- Priority: High
- Client group auto-added to recipients

---

## 🔧 Customization

### **Adding New Projects**
Edit `project-config.json`:
```json
{
  "code": "PROJECT-007",
  "name": "New Project",
  "displayName": "PROJECT-007: New Project",
  "category": "PROJECT-007",
  "categoryColor": "Preset8",
  "projectManager": {
    "name": "Your Name",
    "email": "you@company.com"
  },
  "teamMembers": [],
  "clientGroup": null,
  "contractors": []
}
```

### **Adding New Email Types**
Edit `project-config.json`:
```json
{
  "code": "CUSTOM",
  "name": "Custom Type",
  "category": "Custom Category",
  "priority": "Normal"
}
```

### **Updating Team Members**
Edit project in `project-config.json`:
```json
"teamMembers": [
  {
    "name": "New Member",
    "email": "newmember@company.com",
    "role": "Developer"
  }
]
```

---

## 🔮 Future Enhancements (SharePoint Integration)

The current configuration file (`project-config.json`) is designed to be replaced with SharePoint Lists:

### **Planned Features:**
1. **SharePoint Projects List**
   - Centrally managed project data
   - Auto-sync with add-in
   - No manual config file updates

2. **SharePoint Team Members List**
   - Dynamic team roster
   - Automatically updated when people join/leave

3. **SharePoint Email Tracking List**
   - Log all sent emails with metadata
   - Track email counts per project
   - Audit trail for compliance

4. **SharePoint Client Database**
   - Client contact management
   - Auto-populate client groups

---

## 📊 Permissions Required

The add-in requires **ReadWriteMailbox** permission to:
- Read email subject and sender (read mode)
- Modify email subject and body (compose mode)
- Add recipients to TO/CC/BCC
- Get and set categories
- Set custom properties
- Access mailbox master categories

---

## 🛠️ Technical Details

### **Files Structure**
```
outlook-email-manager/
├── manifest.xml                 # Add-in configuration
├── project-config.json          # Project/team data
├── taskpane-compose.html        # Compose mode UI
├── taskpane-compose.js          # Compose mode logic
├── taskpane-read.html           # Read mode UI
├── taskpane-read.js             # Read mode logic
├── taskpane.html                # Legacy (removed)
├── taskpane.js                  # Legacy (removed)
└── commands.html                # Commands handler
```

### **API Requirements**
- **Office.js**: Version 1.8+ (for categories API)
- **Mailbox API**: Requirement Set 1.8
- **Permissions**: ReadWriteMailbox

### **Browser Compatibility**
- ✅ Outlook on the web (Office 365)
- ✅ New Outlook for Windows
- ⚠️ Classic Outlook on Windows (limited)
- ⚠️ Outlook Mobile (limited categories support)

---

## 📝 Tips & Best Practices

### **For Project Managers**
1. Set up Outlook rules to auto-file categorized emails
2. Use category filters to see all project emails
3. Review email tracking via custom properties

### **For Team Members**
1. Always use the add-in when sending project emails
2. Categorize received client emails immediately
3. Check suggestions - they're usually accurate!

### **For Administrators**
1. Maintain `project-config.json` with current team data
2. Add new projects as they start
3. Archive old projects (remove from config)
4. Plan SharePoint migration for enterprise scale

---

## 🐛 Troubleshooting

### **Categories Not Appearing**
- Refresh Outlook Web (Ctrl+Shift+R)
- Check if categories were created in Outlook settings
- Verify ReadWriteMailbox permission is granted

### **Recipients Not Adding**
- Verify email addresses in project-config.json
- Check if checkboxes are enabled (disabled = no data)
- Ensure compose mode (not read mode)

### **Smart Suggestions Not Working**
- Subject must contain project code `[PROJECT-XXX]` or project name keywords
- Only works in read mode
- Case-insensitive matching

### **Add-in Not Loading**
- Clear browser cache
- Re-install add-in
- Check GitHub Pages is serving files (https://aminghali.github.io/outlook-email-manager/)
- Verify manifest.xml is valid

---

## 📞 Support

For issues, feature requests, or questions:
- GitHub Issues: https://github.com/aminghali/outlook-email-manager/issues
- Email: aminghali@gmail.com

---

## 📜 Version History

### **Version 2.0.0** (Current)
- ✅ Added dual compose/read mode interfaces
- ✅ Auto-categorization system
- ✅ Smart recipient management
- ✅ Project configuration file
- ✅ Smart project detection
- ✅ Custom properties tracking
- ✅ Category management in read mode

### **Version 1.0.0** (Initial)
- Basic template system
- Subject and header generation
- Single interface for compose mode

---

**Made with ❤️ using Claude Code**
