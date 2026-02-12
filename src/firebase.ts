import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "propper_value_here",
    authDomain: "propper_value_here",
    projectId: "propper_value_here",
    storageBucket: "propper_value_here",
    messagingSenderId: "propper_value_here",
    appId: "propper_value_here",
    measurementId: "propper_value_here"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
