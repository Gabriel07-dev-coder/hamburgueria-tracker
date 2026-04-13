import { db } from './firebase-config.js';
import { collection, onSnapshot, addDoc, doc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const map = L.map('map').setView([-25.4351, -49.2786], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

const markers = { pedidos: {}, entregadores: {} };
let rotaAtiva = null;
let ultimaPosicaoEntregador = null;

// 1. MONITORAR ENTREGADOR
onSnapshot(collection(db, "entregadores"), (snap) => {
    snap.forEach(docSnap => {
        const e = docSnap.data();
        if (e.status === "online") {
            ultimaPosicaoEntregador = L.latLng(e.lat, e.lng);
            if (markers.entregadores[docSnap.id]) {
                markers.entregadores[docSnap.id].setLatLng([e.lat, e.lng]);
            } else {
                markers.entregadores[docSnap.id] = L.circleMarker([e.lat, e.lng], { radius: 8, color: '#00bcd4', fillOpacity: 1 }).addTo(map).bindTooltip(e.nome, { permanent: true });
            }
        }
    });
});

// 2. FUNÇÃO PARA DESENHAR ROTA
function atualizarRota(destinoLat, destinoLng) {
    if (rotaAtiva) { map.removeControl(rotaAtiva); rotaAtiva = null; }
    
    if (ultimaPosicaoEntregador && destinoLat && destinoLng) {
        console.log("Traçando rota para:", destinoLat, destinoLng); // Para você testar no console
        rotaAtiva = L.Routing.control({
            waypoints: [
                ultimaPosicaoEntregador,
                L.latLng(destinoLat, destinoLng)
            ],
            lineOptions: { styles: [{ color: '#00bcd4', weight: 6, opacity: 0.9 }] },
            createMarker: function() { return null; },
            addWaypoints: false,
            show: false
        }).addTo(map);
    }
}

// 3. MONITORAR PEDIDOS
onSnapshot(collection(db, "pedidos"), (snap) => {
    const lista = document.getElementById('lista-pedidos');
    document.getElementById('contador-pedidos').innerText = snap.size;
    lista.innerHTML = '';

    // Limpar marcadores de pedidos antigos
    Object.values(markers.pedidos).forEach(m => map.removeLayer(m));
    markers.pedidos = {};

    snap.forEach(docSnap => {
        const p = docSnap.data();
        const id = docSnap.id;

        const card = document.createElement('div');
        card.className = 'pedido-card';
        card.innerHTML = `<strong>#${p.numero} - R$ ${p.taxa}</strong><p>${p.endereco}</p>
        <button style="background:#e74c3c; color:white; border:none; padding:5px; border-radius:5px; cursor:pointer;" onclick="remover('${id}')">REMOVER</button>`;
        lista.appendChild(card);

        if (p.lat && p.lng) {
            markers.pedidos[id] = L.marker([p.lat, p.lng]).addTo(map);
            atualizarRota(p.lat, p.lng); // Tenta desenhar a rota para o pedido atual
        }
    });
});

// 4. DESPACHAR COM BUSCA DE COORDENADAS
document.getElementById('btn-add').onclick = async () => {
    const end = document.getElementById('p-end').value;
    if (!end) return alert("Endereço vazio!");

    const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(end + ", Curitiba")}`);
    const geo = await resp.json();

    if (geo.length > 0) {
        await addDoc(collection(db, "pedidos"), {
            numero: document.getElementById('p-id').value,
            endereco: end,
            taxa: document.getElementById('p-taxa').value,
            lat: parseFloat(geo[0].lat),
            lng: parseFloat(geo[0].lon),
            criadoEm: serverTimestamp()
        });
        document.querySelectorAll('header input').forEach(i => i.value = '');
    } else alert("Endereço não localizado!");
};

window.remover = async (id) => { if(confirm("Remover?")) await deleteDoc(doc(db, "pedidos", id)); };
