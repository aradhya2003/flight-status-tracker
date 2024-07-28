from flask import Flask, request, jsonify
import requests
from google.auth.transport.requests import Request
from google.oauth2 import service_account
from flask_cors import CORS
from pymongo import MongoClient, ReturnDocument
from bson import ObjectId

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB connection
MONGO_URI = 'Enter your credentials/Path'
client = MongoClient(MONGO_URI)
db = client['flight-status-db']
flights_collection = db['flights']

tokens = []

SERVICE_ACCOUNT_FILE = 'Enter your credentials/Path'

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
    data = request.get_json()
    token = data.get('token')
    if token not in tokens:
        tokens.append(token)
    return jsonify({"message": "Token saved"}), 200

@app.route('/api/notify', methods=['POST'])
def notify():
    data = request.get_json()
    title = data.get('title')
    body = data.get('body')
    results = []
    for token in tokens:
        result = send_fcm_notification(token, title, body)
        results.append(result)
        print(result)
    return jsonify({"message": "Notifications sent", "results": results}), 200

@app.route('/api/flight-status', methods=['GET'])
def get_flight_status():
    try:
        flights = list(flights_collection.find({}))
        
        # Convert departure times to datetime and sort
        for flight in flights:
            flight['_id'] = str(flight['_id']) 

        
        # Sort flights by departure time
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
         # Use flight number as unique identifier
        result = None

        if flight_number:
            existing_flight = flights_collection.find_one({"flight": flight_number})

            if existing_flight:
                # Update the existing flight
                result = flights_collection.find_one_and_update(
                    {"flight": flight_number},
                    {"$set": data},
                    upsert=True,  
                    # This will insert the document if it doesn't exist
                    return_document=ReturnDocument.AFTER
                )
                operation = "updated"
                notify_flight_status_change(existing_flight, data)
            else:
                result = flights_collection.find_one_and_update(
                    {"flight": flight_number},
                    {"$set": data},
                    upsert=True,
                    return_document=ReturnDocument.AFTER
                )
                operation = "inserted"

        else:
            return jsonify({"message": "Flight number is required"}), 400

        if result:
            return jsonify({"message": f"Flight data {operation}", "result": str(result['_id'])}), 200
        else:
            return jsonify({"message": "No changes made"}), 304

    except Exception as e:
        print(f"Error during flight data insertion/updation: {e}")
        return jsonify({"error": str(e)}), 500

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
            
if __name__ == '__main__':
    print("Starting Flask app...")
    app.run(debug=True)
