#!/bin/sh
# wait-for-postgres.sh
# Attend que PostgreSQL soit prêt avant de lancer la commande

set -e

host="$1"
port="${2:-5432}"
shift 2
cmd="$@"

echo "Waiting for PostgreSQL at $host:$port..."

until nc -z "$host" "$port"; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is up - executing command"
exec $cmd
