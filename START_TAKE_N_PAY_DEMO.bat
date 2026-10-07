@echo off
title Take N Pay - Laptop Demo
cd /d "%~dp0"

start "Take N Pay Demo Server" cmd /k "npm.cmd run dev"

timeout /t 5 /nobreak >nul

start "" "http://localhost:3000/"

echo.
echo ==========================================
echo   TAKE N PAY LAPTOP DEMO
echo ==========================================
echo   Server started locally.
echo   Browser: http://localhost:3000/
echo ==========================================
