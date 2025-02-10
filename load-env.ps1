# Read .env.local file and set environment variables
$envFilePath = ".\.env.local"
if (Test-Path $envFilePath) {
    $envFileContent = Get-Content $envFilePath | ForEach-Object {
        if ($_ -match "^\s*#") {
            # Skip comments
            return
        }
        if ($_ -match "^\s*(.*?)\s*=\s*""?(.*?)""?\s*$") {
            $envName = $matches[1]
            $envValue = $matches[2]
            [System.Environment]::SetEnvironmentVariable($envName, $envValue, "Process")
        }
    }
    Write-Host "Environment variables loaded from .env.local"
} else {
    Write-Host ".env.local file not found"
}