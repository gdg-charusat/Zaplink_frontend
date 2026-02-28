#!/bin/bash

# Zaplink Frontend Development Setup Script
# This script helps you set up the Zaplink frontend with its backend server

echo "======================================"
echo "🚀 Zaplink Frontend Setup Script"
echo "======================================"
echo ""

# Check if backend repository exists
if [ ! -d "../Zaplink_backend" ]; then
    echo "⚠️  Backend repository not found at ../Zaplink_backend"
    echo ""
    echo "To set up the backend, Please run:"
    echo "  cd .."
    echo "  git clone https://github.com/gdg-charusat/Zaplink_backend.git"
    echo "  cd Zaplink_backend"
    echo "  npm install"
    echo "  npm start"
    echo ""
    echo "Then in another terminal, return to this directory and run:"
    echo "  npm run dev"
    echo ""
    exit 1
fi

echo "✅ Backend repository found!"
echo ""
echo "To start the development environment:"
echo ""
echo "1️⃣  Terminal 1 - Start the Backend:"
echo "   cd ../Zaplink_backend"
echo "   npm start"
echo ""
echo "2️⃣  Terminal 2 - Start the Frontend:"
echo "   npm run dev"
echo ""
echo "The frontend will automatically proxy /api/* requests to the backend!"
echo ""
