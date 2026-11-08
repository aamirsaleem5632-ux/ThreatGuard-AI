# Deployment & Production Operations Guide

## 1. Hosting Environment
- **Frontend**: Vercel (Next.js Edge / Serverless deployment).
- **Backend**: Railway / Docker container with Uvicorn.
- **Database**: Managed PostgreSQL.

## 2. Environment Variables
```env
# Backend
DATABASE_URL=sqlite:///./threatguard.db # or postgresql://user:pass@host/threatguard
GEMINI_API_KEY=your_gemini_api_key_here
ABUSEIPDB_API_KEY=your_abuseipdb_key_here
URLHAUS_API_KEY=your_urlhaus_key_here
SECRET_KEY=threatguard-super-secret-key-change-in-prod
ENVIRONMENT=development
FRONTEND_URL=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 3. Quickstart Commands
```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```
