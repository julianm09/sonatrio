// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import * as admin from "firebase-admin";

// Load your service account key JSON
import * as serviceAccount from "../sonatrio-firebase-adminsdk-5ytkw-c8d13500ab.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB5EgLxYFYs5UoQSA4eyprACSNAE2D2_a8",
    authDomain: "sonatrio.firebaseapp.com",
    projectId: "sonatrio",
    storageBucket: "sonatrio.firebasestorage.app",
    messagingSenderId: "314891765825",
    appId: "1:314891765825:web:fecec00997339f33b39ec0",
    measurementId: "G-SLWKFL1Q8P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services as needed
const auth = getAuth(app);

export { auth };
