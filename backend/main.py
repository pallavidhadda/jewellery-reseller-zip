from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os

from database.database import init_db

# Import routers
from routers import auth, resellers, products, orders, payouts, storefronts, manufacturers, admin

# Create FastAPI app
app = FastAPI(
    title="Jewelry Reseller Platform",
    description="White-label eCommerce platform for jewelry resellers",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "*"  # For development - restrict in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directories
os.makedirs("uploads/logos", exist_ok=True)
os.makedirs("uploads/banners", exist_ok=True)
os.makedirs("uploads/products", exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(resellers.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(payouts.router, prefix="/api")
app.include_router(storefronts.router, prefix="/api")
app.include_router(manufacturers.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

# Error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )

# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

# Root endpoint
@app.get("/")
async def root():
    return {
        "name": "Jewelry Reseller Platform API",
        "version": "1.0.0",
        "docs": "/api/docs"
    }

# Startup event
@app.on_event("startup")
async def startup():
    # Initialize database
    init_db()
    print("[OK] Database initialized")
    print("Jewelry Reseller Platform API is running!")

# Shutdown event
@app.on_event("shutdown")
async def shutdown():
    print("Shutting down...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
