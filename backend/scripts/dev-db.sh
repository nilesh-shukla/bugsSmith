#!/usr/bin/env bash
# dev-db.sh - start postgresql via docker-compose and run migrations
set -e
ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT_DIR"
if ! command -v docker >/dev/null 2>&1; then
  echo "docker not found; please install Docker or run docker-compose manually"
  exit 1
fi

docker compose up -d db

# wait for postgres to accept connections
echo "Waiting for Postgres..."
for i in {1..30}; do
  if docker exec $(docker ps -qf "name=bugssmith-db") pg_isready -U postgres >/dev/null 2>&1; then
    echo "Postgres is ready"
    break
  fi
  sleep 1
done

# run migrations
npx prisma migrate deploy

echo "DB ready and migrations applied."
