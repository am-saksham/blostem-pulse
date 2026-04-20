from fastapi import APIRouter, Depends
from sqlmodel import Session
from ..db import get_session
from ..models import MarketSignal, MarketSignalBase
from ..worker import recalculate_intent

router = APIRouter()

@router.post("/signal", response_model=MarketSignal)
def receive_market_signal(signal_in: MarketSignalBase, session: Session = Depends(get_session)):
    """
    Simulated webhook endpoint.
    Receives a new signal, stores it synchronously, 
    then triggers the background worker to recalculate intent score.
    """
    signal = MarketSignal(**signal_in.dict())
    session.add(signal)
    session.commit()
    session.refresh(signal)
    
    # Offload heavy mathematical decay recalculation to Celery Redis Queue
    recalculate_intent.delay(signal.lead_id)
    
    return signal
