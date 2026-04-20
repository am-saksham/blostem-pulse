from sqlmodel import SQLModel, create_engine, Session, text
import os

DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://user:password@localhost:5433/engine_db")

engine = create_engine(DATABASE_URL)

def init_db():
    from .models import Lead, MarketSignal, OutreachSequence, ComplianceVector
    
    # Must enable pgvector extension before creating vector tables
    with Session(engine) as session:
        session.exec(text("CREATE EXTENSION IF NOT EXISTS vector"))
        session.commit()
        
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
