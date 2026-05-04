from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import sqlite3

reviews_bp = Blueprint('reviews', __name__)

DATABASE = 'maduraione.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@reviews_bp.route('/', methods=['POST'])
@jwt_required()
def add_review():
    current_user = get_jwt_identity()
    data = request.json
    
    transport_id = data.get('transport_id')
    rating = data.get('rating')
    comment = data.get('comment')
    
    if not transport_id or not rating:
        return jsonify({'error': 'Transport ID and rating required'}), 400
    
    if rating < 1 or rating > 5:
        return jsonify({'error': 'Rating must be between 1 and 5'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO reviews (user_id, transport_id, rating, comment)
        VALUES (?, ?, ?, ?)
    ''', (current_user['id'], transport_id, rating, comment))
    
    cursor.execute('''
        UPDATE transports 
        SET rating = (SELECT AVG(rating) FROM reviews WHERE transport_id = ?)
        WHERE id = ?
    ''', (transport_id, transport_id))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Review added successfully'}), 201

@reviews_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_reviews():
    current_user = get_jwt_identity()
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT r.*, t.name as transport_name 
        FROM reviews r 
        JOIN transports t ON r.transport_id = t.id 
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
    ''', (current_user['id'],))
    reviews = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(review) for review in reviews]), 200
