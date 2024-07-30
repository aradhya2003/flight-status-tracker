
# Flight Status App

## Overview
The Flight Status App is a system designed to provide real-time flight status updates and notifications to passengers. It allows users to track flight statuses, including delays, cancellations, and gate changes, and receive push notifications for any changes.

## Features
- **Real-time Updates:** Display current flight status (delays, cancellations, gate changes).
- **Push Notifications:** Send notifications for flight status changes via Firebase Cloud Messaging.
- **Integration with Airport Systems:** Pull data from airport databases for accurate information.

## Tech Stack
### Frontend:
- **React.js:** Used for building the user interface.
- **Material-UI:** For styling and UI components.
- **Axios:** For making HTTP requests from the frontend to the backend.
- **Date-fns:** For handling date formatting.

### Backend:
- **Flask (Python):** Used for building the backend API.
- **MongoDB:** Used as the database for storing flight data.
- **Firebase Cloud Messaging:** Used for sending push notifications.
- **Google Auth Library:** For authenticating requests to Firebase Cloud Messaging.
- **Pymongo:** For connecting and performing operations on MongoDB.
- **Flask-CORS:** To handle Cross-Origin Resource Sharing (CORS) in Flask.
- **Requests:** For making HTTP requests in Python.

## Installation and Setup
### Clone the repository
\`\`\`bash
git clone https://github.com/your-username/flight-status-app.git
cd flight-status-app
\`\`\`

### Backend Setup
1. **Create a virtual environment:**
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # On Windows use \`venv\Scripts\activate\`
   \`\`\`
2. **Install the required Python packages:**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`
3. **Start the Flask server:**
   \`\`\`bash
   python app.py
   \`\`\`

### Frontend Setup
1. **Navigate to the frontend directory:**
   \`\`\`bash
   cd frontend
   \`\`\`
2. **Install the required npm packages:**
   \`\`\`bash
   npm install
   \`\`\`
3. **Start the React development server:**
   \`\`\`bash
   npm start
   \`\`\`

### Environment Variables
- Ensure the Firebase service account file is placed in the correct location.
- Set the MongoDB connection URI in the \`app.py\` file.

## Usage
- Open the frontend in a web browser (usually at \`http://localhost:3000\`).
- Use the interface to track flight statuses and receive real-time updates and notifications.

## Project Structure
- **frontend/**: Contains the React frontend code.
- **app.py**: The main Flask application file.
- **requirements.txt**: Contains the Python dependencies.
- **public/**: Static files and assets.

## Screenshots

- **Login Page for Admins and Users**
![Login Page for Admins and Users](https://github.com/user-attachments/assets/6343db01-9257-411e-bdb9-5d8557c7fa4c)

- **Dashboard with No Flight Available**

  ![Dashboard with No Flight Available](https://github.com/user-attachments/assets/bd2ce029-3196-4402-8717-7fe887444c19)

  


- **Dashboard with Some Flight Data Available**

  ![Dashboard with Some Flight Data Available](https://github.com/user-attachments/assets/ff72bc07-0060-4f14-9e13-461e54da0390)

- **Admin Dashboard For Updating The Flight Status**
![Admin Dashboard For Updating The Flight Status](https://github.com/user-attachments/assets/6e989f74-3425-46dd-b5a9-b772daadcd2b)



- **Flight Gate Change Notification**

  ![Flight Gate Change Notification](https://github.com/user-attachments/assets/6277b021-a03d-4fb5-9d0a-89703c40ffd6)


- **Flight Cancelled Notification**

  ![Flight Cancelled Notification](https://github.com/user-attachments/assets/60c1f6d4-4847-4155-b908-8961f5b491d7)


- **Flight Delayed Notification**

  ![Flight Delayed Notification](https://github.com/user-attachments/assets/d1a5e382-e2c0-4211-acd4-afe6481281b2)

## Contributors
- **Aradhya Teharia** - Developer

## License
This project is licensed under the MIT License.
