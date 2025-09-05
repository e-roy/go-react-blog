Write-Host "Generating TypeScript types from Go backend..." -ForegroundColor Green
go run tools/generate-types.go

if ($LASTEXITCODE -eq 0) {
    Write-Host "Types generated successfully!" -ForegroundColor Green
    Write-Host "Output: ../frontend/app/types/generated.ts" -ForegroundColor Yellow
} else {
    Write-Host "Failed to generate types!" -ForegroundColor Red
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
