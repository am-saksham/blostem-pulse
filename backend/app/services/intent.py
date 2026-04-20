import math
import datetime
from sqlmodel import Session
from ..db import engine
from ..models import Lead, MarketSignal

# decay constant (lambda). e.g., 0.05 means ~5% decay per day.
LAMBDA_DECAY = 0.05
# multipliers
ALPHA = 1.0

def calculate_time_decay_score(signals: list[MarketSignal]) -> float:
    """
    Implements the strict time-decay intent algorithm.
    Score = alpha * SUM( w_i * s_i * e^(-lambda * t_i) )
    We apply the decay formula to each signal individually to evaluate historical context.
    """
    total_score = 0.0
    now = datetime.datetime.utcnow()
    
    for signal in signals:
        # t = time elapsed in days
        delta = now - signal.created_at
        t = delta.total_seconds() / 86400.0  # seconds in a day
        if t < 0: t = 0
        
        # w_i * s_i
        base_value = signal.weight * signal.value
        
        # exponentially decayed value
        decayed_value = ALPHA * base_value * math.exp(-LAMBDA_DECAY * t)
        total_score += decayed_value
        
    return total_score

def calculate_and_update_intent(lead_id: int):
    with Session(engine) as session:
        lead = session.get(Lead, lead_id)
        if not lead:
            print(f"Lead {lead_id} not found.")
            return
            
        signals = session.query(MarketSignal).filter(MarketSignal.lead_id == lead_id).all()
        new_score = calculate_time_decay_score(signals)
        
        lead.intent_score = new_score
        session.commit()
        print(f"Updated lead {lead_id} intent score to {new_score:.2f}")
