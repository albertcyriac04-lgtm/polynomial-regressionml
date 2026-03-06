#!/bin/bash
# =============================================
# deploy.sh — EC2 Ubuntu Deployment Script
# Polynomial Regression ML Application
# =============================================
set -e

APP_DIR="/home/ubuntu/polynomial-regressionml"
REPO_URL="https://github.com/albertcyriac04-lgtm/polynomial-regressionml.git"

echo "============================================="
echo " PolyPredict — Deployment Script"
echo "============================================="

# 1. System Update
echo "[1/7] Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# 2. Install Python & Dependencies
echo "[2/7] Installing Python 3 and pip..."
sudo apt-get install -y python3 python3-pip python3-venv git

# 3. Clone or pull the repository
echo "[3/7] Setting up application code..."
if [ -d "$APP_DIR" ]; then
    echo "  → Repository exists, pulling latest changes..."
    cd "$APP_DIR"
    git pull origin main
else
    echo "  → Cloning repository..."
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

# 4. Create virtual environment
echo "[4/7] Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# 5. Install Python dependencies
echo "[5/7] Installing Python packages..."
pip install --upgrade pip
pip install -r requirements.txt

# 6. Train the model
echo "[6/7] Training the ML model..."
python train.py

# 7. Start the application with Gunicorn
echo "[7/7] Starting Gunicorn server..."
echo ""
echo "============================================="
echo " Application is starting on port 5000"
echo " Access: http://44.210.100.50:5000"
echo "============================================="

# Kill any existing gunicorn processes
pkill gunicorn || true

# Run with gunicorn (4 workers, bind to all interfaces on port 5000)
gunicorn --workers 4 --bind 0.0.0.0:5000 app:app --daemon

echo ""
echo "✅ Deployment complete! Gunicorn is running in the background."
echo "   To check logs: journalctl -u gunicorn"
echo "   To stop: pkill gunicorn"
