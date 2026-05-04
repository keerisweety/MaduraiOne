from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import sqlite3

transports_bp = Blueprint('transports', __name__)

DATABASE = 'maduraione.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@transports_bp.route('/', methods=['GET'])
def get_all_transports():
    category = request.args.get('category')
    search = request.args.get('search')
    
    conn = get_db()
    cursor = conn.cursor()
    
    query = 'SELECT * FROM transports WHERE 1=1'
    params = []
    
    if category and category != 'all':
        query += ' AND category = ?'
        params.append(category)
    
    if search:
        query += ' AND (name LIKE ? OR description LIKE ? OR location LIKE ?)'
        search_term = f'%{search}%'
        params.extend([search_term, search_term, search_term])
    
    query += ' ORDER BY rating DESC'
    cursor.execute(query, params)
    transports = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(transport) for transport in transports]), 200

@transports_bp.route('/<int:transport_id>', methods=['GET'])
def get_transport(transport_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM transports WHERE id = ?', (transport_id,))
    transport = cursor.fetchone()
    
    if not transport:
        conn.close()
        return jsonify({'error': 'Transport service not found'}), 404
    
    cursor.execute('''
        SELECT r.*, u.name as user_name 
        FROM reviews r 
        JOIN users u ON r.user_id = u.id 
        WHERE r.transport_id = ? 
        ORDER BY r.created_at DESC
    ''', (transport_id,))
    reviews = cursor.fetchall()
    conn.close()
    
    return jsonify({
        'transport': dict(transport),
        'reviews': [dict(review) for review in reviews]
    }), 200

@transports_bp.route('/categories', methods=['GET'])
def get_categories():
    return jsonify([
        {'id': 'bus', 'name': 'Bus', 'icon': '🚌', 'desc': 'Government & Private Buses'},
        {'id': 'auto', 'name': 'Auto Rickshaw', 'icon': '🛺', 'desc': 'Metered Auto Services'},
        {'id': 'car', 'name': 'Car/Taxi', 'icon': '🚗', 'desc': 'Cabs & Taxis'},
        {'id': 'bike', 'name': 'Bike Taxi', 'icon': '🏍️', 'desc': 'Quick Bike Rides'},
        {'id': 'train', 'name': 'Train', 'icon': '🚂', 'desc': 'Railway Station'}
    ]), 200

@transports_bp.route('/featured', methods=['GET'])
def get_featured():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM transports ORDER BY rating DESC LIMIT 6')
    transports = cursor.fetchall()
    conn.close()
    return jsonify([dict(transport) for transport in transports]), 200
