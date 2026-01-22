import streamlit as st
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from database.database import SessionLocal
from database.models import User, Reseller, Order, Product
from sqlalchemy import func

def show_admin_panel():
    if not st.session_state.get('user') or st.session_state.get('role') != 'admin':
        st.warning("Admin Access Required")
        return

    st.title("🛡️ Platform Admin Panel")
    
    db = SessionLocal()
    
    # Platform Stats
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Total Resellers", db.query(Reseller).count())
    c2.metric("Total Orders", db.query(Order).count())
    c3.metric("Platform Revenue", f"₹{db.query(func.sum(Order.total_amount)).scalar() or 0:,}")
    c4.metric("Manufacturers", 1) # Static for now
    
    # Reseller Management
    st.subheader("Manage Resellers")
    resellers = db.query(Reseller).all()
    
    for r in resellers:
        with st.expander(f"{r.business_name} ({r.slug})"):
            st.write(f"Owner Email: {r.user.email}")
            st.write(f"Published: {'✅' if r.is_published else '❌'}")
            if st.button("Delete Reseller", key=f"del_{r.id}"):
                st.error("Deletion not implemented in prototype")
                
    # Catalog Management
    st.subheader("Global Product Catalog")
    products = db.query(Product).all()
    st.dataframe([{
        "Name": p.name,
        "Base Price": p.base_price,
        "Stock": p.stock_quantity,
        "Active": p.is_active
    } for p in products])

    db.close()

if __name__ == "__main__":
    show_admin_panel()
