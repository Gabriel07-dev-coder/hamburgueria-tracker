import { db } from './firebase-config.js';
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const map = L.map('map', { zoomControl: false }).setView([-25.4351, -49.2786], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

const markers = { pedidos: {}, entregadores: {} };

// 1. MONITORAR ENTREGADORES
onSnapshot(collection(db, "entregadores"), (snap) => {
    snap.forEach(docSnap => {
        const e = docSnap.data();
        const id = docSnap.id;
        if (markers.entregadores[id]) markers.entregadores[id].setLatLng([e.lat, e.lng]);
        else markers.entregadores[id] = L.circleMarker([e.lat, e.lng], { radius: 7, color: '#00bcd4', fillOpacity: 1 }).addTo(map).bindTooltip(e.nome);
    });
});

// 2. DESPACHAR NOVO PEDIDO
const btnAdd = document.getElementById('btn-add');
if (btnAdd) {
    btnAdd.onclick = async () => {
        const end = document.getElementById('p-end').value;
        if (!end) return alert("Endereço vazio!");

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
            document.querySelectorAll('header input').forEach(i => i.value = '');
        } else alert("Endereço não localizado!");
    };
}

// 3. LISTA E EDIÇÃO DE PEDIDOS
onSnapshot(collection(db, "pedidos"), (snap) => {
    const lista = document.getElementById('lista-pedidos');
    const contador = document.getElementById('contador-pedidos');
    if (contador) contador.innerText = snap.size;
    if (lista) {
        lista.innerHTML = '';
        snap.forEach(docSnap => {
            const p = docSnap.data();
            const id = docSnap.id;
            const card = document.createElement('div');
            card.className = 'pedido-card';
            card.innerHTML = `
                <strong>#${p.numero} - R$ ${p.taxa}</strong><p>${p.endereco}</p>
                <div class="actions">
                    <button class="btn-sm btn-edit" onclick="editar('${id}', '${p.numero}', '${p.taxa}', '${p.endereco}')">EDITAR</button>
                    <button class="btn-sm btn-del" onclick="remover('${id}')">REMOVER</button>
                </div>`;
            lista.appendChild(card);
            if (!markers.pedidos[id]) markers.pedidos[id] = L.marker([p.lat, p.lng]).addTo(map).bindPopup(`#${p.numero}`);
        });
    }
});

// FUNÇÕES GLOBAIS
window.remover = async (id) => { if(confirm("Remover?")) await deleteDoc(doc(db, "pedidos", id)); };

window.editar = async (id, numA, taxaA, endA) => {
    const nN = prompt("Novo Número:", numA);
    const nT = prompt("Novo Valor R$:", taxaA);
    const nE = prompt("Novo Endereço:", endA);

    if (nN !== null && nT !== null && nE !== null) {
        let coords = { lat: null, lng: null };
        if (nE !== endA) {
            const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(nE + ", Curitiba")}`);
            const g = await r.json();
            if (g.length > 0) { coords.lat = parseFloat(g[0].lat); coords.lng = parseFloat(g[0].lon); }
        }

        const upData = { numero: nN, taxa: nT, endereco: nE };
        if (coords.lat) { upData.lat = coords.lat; upData.lng = coords.lng; }
        
        await updateDoc(doc(db, "pedidos", id), upData);
        if (coords.lat) markers.pedidos[id].setLatLng([coords.lat, coords.lng]);
    }
};
