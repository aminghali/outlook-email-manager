@echo off
echo ================================================
echo   NGROK SETUP AND START
echo ================================================
echo.

echo Step 1: Configuring ngrok with your authtoken...
ngrok config add-authtoken 2z5fRMNUfyyjaf225iq4ubx2Ryv_77FW8ufVaPZtNwci62Dn9

echo.
echo ✅ ngrok configured!
echo.
echo ================================================
echo Step 2: Starting ngrok tunnel on port 8000...
echo.
echo COPY THE HTTPS URL THAT APPEARS BELOW!
echo Keep this window OPEN while testing.
echo.
echo ================================================
echo.

ngrok http 8000

pause
