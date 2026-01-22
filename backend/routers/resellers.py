from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from datetime import datetime, timedelta
import os
import uuid

from database.database import get_db
from database.models import User, Reseller, ResellerProduct, Order, OrderItem, Payout, StorefrontConfig, Product
from database.schemas import (
    ResellerResponse, ResellerUpdate, ResellerBranding, ResellerDomain,
    DashboardStats, RevenueByPeriod, StorefrontConfigUpdate, StorefrontConfigResponse
)
from routers.auth import get_current_active_user, require_reseller

router = APIRouter(prefix="/resellers", tags=["Resellers"])

# ============== HELPER FUNCTIONS ==============

def get_reseller_for_user(user: User, db: Session) -> Reseller:
    """Get reseller profile for current user"""
    reseller = db.query(Reseller).filter(Reseller.user_id == user.id).first()
    if not reseller:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reseller profile not found"
        )
    return reseller

# ============== PROFILE ROUTES ==============

@router.get("/profile", response_model=ResellerResponse)
async def get_profile(
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Get current reseller's profile"""
    return get_reseller_for_user(current_user, db)

@router.put("/profile", response_model=ResellerResponse)
async def update_profile(
    data: ResellerUpdate,
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Update reseller profile"""
    reseller = get_reseller_for_user(current_user, db)
    
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(reseller, field, value)
    
    db.commit()
    db.refresh(reseller)
    return reseller

@router.put("/branding", response_model=ResellerResponse)
async def update_branding(
    data: ResellerBranding,
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Update storefront branding"""
    reseller = get_reseller_for_user(current_user, db)
    
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(reseller, field, value)
    
    db.commit()
    db.refresh(reseller)
    return reseller

@router.post("/logo")
async def upload_logo(
    file: UploadFile = File(...),
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Upload store logo"""
    reseller = get_reseller_for_user(current_user, db)
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Allowed: JPEG, PNG, WebP, SVG"
        )
    
    # Create uploads directory
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    upload_dir = os.path.join(base_dir, "uploads", "logos")
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    ext = file.filename.split(".")[-1] if "." in file.filename else "png"
    filename = f"{reseller.slug}-{uuid.uuid4().hex[:8]}.{ext}"
    filepath = os.path.join(upload_dir, filename)
    
    # Save file
    try:
        with open(filepath, "wb") as f:
            content = await file.read()
            f.write(content)
        print(f"[DEBUG] Logo saved to: {filepath}")
    except Exception as e:
        print(f"[ERROR] Failed to save logo: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save logo file: {str(e)}"
        )
    
    # Update reseller
    reseller.logo_url = f"/uploads/logos/{filename}"
    db.commit()
    
    return {"logo_url": reseller.logo_url}

@router.post("/banner")
async def upload_banner(
    file: UploadFile = File(...),
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Upload store banner"""
    reseller = get_reseller_for_user(current_user, db)
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Allowed: JPEG, PNG, WebP"
        )
    
    # Create uploads directory
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    upload_dir = os.path.join(base_dir, "uploads", "banners")
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{reseller.slug}-banner-{uuid.uuid4().hex[:8]}.{ext}"
    filepath = os.path.join(upload_dir, filename)
    
    # Save file
    try:
        with open(filepath, "wb") as f:
            content = await file.read()
            f.write(content)
        print(f"[DEBUG] Banner saved to: {filepath}")
    except Exception as e:
        print(f"[ERROR] Failed to save banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save banner file: {str(e)}"
        )
    
    # Update storefront config
    config = db.query(StorefrontConfig).filter(StorefrontConfig.reseller_id == reseller.id).first()
    if not config:
        config = StorefrontConfig(reseller_id=reseller.id)
        db.add(config)
    
    config.hero_image = f"/uploads/banners/{filename}"
    db.commit()
    
    return {"banner_url": config.hero_image}

@router.put("/domain", response_model=ResellerResponse)
async def update_domain(
    data: ResellerDomain,
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Update domain settings"""
    reseller = get_reseller_for_user(current_user, db)
    
    # Check subdomain availability
    if data.subdomain and data.subdomain != reseller.subdomain:
        existing = db.query(Reseller).filter(
            Reseller.subdomain == data.subdomain,
            Reseller.id != reseller.id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Subdomain already taken"
            )
        reseller.subdomain = data.subdomain
    
    # Update custom domain
    if data.custom_domain is not None:
        reseller.custom_domain = data.custom_domain or None
        reseller.domain_verified = False  # Needs re-verification
    
    db.commit()
    db.refresh(reseller)
    return reseller

@router.post("/publish", response_model=ResellerResponse)
async def publish_store(
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Publish the storefront"""
    reseller = get_reseller_for_user(current_user, db)
    
    # Check requirements
    if not reseller.business_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Business name is required"
        )
    
    # Check if has products
    product_count = db.query(ResellerProduct).filter(
        ResellerProduct.reseller_id == reseller.id,
        ResellerProduct.is_active == True
    ).count()
    
    if product_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Add at least one product before publishing"
        )
    
    reseller.is_published = True
    reseller.is_onboarded = True
    db.commit()
    db.refresh(reseller)
    
    return reseller

@router.post("/unpublish", response_model=ResellerResponse)
async def unpublish_store(
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Unpublish the storefront"""
    reseller = get_reseller_for_user(current_user, db)
    reseller.is_published = False
    db.commit()
    db.refresh(reseller)
    return reseller

# ============== DASHBOARD ROUTES ==============

@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics"""
    reseller = get_reseller_for_user(current_user, db)
    
    # Get counts
    total_products = db.query(ResellerProduct).filter(
        ResellerProduct.reseller_id == reseller.id,
        ResellerProduct.is_active == True
    ).count()
    
    total_orders = db.query(Order).filter(Order.reseller_id == reseller.id).count()
    
    # Get totals
    revenue_result = db.query(
        func.sum(Order.total_amount),
        func.sum(Order.reseller_commission)
    ).filter(Order.reseller_id == reseller.id).first()
    
    total_revenue = revenue_result[0] or 0
    total_commission = revenue_result[1] or 0
    
    # Get pending payout
    pending_payout = db.query(
        func.sum(Order.reseller_commission)
    ).filter(
        Order.reseller_id == reseller.id,
        Order.status.in_(["delivered"])
    ).scalar() or 0
    
    # Subtract already paid out
    paid_out = db.query(
        func.sum(Payout.amount)
    ).filter(
        Payout.reseller_id == reseller.id,
        Payout.status == "completed"
    ).scalar() or 0
    
    pending_payout = max(0, pending_payout - paid_out)
    
    # This month stats
    first_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    month_result = db.query(
        func.count(Order.id),
        func.sum(Order.total_amount),
        func.sum(Order.reseller_commission)
    ).filter(
        Order.reseller_id == reseller.id,
        Order.created_at >= first_of_month
    ).first()
    
    return DashboardStats(
        total_products=total_products,
        total_orders=total_orders,
        total_revenue=float(total_revenue),
        total_commission=float(total_commission),
        pending_payout=float(pending_payout),
        orders_this_month=month_result[0] or 0,
        revenue_this_month=float(month_result[1] or 0),
        commission_this_month=float(month_result[2] or 0)
    )

@router.get("/dashboard/revenue", response_model=List[RevenueByPeriod])
async def get_revenue_by_period(
    days: int = 30,
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Get revenue breakdown by day"""
    reseller = get_reseller_for_user(current_user, db)
    
    start_date = datetime.now() - timedelta(days=days)
    
    # Query orders grouped by date
    results = db.query(
        func.date(Order.created_at).label('date'),
        func.sum(Order.total_amount).label('revenue'),
        func.count(Order.id).label('orders'),
        func.sum(Order.reseller_commission).label('commission')
    ).filter(
        Order.reseller_id == reseller.id,
        Order.created_at >= start_date
    ).group_by(
        func.date(Order.created_at)
    ).order_by(
        func.date(Order.created_at)
    ).all()
    
    return [
        RevenueByPeriod(
            period=str(r.date),
            revenue=float(r.revenue or 0),
            orders=r.orders,
            commission=float(r.commission or 0)
        )
        for r in results
    ]

# ============== STOREFRONT CONFIG ==============

@router.get("/storefront-config", response_model=StorefrontConfigResponse)
async def get_storefront_config(
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Get storefront configuration"""
    reseller = get_reseller_for_user(current_user, db)
    
    config = db.query(StorefrontConfig).filter(
        StorefrontConfig.reseller_id == reseller.id
    ).first()
    
    if not config:
        # Create default config
        config = StorefrontConfig(reseller_id=reseller.id)
        db.add(config)
        db.commit()
        db.refresh(config)
    
    return config

@router.put("/storefront-config", response_model=StorefrontConfigResponse)
async def update_storefront_config(
    data: StorefrontConfigUpdate,
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Update storefront configuration"""
    reseller = get_reseller_for_user(current_user, db)
    
    config = db.query(StorefrontConfig).filter(
        StorefrontConfig.reseller_id == reseller.id
    ).first()
    
    if not config:
        config = StorefrontConfig(reseller_id=reseller.id)
        db.add(config)
    
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(config, field, value)
    
    db.commit()
    db.refresh(config)
    return config

# ============== ONBOARDING ==============

@router.get("/onboarding-status")
async def get_onboarding_status(
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Get onboarding progress"""
    reseller = get_reseller_for_user(current_user, db)
    
    steps = {
        "profile_complete": bool(reseller.business_name and reseller.description),
        "branding_complete": bool(reseller.logo_url or reseller.primary_color != "#8B5CF6"),
        "domain_setup": bool(reseller.subdomain),
        "products_added": db.query(ResellerProduct).filter(
            ResellerProduct.reseller_id == reseller.id
        ).count() > 0,
        "store_published": reseller.is_published
    }
    
    completed = sum(1 for v in steps.values() if v)
    total = len(steps)
    
    return {
        "steps": steps,
        "completed": completed,
        "total": total,
        "percent": int((completed / total) * 100),
        "is_complete": completed == total
    }

@router.post("/complete-onboarding", response_model=ResellerResponse)
async def complete_onboarding(
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Mark onboarding as complete"""
    reseller = get_reseller_for_user(current_user, db)
    reseller.is_onboarded = True
    db.commit()
    db.refresh(reseller)
    return reseller
