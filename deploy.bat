@echo off
echo ==============================================
echo Converting Excel to Web Data
echo ==============================================
node convert.js

echo.
echo ==============================================
echo Pushing Updates to Private GitHub Repository
echo ==============================================
echo.

:: Add all new files and changes
git add .

:: Commit with dynamic timestamp
git commit -m "Dashboard update %date% %time%"

:: Push to main branch
git push origin main

echo.
echo ==============================================
echo Done! Your private repository is updated.
echo ==============================================
pause

echo.
echo ==============================================
echo Done! Your private repository is updated.
echo ==============================================
pause
