import { db } from './firebase-config.js';
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

let map;
let markerEntregador;

function inicializarMapaEmpresa() {
    // O mapa abre no Centro, sem nenhum marcador inicial
    map = L.map('map', { zoomControl: false }).setView([-25.4351, -49.2786], 15);
    
    // Tema escuro padrão do seu rastreador
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

    // Conecta ao Firestore para buscar a posição real
    onSnapshot(doc(db, "rastreio", "entregador_1"), (doc) => {
        const data = doc.data();
        if (data) {
            const novaPos = [data.lat, data.lng];

            if (!markerEntregador) {
                // Cria o marcador azul do entregador (o ponto do Scooby Dog foi removido)
                markerEntregador = L.circleMarker(novaPos, {
                    radius: 10, 
                    fillColor: "#00bcd4", 
                    color: "white", 
                    weight: 3, 
                    fillOpacity: 1
                }).addTo(map);
            } else {
                markerEntregador.setLatLng(novaPos);
            }
            // Move a câmera para seguir o entregador
            map.panTo(novaPos);
        }
    });
}

inicializarMapaEmpresa();
