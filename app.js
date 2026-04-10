import { db } from './firebase-config.js';
import { collection, onSnapshot, addDoc, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const map = L.map('map', { zoomControl: false }).setView([-25.4351, -49.2786], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

const markersPedidos = {};
const markersEntregadores = {};

// 1. Monitorar Entregadores
onSnapshot(collection(db, "rastreio"), (snapshot) => {
    snapshot.docChanges().forEach(change => {
        const data = change.doc.data();
        const id = change.doc.id;
        if (markersEntregadores[id]) markersEntregadores[id].setLatLng([data.lat, data.lng]);
        else {
            markersEntregadores[id] = L.circleMarker([data.lat, data.lng], {
                radius: 10, fillColor: "#00bcd4", color: "#fff", weight: 3, fillOpacity: 1
            }).addTo(map).bindTooltip("Entregador Online");
        }
    });
});

// 2. Criar Pedido com Geocoding
async function cadastrarPedido() {
    const numero = document.getElementById('p-id').value;
    const endereco = document.getElementById('p-end').value;
    const taxa = document.getElementById('p-taxa').value;

    const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`);
    const geo = await resp.json();

    if (geo.length > 0) {
        const lat = parseFloat(geo[0].lat);
        const lng = parseFloat(geo[0].lon);

        // Salva na coleção global de pedidos
        await addDoc(collection(db, "pedidos"), { numero, endereco, taxa, lat, lng, status: "pendente" });

        // Envia para o painel do entregador específico (ex: entregador_1)
        await setDoc(doc(db, "rastreio", "entregador_1"), {
            destinoLat: lat,
            destinoLng: lng,
            enderecoDestino: endereco
        }, { merge: true });

        alert("Pedido enviado!");
    }
}

// 3. Renderizar Lista Lateral
onSnapshot(collection(db, "pedidos"), (snapshot) => {
    const lista = document.getElementById('lista-pedidos');
    lista.innerHTML = '';
    snapshot.forEach(docSnap => {
        const p = docSnap.data();
        lista.innerHTML += `
            <div class="pedido-card">
                <strong>Pedido #${p.numero} - R$ ${p.taxa}</strong><br>
                <small>${p.endereco}</small>
            </div>`;
        if (!markersPedidos[docSnap.id]) {
            markersPedidos[docSnap.id] = L.marker([p.lat, p.lng]).addTo(map);
        }
    });
});

document.getElementById('btn-adicionar').onclick = cadastrarPedido;
