import { db } from './firebase-config.js';
import { collection, onSnapshot, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Configurações do Mapa
const map = L.map('map', { zoomControl: false }).setView([-25.4351, -49.2786], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

const layers = { pedidos: {}, entregadores: {} };

// --- FUNÇÃO: DESPACHAR PEDIDO ---
async function despacharPedido() {
    const end = document.getElementById('p-end').value;
    const id = document.getElementById('p-id').value;
    
    if(!end) return alert("Endereço obrigatório!");

    // Geocoding Gratuito (Nominatim)
    const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(end + ", Curitiba")}`);
    const data = await resp.json();

    if(data.length > 0) {
        await addDoc(collection(db, "pedidos"), {
            numero: id,
            endereco: end,
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            status: "pendente",
            criadoEm: serverTimestamp()
        });
        document.querySelectorAll('.dispatch-bar input').forEach(i => i.value = '');
    }
}

// --- MONITORAMENTO EM TEMPO REAL ---
onSnapshot(collection(db, "pedidos"), (snap) => {
    const lista = document.getElementById('lista-pedidos');
    document.getElementById('contador-pedidos').innerText = snap.size;
    lista.innerHTML = '';

    snap.forEach(docSnap => {
        const p = docSnap.data();
        const id = docSnap.id;

        // Adiciona Card
        lista.innerHTML += `
            <div class="pedido-card ${p.status}">
                <h4>#${p.numero} <small>R$ ${p.taxa || '0,00'}</small></h4>
                <p>${p.endereco}</p>
                <div style="font-size:11px; margin-top:10px; color:${p.status === 'pendente' ? '#ffa502' : '#00bcd4'}">
                    ● ${p.status.toUpperCase()}
                </div>
            </div>`;

        // Adiciona Marcador no Mapa
        if(!layers.pedidos[id]) {
            layers.pedidos[id] = L.marker([p.lat, p.lng]).addTo(map)
                .bindPopup(`<b>Pedido #${p.numero}</b><br>${p.endereco}`);
        }
    });
});

// Monitorar Entregadores
onSnapshot(collection(db, "rastreio"), (snap) => {
    snap.forEach(docSnap => {
        const e = docSnap.data();
        const id = docSnap.id;
        if(layers.entregadores[id]) {
            layers.entregadores[id].setLatLng([e.lat, e.lng]);
        } else {
            layers.entregadores[id] = L.circleMarker([e.lat, e.lng], {
                radius: 10, fillColor: "#00bcd4", color: "#fff", weight: 3, fillOpacity: 1
            }).addTo(map).bindTooltip("Entregador Ativo");
        }
    });
});

document.getElementById('btn-despachar').onclick = despacharPedido;
