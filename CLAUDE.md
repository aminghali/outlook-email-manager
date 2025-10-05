# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Outlook Web Add-in** for standardizing enterprise email communication. It adds a taskpane to Outlook that allows users to select projects and email types from dropdowns, then automatically generates formatted subject lines and professional email headers.

**Technology**: Vanilla JavaScript + Office.js API (no build system, no frameworks)
**Deployment**: Static files hosted on web server (HTTPS required)

## Architecture

### Configuration vs Implementation Pattern

**CRITICAL**: This codebase has a configuration/implementation split that is currently **not fully integrated**:

- `config.js` - Contains centralized configuration (projects, email types, formatting rules)
- `taskpane.js` - Contains hardcoded project/email type mappings (lines 13-37, 133-146)
- `taskpane.html` - Contains hardcoded dropdown options (lines 211-237)

**When modifying projects or email types**: You must update **three places** (config.js, taskpane.js, and taskpane.html) to maintain consistency. Better approach: refactor to read from `CONFIG` object dynamically.

### File Relationships

```
manifest.xml          → Defines Office Add-in, points to HTML files
  ├─ commands.html    → Minimal Office.js initialization
  └─ taskpane.html    → Main UI
       ├─ taskpane.js → Application logic
       └─ config.js   → Configuration (not fully utilized)
```

### Key Functions (taskpane.js)

- `generateSubject()` (line 100) - Creates formatted subject line from template
- `generateEmailHeader()` (line 111) - Builds email header with project metadata
- `applyTemplate()` (line 149) - Applies subject + header to current email via Office.js API
- `getProjectInfo()` (line 133) - Maps project codes to full names (hardcoded)

### Office.js Integration Pattern

All email manipulation uses async Office.js APIs:
```javascript
// Pattern used throughout:
Office.context.mailbox.item.subject.setAsync(value, callback)
Office.context.mailbox.item.body.setAsync(value, options, callback)
```

## Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Start local HTTP server (HTTP only, for quick testing)
npm start
# Runs: http-server -p 8000 -c-1

# Start HTTPS server (required for Office.js)
npm run start:https
# Requires cert.pem and key.pem (see below)

# Generate self-signed SSL certificate
npm run generate-ssl
# Runs: openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

### Testing with ngrok
For Office Add-in testing, you need a public HTTPS URL:
```bash
# After starting local server:
npm install -g ngrok
ngrok http 8080

# Update manifest.xml URLs with ngrok HTTPS URL (changes every restart)
```

### Deployment
No build process - deploy files as-is. See DEPLOYMENT.md for detailed instructions.

```bash
# Validate manifest before deploying
npm run validate

# Deploy to Azure (if configured)
npm run deploy:azure

# Deploy to GitHub Pages (if configured)
npm run deploy:github
```

## Pre-Deployment Requirements

Before deploying, **must update**:

1. **manifest.xml** - Replace ALL instances of `https://yourdomain.com` with actual hosting URL
2. **manifest.xml line 8** - Generate new GUID at https://guidgenerator.com
3. **manifest.xml line 10** - Update `<ProviderName>` with company name
4. **config.js line 11** - Update `company.name`
5. **config.js line 18-34** - Customize `projects` array with actual projects

## Code Organization Quirks

### Duplication Issues
- Email types defined in both `taskpane.js` (EMAIL_TEMPLATES object) and `config.js` (emailTypes array)
- Projects defined in `taskpane.html` (hardcoded options), `taskpane.js` (getProjectInfo function), and `config.js` (projects array)
- **When adding/modifying**: Update all locations or refactor to single source

### Hardcoded Values
- taskpane.html lines 211-237: Project dropdown options should be generated from config.js
- taskpane.js lines 133-146: Project mapping should read from config.js
- taskpane.js lines 13-37: Email templates should read from config.js

### Configuration Not Fully Utilized
`config.js` contains extensive configuration options (validation rules, integrations, UI settings) that are **defined but not implemented** in the code:
- `signature` (line 158) - Not used
- `validation.requireCustomSubjectFor` (line 173) - Not enforced
- `integration.*` (lines 185-192) - Not implemented
- `ui.rememberLastProject` (line 206) - Not implemented

## Common Tasks

### Adding a New Project
1. Edit `config.js` line ~30, add to projects array
2. Edit `taskpane.html` line ~211, add `<option>` to projectSelect
3. Edit `taskpane.js` line ~133, add to getProjectInfo() mapping

**OR** (recommended): Refactor to dynamically populate dropdown from config.js on load.

### Adding a New Email Type
1. Edit `config.js` line ~40, add to emailTypes array
2. Edit `taskpane.html` line ~225, add `<option>` to emailTypeSelect
3. Edit `taskpane.js` line ~13, add to EMAIL_TEMPLATES.headers
4. Edit `taskpane.js` line ~26, add to EMAIL_TEMPLATES.priorities

### Changing Subject Format
Edit `taskpane.js` function `generateSubject()` (line 100-108). Currently uses:
```javascript
`[${currentSelection.project}] ${typeLabel} - ${currentSelection.customSubject}`
```

### Customizing Email Header
Edit `taskpane.js` function `generateEmailHeader()` (line 111-131). Header structure:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 {TYPE IN CAPS}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project: {Project Code}: {Project Name}
Type: {Type Label}
Priority: {Priority Level}
Date: {Formatted Date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Changing Colors/Branding
- Primary color: `taskpane.html` line ~35, 50, 95, 139, etc. (search for `#0078d4`)
- Also in `config.js` line 197 (ui.primaryColor) - but not currently used by code

## Testing

**No automated tests exist**. Manual testing required:

1. Deploy to local HTTPS server or ngrok
2. Update manifest.xml with test URL
3. Sideload add-in in Outlook Web:
   - Settings → Manage add-ins → "+ My add-ins" → "Add from file"
4. Compose new email
5. Click "Email Manager Pro" button
6. Test: project selection → email type → preview → apply template
7. Verify subject line and email header are correct

## Security Considerations

- **Input sanitization**: Custom subject input (taskpane.html line 242) is NOT sanitized before use
- **XSS potential**: Preview uses innerHTML (taskpane.js line 97) - consider using textContent
- All processing is client-side (no backend), Office.js sandboxed environment provides some protection

## Important Constraints

- **HTTPS required**: Office.js only loads from HTTPS URLs
- **CORS**: Web server must allow Office.js requests
- **Mailbox API version**: Requires Mailbox 1.1+ (manifest.xml line 29)
- **No build process**: Files deployed as-is (no transpilation, bundling, or minification)
- **Browser compatibility**: Uses ES6+ syntax without polyfills

## Documentation Structure

- **QUICKSTART.md** - 5-minute deployment guide for non-technical users
- **README.md** - Comprehensive user and admin guide
- **DEPLOYMENT.md** - Detailed deployment options (Azure, GitHub Pages, custom server, local testing)
- **CUSTOMIZATION-GUIDE.md** - How to customize projects, types, colors, headers
- **PROJECT-OVERVIEW.md** - High-level project structure and features
- **index.html** - Landing page with links to all documentation

## Known Issues

1. Configuration split: config.js not fully integrated with implementation code
2. No version control: Project is not a git repository (should run `git init`)
3. Hardcoded dropdown values instead of dynamic generation
4. Missing features that are configured but not implemented (see config.js)
5. No input validation or sanitization
6. No error recovery for Office.js API failures
