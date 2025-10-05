# 🎨 Customization Guide - Email Manager Pro

## Quick Customization Reference

This guide shows you exactly how to customize the Email Manager Pro for your company's needs.

---

## 📝 Table of Contents

1. [Adding New Projects](#adding-new-projects)
2. [Adding New Email Types](#adding-new-email-types)
3. [Changing Subject Line Format](#changing-subject-line-format)
4. [Customizing Email Headers](#customizing-email-headers)
5. [Changing Colors & Branding](#changing-colors--branding)
6. [Advanced Customization](#advanced-customization)

---

## 1. Adding New Projects

### Option A: Edit config.js (Recommended)

Open `config.js` and find the `projects` array:

```javascript
projects: [
    { code: "PROJECT-001", name: "Alpha Initiative", active: true },
    // Add your new project here:
    { code: "PROJ-2025-Q4", name: "Q4 Digital Transformation", active: true },
    { code: "CLIENT-ACME", name: "Acme Corp Partnership", active: true },
]
```

**Fields explained:**
- `code`: Short identifier (appears in subject line)
- `name`: Full descriptive name (appears in dropdown and header)
- `active`: Set to `false` to hide without deleting

### Option B: Edit taskpane.html Directly

Open `taskpane.html` and find the `<select id="projectSelect">` section:

```html
<select id="projectSelect">
    <option value="">-- Choose a project --</option>
    <option value="YOUR-CODE">Your Project Name</option>
    <!-- Add more options here -->
</select>
```

**Best practices for project codes:**
- Use uppercase
- Keep under 20 characters
- Use hyphens for spaces
- Examples: `PROJ-2025-001`, `CLIENT-ACME`, `DEPT-MARKETING`

---

## 2. Adding New Email Types

### In config.js:

```javascript
emailTypes: [
    { 
        code: "UPDATE",           // Internal code
        label: "Status Update",   // Display name in dropdown
        priority: "Normal",       // "Normal", "High", or "Low"
        icon: "📊",              // Emoji (optional)
        headerText: "Status Update"  // Text in email header
    },
    // Add your custom type:
    {
        code: "CONTRACT",
        label: "Contract Review",
        priority: "High",
        icon: "📄",
        headerText: "Contract Review Required"
    }
]
```

### Common Email Types for Enterprise:

```javascript
// Sales & Business Development
{ code: "PROPOSAL", label: "Proposal Submission", priority: "High", icon: "📋" },
{ code: "QUOTE", label: "Quote Request", priority: "Normal", icon: "💰" },
{ code: "CONTRACT", label: "Contract Review", priority: "High", icon: "📄" },

// Project Management
{ code: "MILESTONE", label: "Milestone Update", priority: "Normal", icon: "🎯" },
{ code: "RISK", label: "Risk Alert", priority: "High", icon: "⚠️" },
{ code: "DELIVERABLE", label: "Deliverable Complete", priority: "Normal", icon: "✅" },

// Support & Operations
{ code: "INCIDENT", label: "Incident Report", priority: "High", icon: "🚨" },
{ code: "MAINTENANCE", label: "Maintenance Notice", priority: "Normal", icon: "🔧" },
{ code: "OUTAGE", label: "Service Outage", priority: "High", icon: "❌" },

// HR & Admin
{ code: "POLICY", label: "Policy Update", priority: "Normal", icon: "📜" },
{ code: "ONBOARDING", label: "New Hire Onboarding", priority: "Normal", icon: "👋" },
{ code: "TRAINING", label: "Training Invitation", priority: "Normal", icon: "🎓" },

// Finance
{ code: "INVOICE", label: "Invoice Submission", priority: "Normal", icon: "💵" },
{ code: "EXPENSE", label: "Expense Report", priority: "Normal", icon: "💳" },
{ code: "BUDGET", label: "Budget Review", priority: "High", icon: "📊" }
```

---

## 3. Changing Subject Line Format

### Current Default Format:
```
[PROJECT-CODE] Email Type - Custom Subject
Example: [PROJ-001] Status Update - Q3 Results
```

### Customization Options:

**In config.js**, modify `subjectFormat`:

```javascript
// Option 1: Current format (default)
subjectFormat: "[{project}] {type}{custom}"
// Result: [PROJ-001] Status Update - Details

// Option 2: Pipe separator
subjectFormat: "{project} | {type} | {custom}"
// Result: PROJ-001 | Status Update | Details

// Option 3: Colon format
subjectFormat: "{type}: {project} - {custom}"
// Result: Status Update: PROJ-001 - Details

// Option 4: No brackets
subjectFormat: "{project} - {type} - {custom}"
// Result: PROJ-001 - Status Update - Details

// Option 5: Reverse order
subjectFormat: "{custom} ({type} - {project})"
// Result: Details (Status Update - PROJ-001)
```

**Variables available:**
- `{project}` - Project code
- `{type}` - Email type label
- `{custom}` - Custom subject text (automatically adds " - " if present)

### Advanced: Custom Logic in JavaScript

Edit `taskpane.js`, find the `generateSubject()` function:

```javascript
function generateSubject() {
    const typeLabel = EMAIL_TEMPLATES.headers[currentSelection.emailType];
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Custom format with date
    let subject = `[${currentSelection.project}] ${typeLabel} - ${date}`;
    
    if (currentSelection.customSubject) {
        subject += ` - ${currentSelection.customSubject}`;
    }
    
    return subject;
}
// Result: [PROJ-001] Status Update - Oct 15 - Q3 Results
```

---

## 4. Customizing Email Headers

### Basic Header Configuration

In `config.js`, modify the `header` object:

```javascript
header: {
    // Visual styling
    includeDividers: true,              // Show separator lines
    dividerChar: "━",                   // Character for dividers
    dividerLength: 40,                  // Length of divider line
    
    // Information to include
    includeProject: true,               // Show project name
    includeType: true,                  // Show email type
    includePriority: true,              // Show priority level
    includeDate: true,                  // Show date
    includeTime: false,                 // Show time
    includeSender: false,               // Show sender name
    
    // Date formatting
    dateFormat: 'long',                 // 'short', 'long', or 'iso'
    
    // Custom fields
    customFields: [
        { label: "Department", value: "Engineering" },
        { label: "Region", value: "North America" },
        { label: "Cost Center", value: "CC-12345" }
    ]
}
```

### Header Style Examples:

**Minimal Header:**
```javascript
header: {
    includeDividers: false,
    includeProject: true,
    includeType: true,
    includePriority: false,
    includeDate: false,
}
```
Output:
```
Project: PROJ-001: Alpha Initiative
Type: Status Update
```

**Detailed Header:**
```javascript
header: {
    includeDividers: true,
    dividerChar: "═",
    includeProject: true,
    includeType: true,
    includePriority: true,
    includeDate: true,
    includeTime: true,
    customFields: [
        { label: "Owner", value: "John Smith" },
        { label: "Deadline", value: "Q4 2025" }
    ]
}
```
Output:
```
══════════════════════════════════════
📝 STATUS UPDATE
══════════════════════════════════════

Project: PROJ-001: Alpha Initiative
Type: Status Update
Priority: Normal
Date: October 4, 2025
Time: 2:30 PM EST
Owner: John Smith
Deadline: Q4 2025

══════════════════════════════════════
```

### Custom Divider Characters:

```javascript
// Box drawing characters
dividerChar: "━"  // Heavy horizontal
dividerChar: "─"  // Light horizontal
dividerChar: "═"  // Double horizontal
dividerChar: "▬"  // Black rectangle
dividerChar: "▔"  // Upper block

// Simple characters
dividerChar: "-"  // Hyphen
dividerChar: "="  // Equals
dividerChar: "*"  // Asterisk
dividerChar: "~"  // Tilde
```

---

## 5. Changing Colors & Branding

### Primary Color

In `config.js`:

```javascript
ui: {
    primaryColor: "#0078d4",  // Microsoft Blue (default)
}
```

**Common corporate colors:**
```javascript
// Tech companies
primaryColor: "#0078d4"  // Microsoft Blue
primaryColor: "#1877f2"  // Facebook Blue
primaryColor: "#0073b1"  // LinkedIn Blue
primaryColor: "#1da1f2"  // Twitter Blue

// Enterprise brands
primaryColor: "#ff0000"  // Red (Target, Coca-Cola)
primaryColor: "#00ff00"  // Green (John Deere, Spotify)
primaryColor: "#ffa500"  // Orange (Amazon, Home Depot)
primaryColor: "#800080"  // Purple (Yahoo, FedEx)
```

### In taskpane.html CSS:

Find the `<style>` section and update:

```css
/* Primary brand color */
h1 {
    color: #YOUR-COLOR-HERE;
}

.btn-primary {
    background: #YOUR-COLOR-HERE;
}

.preview-content {
    border-left: 3px solid #YOUR-COLOR-HERE;
}

/* Hover states */
.btn-primary:hover {
    background: #DARKER-SHADE-HERE;
}
```

### Adding Company Logo:

In `taskpane.html`, add after the `<h1>` tag:

```html
<div style="text-align: center; margin-bottom: 20px;">
    <img src="https://your-domain.com/logo.png" 
         alt="Company Logo" 
         style="max-width: 150px; height: auto;">
</div>
```

---

## 6. Advanced Customization

### Auto-Populate Based on Recipient

Edit `taskpane.js` to add auto-detection:

```javascript
Office.context.mailbox.item.to.getAsync(function(result) {
    if (result.status === Office.AsyncResultStatus.Succeeded) {
        const toEmails = result.value;
        
        // Auto-select project based on recipient domain
        if (toEmails[0].emailAddress.includes('@client-acme.com')) {
            document.getElementById('projectSelect').value = 'CLIENT-ACME';
            handleSelectionChange();
        }
    }
});
```

### Add Current User's Name to Header

```javascript
function generateEmailHeader() {
    // Get current user
    const userName = Office.context.mailbox.userProfile.displayName;
    
    let header = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    header += `From: ${userName}\n`;
    // ... rest of header
    return header;
}
```

### Dynamic Project List from SharePoint

```javascript
// Fetch projects from SharePoint list
fetch('https://your-sharepoint.com/_api/web/lists/getbytitle(\'Projects\')/items')
    .then(response => response.json())
    .then(data => {
        const projectSelect = document.getElementById('projectSelect');
        data.value.forEach(project => {
            const option = document.createElement('option');
            option.value = project.ProjectCode;
            option.textContent = project.Title;
            projectSelect.appendChild(option);
        });
    });
```

### Add Email Tracking Code

```javascript
function generateSubject() {
    // Generate unique tracking ID
    const trackingId = 'TRK-' + Date.now().toString(36).toUpperCase();
    
    let subject = `[${currentSelection.project}] ${typeLabel}`;
    if (currentSelection.customSubject) {
        subject += ` - ${currentSelection.customSubject}`;
    }
    subject += ` #${trackingId}`;
    
    return subject;
}
// Result: [PROJ-001] Status Update - Q3 Results #TRK-L7X8K9
```

### Remember Last Selection (Local Storage)

```javascript
function handleSelectionChange() {
    // Save to local storage
    localStorage.setItem('lastProject', currentSelection.project);
    localStorage.setItem('lastEmailType', currentSelection.emailType);
    
    updatePreview();
}

function initializeApp() {
    // Load last selection
    const lastProject = localStorage.getItem('lastProject');
    const lastEmailType = localStorage.getItem('lastEmailType');
    
    if (lastProject) {
        document.getElementById('projectSelect').value = lastProject;
    }
    if (lastEmailType) {
        document.getElementById('emailTypeSelect').value = lastEmailType;
    }
}
```

---

## 🎯 Common Customization Scenarios

### Scenario 1: Law Firm

```javascript
projects: [
    { code: "CASE-2025-001", name: "Smith v. Johnson", active: true },
    { code: "CLIENT-ACME", name: "Acme Corp Retainer", active: true },
    { code: "LITIGATION", name: "Litigation Department", active: true },
]

emailTypes: [
    { code: "DISCOVERY", label: "Discovery Request", priority: "High", icon: "📋" },
    { code: "DEPOSITION", label: "Deposition Notice", priority: "High", icon: "⚖️" },
    { code: "FILING", label: "Court Filing", priority: "High", icon: "📁" },
    { code: "CLIENT-UPDATE", label: "Client Update", priority: "Normal", icon: "📧" },
]
```

### Scenario 2: Healthcare Organization

```javascript
projects: [
    { code: "DEPT-CARDIOLOGY", name: "Cardiology Department", active: true },
    { code: "DEPT-ONCOLOGY", name: "Oncology Department", active: true },
    { code: "ADMIN", name: "Hospital Administration", active: true },
]

emailTypes: [
    { code: "PATIENT-CARE", label: "Patient Care", priority: "High", icon: "🏥" },
    { code: "PROTOCOL", label: "Protocol Update", priority: "Normal", icon: "📋" },
    { code: "EMERGENCY", label: "Emergency Alert", priority: "High", icon: "🚨" },
    { code: "REFERRAL", label: "Patient Referral", priority: "Normal", icon: "👥" },
]
```

### Scenario 3: Software Development

```javascript
projects: [
    { code: "PROD-API", name: "API Development", active: true },
    { code: "PROD-MOBILE", name: "Mobile App", active: true },
    { code: "DEVOPS", name: "DevOps & Infrastructure", active: true },
]

emailTypes: [
    { code: "BUG", label: "Bug Report", priority: "High", icon: "🐛" },
    { code: "FEATURE", label: "Feature Request", priority: "Normal", icon: "✨" },
    { code: "RELEASE", label: "Release Notes", priority: "Normal", icon: "🚀" },
    { code: "INCIDENT", label: "Production Incident", priority: "High", icon: "🔥" },
]
```

---

## 📋 Customization Checklist

Before deploying, make sure you've:

- [ ] Updated company name in `config.js`
- [ ] Added all your projects to `projects` array
- [ ] Customized email types for your industry
- [ ] Chosen a subject line format
- [ ] Configured header appearance
- [ ] Updated primary color to match branding
- [ ] Updated all URLs in `manifest.xml`
- [ ] Tested with sample emails
- [ ] Created user documentation

---

## 🆘 Need Help?

**Can't find what you're looking for?**
- Check the main [README.md](README.md) for general setup
- See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions
- Open an issue on GitHub
- Contact your IT administrator

**Want to contribute?**
- Submit a pull request with your customization
- Share your configuration examples
- Report bugs or suggest features