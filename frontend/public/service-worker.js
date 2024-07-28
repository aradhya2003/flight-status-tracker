importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "Enter your credentials",
  authDomain: "Enter your credentials",
  projectId: "flight-status-app-c5045",
  storageBucket: "flight-status-app-c5045.appspot.com",
  messagingSenderId: "Enter your credentials",
  appId: "1:7046057504:web:a891f9b87c8e899c007645",
  measurementId: "Enter your credentials"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/default-icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
