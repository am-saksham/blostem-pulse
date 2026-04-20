from celery import Celery
import os

from .services.intent import calculate_and_update_intent

REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6380/0")

celery_app = Celery(
    "marketing_engine",
    broker=REDIS_URL,
    backend=REDIS_URL
)

celery_app.conf.task_routes = {
    "app.worker.recalculate_intent": "main-queue"
}

@celery_app.task
def recalculate_intent(lead_id: int):
    """
    Background task to recalculate the time-decay intent score
    using the mathematical matrix defined in our algorithm.
    """
    print(f"Celery: Recalculating intent for lead_id={lead_id}")
    calculate_and_update_intent(lead_id)
