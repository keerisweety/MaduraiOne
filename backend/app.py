from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
import sqlite3
import os

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'madurai-one-secret-key-2024'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
CORS(app)
jwt = JWTManager(app)

DATABASE = 'maduraione.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    if os.path.exists(DATABASE):
        os.remove(DATABASE)
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            is_admin INTEGER DEFAULT 0
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE transports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            phone TEXT,
            location TEXT,
            hours TEXT,
            fare_range TEXT,
            rating REAL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            transport_id INTEGER NOT NULL,
            rating INTEGER NOT NULL,
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (transport_id) REFERENCES transports(id)
        )
    ''')
    
    cursor.execute("SELECT COUNT(*) FROM transports")
    if cursor.fetchone()[0] == 0:
        sample_transports = [
            # BUS Services
            ('TNSTC Madurai', 'bus', 'Tamil Nadu State Transport Corporation - Government bus service with routes covering all districts from Madurai. Offers Volvo, Semi-Sleeper, and Ordinary buses. Book via official app or at bus stands.', '+91-452-2380001', 'Madurai Central Bus Stand, Kamarajar Salai, Madurai - 625001', '5:00 AM - 11:00 PM', '₹10 - ₹200', 4.3),
            ('TNSTC Mattuthavani', 'bus', 'Main inter-city bus terminus with buses to Chennai, Bangalore, Coimbatore and other major cities. Private bus operators also operate from this stand.', '+91-452-2380002', 'Mattuthavani Bus Stand, Bypass Road, Madurai - 625010', '24 Hours', '₹15 - ₹500', 4.2),
            ('Arapalayam Bus Stand', 'bus', 'Major bus terminal in North Madurai serving Northern Tamil Nadu destinations. Both government and private buses available.', '+91-452-2345678', 'Arapalayam, Goripalayam, Madurai - 625016', '4:00 AM - 12:00 AM', '₹10 - ₹300', 4.1),
            ('Madurai Radha Travels', 'bus', 'Premium private bus service with AC Seater, AC Sleeper, and Volvo buses. Specializes in Madurai to Bangalore and Chennai routes.', '+91-452-4200000', 'Mattuthavani Bus Stand, Madurai - 625010', '24 Hours', '₹300 - ₹1500', 4.5),
            ('Griffin Travels', 'bus', 'Luxury bus service offering multi-axle Volvo, Mercedes buses for comfortable travel. Free WiFi and entertainment on board.', '+91-452-2341234', 'Near Arapalayam Bus Stand, Madurai - 625016', '24 Hours', '₹400 - ₹2000', 4.4),
            ('EGloo Travels', 'bus', 'Budget-friendly private bus operator with AC and Non-AC options. Known for on-time departures and clean buses.', '+91-452-4200000', 'Mattuthavani, Madurai - 625010', '6:00 AM - 11:00 PM', '₹200 - ₹1200', 4.3),
            
            # AUTO Services
            ('Madurai Auto 24/7', 'auto', '24/7 metered auto rickshaw booking service. GPS tracked autos with verified drivers. Safe and reliable city travel.', '+91-452-100100', 'Near Meenakshi Temple, West Masi Street, Madurai - 625001', '24 Hours', '₹20 - ₹250', 4.0),
            ('Meter Auto Stand - Near Temple', 'auto', 'Official metered auto stand near Meenakshi Amman Temple. Fixed starting rates, honest meters.', '+91-452-2341001', 'West Masi Street, Near Meenakshi Temple, Madurai - 625001', '6:00 AM - 11:00 PM', '₹25 - ₹300', 3.9),
            ('Anna Nagar Auto Stand', 'auto', 'Reliable auto rickshaw service in Anna Nagar and surrounding areas. Pre-paid and meter options available.', '+91-452-2531001', 'Anna Nagar, Madurai - 625020', '6:00 AM - 10:00 PM', '₹25 - ₹200', 3.8),
            ('Goripalayam Auto Zone', 'auto', 'Auto rickshaw hub serving Goripalayam, Tallakulam and nearby areas. Night service available.', '+91-452-2641001', 'Goripalayam, Madurai - 625016', '24 Hours', '₹20 - ₹180', 3.7),
            
            # CAR/TAXI Services
            ('SRT Cabs Madurai', 'car', 'Premium taxi service with well-maintained cars. Airport transfers, local sightseeing, and outstation trips. Professional drivers.', '+91-452-400400', 'Tallakulam, Madurai - 625002', '24 Hours', '₹12/km', 4.6),
            ('Madurai Car Rental', 'car', 'Own fleet of verified vehicles. Airport pickup/drop, city tours, and long distance travel. Competitive pricing.', '+91-99999-99999', 'Mattuthavani, Madurai - 625010', '24 Hours', '₹10/km', 4.5),
            ('The Madurai Cabs & Tours Travels', 'car', 'Complete tour and travel solution. Car rentals, sightseeing packages, temple tours. Experienced drivers for Madurai tourism.', '+91-93248-86964', 'Madurai City', '6:00 AM - 10:00 PM', '₹14/km', 4.4),
            ('Red Taxi Madurai', 'car', 'App-based taxi service with various vehicle options. Sedans, SUVs, and tempo travellers available.', 'Book via App', 'Available across Madurai', '24 Hours', '₹15/km', 4.3),
            ('Gozocabs Madurai', 'car', 'Pan-India taxi service with presence in Madurai. Outstation cabs, local rides, and airport transfers.', '+91-452-600000', 'Goripalayam, Madurai - 625016', '24 Hours', '₹11/km', 4.4),
            ('Friends Track Call Taxi', 'car', 'Local taxi service with quick response. Ideal for airport transfers and local travel.', '+91-99999-88888', 'Madurai City', '6:00 AM - 12:00 AM', '₹13/km', 4.2),
            
            # BIKE Services
            ('Rapido Bike Taxi', 'bike', 'India\'s fastest bike taxi service. Quick rides for short distances. Download app or book via website.', 'Rapido App', 'Available across Madurai', '24 Hours', '₹15 - ₹80', 4.1),
            ('Uber Moto Madurai', 'bike', 'Uber\'s bike taxi service in Madurai. Affordable and quick rides through city traffic.', 'Uber App', 'Available across Madurai', '24 Hours', '₹15 - ₹100', 4.0),
            ('Bike Pool Madurai', 'bike', 'Shared bike service for budget travel. Connect with verified riders heading same direction.', '+91-88888-88888', 'Madurai City', '7:00 AM - 9:00 PM', '₹10 - ₹50', 3.8),
            
            # TRAIN Services
            ('Madurai Junction Railway Station', 'train', 'Major railway hub with connections to all major Indian cities. Express, Superfast, and Rajdhani trains. IRCTC booking available.', '+91-452-2305050', 'East Veli Street, Madurai Junction, Madurai - 625001', '24 Hours', '₹50 - ₹5000', 4.5),
            ('Koodal Nagar Railway Station', 'train', 'Secondary railway station in Madurai serving local and some express trains. Less crowded than main junction.', '+91-452-2315050', 'Koodal Nagar, Madurai - 625018', '6:00 AM - 10:00 PM', '₹30 - ₹3000', 4.0),
            ('Shivan Thirumalai Station', 'train', 'Madurai\'s third railway station, primarily for freight and some passenger services.', '+91-452-2405050', 'Shivan Thirumalai, Madurai - 625002', '24 Hours', '₹30 - ₹2000', 3.8)
        ]
        cursor.executemany('INSERT INTO transports (name, category, description, phone, location, hours, fare_range, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', sample_transports)
    
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)", 
                       ('Admin', 'admin@madurai.com', 'admin123', 1))
    
    conn.commit()
    conn.close()

from routes.auth import auth_bp
from routes.places import transports_bp
from routes.reviews import reviews_bp
from routes.admin import admin_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(transports_bp, url_prefix='/api/transports')
app.register_blueprint(reviews_bp, url_prefix='/api/reviews')
app.register_blueprint(admin_bp, url_prefix='/api/admin')

@app.route('/')
def home():
    return {'message': 'MaduraiOne API is running', 'version': '1.0.0'}

@app.route('/api/health')
def health():
    return {'status': 'healthy'}

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
