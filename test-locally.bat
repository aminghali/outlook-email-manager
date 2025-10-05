@echo off
echo ================================================
echo   OUTLOOK PLUGIN - LOCAL TESTING SETUP
echo ================================================
echo.
echo This will:
echo 1. Start a local web server on port 8000
echo 2. Instructions for ngrok setup
echo.
echo Press CTRL+C to stop the server when done testing
echo.
echo ================================================
echo.

echo Starting local server...
echo Server will be available at: http://localhost:8000
echo.
echo NEXT STEPS (do these in a NEW terminal):
echo.
echo 1. Open a NEW command prompt/terminal
echo 2. Run: ngrok http 8000
echo 3. Copy the HTTPS URL from ngrok (looks like: https://abc123.ngrok-free.app)
echo 4. Run: node update-manifest.js [YOUR-NGROK-URL]
echo 5. Follow the instructions to install in Outlook
echo.
echo ================================================
echo.

npm start
