import streamlit as st
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from database.database import SessionLocal
from database.models import Reseller, Product, ResellerProduct

def show_storefront():
    st.markdown("""
    <style>
        .store-header {
            text-align: center;
            padding: 2rem;
            background: rgba(139, 92, 246, 0.1);
            border-radius: 20px;
            margin-bottom: 2rem;
        }
        .price-badge {
            background: #8B5CF6;
            color: white;
            padding: 2px 10px;
            border-radius: 10px;
            font-weight: bold;
        }
    </style>
    """, unsafe_allow_html=True)

    db = SessionLocal()
    
    # Simple selection for demo
    resellers = db.query(Reseller).filter(Reseller.is_published == True).all()
    
    if not resellers:
        st.warning("No published stores found")
        db.close()
        return

    selected_reseller = st.selectbox("Visit a Store", resellers, format_func=lambda r: r.business_name)
    
    if selected_reseller:
        st.markdown(f"""
        <div class="store-header">
            <h1 class="gradient-text">{selected_reseller.business_name}</h1>
            <p>{selected_reseller.description or 'Welcome to our premium jewelry collection'}</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Display Products
        products = db.query(ResellerProduct).join(Product).filter(ResellerProduct.reseller_id == selected_reseller.id).all()
        
        if not products:
            st.info("No products in this store yet")
        else:
            # Grid layout
            cols = st.columns(3)
            for idx, item in enumerate(products):
                with cols[idx % 3]:
                    st.markdown('<div class="jewelry-card">', unsafe_allow_html=True)
                    st.image(item.product.primary_image or "https://via.placeholder.com/300", use_column_width=True)
                    st.write(f"**{item.product.name}**")
                    st.markdown(f'<span class="price-badge">₹{item.retail_price:,}</span>', unsafe_allow_html=True)
                    if st.button("Add to Cart", key=f"cart_{idx}"):
                        st.toast(f"Added {item.product.name} to cart!")
                    st.markdown('</div>', unsafe_allow_html=True)

    db.close()

if __name__ == "__main__":
    show_storefront()
