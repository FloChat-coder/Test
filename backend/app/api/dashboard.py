from flask import Blueprint, request, jsonify, session
from app.utils.db import get_db_connection

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/api/dashboard/activity-feed', methods=['GET'])
def get_activity_feed():
    if 'client_id' not in session: 
        return jsonify({"error": "Unauthorized"}), 401
    
    client_id = session['client_id']
    conn = get_db_connection()
    cur = conn.cursor()
    feed = []

    try:
        # 1. Lead Activities
        cur.execute("""
            SELECT la.id, la.message, la.created_at, l.name
            FROM lead_activities la
            JOIN leads l ON la.lead_id = l.id
            WHERE l.client_id = %s
            ORDER BY la.created_at DESC LIMIT 10
        """, (client_id,))
        for row in cur.fetchall():
            la_id, message, created_at, lead_name = row
            time_str = created_at.strftime("%I:%M %p") if created_at else "Just now"
            feed.append({
                "id": f"lead_{la_id}",
                "type": "qualified",
                "title": "Lead interaction",
                "timeInfo": time_str,
                "description": f"Interaction with {lead_name}: {message}",
                "timestamp": created_at.timestamp() if created_at else 0
            })
        
        # 2. Handoffs
        cur.execute("""
            SELECT id, combined_question, created_at
            FROM handoff_clusters
            WHERE client_id = %s
            ORDER BY created_at DESC LIMIT 10
        """, (client_id,))
        for row in cur.fetchall():
            ho_id, question, created_at = row
            time_str = created_at.strftime("%I:%M %p") if created_at else "Just now"
            feed.append({
                "id": f"ho_{ho_id}",
                "type": "human",
                "title": "Human handoff requested",
                "timeInfo": time_str,
                "description": f"User asked: {question[:100]}...",
                "timestamp": created_at.timestamp() if created_at else 0
            })
            
        # 3. Chat Sessions (bot handled)
        cur.execute("""
            SELECT session_id, updated_at
            FROM chat_sessions
            WHERE client_id = %s AND handoff_triggered = FALSE
            ORDER BY updated_at DESC LIMIT 10
        """, (client_id,))
        for row in cur.fetchall():
            s_id, updated_at = row
            time_str = updated_at.strftime("%I:%M %p") if updated_at else "Just now"
            feed.append({
                "id": f"bot_{s_id}",
                "type": "bot",
                "title": "Bot handled query",
                "timeInfo": time_str,
                "description": "Successfully completed a conversation session.",
                "timestamp": updated_at.timestamp() if updated_at else 0
            })

        # Sort combined feed by timestamp descending
        feed.sort(key=lambda x: x["timestamp"], reverse=True)
        return jsonify(feed[:20])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()
