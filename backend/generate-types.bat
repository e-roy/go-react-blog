@echo off
echo Generating TypeScript types from Go backend...
go run tools/generate-types.go
echo.
echo Types generated successfully!
pause
