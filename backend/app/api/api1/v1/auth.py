from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, Token
from app.config.settings import settings

# Creazione del router
router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Funzioni di supporto per la gestione delle password
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str)-> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Funzione per la creazione del token di accesso
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(datetime.timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    to_encode.update({"sub": str(data["username"])})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

#Rotta per il registro di un nuovo utente
@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Controlla se l'utente esiste già
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email già registrata")
    
    # Crea il nuovo utente
    new_user = User(
        email=user.email,
        full_name=user.full_name,
        password_hash=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Crea il token di accesso
    access_token = create.access_token({"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}


#Rotta per il login di un utente
@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Credenziali non valide")

    # Crea il token di accesso
    access_token = create_access_token({"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}