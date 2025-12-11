#!/bin/sh
set -e

echo "Waiting for database to be ready..."
sleep 5

echo "Running migrations..."
npm run migration:run:prod

echo "Running seeds..."
node dist/seeds/seed.js

echo "Starting application..."
exec node dist/main

