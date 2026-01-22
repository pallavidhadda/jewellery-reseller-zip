from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from datetime import datetime

from database.database import get_db
from database.models import User, Reseller, Order, Payout
from database.schemas import PayoutRequest, PayoutResponse
from routers.auth import get_current_active_user, require_reseller

router = APIRouter(prefix="/payouts", tags=["Payouts"])

# ============== HELPER FUNCTIONS ==============

def get_reseller_for_user(user: User, db: Session) -> Reseller:
    reseller = db.query(Reseller).filter(Reseller.user_id == user.id).first()
    if not reseller:
        raise HTTPException(status_code=404, detail="Reseller profile not found")
    return reseller

def calculate_available_payout(reseller_id: int, db: Session) -> float:
    """Calculate available payout amount"""
    # Sum of commissions from delivered orders
    total_commission = db.query(
        func.sum(Order.reseller_commission)
    ).filter(
        Order.reseller_id == reseller_id,
        Order.status == "delivered"
    ).scalar() or 0
    
    # Subtract already paid out or pending payouts
    paid_out = db.query(
        func.sum(Payout.amount)
    ).filter(
        Payout.reseller_id == reseller_id,
        Payout.status.in_(["pending", "processing", "completed"])
    ).scalar() or 0
    
    return max(0, float(total_commission - paid_out))

# ============== PAYOUT ROUTES ==============

@router.get("/balance")
async def get_payout_balance(
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Get current payout balance"""
    reseller = get_reseller_for_user(current_user, db)
    
    available = calculate_available_payout(reseller.id, db)
    
    # Get pending payouts
    pending = db.query(
        func.sum(Payout.amount)
    ).filter(
        Payout.reseller_id == reseller.id,
        Payout.status.in_(["pending", "processing"])
    ).scalar() or 0
    
    # Get total paid out
    total_paid = db.query(
        func.sum(Payout.amount)
    ).filter(
        Payout.reseller_id == reseller.id,
        Payout.status == "completed"
    ).scalar() or 0
    
    # Get total earned (all commissions)
    total_earned = db.query(
        func.sum(Order.reseller_commission)
    ).filter(
        Order.reseller_id == reseller.id,
        Order.status == "delivered"
    ).scalar() or 0
    
    return {
        "available": float(available),
        "pending": float(pending),
        "total_paid": float(total_paid),
        "total_earned": float(total_earned)
    }

@router.get("", response_model=List[PayoutResponse])
async def get_payouts(
    status_filter: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Get payout history"""
    reseller = get_reseller_for_user(current_user, db)
    
    query = db.query(Payout).filter(Payout.reseller_id == reseller.id)
    
    if status_filter:
        query = query.filter(Payout.status == status_filter)
    
    offset = (page - 1) * per_page
    payouts = query.order_by(Payout.requested_at.desc()).offset(offset).limit(per_page).all()
    
    return payouts

@router.post("/request", response_model=PayoutResponse)
async def request_payout(
    data: PayoutRequest,
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Request a payout"""
    reseller = get_reseller_for_user(current_user, db)
    
    available = calculate_available_payout(reseller.id, db)
    
    if available <= 0:
        raise HTTPException(
            status_code=400,
            detail="No available balance for payout"
        )
    
    # Determine amount
    amount = data.amount if data.amount and data.amount <= available else available
    
    if amount < 100:  # Minimum payout
        raise HTTPException(
            status_code=400,
            detail="Minimum payout amount is Rs.100"
        )
    
    # Create payout request
    payout = Payout(
        reseller_id=reseller.id,
        amount=amount,
        payment_method=data.payment_method,
        status="pending"
    )
    db.add(payout)
    db.commit()
    db.refresh(payout)
    
    # TODO: Notify admin about payout request
    
    return payout

@router.get("/{payout_id}", response_model=PayoutResponse)
async def get_payout(
    payout_id: int,
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Get payout details"""
    reseller = get_reseller_for_user(current_user, db)
    
    payout = db.query(Payout).filter(
        Payout.id == payout_id,
        Payout.reseller_id == reseller.id
    ).first()
    
    if not payout:
        raise HTTPException(status_code=404, detail="Payout not found")
    
    return payout
