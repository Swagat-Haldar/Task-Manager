# Team Task Manager - Backend (FastAPI)

This is the FastAPI backend service for the Team Task Manager. It handles authentication, RBAC, and data persistence via PostgreSQL.

## 🚀 Technical Highlights
- **FastAPI**: Modern, high-performance web framework.
- **SQLAlchemy 2.0**: Type-safe ORM for database interactions.
- **Alembic**: Database migration management.
- **JWT Auth**: Secure cookie-based authentication.
- **Pydantic v2**: Strict data validation.

## 🛠 Setup & Development

1. **Environment**:
   Copy `.env.example` to `.env` and fill in your database credentials.

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Migrations**:
   ```bash
   alembic upgrade head
   ```

4. **Run Server**:
   ```bash
   uvicorn app.main:app --reload
   ```

## 🧪 Testing
Run the test suite using pytest:
```bash
pytest
```

## 📚 API Docs
Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
