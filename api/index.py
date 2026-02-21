from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, tasks
from db import engine

# Create database tables
from models import BaseSQLModel
BaseSQLModel.metadata.create_all(bind=engine)

app = FastAPI(
    title="Todo API",
    description="Backend API for Todo App",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (Local, Vercel, etc.)
    allow_credentials=False,  # Set to False to allow "*" wildcard (standard for Bearer tokens)
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])

@app.get("/")
async def root():
    return {"message": "Hello from the RELOADED Server!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}