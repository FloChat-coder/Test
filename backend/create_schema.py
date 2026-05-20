import psycopg2
import os
from dotenv import load_dotenv

load_dotenv('d:/FloChat/Test/FloChat.env')
url = os.getenv('DATABASE_URL')
conn = psycopg2.connect(url)
cur = conn.cursor()

try:
    # Check if leads table exists, create if not
    cur.execute("""
        CREATE TABLE IF NOT EXISTS leads (
            id SERIAL PRIMARY KEY,
            client_id VARCHAR,
            session_id VARCHAR,
            email VARCHAR,
            name VARCHAR,
            phone VARCHAR,
            title VARCHAR,
            location VARCHAR,
            source VARCHAR,
            source_detail VARCHAR,
            status VARCHAR DEFAULT 'New',
            avatar_url VARCHAR,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # Try adding columns to leads just in case it already existed without them
    new_columns = [
        ("name", "VARCHAR"),
        ("phone", "VARCHAR"),
        ("title", "VARCHAR"),
        ("location", "VARCHAR"),
        ("source", "VARCHAR"),
        ("source_detail", "VARCHAR"),
        ("status", "VARCHAR DEFAULT 'New'"),
        ("avatar_url", "VARCHAR")
    ]
    
    for col_name, col_type in new_columns:
        try:
            cur.execute(f"ALTER TABLE leads ADD COLUMN IF NOT EXISTS {col_name} {col_type};")
        except Exception as e:
            conn.rollback() # rollback failed alter
            pass # ignore if exists

    # Create lead_activities table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS lead_activities (
            id SERIAL PRIMARY KEY,
            lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
            message VARCHAR,
            is_recent BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # Clients columns for Settings
    client_new_columns = [
        ("name", "VARCHAR"),
        ("email", "VARCHAR"),
        ("password_hash", "VARCHAR")
    ]
    for col_name, col_type in client_new_columns:
        try:
            cur.execute(f"ALTER TABLE clients ADD COLUMN IF NOT EXISTS {col_name} {col_type};")
            conn.commit()
        except Exception as e:
            conn.rollback()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS chatbots (
            id SERIAL PRIMARY KEY,
            client_id VARCHAR,
            name VARCHAR,
            theme_color VARCHAR DEFAULT 'indigo',
            icon_url VARCHAR,
            status VARCHAR DEFAULT 'Draft',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS billing_details (
            client_id VARCHAR PRIMARY KEY,
            plan_name VARCHAR DEFAULT 'Free Plan',
            price NUMERIC DEFAULT 0,
            card_brand VARCHAR,
            card_last4 VARCHAR(4),
            card_exp_month VARCHAR(2),
            card_exp_year VARCHAR(4),
            auto_renew BOOLEAN DEFAULT FALSE
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS invoices (
            id SERIAL PRIMARY KEY,
            client_id VARCHAR,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            description VARCHAR,
            amount NUMERIC,
            status VARCHAR,
            invoice_url VARCHAR
        );
    """)

    conn.commit()
    print("Schema updated successfully.")
except Exception as e:
    conn.rollback()
    print("Failed to update schema:", e)
finally:
    cur.close()
    conn.close()
