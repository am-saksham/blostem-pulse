from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
from sqlalchemy import Column
from pgvector.sqlalchemy import Vector
import datetime

class UserBase(SQLModel):
    username: str = Field(unique=True, index=True)
    role: str = Field(default="analyst")

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str

class LeadBase(SQLModel):
    name: str
    company: str
    email: str
    intent_score: float = Field(default=0.0)

class Lead(LeadBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

    signals: List["MarketSignal"] = Relationship(back_populates="lead")
    sequences: List["OutreachSequence"] = Relationship(back_populates="lead")

class MarketSignalBase(SQLModel):
    signal_type: str  # e.g., 'series_b_funding', 'viewed_pricing_page'
    weight: float
    value: float
    lead_id: int = Field(foreign_key="lead.id")

class MarketSignal(MarketSignalBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

    lead: "Lead" = Relationship(back_populates="signals")

class OutreachSequence(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    lead_id: int = Field(foreign_key="lead.id")
    generated_text: str
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

    lead: "Lead" = Relationship(back_populates="sequences")

class ComplianceVector(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    rule_text: str
    # 768 dimensions is common/default for text-embedding-004
    embedding: List[float] = Field(sa_column=Column(Vector(768)))
