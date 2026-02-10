from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from datetime import datetime
from routers import auth, tasks
from db import engine
from middleware.error_handler import validation_exception_handler, http_exception_handler, general_exception_handler

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Import after loading env vars
from models import BaseSQLModel
from db import engine


# Create database tables and seed demo users
BaseSQLModel.metadata.create_all(bind=engine)
seed_demo_users()

app = FastAPI(
    title="Todo API",
    description="Backend API for Todo App",
    version="1.0.0"
)

# Add exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])

@app.get("/")
async def root():
    return {"message": "Welcome to Todo API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}