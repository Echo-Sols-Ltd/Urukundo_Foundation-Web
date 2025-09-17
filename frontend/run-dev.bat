@echo off

REM Urukundo Foundation - Development Server
REM This script runs the Next.js development server on port 3000

echo 🚀 Starting Urukundo Foundation Development Server...
echo 📍 Server will run on: http://localhost:3000
echo.

REM Set port environment variable
set PORT=3000

REM Run the development server
npm run dev
