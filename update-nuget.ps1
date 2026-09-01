Push-Location $PSScriptRoot
Push-Location .\Backend

$output = dotnet list package --outdated --format json | ConvertFrom-Json

foreach($project in $output.projects) {
    Write-Host "Updating " -NoNewline
    Write-Host "$(Split-Path $project.path -Leaf)..." -ForegroundColor Green

    foreach($framework in $project.frameworks) {
        Write-Host "  $($framework.framework)..." -NoNewline
        Write-Host " ($($framework.topLevelPackages.Count) dependencies)" -ForegroundColor Green

        foreach($package in $framework.topLevelPackages) {
            Write-Host "    $($package.id)..." -NoNewline
            Write-Host " ($($package.resolvedVersion) -> $($package.latestVersion))" -ForegroundColor Green

            dotnet add "$($project.path)" package "$($package.id)" --version "$($package.latestVersion)" | Out-Null
        }
    }
}

Pop-Location
Pop-Location