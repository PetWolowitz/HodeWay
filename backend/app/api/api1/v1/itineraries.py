from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.auth import get_current_user
from app.database import get_db
from app.models import Itinerary
from app.schemas import ItineraryCreate
from app.models import User # Assicura la relazione tra utente e itinerario

router = APIRouter()


#Crea rotta itinerario
@router.post("/", response_model=ItineraryCreate)
def create_itinerary(
    itinerary: ItineraryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Creazione di un nuovo itinerario
    new_itinerary = Itinerary(
        user_id=current_user.id,
        title=itinerary.title,
        description=itinerary.description,
        start_date=itinerary.start_date,
        end_date=itinerary.end_date,
    )
    db.add(new_itinerary)
    db.commit()
    db.refresh(new_itinerary)
    return new_itinerary


#leggi tutti gli itinerari dell'utente
@router.get("/", response_model=List[ItineraryCreate])
def get_itineraries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    itineraries = db.query(Itinerary).filter(Itinerary.user_id == current_user.id).all()
    return itineraries


#Ottieni in singolo itinerario
@router.get("/{itinerary_id}", response_model=ItineraryCreate)
def get_itinerary(
    itinerary_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    itinerary = db.query(Itinerary).filter(Itinerary.id == itinerary_id).first()
    if itinerary is None:
        raise HTTPException(status_code=404, detail="Itinerario non trovato")
    return itinerary


#Aggiorna un itinerario
@router.put("/{itinerary_id}", response_model=ItineraryCreate)
def update_itinerary(
    itinerary_id: str,
    itinerary_data: ItineraryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    itinerary = db.query(Itinerary).filter(
        Itinerary.id == itinerary_id, Itinerary.user_id == current_user.id
    ).first()
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerario non trovato")
    
    # Aggiorna i campi dell'itinerario
    itinerary.title = itinerary_data.title
    itinerary.description = itinerary_data.description
    itinerary.start_date = itinerary_data.start_date
    itinerary.end_date = itinerary_data.end_date

    db.commit()
    db.refresh(itinerary)
    return itinerary


# Elimina un itinerario
@router.delete("/{itinerary_id}")
def delete_itinerary(
    itinerary_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    itinerary = db.query(Itinerary).filter(
        Itinerary.id == itinerary_id, Itinerary.user_id == current_user.id
    ).first()
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerario non trovato")

    db.delete(itinerary)
    db.commit()
    return {"detail": "Itinerario eliminato con successo"}