import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# We default to a postgres connection if DATABASE_URL is set, otherwise default to a local Postgres instance
# Format: postgresql://user:password@localhost/dbname
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@localhost:5432/hrms_lite"
)

# For SQLite fallback during rapid dev if Postgres is not accessible, uncomment the below, but requirement is Postgres.
# SQLALCHEMY_DATABASE_URL = "sqlite:///./hrms.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
# If using SQLite, we need connect_args={"check_same_thread": False}. For Postgres we don't.
# engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
