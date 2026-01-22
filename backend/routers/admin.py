from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from datetime import datetime, timedelta

from database.database import get_db
from database.models import (
    User, Reseller, Manufacturer, Product, Order, Payout, SupportTicket
)
from database.schemas import SupportTicketCreate, SupportTicketResponse
from routers.auth import get_current_active_user, require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

# ============== DASHBOARD ==============

@router.get("/dashboard")
async def get_admin_dashboard(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get admin dashboard statistics"""
    
    # Users
    total_resellers = db.query(Reseller).count()
    active_resellers = db.query(Reseller).filter(Reseller.is_published == True).count()
    
    total_manufacturers = db.query(Manufacturer).count()
    
    # Products
    total_products = db.query(Product).filter(Product.is_active == True).count()
    
    # Orders
    total_orders = db.query(Order).count()
    pending_orders = db.query(Order).filter(Order.status == "pending").count()
    
    # Revenue
    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0
    total_commission = db.query(func.sum(Order.reseller_commission)).scalar() or 0
    
    # Payouts
    pending_payouts = db.query(func.sum(Payout.amount)).filter(
        Payout.status == "pending"
    ).scalar() or 0
    
    # This month
    first_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    orders_this_month = db.query(Order).filter(
        Order.created_at >= first_of_month
    ).count()
    
    revenue_this_month = db.query(func.sum(Order.total_amount)).filter(
        Order.created_at >= first_of_month
    ).scalar() or 0
    
    new_resellers_this_month = db.query(Reseller).filter(
        Reseller.created_at >= first_of_month
    ).count()
    
    return {
        "resellers": {
            "total": total_resellers,
            "active": active_resellers,
            "new_this_month": new_resellers_this_month
        },
        "manufacturers": {
            "total": total_manufacturers
        },
        "products": {
            "total": total_products
        },
        "orders": {
            "total": total_orders,
            "pending": pending_orders,
            "this_month": orders_this_month
        },
        "revenue": {
            "total": float(total_revenue),
            "this_month": float(revenue_this_month),
            "total_commission": float(total_commission)
        },
        "payouts": {
            "pending": float(pending_payouts)
        }
    }

# ============== RESELLER MANAGEMENT ==============

@router.get("/resellers")
async def get_all_resellers(
    is_published: Optional[bool] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get all resellers"""
    query = db.query(Reseller)
    
    if is_published is not None:
        query = query.filter(Reseller.is_published == is_published)
    if search:
        query = query.filter(Reseller.business_name.ilike(f"%{search}%"))
    
    total = query.count()
    offset = (page - 1) * per_page
    resellers = query.offset(offset).limit(per_page).all()
    
    return {
        "items": resellers,
        "total": total,
        "page": page,
        "pages": (total + per_page - 1) // per_page,
        "per_page": per_page
    }

@router.get("/resellers/{reseller_id}")
async def get_reseller(
    reseller_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get reseller details"""
    reseller = db.query(Reseller).filter(Reseller.id == reseller_id).first()
    if not reseller:
        raise HTTPException(status_code=404, detail="Reseller not found")
    
    # Get stats
    from database.models import ResellerProduct
    product_count = db.query(ResellerProduct).filter(
        ResellerProduct.reseller_id == reseller_id
    ).count()
    
    order_count = db.query(Order).filter(
        Order.reseller_id == reseller_id
    ).count()
    
    total_revenue = db.query(func.sum(Order.total_amount)).filter(
        Order.reseller_id == reseller_id
    ).scalar() or 0
    
    return {
        "reseller": reseller,
        "stats": {
            "products": product_count,
            "orders": order_count,
            "revenue": float(total_revenue)
        }
    }

@router.patch("/resellers/{reseller_id}/status")
async def update_reseller_status(
    reseller_id: int,
    is_active: bool,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Enable/disable reseller"""
    reseller = db.query(Reseller).filter(Reseller.id == reseller_id).first()
    if not reseller:
        raise HTTPException(status_code=404, detail="Reseller not found")
    
    user = db.query(User).filter(User.id == reseller.user_id).first()
    if user:
        user.is_active = is_active
    
    if not is_active:
        reseller.is_published = False
    
    db.commit()
    
    return {"message": f"Reseller {'enabled' if is_active else 'disabled'}"}

# ============== ORDER MANAGEMENT ==============

@router.get("/orders")
async def get_all_orders(
    status_filter: Optional[str] = None,
    reseller_id: Optional[int] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get all orders"""
    query = db.query(Order)
    
    if status_filter:
        query = query.filter(Order.status == status_filter)
    if reseller_id:
        query = query.filter(Order.reseller_id == reseller_id)
    
    total = query.count()
    offset = (page - 1) * per_page
    orders = query.order_by(Order.created_at.desc()).offset(offset).limit(per_page).all()
    
    return {
        "items": orders,
        "total": total,
        "page": page,
        "pages": (total + per_page - 1) // per_page,
        "per_page": per_page
    }

# ============== PAYOUT MANAGEMENT ==============

@router.get("/payouts")
async def get_all_payouts(
    status_filter: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get all payout requests"""
    query = db.query(Payout)
    
    if status_filter:
        query = query.filter(Payout.status == status_filter)
    
    total = query.count()
    offset = (page - 1) * per_page
    payouts = query.order_by(Payout.requested_at.desc()).offset(offset).limit(per_page).all()
    
    return {
        "items": payouts,
        "total": total,
        "page": page,
        "pages": (total + per_page - 1) // per_page,
        "per_page": per_page
    }

@router.patch("/payouts/{payout_id}/process")
async def process_payout(
    payout_id: int,
    action: str,  # approve, reject
    payment_reference: Optional[str] = None,
    notes: Optional[str] = None,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Process a payout request"""
    payout = db.query(Payout).filter(Payout.id == payout_id).first()
    if not payout:
        raise HTTPException(status_code=404, detail="Payout not found")
    
    if payout.status != "pending":
        raise HTTPException(status_code=400, detail="Payout already processed")
    
    if action == "approve":
        payout.status = "processing"
        payout.processed_at = datetime.utcnow()
        if payment_reference:
            payout.payment_reference = payment_reference
        message = "Payout approved and processing"
    elif action == "complete":
        payout.status = "completed"
        payout.completed_at = datetime.utcnow()
        if payment_reference:
            payout.payment_reference = payment_reference
        message = "Payout completed"
    elif action == "reject":
        payout.status = "failed"
        message = "Payout rejected"
    else:
        raise HTTPException(status_code=400, detail="Invalid action")
    
    if notes:
        payout.notes = notes
    
    db.commit()
    
    return {"message": message, "status": payout.status}

# ============== SUPPORT TICKETS ==============

@router.get("/tickets")
async def get_all_tickets(
    status_filter: Optional[str] = None,
    priority_filter: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get all support tickets"""
    query = db.query(SupportTicket)
    
    if status_filter:
        query = query.filter(SupportTicket.status == status_filter)
    if priority_filter:
        query = query.filter(SupportTicket.priority == priority_filter)
    
    total = query.count()
    offset = (page - 1) * per_page
    tickets = query.order_by(SupportTicket.created_at.desc()).offset(offset).limit(per_page).all()
    
    return {
        "items": tickets,
        "total": total,
        "page": page,
        "pages": (total + per_page - 1) // per_page,
        "per_page": per_page
    }

@router.patch("/tickets/{ticket_id}/respond")
async def respond_to_ticket(
    ticket_id: int,
    response: str,
    new_status: str = "resolved",
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Respond to a support ticket"""
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    ticket.response = response
    ticket.responded_at = datetime.utcnow()
    ticket.status = new_status
    db.commit()
    
    # TODO: Send email notification
    
    return {"message": "Response sent"}

# ============== USER SUPPORT TICKET CREATION ==============

@router.post("/tickets", response_model=SupportTicketResponse)
async def create_ticket(
    data: SupportTicketCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a support ticket"""
    ticket = SupportTicket(
        user_id=current_user.id,
        subject=data.subject,
        message=data.message,
        priority=data.priority
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    
    return ticket

@router.get("/my-tickets", response_model=List[SupportTicketResponse])
async def get_my_tickets(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's support tickets"""
    tickets = db.query(SupportTicket).filter(
        SupportTicket.user_id == current_user.id
    ).order_by(SupportTicket.created_at.desc()).all()
    
    return tickets
