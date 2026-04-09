import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCxSHASI8Ve9evqhKfd-bnTfXagqLIunM",
    authDomain: "hamburgueria-tracker.firebaseapp.com",
    projectId: "hamburgueria-tracker",
    storageBucket: "hamburgueria-tracker.firebasestorage.app",
    messagingSenderId: "1070466497328",
    appId: "1:1070466497328:web:74132bd089e63817aea6f5",
    measurementId: "G-JQYBOEBT4T"
};

const app = initializeApp(firebaseConfig);
// A LINHA QUE VOCÊ ESQUECEU:
export const db = getFirestore(app);
