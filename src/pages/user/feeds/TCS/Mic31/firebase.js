// firebase.js
import { initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

// Replace these with your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAY6SJDAYOoZRgJWVub-ncMhMRgoMRwXKs",
    authDomain: "ball-mill-c304d.firebaseapp.com",
    databaseURL: "https://ball-mill-c304d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ball-mill-c304d",
    storageBucket: "ball-mill-c304d.appspot.com",
    messagingSenderId: "15875257637",
    appId: "1:15875257637:web:1a098798488f14390f16cc"
  };


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebaseApp);

export default db;