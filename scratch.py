import psycopg2, os
from dotenv import load_dotenv
load_dotenv('d:/FloChat/Test/FloChat.env')
conn = psycopg2.connect(os.getenv('DATABASE_URL'))
cur = conn.cursor()
cur.execute("""
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    ORDER BY table_name, ordinal_position;
""")
for row in cur.fetchall(): print(row)
