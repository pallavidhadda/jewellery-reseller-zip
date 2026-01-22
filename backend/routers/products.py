from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, or_
from typing import Optional, List

from database.database import get_db
from database.models import User, Reseller, Product, ResellerProduct, Manufacturer
from database.schemas import (
    ProductResponse, ResellerProductCreate, ResellerProductUpdate,
    ResellerProductResponse, BulkPriceUpdate
)
from routers.auth import get_current_active_user, require_reseller

router = APIRouter(prefix="/products", tags=["Products"])

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

# ============== CATALOG ROUTES (View Manufacturer Products) ==============

@router.get("/catalog", response_model=List[ProductResponse])
async def get_catalog(
    category: Optional[str] = None,
    material: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Browse manufacturer product catalog"""
    query = db.query(Product).filter(Product.is_active == True)
    
    # Apply filters
    if category:
        query = query.filter(Product.category == category)
    if material:
        query = query.filter(Product.material == material)
    if min_price is not None:
        query = query.filter(Product.base_price >= min_price)
    if max_price is not None:
        query = query.filter(Product.base_price <= max_price)
    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.description.ilike(f"%{search}%"),
                Product.sku.ilike(f"%{search}%")
            )
        )
    
    # Paginate
    offset = (page - 1) * per_page
    products = query.offset(offset).limit(per_page).all()
    
    return products

@router.get("/catalog/categories")
async def get_categories(
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Get list of product categories"""
    categories = db.query(Product.category).filter(
        Product.is_active == True,
        Product.category.isnot(None)
    ).distinct().all()
    
    return [c[0] for c in categories if c[0]]

@router.get("/catalog/materials")
async def get_materials(
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Get list of product materials"""
    materials = db.query(Product.material).filter(
        Product.is_active == True,
        Product.material.isnot(None)
    ).distinct().all()
    
    return [m[0] for m in materials if m[0]]

@router.get("/catalog/{product_id}", response_model=ProductResponse)
async def get_catalog_product(
    product_id: int,
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Get single product from catalog"""
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.is_active == True
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return product

# ============== MY PRODUCTS (Reseller's Selected Products) ==============

@router.get("/my-products")
async def get_my_products(
    is_active: Optional[bool] = None,
    is_featured: Optional[bool] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Get reseller's selected products"""
    reseller = get_reseller_for_user(current_user, db)
    
    query = db.query(ResellerProduct).options(
        joinedload(ResellerProduct.product)
    ).filter(ResellerProduct.reseller_id == reseller.id)
    
    # Apply filters
    if is_active is not None:
        query = query.filter(ResellerProduct.is_active == is_active)
    if is_featured is not None:
        query = query.filter(ResellerProduct.is_featured == is_featured)
    if search:
        query = query.join(Product).filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.sku.ilike(f"%{search}%")
            )
        )
    
    # Get total count
    total = query.count()
    
    # Paginate
    offset = (page - 1) * per_page
    items = query.order_by(ResellerProduct.display_order).offset(offset).limit(per_page).all()
    
    # Format response with margin calculations
    result = []
    for rp in items:
        product_dict = {
            "id": rp.id,
            "reseller_id": rp.reseller_id,
            "product_id": rp.product_id,
            "retail_price": rp.retail_price,
            "compare_at_price": rp.compare_at_price,
            "is_active": rp.is_active,
            "is_featured": rp.is_featured,
            "display_order": rp.display_order,
            "custom_title": rp.custom_title,
            "custom_description": rp.custom_description,
            "margin": rp.retail_price - rp.product.base_price if rp.product else 0,
            "margin_percent": ((rp.retail_price - rp.product.base_price) / rp.product.base_price * 100) if rp.product and rp.product.base_price > 0 else 0,
            "product": {
                "id": rp.product.id,
                "name": rp.product.name,
                "slug": rp.product.slug,
                "description": rp.product.description,
                "short_description": rp.product.short_description,
                "base_price": rp.product.base_price,
                "msrp": rp.product.msrp,
                "sku": rp.product.sku,
                "category": rp.product.category,
                "subcategory": rp.product.subcategory,
                "material": rp.product.material,
                "weight": rp.product.weight,
                "dimensions": rp.product.dimensions,
                "primary_image": rp.product.primary_image,
                "images": rp.product.images or [],
                "stock_quantity": rp.product.stock_quantity,
                "is_active": rp.product.is_active,
                "is_featured": rp.product.is_featured,
                "tags": rp.product.tags or [],
                "specifications": rp.product.specifications or {},
                "manufacturer_id": rp.product.manufacturer_id,
                "created_at": rp.product.created_at.isoformat() if rp.product.created_at else None
            } if rp.product else None,
            "created_at": rp.created_at.isoformat() if rp.created_at else None
        }
        result.append(product_dict)
    
    return {
        "items": result,
        "total": total,
        "page": page,
        "pages": (total + per_page - 1) // per_page,
        "per_page": per_page
    }

@router.post("/my-products")
async def add_product(
    data: ResellerProductCreate,
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Add a product to reseller's store"""
    reseller = get_reseller_for_user(current_user, db)
    
    # Check if product exists
    product = db.query(Product).filter(
        Product.id == data.product_id,
        Product.is_active == True
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Check if already added
    existing = db.query(ResellerProduct).filter(
        ResellerProduct.reseller_id == reseller.id,
        ResellerProduct.product_id == data.product_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product already in your store"
        )
    
    # Validate minimum markup
    manufacturer = db.query(Manufacturer).filter(
        Manufacturer.id == product.manufacturer_id
    ).first()
    
    if manufacturer:
        min_price = product.base_price * (1 + manufacturer.minimum_markup_percent / 100)
        if data.retail_price < min_price:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Retail price must be at least Rs.{min_price:.2f} (minimum {manufacturer.minimum_markup_percent}% markup)"
            )
    
    # Create reseller product
    reseller_product = ResellerProduct(
        reseller_id=reseller.id,
        product_id=data.product_id,
        retail_price=data.retail_price,
        compare_at_price=data.compare_at_price,
        is_featured=data.is_featured,
        custom_title=data.custom_title,
        custom_description=data.custom_description
    )
    db.add(reseller_product)
    db.commit()
    db.refresh(reseller_product)
    
    return {"message": "Product added successfully", "id": reseller_product.id}

@router.put("/my-products/{reseller_product_id}")
async def update_reseller_product(
    reseller_product_id: int,
    data: ResellerProductUpdate,
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Update a product in reseller's store"""
    reseller = get_reseller_for_user(current_user, db)
    
    reseller_product = db.query(ResellerProduct).filter(
        ResellerProduct.id == reseller_product_id,
        ResellerProduct.reseller_id == reseller.id
    ).first()
    
    if not reseller_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found in your store"
        )
    
    # Validate minimum markup if price is being updated
    if data.retail_price is not None:
        product = db.query(Product).filter(
            Product.id == reseller_product.product_id
        ).first()
        
        manufacturer = db.query(Manufacturer).filter(
            Manufacturer.id == product.manufacturer_id
        ).first()
        
        if manufacturer:
            min_price = product.base_price * (1 + manufacturer.minimum_markup_percent / 100)
            if data.retail_price < min_price:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Retail price must be at least Rs.{min_price:.2f}"
                )
    
    # Update fields
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(reseller_product, field, value)
    
    db.commit()
    db.refresh(reseller_product)
    
    return {"message": "Product updated successfully"}

@router.delete("/my-products/{reseller_product_id}")
async def remove_reseller_product(
    reseller_product_id: int,
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Remove a product from reseller's store"""
    reseller = get_reseller_for_user(current_user, db)
    
    reseller_product = db.query(ResellerProduct).filter(
        ResellerProduct.id == reseller_product_id,
        ResellerProduct.reseller_id == reseller.id
    ).first()
    
    if not reseller_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found in your store"
        )
    
    db.delete(reseller_product)
    db.commit()
    
    return {"message": "Product removed successfully"}

@router.post("/my-products/bulk-update")
async def bulk_update_prices(
    data: BulkPriceUpdate,
    current_user: User = Depends(require_reseller),
    db: Session = Depends(get_db)
):
    """Bulk update product prices with markup percentage"""
    reseller = get_reseller_for_user(current_user, db)
    
    # Get reseller products
    reseller_products = db.query(ResellerProduct).filter(
        ResellerProduct.reseller_id == reseller.id,
        ResellerProduct.product_id.in_(data.product_ids)
    ).all()
    
    updated = 0
    errors = []
    
    for rp in reseller_products:
        product = db.query(Product).filter(Product.id == rp.product_id).first()
        if product:
            new_price = product.base_price * (1 + data.markup_percent / 100)
            
            # Check minimum markup
            manufacturer = db.query(Manufacturer).filter(
                Manufacturer.id == product.manufacturer_id
            ).first()
            
            if manufacturer:
                min_price = product.base_price * (1 + manufacturer.minimum_markup_percent / 100)
                if new_price < min_price:
                    errors.append({
                        "product_id": product.id,
                        "error": f"Markup too low. Minimum required: {manufacturer.minimum_markup_percent}%"
                    })
                    continue
            
            rp.retail_price = round(new_price, 2)
            updated += 1
    
    db.commit()
    
    return {
        "message": f"Updated {updated} products",
        "updated": updated,
        "errors": errors
    }
