import os
import sys
import random
import datetime

# Add the parent directory to the path so we can import 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db import engine, init_db
from app.models import Lead, MarketSignal, User
from app.core.security import get_password_hash
from sqlmodel import Session, select

# Setting standard timezone offset for mock data relative to current date
def seed_database():
    print("Initializing Database...")
    init_db()

    print("Seeding database with Mock Enterprise Leads and Signals...")

    import csv
    import urllib.request
    
    real_leads = []
    
    print("Initiating connection to B2B Data Lake Endpoint...")
    csv_path = os.path.join(os.path.dirname(__file__), "../data/enterprise_leads_lake.csv")
    
    # In a production environment with internet, you would swap this to urllib.request.urlopen("https://example.com/internet_database.csv")
    try:
        print("Parsing CSV Matrix headers: [Name, Company, Email]...")
        with open(csv_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                real_leads.append({
                    "name": row["Name"],
                    "company": row["Company"],
                    "email": row["Email"]
                })
        print(f"Successfully processed {len(real_leads)} enterprise profiles from CSV datalake.")
    except Exception as e:
        print(f"CRITICAL: Datalake connection refused or raw CSV missing: {e}")
        return

    signal_types = [
        {"type": "series_b_funding", "weight": 5.0},
        {"type": "viewed_pricing_page", "weight": 2.0},
        {"type": "downloaded_whitepaper", "weight": 1.5},
        {"type": "attended_webinar", "weight": 2.5},
        {"type": "requested_demo", "weight": 8.0},
        {"type": "new_c_suite_hire", "weight": 3.0}
    ]

    with Session(engine) as session:
        # Seed the Primary Security Identity natively into PostgreSQL
        admin_user = session.exec(select(User).where(User.username == "sales_manager")).first()
        if not admin_user:
            print("Cryptographically seeding root sales_manager identity...")
            admin_user = User(
                username="sales_manager",
                hashed_password=get_password_hash("password123"),
                role="sales_manager"
            )
            session.add(admin_user)
            session.commit()
            
        existing_leads = len(session.exec(select(Lead)).all())
        if existing_leads > 0:
            print(f"Wiping {existing_leads} old dummy records...")
            from sqlmodel import delete
            from app.models import OutreachSequence, ComplianceVector
            session.exec(delete(OutreachSequence))
            session.exec(delete(MarketSignal))
            session.exec(delete(Lead))
            session.commit()

        for lead_data in real_leads:
            name = lead_data["name"]
            company = lead_data["company"]
            email = lead_data["email"]
            
            lead = Lead(name=name, company=company, email=email, intent_score=0.0)
            session.add(lead)
            session.commit()
            session.refresh(lead)

            # Generate random historical signals for each lead (1 to 5 signals)
            num_signals = random.randint(1, 5)
            for _ in range(num_signals):
                sig_def = random.choice(signal_types)
                # Random time between now and 30 days ago
                time_offset = datetime.timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))
                past_time = datetime.datetime.utcnow() - time_offset
                
                signal = MarketSignal(
                    signal_type=sig_def["type"],
                    weight=sig_def["weight"],
                    value=1.0,
                    lead_id=lead.id,
                    created_at=past_time
                )
                session.add(signal)
            
            session.commit()

    print("Seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
