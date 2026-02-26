import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
from dotenv import load_dotenv

load_dotenv()

# We connect to the default 'postgres' database to create our new database.

try:
    # Assuming credentials from .env, but default database is 'postgres'
    conn = psycopg2.connect(
        user="postgres",
        password="postgres",
        host="localhost",
        port="5432",
        dbname="postgres"
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    
    # Check if database exists
    cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'hrms_lite'")
    exists = cur.fetchone()
    if not exists:
        cur.execute("CREATE DATABASE hrms_lite")
        print("Database 'hrms_lite' created successfully.")
    else:
        print("Database 'hrms_lite' already exists.")
        
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error creating database: {e}")
