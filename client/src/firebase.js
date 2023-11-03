import { initializeApp } from "firebase/app";
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_KEY,
    authDomain: "real-estate-50d7c.firebaseapp.com",
    projectId: "real-estate-50d7c",
    storageBucket: "real-estate-50d7c.appspot.com",
    messagingSenderId: "440471471162",
    appId: "1:440471471162:web:352d5cbd0221f270eb6103",
    measurementId: "G-12VD8H6K5Q",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
