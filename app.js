import { db } from './firebase-config.js';
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

let map;
let markerEntregador;

function inicializarMapaEmpresa() {
    // Inicializa o mapa focado no Centro de Curitiba
    map = L.map('map', { zoomControl: false }).setView([-25.4351, -49.2786], 15);
    
    // Tema Dark que você definiu para o projeto
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

    // ESCUTA O GPS: O ponto só aparece quando houver sinal vindo do Firebase
    onSnapshot(doc(db, "rastreio", "entregador_1"), (doc) => {
        const data = doc.data();
        if (data) {
            const novaPos = [data.lat, data.lng];

            if (!markerEntregador) {
                // Cria o marcador na posição REAL (sem nomes ou textos fixos)
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
            // Segue o movimento automaticamente
            map.panTo(novaPos);
        }
    });
}

inicializarMapaEmpresa();
