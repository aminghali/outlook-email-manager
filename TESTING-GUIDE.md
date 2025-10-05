# 🧪 Testing Guide - Email Manager Pro

## Quick Start (5 Minutes)

### Prerequisites
- ✅ Node.js installed (you have v22.18.0)
- ✅ npm installed (you have v9.6.4)
- ✅ Dependencies installed (npm install) ✓
- ✅ ngrok installed ✓
- ✅ Microsoft 365 account with Outlook access

---

## 🚀 FASTEST METHOD: Using ngrok (Recommended)

### Step 1: Start Local Server

Open **Command Prompt** or **PowerShell**:

```bash
cd "D:\R1\Outlook Plugin"
npm start
```

You should see:
```
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8000
  http://192.168.x.x:8000
```

✅ **Leave this terminal OPEN** (server must keep running)

---

### Step 2: Start ngrok Tunnel

Open a **SECOND Command Prompt/PowerShell**:

```bash
cd "D:\R1\Outlook Plugin"
ngrok http 8000
```

You'll see output like:
```
Session Status                online
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:8000
```

✅ **Copy the HTTPS URL** (e.g., `https://abc123.ngrok-free.app`)

⚠️ **Important**: Keep this terminal open too! If you close it, the URL stops working.

---

### Step 3: Update manifest.xml

Open a **THIRD Command Prompt/PowerShell**:

```bash
cd "D:\R1\Outlook Plugin"
node update-manifest.js https://YOUR-NGROK-URL.ngrok-free.app
```

Replace `YOUR-NGROK-URL` with the URL from Step 2.

Example:
```bash
node update-manifest.js https://abc123.ngrok-free.app
```

You should see:
```
✅ SUCCESS! manifest.xml has been updated
```

---

### Step 4: Install Add-in in Outlook Web

1. **Open Outlook Web**: Go to https://outlook.office.com

2. **Click Settings** (gear icon in top right)

3. **Click "View all Outlook settings"** (at bottom of settings panel)

4. **Navigate to**: General → Manage add-ins

5. **Click "+ My add-ins"** (bottom left)

6. **Select "Add from file"**

7. **Browse to** `D:\R1\Outlook Plugin\manifest.xml`

8. **Click "Install"**

9. You might see a warning about installing add-ins from this source. Click **"Install"** again to confirm.

10. **Close the settings panel**

---

### Step 5: Test the Add-in

1. **Refresh Outlook** (press F5 or reload the page)

2. **Click "New email"** (top left)

3. **Look for the add-in button**:
   - In the ribbon, you should see "Email Manager Pro" or an icon
   - Click it to open the taskpane on the right

4. **Test the functionality**:
   - Select a project from the dropdown
   - Select an email type
   - Type something in "Custom Subject" (optional)
   - Watch the preview update
   - Click "Apply Template"

5. **Verify the results**:
   - ✅ Subject line should be formatted: `[PROJECT-001] Status Update - Your Text`
   - ✅ Email body should have a professional header

6. **Send a test email to yourself** to see the final result!

---

## 🎨 Customization (Optional)

Before testing, you can customize the projects:

### Quick Customization

Edit `config.js` (line 18-34) with your actual projects:

```javascript
projects: [
    { code: "YOUR-PROJECT", name: "Your Project Name", active: true },
    { code: "ANOTHER-PROJECT", name: "Another Project", active: true },
    // Add your company's projects here
]
```

**Note**: You'll also need to update:
- `taskpane.html` (lines 211-237) - Add dropdown options
- `taskpane.js` (lines 133-146) - Add to project mapping

Or just test with the default projects first!

---

## 🔧 Troubleshooting

### Add-in doesn't appear in Outlook
- Wait 2-3 minutes after installation
- Hard refresh: Press Ctrl + Shift + R
- Clear browser cache
- Make sure both servers (npm start and ngrok) are still running

### "Can't load add-in" error
- Check that ngrok is still running
- Verify the ngrok URL in manifest.xml is correct
- Check the browser console (F12) for errors
- Make sure you're using the HTTPS URL from ngrok, not HTTP

### ngrok URL changed
- ngrok generates a new URL each time you restart it
- You'll need to:
  1. Copy the new URL
  2. Run `node update-manifest.js [NEW-URL]` again
  3. Uninstall the old add-in from Outlook
  4. Reinstall with the updated manifest.xml

**Tip**: Get a free ngrok account at https://ngrok.com to get a permanent URL

### Preview not updating
- Make sure you've selected both a project AND email type
- Check browser console (F12) for JavaScript errors

### Template not applying
- Ensure you're composing a NEW email (not reply/forward)
- Check that both dropdowns have selections
- Look in browser console for errors

---

## 📊 What to Test

### Basic Functionality
- [ ] Add-in button appears in Outlook ribbon
- [ ] Clicking button opens taskpane
- [ ] Project dropdown loads with all options
- [ ] Email type dropdown loads with all options
- [ ] Preview updates when selections change
- [ ] "Apply Template" button becomes enabled after selections
- [ ] Subject line is set correctly
- [ ] Email header is added to body
- [ ] "Clear" button resets the form

### Edge Cases
- [ ] What happens if you apply template twice?
- [ ] Can you edit the subject after applying?
- [ ] Does it work with custom subject text?
- [ ] Does it work without custom subject text?
- [ ] Test with different project combinations

### Different Email Types
- [ ] Status Update
- [ ] Action Request
- [ ] Meeting Invitation
- [ ] Approval Required
- [ ] Urgent Matter
- [ ] FYI

---

## 🎯 Success Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Local server running (`npm start`)
- [ ] ngrok tunnel running (`ngrok http 8000`)
- [ ] manifest.xml updated with ngrok URL
- [ ] Add-in installed in Outlook Web
- [ ] Add-in button visible in Outlook
- [ ] Can open taskpane
- [ ] Can select project and type
- [ ] Preview shows correctly
- [ ] Template applies to email
- [ ] Subject line formatted correctly
- [ ] Email header inserted correctly
- [ ] Sent test email successfully

---

## 🔄 Daily Testing Workflow

Each time you want to test:

1. **Start servers** (2 terminals):
   ```bash
   # Terminal 1
   npm start

   # Terminal 2
   ngrok http 8000
   ```

2. **If ngrok URL changed**:
   ```bash
   # Terminal 3
   node update-manifest.js [NEW-NGROK-URL]
   # Then reinstall in Outlook
   ```

3. **Test in Outlook Web**

4. **When done**, press Ctrl+C in both terminals to stop

---

## 📞 Need Help?

### Common Commands

```bash
# Install dependencies
npm install

# Start local server
npm start

# Start ngrok
ngrok http 8000

# Update manifest
node update-manifest.js https://your-url.ngrok-free.app

# Check if servers are running
# You should have 2 terminals open with these running
```

### Useful Links
- Outlook Web: https://outlook.office.com
- ngrok Dashboard: https://dashboard.ngrok.com
- Office Add-ins Troubleshooting: https://docs.microsoft.com/office/dev/add-ins/testing/troubleshoot-manifest

---

## ⚡ Quick Test Script

We've created a helper script for you:

**Windows**:
```bash
test-locally.bat
```

This will:
1. Start the local server
2. Show you instructions for the next steps

---

## 🎓 Next Steps After Testing

Once testing works:

1. **For production deployment**:
   - Deploy to Azure Static Web Apps (free)
   - Deploy to GitHub Pages (free)
   - Deploy to your company's web server
   - See DEPLOYMENT.md for details

2. **Customize for your company**:
   - Update projects in config.js
   - Update email types
   - Change colors/branding
   - See CUSTOMIZATION-GUIDE.md

3. **Roll out to team**:
   - IT Admin can deploy via Microsoft 365 Admin Center
   - Users can install individually
   - See README.md for deployment options

---

**Happy Testing! 🚀**

If you get stuck, check the browser console (F12) for error messages.
