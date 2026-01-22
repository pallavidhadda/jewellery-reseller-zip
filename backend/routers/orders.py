from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import Optional, List
from datetime import datetime
import uuid

from database.database import get_db
from database.models import (
    User, Reseller, Order, OrderItem, Product, ResellerProduct, Manufacturer
)
from database.schemas import (
    OrderCreate, OrderResponse, OrderStatusUpdate, OrderItemResponse
)
from routers.auth import get_current_active_user, require_reseller

router = APIRouter(prefix="/orders", tags=["Orders"])

# ============== HELPER FUNCTIONS ==============

def get_reseller_for_user(user: User, db: Session) -> Reseller:
    reseller = db.query(Reseller).filter(Reseller.user_id == user.id).first()
    if not reseller:
        raise HTTPException(status_code=404, detail="Reseller profile not found")
    return reseller

def generate_order_number() -> str:
    """Generate unique order number"""
    timestamp = datetime.now().strftime("%Y%m%d")
    unique_id = uuid.uuid4().hex[:6].upper()
    return f"ORD-{timestamp}-{unique_id}"

# ============== ORDER ROUTES ==============

@router.get("", response_model=List[OrderResponse])
async def get_orders(
    status_filter: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Get reseller's orders"""
    reseller = get_reseller_for_user(current_user, db)
    
    query = db.query(Order).options(
        joinedload(Order.items)
    ).filter(Order.reseller_id == reseller.id)
    
    if status_filter:
        query = query.filter(Order.status == status_filter)
    
    # Paginate
    offset = (page - 1) * per_page
    orders = query.order_by(Order.created_at.desc()).offset(offset).limit(per_page).all()
    
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Get single order details"""
    reseller = get_reseller_for_user(current_user, db)
    
    order = db.query(Order).options(
        joinedload(Order.items)
    ).filter(
        Order.id == order_id,
        Order.reseller_id == reseller.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order

@router.get("/stats/summary")
async def get_order_stats(
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Get order statistics"""
    reseller = get_reseller_for_user(current_user, db)
    
    # Count by status
    status_counts = db.query(
        Order.status,
        func.count(Order.id)
    ).filter(
        Order.reseller_id == reseller.id
    ).group_by(Order.status).all()
    
    stats = {
        "pending": 0,
        "confirmed": 0,
        "processing": 0,
        "shipped": 0,
        "delivered": 0,
        "cancelled": 0
    }
    
    for status, count in status_counts:
        stats[status] = count
    
    stats["total"] = sum(stats.values())
    
    return stats

# ============== STOREFRONT ORDER CREATION (Customer-facing) ==============

@router.post("/storefront/{reseller_slug}")
async def create_storefront_order(
    reseller_slug: str,
    order_data: OrderCreate,
    db: Session = Depends(get_db)
):
    """Create order on a reseller's storefront (customer-facing)"""
    # Get reseller by slug
    reseller = db.query(Reseller).filter(
        Reseller.slug == reseller_slug,
        Reseller.is_published == True
    ).first()
    
    if not reseller:
        raise HTTPException(status_code=404, detail="Store not found")
    
    # Validate items and calculate totals
    subtotal = 0
    total_commission = 0
    order_items = []
    
    for item_data in order_data.items:
        # Get reseller product
        reseller_product = db.query(ResellerProduct).filter(
            ResellerProduct.reseller_id == reseller.id,
            ResellerProduct.product_id == item_data.product_id,
            ResellerProduct.is_active == True
        ).first()
        
        if not reseller_product:
            raise HTTPException(
                status_code=400,
                detail=f"Product {item_data.product_id} not available"
            )
        
        # Get base product
        product = db.query(Product).filter(Product.id == item_data.product_id).first()
        
        if not product or not product.is_active:
            raise HTTPException(
                status_code=400,
                detail=f"Product {item_data.product_id} not available"
            )
        
        # Check stock
        if product.track_inventory and product.stock_quantity < item_data.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name}"
            )
        
        # Calculate prices
        item_total = reseller_product.retail_price * item_data.quantity
        item_commission = (reseller_product.retail_price - product.base_price) * item_data.quantity
        
        subtotal += item_total
        total_commission += item_commission
        
        order_items.append({
            "product": product,
            "reseller_product": reseller_product,
            "quantity": item_data.quantity,
            "unit_price": reseller_product.retail_price,
            "base_price": product.base_price,
            "total_price": item_total,
            "commission": item_commission
        })
    
    # Calculate shipping and tax
    shipping_cost = 0  # Free shipping for now
    tax_rate = 0.18  # 18% GST
    tax_amount = subtotal * tax_rate
    total_amount = subtotal + shipping_cost + tax_amount
    
    manufacturer_amount = total_amount - total_commission
    
    # Create order
    order = Order(
        reseller_id=reseller.id,
        order_number=generate_order_number(),
        customer_email=order_data.customer_email,
        customer_name=order_data.customer_name,
        customer_phone=order_data.customer_phone,
        shipping_address_line1=order_data.shipping_address_line1,
        shipping_address_line2=order_data.shipping_address_line2,
        shipping_city=order_data.shipping_city,
        shipping_state=order_data.shipping_state,
        shipping_postal_code=order_data.shipping_postal_code,
        shipping_country=order_data.shipping_country,
        subtotal=subtotal,
        shipping_cost=shipping_cost,
        tax_amount=tax_amount,
        total_amount=total_amount,
        reseller_commission=total_commission,
        manufacturer_amount=manufacturer_amount,
        customer_notes=order_data.customer_notes,
        status="pending",
        payment_status="pending"
    )
    db.add(order)
    db.flush()
    
    # Create order items
    for item in order_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item["product"].id,
            product_name=item["product"].name,
            product_sku=item["product"].sku,
            product_image=item["product"].primary_image,
            unit_price=item["unit_price"],
            base_price=item["base_price"],
            quantity=item["quantity"],
            total_price=item["total_price"],
            commission_amount=item["commission"]
        )
        db.add(order_item)
        
        # Update inventory
        if item["product"].track_inventory:
            item["product"].stock_quantity -= item["quantity"]
    
    db.commit()
    db.refresh(order)
    
    # TODO: Send order confirmation emails
    # TODO: Notify manufacturer
    
    return {
        "order_number": order.order_number,
        "order_id": order.id,
        "total_amount": order.total_amount,
        "message": "Order placed successfully"
    }

# ============== ORDER STATUS UPDATES (For Admin/Manufacturer) ==============

@router.patch("/{order_id}/status")
async def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update order status (admin/manufacturer)"""
    # For now, allow reseller to view and admin to update
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check access
    if current_user.role == "reseller":
        reseller = db.query(Reseller).filter(Reseller.user_id == current_user.id).first()
        if not reseller or order.reseller_id != reseller.id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    # Update status
    order.status = data.status.value
    
    if data.tracking_number:
        order.tracking_number = data.tracking_number
    if data.tracking_url:
        order.tracking_url = data.tracking_url
    if data.internal_notes:
        order.internal_notes = data.internal_notes
    
    # Set timestamps
    if data.status.value == "shipped":
        order.shipped_at = datetime.utcnow()
    elif data.status.value == "delivered":
        order.delivered_at = datetime.utcnow()
    
    db.commit()
    
    # TODO: Send status update email to customer
    
    return {"message": "Order status updated", "status": order.status}
