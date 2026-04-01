import { db } from './firebase-config.js';
import { doc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 1. Função para o celular da ANA (entregador.html)
export function iniciarRastreamento(id) {
    if ("geolocation" in navigator) {
        alert("GPS Iniciado! Tentando capturar posição..."); 

        navigator.geolocation.watchPosition((position) => {
            const docRef = doc(db, "entregadores", id);
            updateDoc(docRef, {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                status: "online"
            }).then(() => {
                console.log("Posição enviada ao Firebase!");
            }).catch(err => {
                console.error("Erro ao gravar no banco:", err);
            });
        }, (error) => {
            alert("Erro no GPS: " + error.message);
        }, { enableHighAccuracy: true });
    } else {
        alert("Seu celular não suporta GPS no navegador.");
    }
}

// 2. Função para o seu MAPA (index.html)
export function monitorarEntregador(id, callback) {
    const docRef = doc(db, "entregadores", id);
    onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback(docSnap.data());
        }
    });
}
