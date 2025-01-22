from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from services.database import get_db
from config.settings import settings

router = APIRouter()

@router.get("/health-check")
def health_check(db: Session = Depends(get_db)):
    try:
        # Esegue una query semplice per verificare la connessione al database
        db.execute("SELECT 1")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}