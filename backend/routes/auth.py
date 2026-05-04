from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

auth_bp = Blueprint('auth', __name__)

DATABASE = 'maduraione.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not name or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT email FROM users WHERE email = ?', (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Email already registered'}), 400
    
    hashed_password = generate_password_hash(password)
    cursor.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                   (name, email, hashed_password))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Registration successful'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = cursor.fetchone()
    conn.close()
    
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity={'id': user['id'], 'name': user['name'], 'is_admin': user['is_admin']})
    
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'is_admin': user['is_admin']
        }
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user = get_jwt_identity()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, email, is_admin FROM users WHERE id = ?', (current_user['id'],))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user['id'],
        'name': user['name'],
        'email': user['email'],
        'is_admin': user['is_admin']
    }), 200
