#!/bin/bash

# AAA Stentgraft Sizing App - Start Script

echo "=== AAA Stentgraft Sizing Application ==="
echo ""

# Check for ANTHROPIC_API_KEY
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "UWAGA: Zmienna ANTHROPIC_API_KEY nie jest ustawiona!"
    echo "Ustaw ją przed uruchomieniem:"
    echo "  export ANTHROPIC_API_KEY='your-api-key'"
    echo ""
fi

# Navigate to project directory
cd "$(dirname "$0")"

# Install backend dependencies
echo "[1/4] Instalacja zależności backend..."
cd backend
npm install 2>/dev/null || echo "npm install failed for backend"

# Start backend in background
echo "[2/4] Uruchamianie backend..."
npm start &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Install frontend dependencies
echo "[3/4] Instalacja zależności frontend..."
cd ../frontend
npm install 2>/dev/null || echo "npm install failed for frontend"

# Start frontend
echo "[4/4] Uruchamianie frontend..."
echo ""
echo "==================================="
echo "Backend:  http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo "==================================="
echo ""
echo "Naciśnij Ctrl+C aby zatrzymać"
echo ""

npm run dev

# Cleanup
kill $BACKEND_PID 2>/dev/null
