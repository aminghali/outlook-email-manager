@echo off
echo ================================================
echo   STARTING NGROK TUNNEL
echo ================================================
echo.
echo Starting ngrok on port 8000...
echo.
echo IMPORTANT: Keep this window OPEN!
echo The ngrok URL will appear below.
echo.
echo ================================================
echo.

ngrok http 8000

pause
