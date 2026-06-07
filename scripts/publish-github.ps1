param(
  [string]$RepoName = "TunnelRiskStudio",
  [string]$Visibility = "public"
)

$ErrorActionPreference = "Stop"

function Assert-Command {
  param([string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Missing command: $Name. Please install it and rerun this script."
  }
}

Assert-Command git
Assert-Command gh

gh auth status | Out-Null

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

if (-not (Test-Path ".git")) {
  git init
}

git branch -M main
git add .

$hasChanges = git status --porcelain
if ($hasChanges) {
  git commit -m "Initial release of TunnelRiskStudio"
} else {
  Write-Host "No local changes to commit."
}

$repoExists = $false
try {
  gh repo view $RepoName | Out-Null
  $repoExists = $true
} catch {
  $repoExists = $false
}

if (-not $repoExists) {
  gh repo create $RepoName "--$Visibility" --source . --remote origin --push
} else {
  if (-not (git remote get-url origin 2>$null)) {
    $owner = gh api user --jq ".login"
    git remote add origin "https://github.com/$owner/$RepoName.git"
  }
  git push -u origin main
}

$ownerName = gh api user --jq ".login"
try {
  gh api -X POST "repos/$ownerName/$RepoName/pages" -f source.branch=main -f source.path="/" | Out-Null
  Write-Host "GitHub Pages enabled."
} catch {
  Write-Host "GitHub Pages may already be enabled, or you can enable it manually in Settings > Pages."
}

Write-Host ""
Write-Host "Published repository:"
Write-Host "https://github.com/$ownerName/$RepoName"
Write-Host ""
Write-Host "GitHub Pages URL, after deployment finishes:"
Write-Host "https://$ownerName.github.io/$RepoName/"
