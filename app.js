import { db } from './firebase-config.js';
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

let map;
let markerEntregador;

function inicializarPainelRastreio() {
    // Inicializa o mapa focado no Centro, mas SEM nenhum marcador
    map = L.map('map', { zoomControl: false }).setView([-25.4351, -49.2786], 15);
    
    // Tema escuro para o seu estilo de rastreador
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

    // ESCUTA O FIREBASE: O marcador só aparece quando você ligar o GPS no celular
    onSnapshot(doc(db, "rastreio", "entregador_1"), (doc) => {
        const data = doc.data();
        if (data) {
            const novaPos = [data.lat, data.lng];

            if (!markerEntregador) {
                // Cria apenas o marcador da posição real, sem popup ou nomes
                markerEntregador = L.circleMarker(novaPos, {
                    radius: 10, 
                    fillColor: "#00bcd4", // O azul que você já usa
                    color: "white", 
                    weight: 3, 
                    fillOpacity: 1
                }).addTo(map);
            } else {
                markerEntregador.setLatLng(novaPos);
            }
            // Segue o movimento em tempo real
            map.panTo(novaPos);
        }
    });
}

inicializarPainelRastreio();
