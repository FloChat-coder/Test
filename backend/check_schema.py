import psycopg2
import os
from dotenv import load_dotenv

load_dotenv('d:/FloChat/Test/FloChat.env')
url = os.getenv('DATABASE_URL')
conn = psycopg2.connect(url)
cur = conn.cursor()
cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'leads';")
print("LEADS TABLE:")
for row in cur.fetchall():
    print(row)

cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'lead_activities';")
print("\nLEAD_ACTIVITIES TABLE:")
for row in cur.fetchall():
    print(row)
