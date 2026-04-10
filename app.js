import { db } from './firebase-config.js';
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const map = L.map('map').setView([-25.4351, -49.2786], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

const listaMarcadores = {};

// Escuta em tempo real a coleção 'entregadores'
onSnapshot(collection(db, "entregadores"), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        const entregador = change.doc.data();
        const id = change.doc.id;
        const novaPos = [entregador.lat, entregador.lng];

        if (change.type === "added" || change.type === "modified") {
            // Se o marcador já existe, apenas move. Se não, cria.
            if (listaMarcadores[id]) {
                listaMarcadores[id].setLatLng(novaPos);
            } else {
                listaMarcadores[id] = L.marker(novaPos)
                    .addTo(map)
                    .bindPopup(`<b>${entregador.nome}</b><br>Status: ${entregador.status}`);
            }
        }

        if (change.type === "removed") {
            map.removeLayer(listaMarcadores[id]);
            delete listaMarcadores[id];
        }
    });
});
