# Streamlit Deployment Guide

## Deploy to Streamlit Community Cloud

### Prerequisites
1. A GitHub account (you already have this!)
2. A Streamlit Community Cloud account (free at [share.streamlit.io](https://share.streamlit.io))

### Step-by-Step Deployment

#### 1. Sign Up for Streamlit Cloud
- Go to [share.streamlit.io](https://share.streamlit.io)
- Click "Sign up" and connect with your GitHub account
- Authorize Streamlit to access your repositories

#### 2. Deploy Your App
1. Click "New app" in Streamlit Cloud
2. Select your repository: `pallavidhadda/jewellery-reseller-zip`
3. Set the branch: `main`
4. Set the main file path: `streamlit_app/app.py`
5. Click "Deploy!"

#### 3. Important Notes

**Database Limitation**: Streamlit Cloud uses ephemeral storage, meaning:
- The SQLite database will reset every time the app restarts
- For production, you'd need to use a cloud database (PostgreSQL on Render/Supabase)

**For Demo Purposes**: The current setup will work fine for showing the app, but data won't persist between sessions.

### Alternative: Quick Demo Setup

If you just want to show the app temporarily:
1. Keep it running locally on your Mac
2. Use **ngrok** to create a public URL:
   ```bash
   # Install ngrok
   brew install ngrok
   
   # Create tunnel
   ngrok http 8501
   ```
3. Share the ngrok URL (e.g., `https://abc123.ngrok.io`)

This gives you an instant public URL without any deployment!

### Recommended for Production
For a real deployment with persistent data:
1. Deploy backend (FastAPI) to **Render** or **Railway**
2. Use **PostgreSQL** database (free tier on Render)
3. Deploy Streamlit app pointing to the hosted backend
