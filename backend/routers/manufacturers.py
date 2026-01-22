from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
import os
import uuid

from database.database import get_db
from database.models import User, Manufacturer, Product
from database.schemas import (
    ManufacturerCreate, ManufacturerResponse,
    ProductCreate, ProductUpdate, ProductResponse
)
from routers.auth import get_current_active_user, require_manufacturer, require_admin
from slugify import slugify

router = APIRouter(prefix="/manufacturers", tags=["Manufacturers"])

# ============== HELPER FUNCTIONS ==============

def get_manufacturer_for_user(user: User, db: Session) -> Manufacturer:
    manufacturer = db.query(Manufacturer).filter(Manufacturer.user_id == user.id).first()
    if not manufacturer:
        raise HTTPException(status_code=404, detail="Manufacturer profile not found")
    return manufacturer

# ============== MANUFACTURER PROFILE ==============

@router.get("/profile", response_model=ManufacturerResponse)
async def get_profile(
    current_user: User = Depends(require_manufacturer),
    db: Session = Depends(get_db)
):
    """Get manufacturer profile"""
    return get_manufacturer_for_user(current_user, db)

# ============== PRODUCT MANAGEMENT ==============

@router.get("/products", response_model=List[ProductResponse])
async def get_products(
    category: Optional[str] = None,
    is_active: Optional[bool] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_manufacturer),
    db: Session = Depends(get_db)
):
    """Get manufacturer's products"""
    manufacturer = get_manufacturer_for_user(current_user, db)
    
    query = db.query(Product).filter(Product.manufacturer_id == manufacturer.id)
    
    if category:
        query = query.filter(Product.category == category)
    if is_active is not None:
        query = query.filter(Product.is_active == is_active)
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    
    offset = (page - 1) * per_page
    products = query.offset(offset).limit(per_page).all()
    
    return products

@router.post("/products", response_model=ProductResponse, status_code=201)
async def create_product(
    data: ProductCreate,
    current_user: User = Depends(require_manufacturer),
    db: Session = Depends(get_db)
):
    """Create a new product"""
    manufacturer = get_manufacturer_for_user(current_user, db)
    
    # Check SKU uniqueness
    existing = db.query(Product).filter(Product.sku == data.sku).first()
    if existing:
        raise HTTPException(status_code=400, detail="SKU already exists")
    
    # Generate slug
    base_slug = slugify(data.name)
    slug = base_slug
    counter = 1
    while db.query(Product).filter(Product.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    product = Product(
        manufacturer_id=manufacturer.id,
        name=data.name,
        slug=slug,
        description=data.description,
        short_description=data.short_description,
        base_price=data.base_price,
        msrp=data.msrp,
        sku=data.sku,
        category=data.category,
        subcategory=data.subcategory,
        material=data.material,
        weight=data.weight,
        dimensions=data.dimensions,
        primary_image=data.primary_image,
        images=data.images,
        stock_quantity=data.stock_quantity,
        tags=data.tags,
        specifications=data.specifications
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    
    return product

@router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    data: ProductUpdate,
    current_user: User = Depends(require_manufacturer),
    db: Session = Depends(get_db)
):
    """Update a product"""
    manufacturer = get_manufacturer_for_user(current_user, db)
    
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.manufacturer_id == manufacturer.id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    
    db.commit()
    db.refresh(product)
    
    return product

@router.delete("/products/{product_id}")
async def delete_product(
    product_id: int,
    current_user: User = Depends(require_manufacturer),
    db: Session = Depends(get_db)
):
    """Soft delete a product"""
    manufacturer = get_manufacturer_for_user(current_user, db)
    
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.manufacturer_id == manufacturer.id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product.is_active = False
    db.commit()
    
    return {"message": "Product deactivated"}

@router.post("/products/{product_id}/images")
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(require_manufacturer),
    db: Session = Depends(get_db)
):
    """Upload product image"""
    manufacturer = get_manufacturer_for_user(current_user, db)
    
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.manufacturer_id == manufacturer.id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Save file
    upload_dir = "uploads/products"
    os.makedirs(upload_dir, exist_ok=True)
    
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{product.sku}-{uuid.uuid4().hex[:8]}.{ext}"
    filepath = os.path.join(upload_dir, filename)
    
    with open(filepath, "wb") as f:
        content = await file.read()
        f.write(content)
    
    image_url = f"/uploads/products/{filename}"
    
    # Add to product images
    if not product.images:
        product.images = []
    product.images = product.images + [image_url]
    
    # Set as primary if first image
    if not product.primary_image:
        product.primary_image = image_url
    
    db.commit()
    
    return {"image_url": image_url}

@router.patch("/products/{product_id}/inventory")
async def update_inventory(
    product_id: int,
    quantity: int,
    current_user: User = Depends(require_manufacturer),
    db: Session = Depends(get_db)
):
    """Update product inventory"""
    manufacturer = get_manufacturer_for_user(current_user, db)
    
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.manufacturer_id == manufacturer.id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product.stock_quantity = quantity
    db.commit()
    
    return {"message": "Inventory updated", "stock_quantity": product.stock_quantity}

# ============== DASHBOARD ==============

@router.get("/dashboard/stats")
async def get_dashboard_stats(
    current_user: User = Depends(require_manufacturer),
    db: Session = Depends(get_db)
):
    """Get manufacturer dashboard stats"""
    manufacturer = get_manufacturer_for_user(current_user, db)
    
    total_products = db.query(Product).filter(
        Product.manufacturer_id == manufacturer.id
    ).count()
    
    active_products = db.query(Product).filter(
        Product.manufacturer_id == manufacturer.id,
        Product.is_active == True
    ).count()
    
    low_stock = db.query(Product).filter(
        Product.manufacturer_id == manufacturer.id,
        Product.is_active == True,
        Product.stock_quantity <= Product.low_stock_threshold
    ).count()
    
    out_of_stock = db.query(Product).filter(
        Product.manufacturer_id == manufacturer.id,
        Product.is_active == True,
        Product.stock_quantity == 0
    ).count()
    
    return {
        "total_products": total_products,
        "active_products": active_products,
        "low_stock": low_stock,
        "out_of_stock": out_of_stock
    }
