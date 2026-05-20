from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash
from app.utils.db import get_db_connection

account_bp = Blueprint('account_settings', __name__)

@account_bp.route('/api/settings/account', methods=['GET'])
def get_account():
    if 'client_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401
        
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT name, email FROM clients WHERE client_id = %s", (session['client_id'],))
    row = cur.fetchone()
    cur.close()
    conn.close()
    
    if not row:
        return jsonify({"error": "Not found"}), 404
        
    return jsonify({
        "name": row[0] or "",
        "email": row[1] or ""
    })

@account_bp.route('/api/settings/account', methods=['PUT'])
def update_account():
    if 'client_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401
        
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    if password and password.strip():
        # User wants to update password
        p_hash = generate_password_hash(password)
        cur.execute("""
            UPDATE clients SET name=%s, email=%s, password_hash=%s
            WHERE client_id=%s
        """, (name, email, p_hash, session['client_id']))
    else:
        cur.execute("""
            UPDATE clients SET name=%s, email=%s
            WHERE client_id=%s
        """, (name, email, session['client_id']))
        
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify({"success": True, "message": "Account updated"})
