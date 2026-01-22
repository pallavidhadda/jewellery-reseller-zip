import streamlit as st
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from database.database import SessionLocal
from database.models import User, Reseller, Product, ResellerProduct, Order
from sqlalchemy import func

def show_reseller_dashboard():
    if not st.session_state.get('user') or st.session_state.get('role') != 'reseller':
        st.warning("Please login as a Reseller to access this page")
        return

    db = SessionLocal()
    user = st.session_state.user
    reseller = db.query(Reseller).filter(Reseller.user_id == user.id).first()
    
    if not reseller:
        st.error("Reseller profile not found")
        return

    st.title(f"🚀 {reseller.business_name} Dashboard")
    
    # Stats
    col1, col2, col3, col4 = st.columns(4)
    
    # Total Revenue (simulated from delivered orders)
    revenue = db.query(func.sum(Order.total_amount)).filter(Order.reseller_id == reseller.id, Order.status == 'delivered').scalar() or 0
    commission = db.query(func.sum(Order.reseller_commission)).filter(Order.reseller_id == reseller.id, Order.status == 'delivered').scalar() or 0
    order_count = db.query(Order).filter(Order.reseller_id == reseller.id).count()
    product_count = db.query(ResellerProduct).filter(ResellerProduct.reseller_id == reseller.id).count()
    
    with col1:
        st.metric("Total Revenue", f"₹{revenue:,}")
    with col2:
        st.metric("Total Orders", order_count)
    with col3:
        st.metric("Commission Earned", f"₹{commission:,}")
    with col4:
        st.metric("Active Products", product_count)

    # Tabs for different sections
    tab1, tab2, tab3 = st.tabs(["🛒 My Products", "📦 Orders", "💳 Payouts"])
    
    with tab1:
        st.subheader("Manage Your Catalog")
        my_products = db.query(ResellerProduct).join(Product).filter(ResellerProduct.reseller_id == reseller.id).all()
        
        if not my_products:
            st.info("You haven't added any products yet.")
        else:
            for item in my_products:
                with st.container():
                    c1, c2, c3 = st.columns([1, 2, 1])
                    with c1:
                        st.image(item.product.primary_image or "https://via.placeholder.com/150", width=100)
                    with c2:
                        st.write(f"**{item.product.name}**")
                        st.write(f"Category: {item.product.category}")
                    with c3:
                        st.write(f"Price: ₹{item.retail_price:,}")
                        if st.button("Remove", key=f"rem_{item.id}"):
                            # Add remove logic here
                            pass
                    st.divider()

    with tab2:
        st.subheader("Recent Orders")
        orders = db.query(Order).filter(Order.reseller_id == reseller.id).order_by(Order.created_at.desc()).limit(10).all()
        if not orders:
            st.write("No orders found")
        else:
            st.table([{
                "Order #": o.order_number,
                "Customer": o.customer_name,
                "Status": o.status,
                "Amount": f"₹{o.total_amount:,}"
            } for o in orders])

    with tab3:
        st.subheader("Payout Requests")
        st.write("Current Available Balance: ₹0")
        st.button("Request Payout", disabled=True)

    db.close()

if __name__ == "__main__":
    show_reseller_dashboard()
