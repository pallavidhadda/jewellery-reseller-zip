from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# ============== ENUMS ==============

class UserRole(str, Enum):
    RESELLER = "reseller"
    MANUFACTURER = "manufacturer"
    ADMIN = "admin"

class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

# ============== AUTH SCHEMAS ==============

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: UserRole = UserRole.RESELLER

class ResellerRegistration(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    business_name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None

# ============== RESELLER SCHEMAS ==============

class ResellerCreate(BaseModel):
    business_name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    phone: Optional[str] = None

class ResellerUpdate(BaseModel):
    business_name: Optional[str] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class ResellerBranding(BaseModel):
    logo_url: Optional[str] = None
    hero_image: Optional[str] = None
    primary_color: Optional[str] = Field(None, pattern=r'^#[0-9A-Fa-f]{6}$')
    secondary_color: Optional[str] = Field(None, pattern=r'^#[0-9A-Fa-f]{6}$')
    accent_color: Optional[str] = Field(None, pattern=r'^#[0-9A-Fa-f]{6}$')
    font_family: Optional[str] = None
    homepage_title: Optional[str] = None
    homepage_tagline: Optional[str] = None
    meta_description: Optional[str] = None

class ResellerDomain(BaseModel):
    subdomain: Optional[str] = Field(None, pattern=r'^[a-z0-9-]+$', min_length=3, max_length=50)
    custom_domain: Optional[str] = None

class ResellerResponse(BaseModel):
    id: int
    business_name: str
    slug: str
    description: Optional[str]
    phone: Optional[str]
    address: Optional[str]
    logo_url: Optional[str]
    primary_color: str
    secondary_color: str
    accent_color: str
    font_family: str
    subdomain: Optional[str]
    custom_domain: Optional[str]
    domain_verified: bool
    homepage_title: Optional[str]
    homepage_tagline: Optional[str]
    is_onboarded: bool
    is_published: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============== MANUFACTURER SCHEMAS ==============

class ManufacturerCreate(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    minimum_markup_percent: float = Field(default=20.0, ge=0, le=100)

class ManufacturerResponse(BaseModel):
    id: int
    company_name: str
    slug: str
    description: Optional[str]
    contact_email: Optional[str]
    contact_phone: Optional[str]
    minimum_markup_percent: float
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============== PRODUCT SCHEMAS ==============

class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    short_description: Optional[str] = None
    base_price: float = Field(..., gt=0)
    msrp: Optional[float] = None
    sku: str = Field(..., min_length=1, max_length=100)
    category: Optional[str] = None
    subcategory: Optional[str] = None
    material: Optional[str] = None
    weight: Optional[float] = None
    dimensions: Optional[str] = None
    primary_image: Optional[str] = None
    images: List[str] = []
    stock_quantity: int = Field(default=0, ge=0)
    tags: List[str] = []
    specifications: Dict[str, Any] = {}

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    base_price: Optional[float] = Field(None, gt=0)
    msrp: Optional[float] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    material: Optional[str] = None
    weight: Optional[float] = None
    dimensions: Optional[str] = None
    primary_image: Optional[str] = None
    images: Optional[List[str]] = None
    stock_quantity: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    tags: Optional[List[str]] = None
    specifications: Optional[Dict[str, Any]] = None

class ProductResponse(BaseModel):
    id: int
    manufacturer_id: int
    name: str
    slug: str
    description: Optional[str]
    short_description: Optional[str]
    base_price: float
    msrp: Optional[float]
    sku: str
    category: Optional[str]
    subcategory: Optional[str]
    material: Optional[str]
    weight: Optional[float]
    dimensions: Optional[str]
    primary_image: Optional[str]
    images: List[str]
    stock_quantity: int
    is_active: bool
    is_featured: bool
    tags: List[str]
    specifications: Dict[str, Any]
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============== RESELLER PRODUCT SCHEMAS ==============

class ResellerProductCreate(BaseModel):
    product_id: int
    retail_price: float = Field(..., gt=0)
    compare_at_price: Optional[float] = None
    is_featured: bool = False
    custom_title: Optional[str] = None
    custom_description: Optional[str] = None

class ResellerProductUpdate(BaseModel):
    retail_price: Optional[float] = Field(None, gt=0)
    compare_at_price: Optional[float] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None
    custom_title: Optional[str] = None
    custom_description: Optional[str] = None

class ResellerProductResponse(BaseModel):
    id: int
    reseller_id: int
    product_id: int
    retail_price: float
    compare_at_price: Optional[float]
    is_active: bool
    is_featured: bool
    display_order: int
    custom_title: Optional[str]
    custom_description: Optional[str]
    margin: float
    margin_percent: float
    product: ProductResponse
    created_at: datetime
    
    class Config:
        from_attributes = True

class BulkPriceUpdate(BaseModel):
    product_ids: List[int]
    markup_percent: float = Field(..., ge=0, le=500)

# ============== ORDER SCHEMAS ==============

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1)

class OrderCreate(BaseModel):
    customer_email: EmailStr
    customer_name: str = Field(..., min_length=2)
    customer_phone: Optional[str] = None
    shipping_address_line1: str
    shipping_address_line2: Optional[str] = None
    shipping_city: str
    shipping_state: str
    shipping_postal_code: str
    shipping_country: str = "India"
    customer_notes: Optional[str] = None
    items: List[OrderItemCreate]

class OrderStatusUpdate(BaseModel):
    status: OrderStatus
    tracking_number: Optional[str] = None
    tracking_url: Optional[str] = None
    internal_notes: Optional[str] = None

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_sku: str
    product_image: Optional[str]
    unit_price: float
    quantity: int
    total_price: float
    commission_amount: float
    
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    order_number: str
    reseller_id: int
    customer_email: str
    customer_name: str
    customer_phone: Optional[str]
    shipping_address_line1: str
    shipping_address_line2: Optional[str]
    shipping_city: str
    shipping_state: str
    shipping_postal_code: str
    shipping_country: str
    subtotal: float
    shipping_cost: float
    tax_amount: float
    total_amount: float
    reseller_commission: float
    status: str
    payment_status: str
    tracking_number: Optional[str]
    tracking_url: Optional[str]
    items: List[OrderItemResponse]
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============== PAYOUT SCHEMAS ==============

class PayoutRequest(BaseModel):
    amount: Optional[float] = None  # If None, request all available
    payment_method: str = "bank_transfer"

class PayoutResponse(BaseModel):
    id: int
    reseller_id: int
    amount: float
    status: str
    payment_method: Optional[str]
    payment_reference: Optional[str]
    period_start: Optional[datetime]
    period_end: Optional[datetime]
    requested_at: datetime
    processed_at: Optional[datetime]
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# ============== STOREFRONT CONFIG SCHEMAS ==============

class StorefrontConfigUpdate(BaseModel):
    theme: Optional[str] = None
    products_per_row: Optional[int] = Field(None, ge=2, le=6)
    show_prices: Optional[bool] = None
    show_stock_status: Optional[bool] = None
    show_featured_products: Optional[bool] = None
    show_categories: Optional[bool] = None
    show_testimonials: Optional[bool] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_image: Optional[str] = None
    hero_cta_text: Optional[str] = None
    footer_text: Optional[str] = None
    social_links: Optional[Dict[str, str]] = None
    google_analytics_id: Optional[str] = None

class StorefrontConfigResponse(BaseModel):
    id: int
    reseller_id: int
    theme: str
    products_per_row: int
    show_prices: bool
    show_stock_status: bool
    show_featured_products: bool
    show_categories: bool
    show_testimonials: bool
    hero_title: Optional[str]
    hero_subtitle: Optional[str]
    hero_image: Optional[str]
    hero_cta_text: str
    footer_text: Optional[str]
    social_links: Dict[str, str]
    google_analytics_id: Optional[str]
    
    class Config:
        from_attributes = True

# ============== DASHBOARD SCHEMAS ==============

class DashboardStats(BaseModel):
    total_products: int
    total_orders: int
    total_revenue: float
    total_commission: float
    pending_payout: float
    orders_this_month: int
    revenue_this_month: float
    commission_this_month: float

class RevenueByPeriod(BaseModel):
    period: str
    revenue: float
    orders: int
    commission: float

# ============== SUPPORT TICKET SCHEMAS ==============

class SupportTicketCreate(BaseModel):
    subject: str = Field(..., min_length=5, max_length=255)
    message: str = Field(..., min_length=10)
    priority: str = "normal"

class SupportTicketResponse(BaseModel):
    id: int
    user_id: int
    subject: str
    message: str
    status: str
    priority: str
    response: Optional[str]
    responded_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============== PAGINATION ==============

class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    pages: int
    per_page: int
