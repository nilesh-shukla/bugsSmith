# dev-db.ps1 - start docker-compose on Windows PowerShell and run migrations
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root\..\
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Error 'docker not found; please install Docker Desktop or Docker CLI'
  exit 1
}

docker compose up -d db
Write-Output 'Waiting for Postgres...'
for ($i=0; $i -lt 60; $i++) {
  $container = docker ps -qf "name=bugssmith-db"
  if ($container) {
    $res = docker exec $container pg_isready -U postgres 2>$null
    if ($LASTEXITCODE -eq 0) { Write-Output 'Postgres is ready'; break }
  }
  Start-Sleep -Seconds 1
}

npx prisma migrate deploy
Write-Output 'DB ready and migrations applied.'
