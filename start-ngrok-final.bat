@echo off
echo ================================================
echo   NGROK TUNNEL - Starting on port 8000
echo ================================================
echo.
echo Configuring ngrok...
ngrok config add-authtoken 2z5fRMNUfyyjaf225iq4ubx2Ryv_77FW8ufVaPZtNwci62Dn9
echo.
echo Starting tunnel...
echo COPY THE HTTPS URL BELOW!
echo.
ngrok http 8000
pause
