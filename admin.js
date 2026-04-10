import { db } from './firebase-config.js';
import { collection, onSnapshot, addDoc, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

let map = L.map('map').setView([-25.4351, -49.2786], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

const markersPedidos = {};
const markersEntregadores = {};

// 1. Escuta Pedidos em Tempo Real
onSnapshot(collection(db, "pedidos"), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        const pedido = change.doc.data();
        const id = change.doc.id;

        if (change.type === "added" || change.type === "modified") {
            if (markersPedidos[id]) map.removeLayer(markersPedidos[id]);
            
            // Ícone customizado por status
            const color = pedido.status === 'entregue' ? 'green' : 'red';
            markersPedidos[id] = L.circleMarker([pedido.lat, pedido.lng], { color }).addTo(map)
                .bindPopup(`Pedido #${id}<br>Status: ${pedido.status}`);
        }
    });
});

// 2. Escuta Entregadores e Desenha a Linha (Polyline)
onSnapshot(collection(db, "rastreio"), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        const rastreio = change.doc.data();
        const entregadorId = change.doc.id;

        if (markersEntregadores[entregadorId]) map.removeLayer(markersEntregadores[entregadorId]);
        
        markersEntregadores[entregadorId] = L.marker([rastreio.lat, rastreio.lng], {
            icon: L.icon({ iconUrl: 'moto-icon.png', iconSize: [30, 30] })
        }).addTo(map);
    });
});

// 3. Geocoding: Converter endereço em coordenadas
async function cadastrarPedido(endereco, cliente) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${endereco}`);
    const data = await response.json();
    
    if (data.length > 0) {
        await addDoc(collection(db, "pedidos"), {
            cliente,
            endereco,
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            status: "pendente",
            timestamp: Date.now()
        });
    }
}
