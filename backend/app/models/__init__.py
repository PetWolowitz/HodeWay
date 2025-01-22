from sqlalchemy import Column, ForeignKey, String, DateTime, Text, Numeric, Integer, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from services.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    itineraries = relationship("Itinerary", back_populates="user")
    collaborations = relationship("Collaborator", back_populates="user")

class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="itineraries")
    destinations = relationship("Destination", back_populates="itinerary", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="itinerary", cascade="all, delete-orphan")
    transports = relationship("Transport", back_populates="itinerary", cascade="all, delete-orphan")
    collaborators = relationship("Collaborator", back_populates="itinerary", cascade="all, delete-orphan")

class Destination(Base):
    __tablename__ = "destinations"

    id = Column(String, primary_key=True, default=generate_uuid)
    itinerary_id = Column(String, ForeignKey("itineraries.id"), nullable=False)
    name = Column(String, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    notes = Column(Text)
    images = Column(JSON)
    location = Column(JSON, nullable=False)
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    itinerary = relationship("Itinerary", back_populates="destinations")
    expenses = relationship("Expense", back_populates="destination")

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(String, primary_key=True, default=generate_uuid)
    itinerary_id = Column(String, ForeignKey("itineraries.id"), nullable=False)
    destination_id = Column(String, ForeignKey("destinations.id"))
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), nullable=False)
    category = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    date = Column(DateTime, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    itinerary = relationship("Itinerary", back_populates="expenses")
    destination = relationship("Destination", back_populates="expenses")

class Transport(Base):
    __tablename__ = "transports"

    id = Column(String, primary_key=True, default=generate_uuid)
    itinerary_id = Column(String, ForeignKey("itineraries.id"), nullable=False)
    type = Column(String(50), nullable=False)
    provider = Column(String, nullable=False)
    booking_reference = Column(String, nullable=False)
    departure = Column(JSON, nullable=False)
    arrival = Column(JSON, nullable=False)
    seats = Column(JSON)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    itinerary = relationship("Itinerary", back_populates="transports")

class Collaborator(Base):
    __tablename__ = "collaborators"

    itinerary_id = Column(String, ForeignKey("itineraries.id"), primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), primary_key=True)
    role = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    itinerary = relationship("Itinerary", back_populates="collaborators")
    user = relationship("User", back_populates="collaborations")