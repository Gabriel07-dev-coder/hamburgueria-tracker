import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCxSHASI8Ve9evqhKfd-bnTfXagqLIunM",
    authDomain: "hamburgueria-tracker.firebaseapp.com",
    projectId: "hamburgueria-tracker",
    storageBucket: "hamburgueria-tracker.firebasestorage.app",
    messagingSenderId: "1070466497328",
    appId: "1:1070466497328:web:74132bd089e63817aea6f5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
