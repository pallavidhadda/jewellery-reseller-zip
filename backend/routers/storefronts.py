from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import Optional, List

from database.database import get_db
from database.models import (
    Reseller, Product, ResellerProduct, StorefrontConfig
)
from database.schemas import ProductResponse

router = APIRouter(prefix="/store", tags=["Storefront"])

# ============== PUBLIC STOREFRONT ROUTES ==============

@router.get("/{slug}")
async def get_storefront(
    slug: str,
    db: Session = Depends(get_db)
):
    """Get storefront data by slug"""
    reseller = db.query(Reseller).filter(
        Reseller.slug == slug,
        Reseller.is_published == True
    ).first()
    
    if not reseller:
        raise HTTPException(status_code=404, detail="Store not found")
    
    # Get storefront config
    config = db.query(StorefrontConfig).filter(
        StorefrontConfig.reseller_id == reseller.id
    ).first()
    
    # Get product count
    product_count = db.query(ResellerProduct).filter(
        ResellerProduct.reseller_id == reseller.id,
        ResellerProduct.is_active == True
    ).count()
    
    return {
        "store": {
            "name": reseller.business_name,
            "slug": reseller.slug,
            "description": reseller.description,
            "logo_url": reseller.logo_url,
            "primary_color": reseller.primary_color,
            "secondary_color": reseller.secondary_color,
            "accent_color": reseller.accent_color,
            "font_family": reseller.font_family,
            "homepage_title": reseller.homepage_title,
            "homepage_tagline": reseller.homepage_tagline,
            "meta_description": reseller.meta_description
        },
        "config": {
            "theme": config.theme if config else "elegant",
            "products_per_row": config.products_per_row if config else 4,
            "show_prices": config.show_prices if config else True,
            "show_stock_status": config.show_stock_status if config else True,
            "show_featured_products": config.show_featured_products if config else True,
            "show_categories": config.show_categories if config else True,
            "hero_title": config.hero_title if config else reseller.homepage_title,
            "hero_subtitle": config.hero_subtitle if config else reseller.homepage_tagline,
            "hero_image": config.hero_image if config else None,
            "hero_cta_text": config.hero_cta_text if config else "Shop Now",
            "footer_text": config.footer_text if config else None,
            "social_links": config.social_links if config else {}
        } if config else None,
        "product_count": product_count
    }

@router.get("/{slug}/products")
async def get_storefront_products(
    slug: str,
    category: Optional[str] = None,
    material: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
    featured_only: bool = False,
    page: int = Query(1, ge=1),
    per_page: int = Query(12, ge=1, le=48),
    db: Session = Depends(get_db)
):
    """Get products for a storefront"""
    reseller = db.query(Reseller).filter(
        Reseller.slug == slug,
        Reseller.is_published == True
    ).first()
    
    if not reseller:
        raise HTTPException(status_code=404, detail="Store not found")
    
    # Build query
    query = db.query(ResellerProduct).options(
        joinedload(ResellerProduct.product)
    ).join(Product).filter(
        ResellerProduct.reseller_id == reseller.id,
        ResellerProduct.is_active == True,
        Product.is_active == True,
        Product.stock_quantity > 0  # Only show in-stock items
    )
    
    # Apply filters
    if category:
        query = query.filter(Product.category == category)
    if material:
        query = query.filter(Product.material == material)
    if min_price is not None:
        query = query.filter(ResellerProduct.retail_price >= min_price)
    if max_price is not None:
        query = query.filter(ResellerProduct.retail_price <= max_price)
    if featured_only:
        query = query.filter(ResellerProduct.is_featured == True)
    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.description.ilike(f"%{search}%")
            )
        )
    
    # Get total
    total = query.count()
    
    # Paginate
    offset = (page - 1) * per_page
    items = query.order_by(
        ResellerProduct.is_featured.desc(),
        ResellerProduct.display_order
    ).offset(offset).limit(per_page).all()
    
    # Format response
    products = []
    for rp in items:
        products.append({
            "id": rp.product_id,
            "reseller_product_id": rp.id,
            "name": rp.custom_title or rp.product.name,
            "slug": rp.product.slug,
            "description": rp.custom_description or rp.product.description,
            "short_description": rp.product.short_description,
            "price": rp.retail_price,
            "compare_at_price": rp.compare_at_price,
            "category": rp.product.category,
            "material": rp.product.material,
            "primary_image": rp.product.primary_image,
            "images": rp.product.images or [],
            "is_featured": rp.is_featured,
            "in_stock": rp.product.stock_quantity > 0,
            "stock_quantity": rp.product.stock_quantity if rp.product.track_inventory else None
        })
    
    return {
        "products": products,
        "total": total,
        "page": page,
        "pages": (total + per_page - 1) // per_page,
        "per_page": per_page
    }

@router.get("/{slug}/products/{product_slug}")
async def get_storefront_product(
    slug: str,
    product_slug: str,
    db: Session = Depends(get_db)
):
    """Get single product from storefront"""
    reseller = db.query(Reseller).filter(
        Reseller.slug == slug,
        Reseller.is_published == True
    ).first()
    
    if not reseller:
        raise HTTPException(status_code=404, detail="Store not found")
    
    # Get reseller product
    reseller_product = db.query(ResellerProduct).options(
        joinedload(ResellerProduct.product)
    ).join(Product).filter(
        ResellerProduct.reseller_id == reseller.id,
        ResellerProduct.is_active == True,
        Product.slug == product_slug,
        Product.is_active == True
    ).first()
    
    if not reseller_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product = reseller_product.product
    
    return {
        "id": product.id,
        "reseller_product_id": reseller_product.id,
        "name": reseller_product.custom_title or product.name,
        "slug": product.slug,
        "description": reseller_product.custom_description or product.description,
        "short_description": product.short_description,
        "price": reseller_product.retail_price,
        "compare_at_price": reseller_product.compare_at_price,
        "sku": product.sku,
        "category": product.category,
        "subcategory": product.subcategory,
        "material": product.material,
        "weight": product.weight,
        "dimensions": product.dimensions,
        "primary_image": product.primary_image,
        "images": product.images or [],
        "is_featured": reseller_product.is_featured,
        "in_stock": product.stock_quantity > 0,
        "stock_quantity": product.stock_quantity if product.track_inventory else None,
        "tags": product.tags or [],
        "specifications": product.specifications or {}
    }

@router.get("/{slug}/categories")
async def get_storefront_categories(
    slug: str,
    db: Session = Depends(get_db)
):
    """Get categories available in storefront"""
    reseller = db.query(Reseller).filter(
        Reseller.slug == slug,
        Reseller.is_published == True
    ).first()
    
    if not reseller:
        raise HTTPException(status_code=404, detail="Store not found")
    
    # Get unique categories from reseller's products
    categories = db.query(Product.category).join(
        ResellerProduct
    ).filter(
        ResellerProduct.reseller_id == reseller.id,
        ResellerProduct.is_active == True,
        Product.is_active == True,
        Product.category.isnot(None)
    ).distinct().all()
    
    return [c[0] for c in categories if c[0]]

@router.get("/{slug}/featured")
async def get_featured_products(
    slug: str,
    limit: int = Query(8, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Get featured products for storefront"""
    reseller = db.query(Reseller).filter(
        Reseller.slug == slug,
        Reseller.is_published == True
    ).first()
    
    if not reseller:
        raise HTTPException(status_code=404, detail="Store not found")
    
    items = db.query(ResellerProduct).options(
        joinedload(ResellerProduct.product)
    ).join(Product).filter(
        ResellerProduct.reseller_id == reseller.id,
        ResellerProduct.is_active == True,
        ResellerProduct.is_featured == True,
        Product.is_active == True,
        Product.stock_quantity > 0
    ).limit(limit).all()
    
    products = []
    for rp in items:
        products.append({
            "id": rp.product_id,
            "name": rp.custom_title or rp.product.name,
            "slug": rp.product.slug,
            "price": rp.retail_price,
            "compare_at_price": rp.compare_at_price,
            "primary_image": rp.product.primary_image,
            "category": rp.product.category
        })
    
    return products
