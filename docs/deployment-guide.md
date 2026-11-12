# Deployment & Production Operations Guide

## 1. Hosting Environment
- **Frontend**: Vercel (Next.js Edge / Serverless deployment).
- **Backend**: Railway / Docker container with Uvicorn.
- **Database**: Managed PostgreSQL.

### Railway Backend
- Set the Railway service root directory to `backend`.
- The service uses `backend/Dockerfile` and `backend/railway.json`; the image runs Python 3.11 and binds Uvicorn to `0.0.0.0:$PORT`.
- Add a Railway PostgreSQL service and set the backend's `DATABASE_URL` to its connection URL. Railway's local filesystem is ephemeral, so the default SQLite database is suitable only for local development or an explicitly persistent volume.
- Set `CORS_ORIGINS` to a JSON array containing the exact frontend origin(s), including the deployed Vercel URL.
- Set a unique, long random `SECRET_KEY` before exposing the service publicly.
- After deployment, verify `https://<backend-domain>/api/health`; this endpoint also checks the database connection.

### Vercel Frontend
- Set `NEXT_PUBLIC_API_URL` to `https://<backend-domain>/api` in the Vercel environment used to build the frontend.
- Keep the backend's `CORS_ORIGINS` aligned with the exact deployed frontend origin. The local API fallback is only for local development.
- Verify `https://<backend-domain>/api/health` before using the deployed frontend. Do not rely on demo fallback data as confirmation that the backend is connected.

## 2. Environment Variables
```env
# Backend
DATABASE_URL=sqlite:///./threatguard.db # or postgresql://user:pass@host/threatguard
GEMINI_API_KEY=your_gemini_api_key_here
ABUSEIPDB_API_KEY=your_abuseipdb_key_here
URLHAUS_API_KEY=your_urlhaus_key_here
SECRET_KEY=replace-with-a-long-random-secret
CORS_ORIGINS=["http://localhost:3000","https://threat-guard-ai-zeta.vercel.app"]

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 3. Quickstart Commands
```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements-railway.txt
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```
