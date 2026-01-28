# Free Deployment Guide for the Jewelry Reseller Platform

This guide provides step-by-step instructions to deploy the frontend and backend of this application for free using Vercel and Render.

## Prerequisites

1.  **A GitHub Account**: You will need to fork this repository into your own GitHub account.
2.  **A Vercel Account**: Sign up for free at [vercel.com](https://vercel.com) using your GitHub account.
3.  **A Render Account**: Sign up for free at [render.com](https://render.com) using your GitHub account.

---

## Part 1: Deploying the Backend with Render

We will start with the backend because the frontend will need its URL to connect to the API.

### Step 1: Create a PostgreSQL Database on Render

1.  Log in to your Render dashboard and click **"New +"** -> **"PostgreSQL"**.
2.  Give your database a unique name (e.g., `jewelry-db`).
3.  Ensure the "Free" plan is selected.
4.  Click **"Create Database"**.
5.  Wait for the database to be created. Once it's ready, find the **"Connections"** section and copy the **"Internal Database URL"**. Keep this URL handy; we'll need it soon.

### Step 2: Deploy the FastAPI Backend on Render

1.  In your Render dashboard, click **"New +"** -> **"Web Service"**.
2.  Select **"Build and deploy from a Git repository"**.
3.  Connect your GitHub account and select your forked repository.
4.  Configure the service:
    *   **Name**: Give your service a unique name (e.g., `jewelry-backend`).
    *   **Root Directory**: `backend` (This tells Render to look inside the `backend` folder).
    *   **Environment**: `Python 3`
    *   **Region**: Choose a region near you.
    *   **Branch**: `main` (or your default branch).
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
    *   **Instance Type**: `Free`

5.  Click **"Advanced Settings"** to add environment variables.
    *   Click **"+ Add Environment Variable"**.
    *   **Key**: `DATABASE_URL`
    *   **Value**: Paste the **Internal Database URL** you copied from your PostgreSQL database in Step 1.

6.  Click **"Create Web Service"**. Render will now build and deploy your backend. This may take a few minutes.
7.  Once deployed, Render will provide you with the public URL for your backend (e.g., `https://jewelry-backend.onrender.com`). Copy this URL.

---

## Part 2: Deploying the Frontend with Vercel

### Step 1: Create a New Project on Vercel

1.  Log in to your Vercel dashboard and click **"Add New..."** -> **"Project"**.
2.  Select your forked GitHub repository. Vercel will automatically detect that it's a Next.js project.

### Step 2: Configure the Project

1.  Vercel will pre-fill most settings correctly. Expand the **"Environment Variables"** section.
2.  Add the following environment variable:
    *   **Name**: `NEXT_PUBLIC_API_URL`
    *   **Value**: Paste the URL of your **deployed Render backend** from Part 1, Step 7 (e.g., `https://jewelry-backend.onrender.com/api`). **Note:** Make sure to include the `/api` suffix if not already present.

3.  Click **"Deploy"**.

### Step 3: Automatic Database Seeding

The backend is configured to automatically seed the database on its first launch. You do **not** need to manually run any seed scripts.
1.  Once the backend is deployed on Render, it will initialize the database tables and populate them with sample jewelry, an admin account, and a demo reseller account.
2.  You can verify this by checking the logs of your Render Web Service. You should see `[OK] Auto-seeding check complete`.

### Step 4: Finalize Frontend Deployment

1.  Vercel will build and deploy your frontend. This is usually very fast.

---

## Conclusion

Once Vercel finishes, it will provide you with a public URL for your frontend. You can now visit this URL to use your fully deployed Jewelry Reseller Platform for free!

**Note**: Free services like Render may "spin down" your backend server after a period of inactivity. The first request after it has spun down may be slow, but subsequent requests will be fast. This is normal for free-tier hosting.
