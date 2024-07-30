from flask import Flask, request, jsonify
import requests
from google.auth.transport.requests import Request
from google.oauth2 import service_account
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from pymongo import MongoClient, ReturnDocument
from bson import ObjectId
import bcrypt

app = Flask(__name__)
CORS(app)

MONGO_URI = 'Enter Your Creds'
client = MongoClient(MONGO_URI)
db = client['flight-status-db']
flights_collection = db['flights']
users_collection = db['users']

SERVICE_ACCOUNT_FILE = 'Enter Your Creds'
app.config['JWT_SECRET_KEY'] = 'Enter Your Creds'
jwt = JWTManager(app)

tokens = []

def get_access_token():
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=["https://www.googleapis.com/auth/cloud-platform"]
    )
    credentials.refresh(Request())
    return credentials.token

def send_fcm_notification(token, title, body):
    url = "https://fcm.googleapis.com/v1/projects/flight-status-app-c5045/messages:send"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {get_access_token()}"
    }
    payload = {
        "message": {
            "token": token,
            "notification": {
                "title": title,
                "body": body
            }
        }
    }
    response = requests.post(url, headers=headers, json=payload)
    return response.json()

@app.route('/api/save-token', methods=['POST'])
def save_token():
    global tokens  
    data = request.get_json()
    token = data.get('token')
    if token and token not in tokens:
        tokens.append(token)
    return jsonify({"message": "Token saved"}), 200

@app.route('/api/notify', methods=['POST'])
def notify():
    global tokens  
    data = request.get_json()
    title = data.get('title')
    body = data.get('body')
    results = []
    for token in tokens:
        result = send_fcm_notification(token, title, body)
        results.append(result)
        print(f"Notification result: {result}") 
    return jsonify({"message": "Notifications sent", "results": results}), 200

# Route to get flight status
@app.route('/api/flight-status', methods=['GET'])
def get_flight_status():
    try:
        flights = list(flights_collection.find({}))
        print(f"Flights retrieved: {flights}") 
        for flight in flights:
            flight['_id'] = str(flight['_id'])
        flights.sort(key=lambda x: x.get('departure', ''))
        return jsonify({"flights": flights}), 200
    except Exception as e:
        print(f"Error fetching flight status: {e}") 
        return jsonify({"error": str(e)}), 500
    

    
@app.route('/api/insert-or-update-flight', methods=['POST'])
def insert_or_update_flight():
    try:
        data = request.get_json()
        flight_number = data.get('flight')
        if not flight_number:
            return jsonify({"message": "Flight number is required"}), 400
        
        # Remove _id from data if it exists
        data.pop('_id', None)

        result = flights_collection.find_one_and_update(
            {"flight": flight_number},
            {"$set": data},
            upsert=True,
            return_document=ReturnDocument.AFTER
        )

        operation = "inserted" if result.get('upserted') else "updated"
        notify_flight_status_change(result, data)
        
        return jsonify({"message": f"Flight data {operation}", "result": str(result['_id'])}), 200

    except Exception as e:
        print(f"Error during flight data insertion/updation: {e}") 
        return jsonify({"error": str(e)}), 500

# Helper function to notify flight status changes
def notify_flight_status_change(existing_flight, updated_flight):
    notifications = []

    if existing_flight.get('status') != updated_flight.get('status'):
        notifications.append(f"Status change: Flight {updated_flight['flight']} is now {updated_flight['status']}")

    if updated_flight.get('status').lower() == 'Cancelled':
        notifications.append(f"Flight {updated_flight['flight']} has been Cancelled.")

    if existing_flight.get('gate') != updated_flight.get('gate'):
        notifications.append(f"Gate change: Flight {updated_flight['flight']} now departs from gate {updated_flight['gate']}")

    if existing_flight.get('delay') != updated_flight.get('delay'):
        notifications.append(f"Delay: Flight {updated_flight['flight']} is delayed by {updated_flight['delay']} minutes")

    for notification in notifications:
        for token in tokens:
            title = f"Update for Flight: {updated_flight['flight']}"
            response = send_fcm_notification(token, title, notification)
            print(f"Notification response for token {token}: {response}") 
            
# Route to handle user login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username and password:
        user = users_collection.find_one({"username": username})
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
            role = user.get('role', 'user')  # Default to 'user' if role is not set
            access_token = create_access_token(identity={'username': username})
            print(f"Login successful for {username}") 
            return jsonify(access_token=access_token, role= role), 200
        else:
            print(f"Failed login attempt for {username}") 
            return jsonify({"msg": "Bad username or password"}), 401
    else:
        print("Username and password required for login") 
        return jsonify({"msg": "Username and password required"}), 400
    
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if username and password:
            existing_user = users_collection.find_one({"username": username})
            if existing_user:
                print(f"Registration failed: Username {username} already exists")  
                return jsonify({"msg": "Username already exists"}), 400

            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            result = users_collection.insert_one({'username': username, 'password': hashed_password})
            print(f"User registered with ID: {result.inserted_id}")  
            return jsonify({"message": "User registered successfully"}), 201
        else:
            print("Username and password required for registration")  
            return jsonify({"msg": "Username and password required"}), 400

    except Exception as e:
        print(f"Error during registration: {e}")  
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask app...")
    app.run(debug=True)
