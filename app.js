import { db } from './firebase-config.js';
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Inicializa o mapa focado em Curitiba
const map = L.map('map', { zoomControl: false }).setView([-25.4351, -49.2786], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

const marcadoresEntregadores = {};

// Ícone customizado para diferenciar dos pedidos
const iconeMoto = L.divIcon({
    className: 'custom-div-icon',
    html: "<div style='background-color:#00bcd4; width:12px; height:12px; border-radius:50%; border:2px solid white; box-shadow: 0 0 10px #00bcd4;'></div>",
    iconSize: [15, 15],
    iconAnchor: [7, 7]
});

// Escuta a coleção em tempo real
onSnapshot(collection(db, "entregadores"), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        const id = change.doc.id;
        const posicao = [data.lat, data.lng];

        if (change.type === "added" || change.type === "modified") {
            if (marcadoresEntregadores[id]) {
                // Atualiza posição suavemente
                marcadoresEntregadores[id].setLatLng(posicao);
            } else {
                // Cria novo marcador se não existir
                marcadoresEntregadores[id] = L.marker(posicao, { icon: iconeMoto })
                    .addTo(map)
                    .bindPopup(`<b>${data.nome}</b><br>Status: ${data.status}`);
            }
        }

        if (change.type === "removed") {
            if (marcadoresEntregadores[id]) {
                map.removeLayer(marcadoresEntregadores[id]);
                delete marcadoresEntregadores[id];
            }
        }
    });
});
