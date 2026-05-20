from flask import Blueprint, request, jsonify, session
from app.utils.db import get_db_connection
import os

billing_bp = Blueprint('billing_settings', __name__)

@billing_bp.route('/api/settings/billing', methods=['GET'])
def get_billing():
    if 'client_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401
        
    client_id = session['client_id']
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Initialize mock billing details if they don't exist
    cur.execute("SELECT plan_name, price, card_brand, card_last4, card_exp_month, card_exp_year, auto_renew FROM billing_details WHERE client_id = %s", (client_id,))
    row = cur.fetchone()
    
    if not row:
        # Create mock data
        cur.execute("""
            INSERT INTO billing_details (client_id, plan_name, price, card_brand, card_last4, card_exp_month, card_exp_year, auto_renew)
            VALUES (%s, 'Pro Plan', 49.00, 'VISA', '4242', '12', '2025', true)
            RETURNING plan_name, price, card_brand, card_last4, card_exp_month, card_exp_year, auto_renew
        """, (client_id,))
        row = cur.fetchone()
        conn.commit()
        
    # Get mock invoices
    cur.execute("SELECT date, description, amount, status FROM invoices WHERE client_id = %s ORDER BY date DESC LIMIT 10", (client_id,))
    invoices_rows = cur.fetchall()
    
    if not invoices_rows:
        # Create some mock invoices
        cur.execute("""
            INSERT INTO invoices (client_id, date, description, amount, status) VALUES 
            (%s, CURRENT_TIMESTAMP - INTERVAL '1 month', 'Pro Plan - Monthly', 49.00, 'Paid'),
            (%s, CURRENT_TIMESTAMP - INTERVAL '2 months', 'Pro Plan - Monthly', 49.00, 'Paid'),
            (%s, CURRENT_TIMESTAMP - INTERVAL '3 months', 'Pro Plan - Monthly', 49.00, 'Paid')
        """, (client_id, client_id, client_id))
        conn.commit()
        cur.execute("SELECT date, description, amount, status FROM invoices WHERE client_id = %s ORDER BY date DESC LIMIT 10", (client_id,))
        invoices_rows = cur.fetchall()
        
    cur.close()
    conn.close()
    
    invoices = []
    for inv in invoices_rows:
        invoices.append({
            "date": inv[0].strftime('%b %d, %Y'),
            "description": inv[1],
            "amount": float(inv[2]),
            "status": inv[3]
        })
        
    return jsonify({
        "plan_name": row[0],
        "price": float(row[1]),
        "card_brand": row[2],
        "card_last4": row[3],
        "card_exp": f"{row[4]}/{row[5][-2:]}" if row[4] and row[5] else "",
        "auto_renew": row[6],
        "invoices": invoices
    })

@billing_bp.route('/api/settings/billing/auto-renew', methods=['PUT'])
def update_auto_renew():
    if 'client_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401
        
    data = request.json
    auto_renew = data.get('auto_renew', False)
    
    # ACTUAL PAYMENT PROVIDER INTEGRATION COMMENTED OUT
    # try:
    #     import stripe
    #     stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
    #     customer = stripe.Customer.retrieve(session['stripe_customer_id'])
    #     subscription = stripe.Subscription.retrieve(customer.subscriptions.data[0].id)
    #     stripe.Subscription.modify(subscription.id, cancel_at_period_end=not auto_renew)
    # except Exception as e:
    #     return jsonify({"error": "Payment provider error"}), 500
        
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE billing_details SET auto_renew=%s WHERE client_id=%s
    """, (auto_renew, session['client_id']))
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify({"success": True})
