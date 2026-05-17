# Team Task Manager (Full Stack)

A production-grade, collaborative task management platform built with **FastAPI** and **Next.js**. Features project-level RBAC, real-time status updates, and a premium workspace-style UI.

## 🚀 Quick Links
- **Live Web Application**: [https://task-manager-alpha-ochre-63.vercel.app](https://task-manager-alpha-ochre-63.vercel.app)
- **Alternative Preview URLs**:
  - [Main Branch Build](https://task-manager-git-main-swagat-haldars-projects.vercel.app)
  - [Alternative Preview Build](https://task-manager-o6ayppwyu-swagat-haldars-projects.vercel.app)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [API Documentation](./docs/API.md)
- [Role-Based Access Control (RBAC)](./docs/RBAC.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)

## 🛠 Tech Stack
- **Backend**: FastAPI, SQLAlchemy 2.0, PostgreSQL, Alembic, Pydantic v2.
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, shadcn/ui, Axios.
- **Authentication**: JWT via HTTP-only Cookies.
- **Deployment**: Railway (Dockerized).

## 📦 Project Structure
- `/backend`: FastAPI service, database models, and API endpoints.
- `/frontend`: Next.js application, UI components, and API integration.
- `/docs`: Detailed technical documentation.

## 🏁 Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (Local or Railway)

### Backend Setup
1. `cd backend`
2. `python -m venv venv`
3. `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
4. `pip install -r requirements.txt`
5. Create `.env` from `.env.example`
6. `alembic upgrade head`
7. `python app/db/seed.py` (optional: seed demo data)
8. `uvicorn app.main:app --reload`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`
4. `npm run dev`

## 👥 Demo Credentials
- **Admin**: `admin@example.com` / `password123`
- **Member**: `member@example.com` / `password123`

## 📄 License
MIT
