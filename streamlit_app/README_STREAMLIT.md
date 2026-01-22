# JewelryHub Streamlit Edition

This is a monolithic version of the Jewelry Reseller Platform built with Streamlit.

## Features Managed
- **Unified Auth**: Login with existing credentials.
- **Admin Dashboard**: Platform-wide monitoring.
- **Reseller Dashboard**: Statistics, product view, and orders.
- **Storefront**: Browse products from any published store.

## How to Run

1. **Activate Environment**:
   ```bash
   source venv_mac/bin/activate
   ```

2. **Run App**:
   ```bash
   streamlit run streamlit_app/app.py
   ```

3. **Access**:
   The app will be available at [http://localhost:8501](http://localhost:8501)

## Tech Stack
- **Frontend/Backend**: Streamlit
- **Database**: SQLAlchemy + SQLite (Reuses existing `jewelry_reseller.db`)
- **Styling**: Custom CSS + `streamlit-antd-components`
