from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr
from decimal import Decimal

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class ItineraryBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime

class ItineraryCreate(ItineraryBase):
    user_id: str

class Itinerary(ItineraryBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class DestinationBase(BaseModel):
    name: str
    start_date: datetime
    end_date: datetime
    notes: Optional[str] = None
    images: Optional[List[str]] = None
    location: Dict[str, Any]
    order_index: int

class DestinationCreate(DestinationBase):
    itinerary_id: str

class Destination(DestinationBase):
    id: str
    itinerary_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class ExpenseBase(BaseModel):
    amount: Decimal
    currency: str
    category: str
    description: str
    date: datetime
    destination_id: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    itinerary_id: str

class Expense(ExpenseBase):
    id: str
    itinerary_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class TransportBase(BaseModel):
    type: str
    provider: str
    booking_reference: str
    departure: Dict[str, Any]
    arrival: Dict[str, Any]
    seats: Optional[List[str]] = None
    notes: Optional[str] = None

class TransportCreate(TransportBase):
    itinerary_id: str

class Transport(TransportBase):
    id: str
    itinerary_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class CollaboratorBase(BaseModel):
    role: str

class CollaboratorCreate(CollaboratorBase):
    itinerary_id: str
    user_id: str

class Collaborator(CollaboratorBase):
    itinerary_id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True