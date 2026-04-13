import { db } from './firebase-config.js';
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const map = L.map('map').setView([-25.4351, -49.2786], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

const markers = { pedidos: {}, entregadores: {} };
let rotaAtiva = null;
let ultimaPosicaoEntregador = null;

// 1. MONITORAR ENTREGADOR E ATUALIZAR ROTA
onSnapshot(collection(db, "entregadores"), (snap) => {
    snap.forEach(docSnap => {
        const e = docSnap.data();
        const id = docSnap.id;
        if (e.status === "online") {
            ultimaPosicaoEntregador = L.latLng(e.lat, e.lng);
            if (markers.entregadores[id]) {
                markers.entregadores[id].setLatLng([e.lat, e.lng]);
            } else {
                markers.entregadores[id] = L.circleMarker([e.lat, e.lng], { radius: 8, color: '#00bcd4', fillOpacity: 1 }).addTo(map).bindTooltip(e.nome, { permanent: true });
            }
        }
    });
});

// 2. DESPACHAR PEDIDO COM GEOCODIFICAÇÃO
document.getElementById('btn-add').onclick = async () => {
    const end = document.getElementById('p-end').value;
    const num = document.getElementById('p-id').value;
    const taxa = document.getElementById('p-taxa').value;

    if (!end) return alert("Digite o endereço!");

    // Busca coordenadas no OpenStreetMap
    const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(end + ", Curitiba")}`);
    const geo = await resp.json();

    if (geo.length > 0) {
        await addDoc(collection(db, "pedidos"), {
            numero: num,
            endereco: end,
            taxa: taxa,
            lat: parseFloat(geo[0].lat),
            lng: parseFloat(geo[0].lon),
            criadoEm: serverTimestamp()
        });
        document.querySelectorAll('header input').forEach(i => i.value = '');
    } else {
        alert("Endereço não encontrado em Curitiba.");
    }
};

// 3. ATUALIZAR LISTA E DESENHAR ROTA
onSnapshot(collection(db, "pedidos"), (snap) => {
    const lista = document.getElementById('lista-pedidos');
    document.getElementById('contador-pedidos').innerText = snap.size;
    lista.innerHTML = '';

    // Limpa rota anterior antes de redesenhar
    if (rotaAtiva) { map.removeControl(rotaAtiva); rotaAtiva = null; }

    snap.forEach(docSnap => {
        const p = docSnap.data();
        const id = docSnap.id;

        // Cria o Card
        const card = document.createElement('div');
        card.className = 'pedido-card';
        card.innerHTML = `
            <strong>#${p.numero} - R$ ${p.taxa}</strong><p>${p.endereco}</p>
            <button style="background:#e74c3c; color:white; border:none; padding:5px; border-radius:5px; margin-top:10px; cursor:pointer;" onclick="remover('${id}')">REMOVER</button>
        `;
        lista.appendChild(card);

        // Marcador do Pedido
        if (!markers.pedidos[id]) {
            markers.pedidos[id] = L.marker([p.lat, p.lng]).addTo(map);
        }

        // DESENHA A ROTA SE O ENTREGADOR ESTIVER ONLINE
        if (ultimaPosicaoEntregador) {
            rotaAtiva = L.Routing.control({
                waypoints: [ultimaPosicaoEntregador, L.latLng(p.lat, p.lng)],
                lineOptions: { styles: [{ color: '#00bcd4', weight: 5 }] },
                createMarker: function() { return null; },
                addWaypoints: false,
                show: false
            }).addTo(map);
        }
    });
});

window.remover = async (id) => { 
    if(confirm("Remover pedido?")) await deleteDoc(doc(db, "pedidos", id)); 
};
