import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCPKp9h9KkLabVGI5mbGIPU6bPf0I_r3mM",
    authDomain: "agitacapital-56d8b.firebaseapp.com",
    databaseURL: "https://agitacapital-56d8b-default-rtdb.firebaseio.com",
    projectId: "agitacapital-56d8b",
    storageBucket: "agitacapital-56d8b.firebasestorage.app",
    messagingSenderId: "409268830366",
    appId: "1:409268830366:web:13de81b7203ddd00ccbb8f",
    measurementId: "G-SLP0W2Z1XW"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);
