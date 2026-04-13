import { db } from './firebase-config.js';
import { collection, onSnapshot, addDoc, doc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const map = L.map('map').setView([-25.4351, -49.2786], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

let markers = { pedidos: {}, entregadores: {} };
let rotaControl = null;
let posEntregador = null;

// 1. Monitora o João
onSnapshot(collection(db, "entregadores"), (snap) => {
    snap.forEach(d => {
        const e = d.data();
        if (e.status === "online" && e.lat) {
            posEntregador = L.latLng(e.lat, e.lng);
            if (markers.entregadores[d.id]) {
                markers.entregadores[d.id].setLatLng(posEntregador);
            } else {
                markers.entregadores[d.id] = L.circleMarker(posEntregador, { radius: 8, color: '#00bcd4', fillOpacity: 1 }).addTo(map).bindTooltip(e.nome, { permanent: true });
            }
        }
    });
});

// 2. Desenha a Rota
function desenharRota(destLat, destLng) {
    if (rotaControl) map.removeControl(rotaControl);
    
    if (posEntregador && destLat && destLng) {
        rotaControl = L.Routing.control({
            waypoints: [posEntregador, L.latLng(destLat, destLng)],
            lineOptions: { styles: [{ color: '#00bcd4', weight: 6, opacity: 0.8 }] },
            createMarker: () => null,
            addWaypoints: false,
            show: false
        }).addTo(map);
    }
}

// 3. Monitora Pedidos
onSnapshot(collection(db, "pedidos"), (snap) => {
    const lista = document.getElementById('lista-pedidos');
    document.getElementById('contador-pedidos').innerText = snap.size;
    lista.innerHTML = '';
    
    // Limpa marcadores de pedidos
    Object.values(markers.pedidos).forEach(m => map.removeLayer(m));
    markers.pedidos = {};

    snap.forEach(d => {
        const p = d.data();
        const card = document.createElement('div');
        card.className = 'pedido-card';
        card.innerHTML = `<strong>#${p.numero} - R$ ${p.taxa}</strong><p>${p.endereco}</p>`;
        lista.appendChild(card);

        if (p.lat && p.lng) {
            markers.pedidos[d.id] = L.marker([p.lat, p.lng]).addTo(map);
            desenharRota(p.lat, p.lng);
        }
    });
});

// 4. Botão Despachar
document.getElementById('btn-add').onclick = async () => {
    const end = document.getElementById('p-end').value;
    if (!end) return;
    
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(end + ", Curitiba")}`);
    const data = await res.json();

    if (data.length > 0) {
        await addDoc(collection(db, "pedidos"), {
            numero: document.getElementById('p-id').value,
            endereco: end,
            taxa: document.getElementById('p-taxa').value,
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            criadoEm: serverTimestamp()
        });
        document.querySelectorAll('header input').forEach(i => i.value = '');
    }
};
