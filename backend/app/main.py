from fastapi import FastAPI, Depends, HTTPException, status
from contextlib import asynccontextmanager
from fastapi.security import OAuth2PasswordRequestForm
from .db import init_db, get_session
from fastapi.middleware.cors import CORSMiddleware
from .api import webhooks
from .core.security import create_access_token, verify_password
from .api.deps import get_current_user_role
from .models import Lead, OutreachSequence, User
from sqlmodel import Session, select

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    init_db()
    yield
    # Cleanup on shutdown if needed

app = FastAPI(title="B2B Marketing Automation Engine", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(webhooks.router, prefix="/api/webhooks", tags=["webhooks"])

@app.post("/api/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

@app.get("/api/leads")
def get_leads(session: Session = Depends(get_session), role: str = Depends(get_current_user_role)):
    leads = session.exec(select(Lead).order_by(Lead.intent_score.desc())).all()
    return leads

@app.get("/api/leads/{lead_id}/sequences")
def get_lead_sequences(lead_id: int, session: Session = Depends(get_session), role: str = Depends(get_current_user_role)):
    sequences = session.exec(select(OutreachSequence).where(OutreachSequence.lead_id == lead_id).order_by(OutreachSequence.created_at.desc())).all()
    
    if not sequences:
        # Just-In-Time Generation Architecture
        from .services.rag import generate_compliant_sequence
        try:
            generate_compliant_sequence(lead_id)
            sequences = session.exec(select(OutreachSequence).where(OutreachSequence.lead_id == lead_id).order_by(OutreachSequence.created_at.desc())).all()
        except Exception:
            pass
            
    return sequences

@app.get("/")
def read_root():
    return {"status": "Enterprise Automation Engine is Running"}
