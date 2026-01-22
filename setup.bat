@echo off
echo ========================================
echo  Jewelry Reseller Platform - Setup
echo ========================================
echo.

echo [1/4] Installing backend dependencies...
cd backend
python -m pip install -r requirements.txt
echo.

echo [2/4] Seeding database with sample data...
python seed_data.py
echo.

echo [3/4] Installing frontend dependencies...
cd ..\frontend
call npm install
echo.

echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo To start the application:
echo   1. Run: start_backend.bat
echo   2. Run: start_frontend.bat (in new terminal)
echo.
echo Demo Credentials:
echo   Admin: admin@jewelryplatform.com / admin123
echo   Manufacturer: manufacturer@jewelrycrafts.com / mfr123
echo   Reseller: demo@mystore.com / demo123
echo.
pause
