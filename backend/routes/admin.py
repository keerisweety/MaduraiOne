from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import sqlite3

admin_bp = Blueprint('admin', __name__)

DATABASE = 'maduraione.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def require_admin():
    current_user = get_jwt_identity()
    if not current_user.get('is_admin'):
        return False
    return True

@admin_bp.route('/transports', methods=['POST'])
@jwt_required()
def add_transport():
    if not require_admin():
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.json
    name = data.get('name')
    category = data.get('category')
    description = data.get('description')
    phone = data.get('phone')
    location = data.get('location')
    hours = data.get('hours')
    fare_range = data.get('fare_range')
    
    if not name or not category:
        return jsonify({'error': 'Name and category required'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO transports (name, category, description, phone, location, hours, fare_range)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (name, category, description, phone, location, hours, fare_range))
    transport_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Transport added', 'id': transport_id}), 201

@admin_bp.route('/transports/<int:transport_id>', methods=['PUT'])
@jwt_required()
def update_transport(transport_id):
    if not require_admin():
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.json
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM transports WHERE id = ?', (transport_id,))
    if not cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Transport not found'}), 404
    
    cursor.execute('''
        UPDATE transports 
        SET name = ?, category = ?, description = ?, phone = ?, location = ?, hours = ?, fare_range = ?
        WHERE id = ?
    ''', (
        data.get('name'),
        data.get('category'),
        data.get('description'),
        data.get('phone'),
        data.get('location'),
        data.get('hours'),
        data.get('fare_range'),
        transport_id
    ))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Transport updated'}), 200

@admin_bp.route('/transports/<int:transport_id>', methods=['DELETE'])
@jwt_required()
def delete_transport(transport_id):
    if not require_admin():
        return jsonify({'error': 'Admin access required'}), 403
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM transports WHERE id = ?', (transport_id,))
    if not cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Transport not found'}), 404
    
    cursor.execute('DELETE FROM reviews WHERE transport_id = ?', (transport_id,))
    cursor.execute('DELETE FROM transports WHERE id = ?', (transport_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Transport deleted'}), 200

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    if not require_admin():
        return jsonify({'error': 'Admin access required'}), 403
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) as count FROM users')
    users_count = cursor.fetchone()['count']
    
    cursor.execute('SELECT COUNT(*) as count FROM transports')
    transports_count = cursor.fetchone()['count']
    
    cursor.execute('SELECT COUNT(*) as count FROM reviews')
    reviews_count = cursor.fetchone()['count']
    
    cursor.execute('SELECT category, COUNT(*) as count FROM transports GROUP BY category')
    category_stats = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    
    return jsonify({
        'users': users_count,
        'transports': transports_count,
        'reviews': reviews_count,
        'categories': category_stats
    }), 200
