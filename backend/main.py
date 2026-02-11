import os
import sys

# Add root directory to sys.path to support 'backend.' imports
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.routes.api import router as api_router
from backend.database.database import init_db

app = FastAPI(title="AI Blog Generation Agent", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    print("Starting AI Blog Generation Agent...")
    try:
        print("Checking database connection...")
        init_db()
        print("Database initialized successfully!")
    except Exception as e:
        print(f"DATABASE ERROR ON STARTUP: {str(e)}")
        print("Continuing without DB for now (Frontend should still load)...")
    print("Backend is ready and listening on port 8000")


# Include API routes
app.include_router(api_router, prefix="/api", tags=["API"])

# Serve static files
app.mount(
    "/static",
    StaticFiles(directory=os.path.join(BASE_DIR, "frontend", "public", "static")),
    name="static",
)


# Serve frontend
@app.get("/")
async def read_root():
    return FileResponse(os.path.join(BASE_DIR, "frontend_backup", "index.html"))


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
