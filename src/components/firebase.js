// firebase.js
import { initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

// Replace these with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0kBf-SbmJm8a3rvKic-pHI9Hu_Cj1qoA",
  authDomain: "ball-mill-site.firebaseapp.com",
  projectId: "ball-mill-site",
  storageBucket: "ball-mill-site.appspot.com",
  messagingSenderId: "385765089377",
  appId: "1:385765089377:web:e7877fbe1ebdae192e0a20"
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebaseApp);

export default db;