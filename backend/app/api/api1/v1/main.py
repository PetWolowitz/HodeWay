from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db

router = APIRouter()

@router.get("/health-check")
def check_database(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT version()"))
        version = result.scalar()
        return {
            "status": "connected",
            "database": "hodeway",
            "version": version
        }
    except Exception as e:
        return {
            "status": "error",
            "detail": str(e),
            "type": str(type(e))
        }