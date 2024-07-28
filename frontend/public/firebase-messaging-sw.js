importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "Enter your credentials",
  authDomain: "flight-status-app-c5045.firebaseapp.com",
  projectId: "flight-status-app-c5045",
  storageBucket: "flight-status-app-c5045.appspot.com",
  messagingSenderId: "Enter your credentials",
  appId: "1:7046057504:web:a891f9b87c8e899c007645",
  measurementId: "Enter your credentials"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
