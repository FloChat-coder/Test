from flask import Blueprint, session, request, jsonify 
import logging
from datetime import datetime

from app.utils.db import get_db_connection

leads_bp = Blueprint('leads', __name__)

def ensure_leads_schema(conn):
    try:
        cur = conn.cursor()
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
        conn.commit()
    except Exception:
        conn.rollback()

    columns = [
        "name VARCHAR", "phone VARCHAR", "title VARCHAR", "location VARCHAR", 
        "source VARCHAR", "source_detail VARCHAR", "status VARCHAR DEFAULT 'New'", "avatar_url VARCHAR"
    ]
    for col in columns:
        try:
            cur = conn.cursor()
            cur.execute(f"ALTER TABLE leads ADD COLUMN IF NOT EXISTS {col};")
            conn.commit()
        except Exception:
            conn.rollback()

    try:
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS lead_activities (
                id SERIAL PRIMARY KEY,
                lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
                message VARCHAR,
                is_recent BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
    except Exception:
        conn.rollback()

@leads_bp.route('/api/leads/request', methods=['POST'])
def capture_lead():
    data = request.json
    client_id = data.get('client_id')
    email = data.get('email')
    session_id = data.get('session_id')
    name = data.get('name', 'Unknown User')
    phone = data.get('phone', '')
    title = data.get('title', '')
    location = data.get('location', '')
    source = data.get('source', 'Website Chat')
    source_detail = data.get('source_detail', 'Chatbot Capture')
    status = data.get('status', 'New')
    avatar_url = data.get('avatar_url', '')
    
    conn = get_db_connection()
    if not conn: return jsonify({"error": "DB connection failed"}), 500
    ensure_leads_schema(conn)
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO leads (client_id, session_id, email, name, phone, title, location, source, source_detail, status, avatar_url) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
        """, (client_id, session_id, email, name, phone, title, location, source, source_detail, status, avatar_url))
        
        lead_id = cur.fetchone()[0]
        
        cur.execute("""
            INSERT INTO lead_activities (lead_id, message, is_recent)
            VALUES (%s, %s, %s)
        """, (lead_id, 'Lead captured via Chatbot', True))

        conn.commit()
        return jsonify({"success": True})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@leads_bp.route('/api/leads/update', methods=['POST'])
def update_lead():
    if 'client_id' not in session: return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    lead_id = data.get('id')
    new_status = data.get('status')
    new_activity = data.get('activity') # e.g. "Sent email followup"
    
    conn = get_db_connection()
    if not conn: return jsonify({"error": "DB connection failed"}), 500
    ensure_leads_schema(conn)
    cur = conn.cursor()
    try:
        if new_status:
            cur.execute("UPDATE leads SET status = %s WHERE id = %s AND client_id = %s", (new_status, lead_id, session['client_id']))
            cur.execute("INSERT INTO lead_activities (lead_id, message, is_recent) VALUES (%s, %s, %s)", (lead_id, f"Status changed to {new_status}", True))
            
        if new_activity:
            cur.execute("INSERT INTO lead_activities (lead_id, message, is_recent) VALUES (%s, %s, %s)", (lead_id, new_activity, True))
            
        conn.commit()
        return jsonify({"success": True})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@leads_bp.route('/api/leads/list', methods=['GET'])
def get_leads_list():
    if 'client_id' not in session: 
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    if not conn: return jsonify({"error": "DB connection failed"}), 500
    ensure_leads_schema(conn)
    cur = conn.cursor()
    try:
        # Join with chat_sessions to get the full conversation
        cur.execute("""
            SELECT l.id, l.email, l.session_id, l.created_at, c.messages,
                   l.name, l.phone, l.title, l.location, l.source, l.source_detail, l.status, l.avatar_url
            FROM leads l
            LEFT JOIN chat_sessions c ON l.session_id = c.session_id
            WHERE l.client_id = %s 
            ORDER BY l.created_at DESC
        """, (session['client_id'],))
        
        leads = []
        rows = cur.fetchall()
        for row in rows:
            lead_id = row[0]
            email = row[1]
            session_id = row[2]
            created_at = row[3]
            messages = row[4] if row[4] else []
            name = row[5] or 'Unknown'
            phone = row[6] or ''
            title = row[7] or ''
            location = row[8] or ''
            source = row[9] or 'Website Chat'
            source_detail = row[10] or ''
            status = row[11] or 'New'
            avatar_url = row[12] or ''
            
            # Fetch activities for this lead
            cur.execute("SELECT id, message, created_at, is_recent FROM lead_activities WHERE lead_id = %s ORDER BY created_at DESC", (lead_id,))
            activities = []
            for a_row in cur.fetchall():
                activities.append({
                    "id": str(a_row[0]),
                    "message": a_row[1],
                    "date": a_row[2].strftime("%b %d, %I:%M %p") if a_row[2] else "",
                    "isRecent": a_row[3]
                })
            
            # Create a snippet from the user's last message to show in the table
            snippet = "No chat history available."
            if messages:
                for msg in reversed(messages):
                    if msg.get('role') == 'user':
                        snippet = msg['content'][:80] + "..." if len(msg['content']) > 80 else msg['content']
                        break

            leads.append({
                "id": str(lead_id),
                "name": name,
                "email": email,
                "avatarUrl": avatar_url,
                "initials": name[:2].upper() if name else "UN",
                "source": source,
                "status": status,
                "date": created_at.strftime("%b %d, %I:%M %p") if created_at else "Unknown",
                "title": title,
                "phone": phone,
                "location": location,
                "sourceDetail": source_detail,
                "activities": activities,
                "messages": messages,
                "snippet": snippet
            })
        return jsonify(leads)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@leads_bp.route('/api/leads/<int:lead_id>/status', methods=['PUT'])
def update_lead_status(lead_id):
    if 'client_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    new_status = data.get('status')
    if not new_status or new_status not in ('New', 'Qualified', 'Contacted'):
        return jsonify({"error": "Invalid status. Must be New, Qualified, or Contacted."}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "DB connection failed"}), 500
    cur = conn.cursor()
    try:
        cur.execute(
            "UPDATE leads SET status = %s WHERE id = %s AND client_id = %s",
            (new_status, lead_id, session['client_id'])
        )
        if cur.rowcount == 0:
            conn.rollback()
            return jsonify({"error": "Lead not found"}), 404

        cur.execute(
            "INSERT INTO lead_activities (lead_id, message, is_recent) VALUES (%s, %s, %s)",
            (lead_id, f"Status changed to {new_status}", True)
        )
        conn.commit()
        return jsonify({"success": True})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@leads_bp.route('/api/leads/<int:lead_id>', methods=['DELETE'])
def delete_lead(lead_id):
    if 'client_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "DB connection failed"}), 500
    cur = conn.cursor()
    try:
        cur.execute(
            "DELETE FROM leads WHERE id = %s AND client_id = %s",
            (lead_id, session['client_id'])
        )
        if cur.rowcount == 0:
            conn.rollback()
            return jsonify({"error": "Lead not found"}), 404
        conn.commit()
        return jsonify({"success": True})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@leads_bp.route('/api/leads/recent', methods=['GET'])
def get_recent_leads():
    if 'client_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "DB connection failed"}), 500
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT id, name, email, status, avatar_url, created_at
            FROM leads
            WHERE client_id = %s
            ORDER BY created_at DESC
            LIMIT 5
        """, (session['client_id'],))
        rows = cur.fetchall()
        leads = []
        for row in rows:
            name = row[1] or 'Unknown'
            leads.append({
                "id": str(row[0]),
                "name": name,
                "email": row[2],
                "status": row[3] or 'New',
                "initials": name[:2].upper(),
                "date": row[5].strftime("%b %d, %I:%M %p") if row[5] else "Unknown"
            })
        return jsonify(leads)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@leads_bp.route('/api/leads/activities', methods=['GET'])
def get_lead_activities():
    if 'client_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "DB connection failed"}), 500
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT la.id, la.message, la.created_at, l.name
            FROM lead_activities la
            JOIN leads l ON la.lead_id = l.id
            WHERE l.client_id = %s
            ORDER BY la.created_at DESC
            LIMIT 20
        """, (session['client_id'],))
        rows = cur.fetchall()
        activities = []
        for row in rows:
            lead_name = row[3] or 'Unknown'
            message = row[1] or ''
            activities.append({
                "id": str(row[0]),
                "type": "qualified",
                "title": "Lead interaction",
                "timeInfo": row[2].strftime("%b %d, %I:%M %p") if row[2] else "",
                "description": f"Interaction with {lead_name}: {message}"
            })
        return jsonify(activities)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()