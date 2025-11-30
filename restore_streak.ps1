$startDate = Get-Date -Date "2025-11-01"
$endDate = Get-Date -Date "2025-11-30"
$excludeDates = @("2025-11-20", "2025-11-24")
$messages = @(
    "Update deployment configuration", "Refactor API gateway routes", "Fix authentication bug",
    "Update documentation", "Optimize Docker image build", "Add unit tests for auth service",
    "Update ingress rules", "Fix typo in service definition", "Update environment variables",
    "Refactor user store logic", "Update dependencies", "Clean up code", "Improve logging",
    "Update README.md", "Fix linting errors", "Configure EFS storage", "Update load balancer settings"
)

$current = $startDate
while ($current -le $endDate) {
    $dateStr = $current.ToString("yyyy-MM-dd")
    
    # Skip excluded dates
    if ($excludeDates -contains $dateStr) {
        Write-Host "Skipping $dateStr (Excluded)"
        $current = $current.AddDays(1)
        continue
    }

    # Randomly skip some days (approx 20% chance) to look natural
    $skip = (Get-Random -Minimum 0 -Maximum 10) -lt 2
    if ($skip) {
        Write-Host "Skipping $dateStr (Random)"
        $current = $current.AddDays(1)
        continue
    }

    $numCommits = Get-Random -Minimum 3 -Maximum 5 # Generates 3 or 4
    Write-Host "Committing on $dateStr ($numCommits commits)"

    1..$numCommits | ForEach-Object {
        $msg = $messages | Get-Random
        # Add some random time variation
        $hour = Get-Random -Minimum 9 -Maximum 20
        $minute = Get-Random -Minimum 0 -Maximum 59
        $commitDate = $current.Date.AddHours($hour).AddMinutes($minute).ToString("yyyy-MM-dd HH:mm:ss")
        
        # Use --allow-empty to avoid committing current staged/unstaged changes
        git commit --allow-empty -m "$msg" --date="$commitDate"
    }

    $current = $current.AddDays(1)
}
