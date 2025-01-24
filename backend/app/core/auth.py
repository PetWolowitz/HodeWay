from fastapi import Depends
from fastapi.security import OAuthPasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.models import User 
from app.database import get_db
from app.config.settings import settings

oauth2_scheme = OAuthPasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db))-> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=400, detail="Token non valido")
    except JWTError:
        raiseHTTPException(status_code=400, detail="Token non valido") 


    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=400, detail="Utente non trovato")
    return user   