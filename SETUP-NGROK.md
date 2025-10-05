# Quick ngrok Setup (2 minutes)

## Step 1: Sign up (FREE)
1. Go to: https://dashboard.ngrok.com/signup
2. Sign up with Google/GitHub or email (it's free!)

## Step 2: Get your token
1. After signing up, you'll see your authtoken
2. Or go to: https://dashboard.ngrok.com/get-started/your-authtoken
3. Copy the token (looks like: 2abc123def456...)

## Step 3: Configure ngrok
Run this command (replace with YOUR token):
```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

## Step 4: Start ngrok
```bash
ngrok http 8000
```

You'll get a stable HTTPS URL like: https://abc123.ngrok-free.app

This URL will stay active as long as ngrok is running!
