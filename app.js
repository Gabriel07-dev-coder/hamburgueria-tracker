import { db } from './firebase-config.js';
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

let map;
let markerEntregador;

function inicializarMapaEmpresa() {
    map = L.map('map', { zoomControl: false }).setView([-25.4351, -49.2786], 15);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

    onSnapshot(doc(db, "rastreio", "entregador_1"), (docSnap) => {
        const data = docSnap.data();
        if (data) {
            const novaPos = [data.lat, data.lng];
            if (!markerEntregador) {
                markerEntregador = L.circleMarker(novaPos, {
                    radius: 10, fillColor: "#00bcd4", color: "white", weight: 3, fillOpacity: 1
                }).addTo(map);
            } else {
                markerEntregador.setLatLng(novaPos);
            }
            map.panTo(novaPos);
        }
    });
}

inicializarMapaEmpresa();
