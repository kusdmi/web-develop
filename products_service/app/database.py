import os

from dotenv import find_dotenv, load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv(find_dotenv(usecwd=True))

PRODUCTS_DATABASE_URL = os.getenv(
    "PRODUCTS_DATABASE_URL",
    "postgresql+psycopg2://postgres:postgres@localhost:5432/products_db",
)

engine = create_engine(PRODUCTS_DATABASE_URL, future=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
