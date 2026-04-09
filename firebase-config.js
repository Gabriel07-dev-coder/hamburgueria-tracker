import { db } from './firebase-config.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Rastreamento em tempo real do entregador
navigator.geolocation.watchPosition(async (pos) => {
    const latLng = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        timestamp: new Date().getTime()
    };

    try {
        // Salva a posição no documento 'entregador_1'
        await setDoc(doc(db, "rastreio", "entregador_1"), latLng);
        console.log("Posição enviada!");
    } catch (e) {
        console.error("Erro ao enviar: ", e);
    }
}, null, { enableHighAccuracy: true });
