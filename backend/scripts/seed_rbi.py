import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db import engine, init_db
from app.models import ComplianceVector
from app.services.rag import get_embedding
from sqlmodel import Session

MOCK_RBI_GUIDELINES = [
    "Digital Lending Guidelines: Marketing materials must explicitly state the Annual Percentage Rate (APR) to borrowers before any loan agreement.",
    "Data Privacy Framework: Financial entities cannot share consumer data with third-party marketing agencies without explicit, granular consent.",
    "Data Localization: All payment system data and transactional marketing data must be stored exclusively on servers located within India.",
    "Misleading Advertisements: Any promotional email claiming 'instant approval' or 'guaranteed returns' is an immediate violation of RBI fair practices code.",
    "Communication Limits: Promotional calls and outreach sequences must not be executed between 8:00 PM and 8:00 AM IST to respect borrower privacy."
]

def seed_rbi_guidelines():
    print("Seeding RBI Mock Guidelines Constraints into Vector Database...")
    init_db()

    with Session(engine) as session:
        # Check if already seeded
        existing = session.query(ComplianceVector).count()
        if existing > 0:
            print(f"Database already contains {existing} compliance vectors. Skipping seed.")
            return

        for rule in MOCK_RBI_GUIDELINES:
            embedding = get_embedding(rule)
            # using 768 length array for Gemini embedding models
            vector_record = ComplianceVector(rule_text=rule, embedding=embedding)
            session.add(vector_record)

        session.commit()
        print("Successfully embedded and stored RBI guidelines!")

if __name__ == "__main__":
    seed_rbi_guidelines()
