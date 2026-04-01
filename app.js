import { db } from './firebase-config.js';
import { doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

export function iniciarRastreamento(id) {
    if ("geolocation" in navigator) {
        alert("GPS Iniciado!"); 

        navigator.geolocation.watchPosition((position) => {
            // Mudamos para setDoc com merge: true para garantir que o ID seja criado
            const docRef = doc(db, "entregadores", id);
            setDoc(docRef, {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                status: "online",
                nome: "ANA"
            }, { merge: true }).then(() => {
                console.log("Posição gravada!");
            }).catch(err => {
                console.error("Erro:", err);
            });
        }, (error) => {
            alert("Erro GPS: " + error.message);
        }, { enableHighAccuracy: true });
    }
}
