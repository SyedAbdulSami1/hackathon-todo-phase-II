from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle FastAPI validation errors"""
    logger.error(f"Validation error: {exc.errors()}")

    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "message": "Validation failed",
                "details": exc.errors(),
                "timestamp": datetime.utcnow().isoformat()
            }
        },
    )

async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    logger.error(f"HTTP {exc.status_code}: {exc.detail}")

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "message": exc.detail,
                "status_code": exc.status_code,
                "timestamp": datetime.utcnow().isoformat()
            }
        },
    )

async def general_exception_handler(request: Request, exc: Exception):
    """Handle unhandled exceptions"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)

    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "message": "Internal server error",
                "status_code": 500,
                "timestamp": datetime.utcnow().isoformat()
            }
        },
    )