from flask import Blueprint, request, jsonify, session
from app.utils.db import get_db_connection

bots_bp = Blueprint('bots_settings', __name__)

@bots_bp.route('/api/settings/bots', methods=['GET'])
def get_bots():
    if 'client_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401
        
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, name, theme_color, icon_url, status, created_at FROM chatbots WHERE client_id = %s ORDER BY created_at ASC", (session['client_id'],))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    
    bots = []
    for row in rows:
        bots.append({
            "id": row[0],
            "name": row[1],
            "theme_color": row[2],
            "icon_url": row[3],
            "status": row[4],
            "created_at": row[5].strftime('%b %Y') if row[5] else ""
        })
        
    return jsonify(bots)

@bots_bp.route('/api/settings/bots', methods=['POST'])
def create_bot():
    if 'client_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401
        
    data = request.json
    name = data.get('name', 'New Bot')
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO chatbots (client_id, name, theme_color, status)
        VALUES (%s, %s, 'indigo', 'Draft')
        RETURNING id, name, theme_color, icon_url, status, created_at
    """, (session['client_id'], name))
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify({
        "id": row[0],
        "name": row[1],
        "theme_color": row[2],
        "icon_url": row[3],
        "status": row[4],
        "created_at": row[5].strftime('%b %Y') if row[5] else ""
    })

@bots_bp.route('/api/settings/bots/<int:bot_id>', methods=['PUT'])
def update_bot(bot_id):
    if 'client_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401
        
    data = request.json
    name = data.get('name')
    theme_color = data.get('theme_color')
    icon_url = data.get('icon_url')
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE chatbots SET name=COALESCE(%s, name), theme_color=COALESCE(%s, theme_color), icon_url=COALESCE(%s, icon_url)
        WHERE id=%s AND client_id=%s
        RETURNING id, name, theme_color, icon_url, status, created_at
    """, (name, theme_color, icon_url, bot_id, session['client_id']))
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    if not row:
        return jsonify({"error": "Bot not found"}), 404
        
    return jsonify({
        "id": row[0],
        "name": row[1],
        "theme_color": row[2],
        "icon_url": row[3],
        "status": row[4],
        "created_at": row[5].strftime('%b %Y') if row[5] else ""
    })

@bots_bp.route('/api/settings/bots/<int:bot_id>', methods=['DELETE'])
def delete_bot(bot_id):
    if 'client_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401
        
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM chatbots WHERE id=%s AND client_id=%s RETURNING id", (bot_id, session['client_id']))
    deleted = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    if not deleted:
        return jsonify({"error": "Bot not found"}), 404
        
    return jsonify({"success": True})
