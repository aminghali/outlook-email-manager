@echo off
echo ================================================
echo   STARTING HTTPS TUNNEL (No signup required!)
echo ================================================
echo.
echo Starting SSH tunnel to localhost.run...
echo.
echo IMPORTANT:
echo 1. You'll see an HTTPS URL - COPY IT!
echo 2. Keep this window OPEN while testing
echo.
echo ================================================
echo.

ssh -R 80:localhost:8000 nokey@localhost.run

pause
