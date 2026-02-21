from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from dependencies.auth import get_current_active_user
from db import get_session
from models import User

router = APIRouter()

@router.get("/test-auth")
async def test_auth(current_user: User = Depends(get_current_active_user)):
    return {"message": "Auth works!", "user": current_user.username}

if __name__ == "__main__":
    import uvicorn
    from fastapi import FastAPI

    app = FastAPI()
    app.include_router(router, prefix="/api")

    uvicorn.run(app, host="0.0.0.0", port=8002)