const firebaseConfig = {
  apiKey: "AIzaSyBJI-UqGV7sbxwFlBIIJdyzqWsz4OR15c4",
  authDomain: "lost-and-found-2cfa1.firebaseapp.com",
  projectId: "lost-and-found-2cfa1",
  storageBucket: "lost-and-found-2cfa1.firebasestorage.app",
  messagingSenderId: "916156623685",
  appId: "1:916156623685:web:19210669cdf7d0bf4b6c2c"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
console.log("Firebase loaded:", firebase);
console.log("Auth object:", auth);
console.log("DB object:", db);