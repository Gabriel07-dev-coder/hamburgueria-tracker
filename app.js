import { db } from './firebase-config.js';
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

let map;
let markerEntregador;

function inicializarMapaEmpresa() {
    // Inicializa o mapa limpo, sem marcadores na praça
    map = L.map('map', { zoomControl: false }).setView([-25.4351, -49.2786], 15);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

    // Escuta a localização REAL do entregador no Firestore
    onSnapshot(doc(db, "rastreio", "entregador_1"), (doc) => {
        const data = doc.data();
        if (data) {
            const novaPos = [data.lat, data.lng];

            if (!markerEntregador) {
                // Cria o marcador móvel apenas quando o sinal chega (sem nomes fixos)
                markerEntregador = L.circleMarker(novaPos, {
                    radius: 10, fillColor: "#00bcd4", color: "white", weight: 3, fillOpacity: 1
                }).addTo(map);
            } else {
                markerEntregador.setLatLng(novaPos);
            }
            map.panTo(novaPos); // O mapa segue você em tempo real
        }
    });
}

inicializarMapaEmpresa();
