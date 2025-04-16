// firebase-config.js

const firebaseConfig = {
  apiKey: "AIzaSyDKV6m3_XZ_3envJDwx3HdOZKyTe0Dr1Xc",
  authDomain: "local-attraction-guide.firebaseapp.com",
  projectId: "local-attraction-guide",
  storageBucket: "local-attraction-guide.firebasestorage.app",
  messagingSenderId: "467664303611",
  appId: "1:467664303611:web:b221ee1facbafdc6da075e",
  databaseURL: "https://local-attraction-guide-default-rtdb.firebaseio.com/",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
