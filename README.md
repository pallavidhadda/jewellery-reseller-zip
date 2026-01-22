# Jewelry Reseller Platform

A turnkey white-label eCommerce platform for jewelry resellers to create branded storefronts, curate products, and earn commissions.

## Features

- **Reseller Onboarding** - Simple signup with guided wizard
- **Product Curation** - Browse manufacturer catalog, select products, set custom prices
- **Branded Storefronts** - Custom themes, colors, logos, and domains
- **Order Management** - Automatic routing to manufacturers for fulfillment
- **Commission Tracking** - Real-time dashboard with payout management
- **Admin Dashboard** - Platform-wide management and analytics

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Setup

1. **Run the setup script:**
   ```bash
   setup.bat
   ```
   This will install all dependencies and seed the database.

2. **Start the backend:**
   ```bash
   start_backend.bat
   ```
   Backend runs at: http://localhost:8000

3. **Start the frontend (new terminal):**
   ```bash
   start_frontend.bat
   ```
   Frontend runs at: http://localhost:3000

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@jewelryplatform.com | admin123 |
| Manufacturer | manufacturer@jewelrycrafts.com | mfr123 |
| Demo Reseller | demo@mystore.com | demo123 |

Demo Store: http://localhost:3000/store/sparkle-jewels

## Project Structure

```
jewelry reseller/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── database/
│   │   ├── database.py      # DB connection
│   │   ├── models.py        # SQLAlchemy models
│   │   └── schemas.py       # Pydantic schemas
│   ├── routers/
│   │   ├── auth.py          # Authentication
│   │   ├── resellers.py     # Reseller management
│   │   ├── products.py      # Product catalog
│   │   ├── orders.py        # Order processing
│   │   ├── payouts.py       # Payout management
│   │   ├── storefronts.py   # Public storefront API
│   │   ├── manufacturers.py # Manufacturer API
│   │   └── admin.py         # Admin dashboard
│   └── seed_data.py         # Sample data seeder
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Landing page
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration
│   │   ├── dashboard/       # Reseller dashboard
│   │   └── store/[slug]/    # Dynamic storefronts
│   └── lib/
│       ├── api.ts           # API client
│       └── store.ts         # State management
│
├── setup.bat                # Setup script
├── start_backend.bat        # Backend starter
└── start_frontend.bat       # Frontend starter
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## Tech Stack

- **Backend**: Python FastAPI, SQLAlchemy, SQLite/PostgreSQL
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Auth**: JWT tokens
- **State**: Zustand

## User Flows

### Reseller Flow
1. Register → Onboarding Wizard → Add Products → Set Prices → Publish Store
2. Share store link → Customers order → Manufacturer ships → Earn commission

### Customer Flow
1. Visit reseller store → Browse products → Add to cart → Checkout
2. Order confirmed → Manufacturer fulfills → Delivered

### Manufacturer Flow
1. Login → Add products to catalog → Set base prices → Manage inventory
2. Receive orders → Fulfill & ship → Update status

## License

MIT
