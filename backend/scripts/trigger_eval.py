import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db import engine
from sqlmodel import Session
from app.models import Lead
from app.worker import recalculate_intent
from app.services.rag import generate_compliant_sequence

def run_eval():
    from sqlmodel import select
    with Session(engine) as session:
        leads = session.exec(select(Lead)).all()
        # 1. Trigger celery tasks synchronously to bypass any dead Redis workers
        for lead in leads:
            recalculate_intent(lead.id)
            
        print(f"Successfully executed {len(leads)} mathematical decay calculations natively.")
        
        # 2. Strict JIT Enforcement: DO NOT precompute vectors. Wait for UI triggers.
        print("Math complete. JIT Architecture is active. Waiting for dashboard clicks to launch RAG vectors...")

if __name__ == "__main__":
    run_eval()
