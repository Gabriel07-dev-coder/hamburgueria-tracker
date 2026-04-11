import { db } from './firebase-config.js';
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const map = L.map('map', { zoomControl: false }).setView([-25.4351, -49.2786], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

const markers = { pedidos: {}, entregadores: {} };

// 1. Monitorar Entregadores
onSnapshot(collection(db, "entregadores"), (snap) => {
    snap.docChanges().forEach(change => {
        const data = change.doc.data();
        const id = change.doc.id;
        if (markers.entregadores[id]) markers.entregadores[id].setLatLng([data.lat, data.lng]);
        else {
            markers.entregadores[id] = L.circleMarker([data.lat, data.lng], { radius: 8, color: '#00bcd4' }).addTo(map).bindTooltip(data.nome);
        }
    });
});

// 2. Despachar Pedido com Geocoding
document.getElementById('btn-add').onclick = async () => {
    const end = document.getElementById('p-end').value;
    const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(end + ", Curitiba")}`);
    const geo = await resp.json();

    if (geo.length > 0) {
        await addDoc(collection(db, "pedidos"), {
            numero: document.getElementById('p-id').value,
            endereco: end,
            taxa: document.getElementById('p-taxa').value,
            lat: parseFloat(geo[0].lat), lng: parseFloat(geo[0].lon),
            status: "pendente", criadoEm: serverTimestamp()
        });
        document.querySelectorAll('input').forEach(i => i.value = '');
    }
};

// 3. Lista de Pedidos Interativa
onSnapshot(collection(db, "pedidos"), (snap) => {
    const lista = document.getElementById('lista-pedidos');
    lista.innerHTML = '';
    snap.forEach(docSnap => {
        const p = docSnap.data();
        const id = docSnap.id;
        const div = document.createElement('div');
        div.className = 'pedido-card';
        div.innerHTML = `
            <strong>#${p.numero} - R$ ${p.taxa}</strong><p>${p.endereco}</p>
            <div class="actions">
                <button class="btn-sm btn-edit" onclick="editar('${id}', '${p.endereco}')">EDITAR</button>
                <button class="btn-sm btn-del" onclick="remover('${id}')">REMOVER</button>
            </div>`;
        lista.appendChild(div);
        if (!markers.pedidos[id]) markers.pedidos[id] = L.marker([p.lat, p.lng]).addTo(map);
    });
});

window.remover = async (id) => { if(confirm("Excluir?")) await deleteDoc(doc(db, "pedidos", id)); };
window.editar = async (id, end) => { 
    const novo = prompt("Novo endereço:", end);
    if(novo) await updateDoc(doc(db, "pedidos", id), { endereco: novo });
};
