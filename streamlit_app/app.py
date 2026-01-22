import streamlit as st
import sys
import os

# Add backend to path so we can import models and database
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from database.database import SessionLocal
from database.models import User, Reseller
from routers.auth import verify_password

# Page Config
st.set_page_config(
    page_title="JewelryHub | Streamlit",
    page_icon="💎",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom CSS for Premium Look
st.markdown("""
<style>
    /* Main App Background */
    .stApp {
        background: linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%);
    }
    
    /* Custom Card */
    .jewelry-card {
        padding: 1.5rem;
        border-radius: 1rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(12px);
        margin-bottom: 1rem;
        transition: transform 0.2s ease;
    }
    
    .jewelry-card:hover {
        transform: translateY(-5px);
        border-color: rgba(139, 92, 246, 0.4);
    }
    
    /* Gradient Text */
    .gradient-text {
        background: linear-gradient(90deg, #8B5CF6, #EC4899);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
        font-size: 3rem;
    }
    
    /* Button Styling */
    .stButton>button {
        border-radius: 0.5rem;
        background: linear-gradient(90deg, #8B5CF6, #EC4899);
        color: white;
        border: none;
        padding: 0.5rem 2rem;
        font-weight: 600;
    }
    
    /* Input Fields */
    .stTextInput>div>div>input {
        background: rgba(0, 0, 0, 0.2);
        color: white;
        border-color: rgba(255, 255, 255, 0.1);
    }
</style>
""", unsafe_allow_html=True)

# Session State Initialization
if 'user' not in st.session_state:
    st.session_state.user = None
if 'role' not in st.session_state:
    st.session_state.role = None

def login():
    st.markdown('<div class="jewelry-card">', unsafe_allow_html=True)
    st.subheader("Welcome Back")
    email = st.text_input("Email")
    password = st.text_input("Password", type="password")
    
    if st.button("Sign In"):
        db = SessionLocal()
        user = db.query(User).filter(User.email == email).first()
        if user and verify_password(password, user.hashed_password):
            st.session_state.user = user
            st.session_state.role = user.role
            st.success(f"Logged in as {user.role}")
            st.rerun()
        else:
            st.error("Invalid credentials")
        db.close()
    st.markdown('</div>', unsafe_allow_html=True)

def main():
    if not st.session_state.user:
        # Landing Page / Login
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.markdown('<p class="gradient-text">JewelryHub</p>', unsafe_allow_html=True)
            st.markdown("### Launch your jewelry business in minutes")
            st.write("Curate stunning jewelry from top manufacturers, set your own prices, and launch your branded online store. We handle inventory and shipping—you focus on selling.")
            
            st.image("https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800", use_column_width=True)
            
        with col2:
            login()
            
    else:
        # Dashboard Content
        st.sidebar.markdown(f"### Hello, {st.session_state.user.email}")
        st.sidebar.write(f"Role: **{st.session_state.role}**")
        
        if st.sidebar.button("Logout"):
            st.session_state.user = None
            st.session_state.role = None
            st.rerun()
            
        # Router based on role
        if st.session_state.role == "admin":
            st.title("Admin Dashboard")
        elif st.session_state.role == "reseller":
            st.title("Reseller Dashboard")
        elif st.session_state.role == "manufacturer":
            st.title("Manufacturer Portal")

if __name__ == "__main__":
    main()
