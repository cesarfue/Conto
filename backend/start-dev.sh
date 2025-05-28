#!/usr/bin/env bash

set -e

echo "Starting backend development environment..."

# Start continuous compilation in background
echo "Starting continuous compilation..."
./gradlew compileJava --continuous &
COMPILE_PID=$!

# Wait for initial compilation
echo "Waiting for initial compilation..."
sleep 8

# Start Spring Boot with DevTools
echo "Starting Spring Boot..."
./gradlew bootRun &
BOOT_PID=$!

# Function to cleanup processes
cleanup() {
    echo "Shutting down processes..."
    kill $COMPILE_PID 2>/dev/null || true
    kill $BOOT_PID 2>/dev/null || true
    exit 0
}

# Handle shutdown signals
trap cleanup SIGTERM SIGINT

# Wait for processes
wait
