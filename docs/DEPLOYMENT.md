# Deployment Guide (Railway)

Follow these steps to deploy the full stack application to Railway.

## 1. Database Setup
1. Log in to [Railway.app](https://railway.app).
2. Click **New Project** -> **Provision PostgreSQL**.
3. Once created, go to the **Variables** tab of the database and copy the `DATABASE_URL`.

## 2. Backend Deployment
1. Click **New** -> **GitHub Repo** -> Select your repository.
2. Set the **Root Directory** to `backend`.
3. Add the following **Variables**:
   - `DATABASE_URL`: (Paste from step 1)
   - `SECRET_KEY`: A long random string.
   - `PROJECT_NAME`: "Team Task Manager"
   - `API_V1_STR`: "/api/v1"
   - `BACKEND_CORS_ORIGINS`: `["https://your-frontend-url.up.railway.app"]`
4. Railway will automatically detect the `Dockerfile` and deploy.
5. Copy the generated **Backend URL** (e.g., `https://your-backend.up.railway.app`).

## 3. Frontend Deployment
1. Click **New** -> **GitHub Repo** -> Select your repository.
2. Set the **Root Directory** to `frontend`.
3. Add the following **Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend.up.railway.app/api/v1`
4. Railway will build the Next.js app using the `Dockerfile`.

## 4. Initialization
Once deployed, you need to seed the admin user:
1. Go to the Backend service in Railway.
2. Open the **Terminal** tab.
3. Run: `python app/db/seed.py`

## 5. Summary of URLs
- **Frontend**: `https://<frontend-slug>.up.railway.app`
- **Backend API**: `https://<backend-slug>.up.railway.app/api/v1`
- **Swagger Docs**: `https://<backend-slug>.up.railway.app/docs`
