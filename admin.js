import { db } from './firebase-config.js';
import { collection, onSnapshot, addDoc, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

let map = L.map('map', { zoomControl: false }).setView([-25.4351, -49.2786], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

const marcadores = { entregadores: {}, pedidos: {} };

// Monitora Entregadores Online
onSnapshot(collection(db, "rastreio"), (snapshot) => {
    snapshot.docChanges().forEach(change => {
        const data = change.doc.data();
        const id = change.doc.id;
        const pos = [data.lat, data.lng];

        if (marcadores.entregadores[id]) {
            marcadores.entregadores[id].setLatLng(pos);
        } else {
            marcadores.entregadores[id] = L.circleMarker(pos, {
                radius: 8, fillColor: "#00bcd4", color: "#fff", weight: 2, fillOpacity: 1
            }).addTo(map).bindTooltip("Entregador Ativo");
        }
    });
});

// Função para converter endereço e salvar pedido
async function criarPedido() {
    const endereco = document.getElementById('p-end').value;
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${endereco}`);
    const geo = await response.json();

    if (geo.length > 0) {
        await addDoc(collection(db, "pedidos"), {
            endereco: endereco,
            lat: parseFloat(geo[0].lat),
            lng: parseFloat(geo[0].lon),
            status: "pendente",
            criadoEm: serverTimestamp()
        });
        alert("Pedido lançado no mapa!");
    }
}

document.querySelector('.btn-add').addEventListener('click', criarPedido);
