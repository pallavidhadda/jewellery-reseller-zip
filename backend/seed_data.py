"""
Seed data for the Jewelry Reseller Platform.
Run this script to populate the database with sample data.
"""

from database.database import SessionLocal, init_db
from database.models import User, Manufacturer, Product, Reseller, StorefrontConfig
from routers.auth import get_password_hash
from slugify import slugify
import random

# Sample jewelry products
SAMPLE_PRODUCTS = [
    {
        "name": "Diamond Solitaire Ring",
        "description": "Exquisite diamond solitaire ring featuring a brilliant-cut diamond set in 18K white gold. Perfect for engagements or special occasions.",
        "short_description": "18K white gold diamond solitaire ring",
        "base_price": 45000,
        "msrp": 65000,
        "category": "Rings",
        "subcategory": "Diamond Rings",
        "material": "Diamond",
        "weight": 4.5,
        "primary_image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
        "stock_quantity": 15,
        "tags": ["diamond", "engagement", "luxury", "18k gold"]
    },
    {
        "name": "Gold Chain Necklace",
        "description": "Classic 22K gold chain necklace with intricate link design. A timeless piece that complements any outfit.",
        "short_description": "22K gold chain necklace",
        "base_price": 35000,
        "msrp": 48000,
        "category": "Necklaces",
        "subcategory": "Gold Chains",
        "material": "Gold",
        "weight": 12.0,
        "primary_image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
        "stock_quantity": 20,
        "tags": ["gold", "chain", "classic", "22k"]
    },
    {
        "name": "Pearl Drop Earrings",
        "description": "Elegant freshwater pearl drop earrings with sterling silver hooks. Perfect for both casual and formal occasions.",
        "short_description": "Freshwater pearl drop earrings",
        "base_price": 8500,
        "msrp": 12000,
        "category": "Earrings",
        "subcategory": "Pearl Earrings",
        "material": "Pearl",
        "weight": 2.5,
        "primary_image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800",
        "stock_quantity": 30,
        "tags": ["pearl", "sterling silver", "elegant", "drop earrings"]
    },
    {
        "name": "Ruby Tennis Bracelet",
        "description": "Stunning tennis bracelet featuring natural rubies set in 14K yellow gold. A statement piece for special occasions.",
        "short_description": "14K gold ruby tennis bracelet",
        "base_price": 52000,
        "msrp": 72000,
        "category": "Bracelets",
        "subcategory": "Gemstone Bracelets",
        "material": "Ruby",
        "weight": 8.0,
        "primary_image": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800",
        "stock_quantity": 8,
        "tags": ["ruby", "tennis bracelet", "luxury", "14k gold"]
    },
    {
        "name": "Sapphire Pendant",
        "description": "Beautiful blue sapphire pendant in 18K white gold setting with diamond halo. Comes with matching chain.",
        "short_description": "Blue sapphire pendant with diamond halo",
        "base_price": 28000,
        "msrp": 40000,
        "category": "Pendants",
        "subcategory": "Gemstone Pendants",
        "material": "Sapphire",
        "weight": 3.2,
        "primary_image": "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800",
        "stock_quantity": 12,
        "tags": ["sapphire", "pendant", "diamond", "18k gold"]
    },
    {
        "name": "Gold Jhumka Earrings",
        "description": "Traditional Indian jhumka earrings crafted in 22K gold with intricate temple design and pearl drops.",
        "short_description": "Traditional 22K gold jhumka earrings",
        "base_price": 42000,
        "msrp": 58000,
        "category": "Earrings",
        "subcategory": "Traditional",
        "material": "Gold",
        "weight": 15.0,
        "primary_image": "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800",
        "stock_quantity": 10,
        "tags": ["jhumka", "traditional", "indian", "22k gold", "temple"]
    },
    {
        "name": "Diamond Stud Earrings",
        "description": "Classic diamond stud earrings featuring 0.5 carat each VVS clarity diamonds in platinum settings.",
        "short_description": "1 carat total diamond studs",
        "base_price": 85000,
        "msrp": 120000,
        "category": "Earrings",
        "subcategory": "Diamond Earrings",
        "material": "Diamond",
        "weight": 2.0,
        "primary_image": "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800",
        "stock_quantity": 6,
        "tags": ["diamond", "studs", "platinum", "luxury"]
    },
    {
        "name": "Kundan Choker Set",
        "description": "Exquisite Kundan choker necklace set with matching earrings. Features Meenakari work on the reverse side.",
        "short_description": "Traditional Kundan choker with earrings",
        "base_price": 65000,
        "msrp": 90000,
        "category": "Sets",
        "subcategory": "Bridal Sets",
        "material": "Kundan",
        "weight": 85.0,
        "primary_image": "https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=800",
        "stock_quantity": 5,
        "tags": ["kundan", "bridal", "traditional", "choker", "meenakari"]
    },
    {
        "name": "Silver Anklet Pair",
        "description": "Delicate sterling silver anklets with tiny bells. Adjustable size fits most.",
        "short_description": "Sterling silver anklets with bells",
        "base_price": 3500,
        "msrp": 5000,
        "category": "Anklets",
        "subcategory": "Silver Anklets",
        "material": "Silver",
        "weight": 25.0,
        "primary_image": "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800",
        "stock_quantity": 40,
        "tags": ["silver", "anklet", "bells", "adjustable"]
    },
    {
        "name": "Emerald Cocktail Ring",
        "description": "Statement emerald cocktail ring with a 3-carat natural emerald surrounded by brilliant diamonds.",
        "short_description": "3 carat emerald cocktail ring",
        "base_price": 95000,
        "msrp": 140000,
        "category": "Rings",
        "subcategory": "Gemstone Rings",
        "material": "Emerald",
        "weight": 8.5,
        "primary_image": "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=800",
        "stock_quantity": 4,
        "tags": ["emerald", "cocktail ring", "luxury", "statement"]
    },
    {
        "name": "Rose Gold Bangle Set",
        "description": "Set of 4 rose gold bangles with delicate diamond-cut finish. Stackable and elegant.",
        "short_description": "Set of 4 rose gold bangles",
        "base_price": 28000,
        "msrp": 38000,
        "category": "Bangles",
        "subcategory": "Gold Bangles",
        "material": "Gold",
        "weight": 32.0,
        "primary_image": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800",
        "stock_quantity": 15,
        "tags": ["rose gold", "bangles", "stackable", "diamond cut"]
    },
    {
        "name": "Mangalsutra",
        "description": "Traditional black beads mangalsutra with 18K gold pendant featuring small diamonds.",
        "short_description": "Traditional mangalsutra with diamond pendant",
        "base_price": 22000,
        "msrp": 30000,
        "category": "Necklaces",
        "subcategory": "Mangalsutra",
        "material": "Gold",
        "weight": 8.0,
        "primary_image": "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800",
        "stock_quantity": 25,
        "tags": ["mangalsutra", "traditional", "bridal", "diamond", "black beads"]
    }
]


def seed_database():
    """Seed the database with sample data"""
    db = SessionLocal()
    
    try:
        # Initialize tables
        init_db()
        print("[OK] Database tables created")
        
        # Check if already seeded
        if db.query(User).first():
            print("⚠️ Database already has data, skipping seed")
            return
        
        # Create admin user
        admin_user = User(
            email="admin@jewelryplatform.com",
            hashed_password=get_password_hash("admin123"),
            role="admin",
            is_verified=True
        )
        db.add(admin_user)
        db.flush()
        print("[OK] Admin user created (admin@jewelryplatform.com / admin123)")
        
        # Create manufacturer user
        mfr_user = User(
            email="manufacturer@jewelrycrafts.com",
            hashed_password=get_password_hash("mfr123"),
            role="manufacturer",
            is_verified=True
        )
        db.add(mfr_user)
        db.flush()
        
        # Create manufacturer profile
        manufacturer = Manufacturer(
            user_id=mfr_user.id,
            company_name="Jewelry Crafts India",
            slug="jewelry-crafts-india",
            description="Premium jewelry manufacturer specializing in traditional and contemporary designs. Over 25 years of craftsmanship.",
            contact_email="orders@jewelrycrafts.com",
            contact_phone="+91 98765 43210",
            address="123 Jewelers Lane, Mumbai 400001, India",
            minimum_markup_percent=20.0
        )
        db.add(manufacturer)
        db.flush()
        print("[OK] Manufacturer created (manufacturer@jewelrycrafts.com / mfr123)")
        
        # Create products
        for i, product_data in enumerate(SAMPLE_PRODUCTS):
            sku = f"JCI-{product_data['category'][:3].upper()}-{1001 + i}"
            slug = slugify(product_data['name'])
            
            product = Product(
                manufacturer_id=manufacturer.id,
                name=product_data['name'],
                slug=slug,
                description=product_data['description'],
                short_description=product_data['short_description'],
                base_price=product_data['base_price'],
                msrp=product_data['msrp'],
                sku=sku,
                category=product_data['category'],
                subcategory=product_data.get('subcategory'),
                material=product_data['material'],
                weight=product_data['weight'],
                primary_image=product_data['primary_image'],
                images=[product_data['primary_image']],
                stock_quantity=product_data['stock_quantity'],
                tags=product_data['tags'],
                is_active=True,
                is_featured=random.choice([True, False])
            )
            db.add(product)
        
        db.flush()
        print(f"[OK] {len(SAMPLE_PRODUCTS)} products created")
        
        # Create demo reseller
        reseller_user = User(
            email="demo@mystore.com",
            hashed_password=get_password_hash("demo123"),
            role="reseller",
            is_verified=True
        )
        db.add(reseller_user)
        db.flush()
        
        reseller = Reseller(
            user_id=reseller_user.id,
            business_name="Sparkle Jewels",
            slug="sparkle-jewels",
            subdomain="sparkle-jewels",
            description="Curated collection of fine jewelry for every occasion. Quality pieces at great prices.",
            phone="+91 98765 00001",
            logo_url=None,
            primary_color="#8B5CF6",
            secondary_color="#EC4899",
            accent_color="#F59E0B",
            homepage_title="Welcome to Sparkle Jewels",
            homepage_tagline="Discover the perfect piece for every moment",
            is_onboarded=True,
            is_published=True
        )
        db.add(reseller)
        db.flush()
        
        # Create storefront config
        storefront_config = StorefrontConfig(
            reseller_id=reseller.id,
            theme="elegant",
            hero_title="Shine Bright with Sparkle Jewels",
            hero_subtitle="Handpicked jewelry collection for the modern you",
            hero_cta_text="Shop Collection"
        )
        db.add(storefront_config)
        
        print("[OK] Demo reseller created (demo@mystore.com / demo123)")
        
        # Add some products to demo reseller
        from database.models import ResellerProduct
        products = db.query(Product).limit(8).all()
        
        for product in products:
            markup = random.uniform(0.25, 0.40)  # 25-40% markup
            retail_price = round(product.base_price * (1 + markup), -1)  # Round to nearest 10
            
            rp = ResellerProduct(
                reseller_id=reseller.id,
                product_id=product.id,
                retail_price=retail_price,
                compare_at_price=product.msrp,
                is_active=True,
                is_featured=product.is_featured
            )
            db.add(rp)
        
        print("[OK] Demo reseller products added")
        
        db.commit()
        print("\n[SUCCESS] Database seeded successfully!")
        print("\nLogin credentials:")
        print("   Admin: admin@jewelryplatform.com / admin123")
        print("   Manufacturer: manufacturer@jewelrycrafts.com / mfr123")
        print("   Demo Reseller: demo@mystore.com / demo123")
        print(f"\nDemo store: http://localhost:3000/store/sparkle-jewels")
        
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
