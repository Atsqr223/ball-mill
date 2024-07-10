// firebase.js
import { initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

// Replace these with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0qVFoNXXsRpGMRGdXpfq_nMmZQOmWrIE",
  authDomain: "ball-mill-website.firebaseapp.com",
  projectId: "ball-mill-website",
  storageBucket: "ball-mill-website.appspot.com",
  messagingSenderId: "535000739980",
  appId: "1:535000739980:web:e5c142f6c02f8c57278ba9"
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebaseApp);

export default db;