# Zenphoria Backend (Python + FastAPI)

FastAPI backend providing RESTful APIs for the **Zenphoria** Psychological Wellness & Clinical Education application.

---

## ⚡ Features
- **Interactive Documentation**: Swagger UI at `http://localhost:8000/docs` & Redoc at `http://localhost:8000/redoc`
- **CORS Enabled**: Configured for React frontend (`http://localhost:5173`)
- **Endpoints**:
  - `POST /api/waiting-list`: Register a client for priority intake
  - `GET /api/waiting-list`: List waiting list submissions
  - `POST /api/consultations`: Submit 3-step consultation assessment
  - `GET /api/consultations`: List consultation entries
  - `GET /api/pillars`: Five Pillars framework data
  - `GET /api/articles`: Journal articles with search & category filtering
  - `GET /api/articles/{id}`: Detailed article content

---

## 🚀 Setup & Execution

### 1. Activate Virtual Environment
```powershell
cd d:\zerophore\backend
.\venv\Scripts\Activate.ps1
```

### 2. Install Dependencies (if not already installed)
```powershell
pip install -r requirements.txt
```

### 3. Run the Backend Server
```powershell
python run.py
```
*Or directly with Uvicorn:*
```powershell
uvicorn app.main:app --reload --port 8000
```

---

## 📖 API Documentation
Once running, visit:
- **Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)
