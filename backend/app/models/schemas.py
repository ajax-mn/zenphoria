from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class BookingCreate(BaseModel):
    name: str = Field(..., min_length=2, example="Julian Hayes")
    email: EmailStr = Field(..., example="julian@example.com")
    focus_area: str = Field(default="Stress & Anxiety", example="Stress & Anxiety")
    cadence: Optional[str] = Field(default="Bi-Weekly Modular Cadence", example="Bi-Weekly Modular Cadence")
    notes: Optional[str] = Field(default="", example="Interested in executive coaching")

class BookingResponse(BaseModel):
    id: str
    name: str
    email: str
    focus_area: str
    cadence: Optional[str] = "Bi-Weekly Modular Cadence"
    notes: Optional[str] = ""
    status: str = "confirmed"
    created_at: datetime

class PillarTag(BaseModel):
    title: str
    desc: str

class Pillar(BaseModel):
    id: str
    title: str
    subtitle: str
    icon: str
    tags: List[PillarTag]

class Article(BaseModel):
    id: str
    title: str
    category: str
    topic: str
    readTime: str
    author: str
    image: str
    excerpt: str
    content: str
