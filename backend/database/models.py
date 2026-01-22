from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum

# ============== ENUMS ==============

class UserRole(str, enum.Enum):
    RESELLER = "reseller"
    MANUFACTURER = "manufacturer"
    ADMIN = "admin"

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class PayoutStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

# ============== USER MODELS ==============

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default=UserRole.RESELLER)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String(255), nullable=True)
    reset_token = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    reseller = relationship("Reseller", back_populates="user", uselist=False)
    manufacturer = relationship("Manufacturer", back_populates="user", uselist=False)

class Reseller(Base):
    __tablename__ = "resellers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    # Business Info
    business_name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    
    # Contact Info
    phone = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    
    # Branding
    logo_url = Column(String(500), nullable=True)
    primary_color = Column(String(7), default="#8B5CF6")  # Purple
    secondary_color = Column(String(7), default="#EC4899")  # Pink
    accent_color = Column(String(7), default="#F59E0B")  # Amber
    font_family = Column(String(100), default="Inter")
    
    # Domain
    subdomain = Column(String(100), unique=True, nullable=True)
    custom_domain = Column(String(255), unique=True, nullable=True)
    domain_verified = Column(Boolean, default=False)
    
    # Settings
    homepage_title = Column(String(255), nullable=True)
    homepage_tagline = Column(Text, nullable=True)
    meta_description = Column(Text, nullable=True)
    
    # Status
    is_onboarded = Column(Boolean, default=False)
    is_published = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="reseller")
    products = relationship("ResellerProduct", back_populates="reseller")
    orders = relationship("Order", back_populates="reseller")
    payouts = relationship("Payout", back_populates="reseller")
    storefront_config = relationship("StorefrontConfig", back_populates="reseller", uselist=False)

class Manufacturer(Base):
    __tablename__ = "manufacturers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    # Business Info
    company_name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    
    # Contact Info
    contact_email = Column(String(255), nullable=True)
    contact_phone = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    
    # Settings
    minimum_markup_percent = Column(Float, default=20.0)  # Minimum markup resellers must apply
    auto_fulfill = Column(Boolean, default=True)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="manufacturer")
    products = relationship("Product", back_populates="manufacturer")

# ============== PRODUCT MODELS ==============

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    manufacturer_id = Column(Integer, ForeignKey("manufacturers.id"))
    
    # Basic Info
    name = Column(String(255), nullable=False)
    slug = Column(String(255), index=True, nullable=False)
    description = Column(Text, nullable=True)
    short_description = Column(String(500), nullable=True)
    
    # Pricing
    base_price = Column(Float, nullable=False)  # Manufacturer's price
    msrp = Column(Float, nullable=True)  # Suggested retail price
    
    # Product Details
    sku = Column(String(100), unique=True, nullable=False)
    category = Column(String(100), nullable=True)
    subcategory = Column(String(100), nullable=True)
    material = Column(String(100), nullable=True)  # Gold, Silver, Diamond, etc.
    weight = Column(Float, nullable=True)  # in grams
    dimensions = Column(String(100), nullable=True)
    
    # Images
    primary_image = Column(String(500), nullable=True)
    images = Column(JSON, default=list)  # List of image URLs
    
    # Inventory
    stock_quantity = Column(Integer, default=0)
    low_stock_threshold = Column(Integer, default=5)
    track_inventory = Column(Boolean, default=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    # Metadata
    tags = Column(JSON, default=list)
    specifications = Column(JSON, default=dict)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    manufacturer = relationship("Manufacturer", back_populates="products")
    reseller_products = relationship("ResellerProduct", back_populates="product")

class ResellerProduct(Base):
    __tablename__ = "reseller_products"
    
    id = Column(Integer, primary_key=True, index=True)
    reseller_id = Column(Integer, ForeignKey("resellers.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    
    # Custom Pricing
    retail_price = Column(Float, nullable=False)  # Reseller's selling price
    compare_at_price = Column(Float, nullable=True)  # Original price for showing discounts
    
    # Display Settings
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)
    
    # Custom Content (optional overrides)
    custom_title = Column(String(255), nullable=True)
    custom_description = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    reseller = relationship("Reseller", back_populates="products")
    product = relationship("Product", back_populates="reseller_products")
    
    @property
    def margin(self):
        """Calculate profit margin"""
        if self.product:
            return self.retail_price - self.product.base_price
        return 0
    
    @property
    def margin_percent(self):
        """Calculate profit margin percentage"""
        if self.product and self.product.base_price > 0:
            return ((self.retail_price - self.product.base_price) / self.product.base_price) * 100
        return 0

# ============== ORDER MODELS ==============

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    reseller_id = Column(Integer, ForeignKey("resellers.id"))
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    
    # Customer Info
    customer_email = Column(String(255), nullable=False)
    customer_name = Column(String(255), nullable=False)
    customer_phone = Column(String(50), nullable=True)
    
    # Shipping Address
    shipping_address_line1 = Column(String(255), nullable=False)
    shipping_address_line2 = Column(String(255), nullable=True)
    shipping_city = Column(String(100), nullable=False)
    shipping_state = Column(String(100), nullable=False)
    shipping_postal_code = Column(String(20), nullable=False)
    shipping_country = Column(String(100), default="India")
    
    # Order Totals
    subtotal = Column(Float, nullable=False)
    shipping_cost = Column(Float, default=0)
    tax_amount = Column(Float, default=0)
    total_amount = Column(Float, nullable=False)
    
    # Commission
    reseller_commission = Column(Float, default=0)  # Amount reseller earns
    manufacturer_amount = Column(Float, default=0)  # Amount going to manufacturer
    
    # Status
    status = Column(String(50), default=OrderStatus.PENDING)
    payment_status = Column(String(50), default="pending")
    
    # Tracking
    tracking_number = Column(String(100), nullable=True)
    tracking_url = Column(String(500), nullable=True)
    shipped_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    
    # Notes
    customer_notes = Column(Text, nullable=True)
    internal_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    reseller = relationship("Reseller", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    
    # Product Snapshot (in case product changes later)
    product_name = Column(String(255), nullable=False)
    product_sku = Column(String(100), nullable=False)
    product_image = Column(String(500), nullable=True)
    
    # Pricing at time of order
    unit_price = Column(Float, nullable=False)  # Retail price
    base_price = Column(Float, nullable=False)  # Manufacturer price
    quantity = Column(Integer, default=1)
    total_price = Column(Float, nullable=False)
    
    # Commission calculation
    commission_amount = Column(Float, default=0)  # Reseller's profit on this item
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product")

# ============== PAYOUT MODELS ==============

class Payout(Base):
    __tablename__ = "payouts"
    
    id = Column(Integer, primary_key=True, index=True)
    reseller_id = Column(Integer, ForeignKey("resellers.id"))
    
    # Payout Details
    amount = Column(Float, nullable=False)
    status = Column(String(50), default=PayoutStatus.PENDING)
    
    # Payment Info
    payment_method = Column(String(50), nullable=True)  # bank_transfer, upi, etc.
    payment_reference = Column(String(255), nullable=True)
    
    # Period
    period_start = Column(DateTime(timezone=True), nullable=True)
    period_end = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    requested_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    notes = Column(Text, nullable=True)
    
    # Relationships
    reseller = relationship("Reseller", back_populates="payouts")

# ============== STOREFRONT CONFIG ==============

class StorefrontConfig(Base):
    __tablename__ = "storefront_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    reseller_id = Column(Integer, ForeignKey("resellers.id"), unique=True)
    
    # Theme Settings
    theme = Column(String(50), default="elegant")  # elegant, modern, minimal, luxury
    
    # Layout Settings
    products_per_row = Column(Integer, default=4)
    show_prices = Column(Boolean, default=True)
    show_stock_status = Column(Boolean, default=True)
    
    # Homepage Sections
    show_featured_products = Column(Boolean, default=True)
    show_categories = Column(Boolean, default=True)
    show_testimonials = Column(Boolean, default=False)
    
    # Hero Section
    hero_title = Column(String(255), nullable=True)
    hero_subtitle = Column(Text, nullable=True)
    hero_image = Column(String(500), nullable=True)
    hero_cta_text = Column(String(100), default="Shop Now")
    
    # Footer
    footer_text = Column(Text, nullable=True)
    social_links = Column(JSON, default=dict)  # {instagram: url, facebook: url, etc.}
    
    # SEO
    google_analytics_id = Column(String(50), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    reseller = relationship("Reseller", back_populates="storefront_config")

# ============== SUPPORT TICKET ==============

class SupportTicket(Base):
    __tablename__ = "support_tickets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    subject = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="open")  # open, in_progress, resolved, closed
    priority = Column(String(50), default="normal")  # low, normal, high, urgent
    
    response = Column(Text, nullable=True)
    responded_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
