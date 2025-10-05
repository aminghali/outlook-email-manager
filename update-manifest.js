// Update manifest.xml with ngrok URL
// Usage: node update-manifest.js https://your-ngrok-url.ngrok-free.app

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log('\n❌ ERROR: Please provide your ngrok URL\n');
    console.log('Usage: node update-manifest.js https://your-ngrok-url.ngrok-free.app\n');
    process.exit(1);
}

const ngrokUrl = args[0].replace(/\/$/, ''); // Remove trailing slash

const manifestPath = path.join(__dirname, 'manifest.xml');
let manifest = fs.readFileSync(manifestPath, 'utf8');

// Replace all instances of https://yourdomain.com with ngrok URL
manifest = manifest.replace(/https:\/\/yourdomain\.com/g, ngrokUrl);

fs.writeFileSync(manifestPath, manifest);

console.log('\n✅ SUCCESS! manifest.xml has been updated\n');
console.log('Old URL: https://yourdomain.com');
console.log('New URL:', ngrokUrl);
console.log('\nNext steps:');
console.log('1. Open Outlook Web (https://outlook.office.com)');
console.log('2. Settings (gear icon) → View all Outlook settings');
console.log('3. General → Manage add-ins');
console.log('4. "+ My add-ins" → "Add from file"');
console.log('5. Upload manifest.xml from this folder');
console.log('6. Refresh Outlook and compose a new email\n');
