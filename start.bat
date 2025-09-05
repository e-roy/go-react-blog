@echo off
echo 🚀 Starting Go + React Full-Stack Application...
echo.

echo 📡 Starting Go Backend...
start "Go Backend" cmd /k "cd backend && go mod tidy && go run main.go"

echo ⏳ Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo 🌐 Starting React Frontend...
start "React Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ✅ Both servers are starting up!
echo.
echo 📍 Backend: http://localhost:8080
echo 🌍 Frontend: http://localhost:5173
echo.
echo Press any key to open the frontend in your browser...
pause >nul

start http://localhost:5173

echo 🎉 Application is ready! Check both terminal windows for server status.
pause
