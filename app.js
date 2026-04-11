import { db } from './firebase-config.js';
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Inicializa Mapa
const map = L.map('map', { zoomControl: false }).setView([-25.4351, -49.2786], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

const markers = { pedidos: {}, entregadores: {} };

// 1. MONITORAR ENTREGADORES
onSnapshot(collection(db, "entregadores"), (snap) => {
    snap.forEach(docSnap => {
        const e = docSnap.data();
        const id = docSnap.id;
        if (markers.entregadores[id]) {
            markers.entregadores[id].setLatLng([e.lat, e.lng]);
        } else {
            markers.entregadores[id] = L.circleMarker([e.lat, e.lng], { radius: 8, color: '#00bcd4', fillOpacity: 1 }).addTo(map).bindTooltip(e.nome);
        }
    });
});

// 2. FUNÇÃO DESPACHAR (COM PROTEÇÃO)
const btnAdd = document.getElementById('btn-add');
if (btnAdd) {
    btnAdd.onclick = async () => {
        const end = document.getElementById('p-end').value;
        const pId = document.getElementById('p-id').value;
        const pTaxa = document.getElementById('p-taxa').value;

        if (!end) return alert("Por favor, digite o endereço.");

        try {
            const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(end + ", Curitiba")}`);
            const geo = await resp.json();

            if (geo.length > 0) {
                await addDoc(collection(db, "pedidos"), {
                    numero: pId,
                    endereco: end,
                    taxa: pTaxa,
                    lat: parseFloat(geo[0].lat),
                    lng: parseFloat(geo[0].lon),
                    status: "pendente",
                    criadoEm: serverTimestamp()
                });
                document.getElementById('p-id').value = '';
                document.getElementById('p-end').value = '';
                document.getElementById('p-taxa').value = '';
            } else { alert("Endereço não localizado!"); }
        } catch (err) { console.error("Erro ao despachar:", err); }
    };
}

// 3. LISTA EM TEMPO REAL (COM PROTEÇÃO)
onSnapshot(collection(db, "pedidos"), (snap) => {
    const contador = document.getElementById('contador-pedidos');
    if (contador) contador.innerText = snap.size;

    const lista = document.getElementById('lista-pedidos');
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
                    <button class="btn-sm btn-edit" onclick="editar('${id}', '${p.endereco}')">EDITAR</button>
                    <button class="btn-sm btn-del" onclick="remover('${id}')">REMOVER</button>
                </div>`;
            lista.appendChild(card);

            if (!markers.pedidos[id]) {
                markers.pedidos[id] = L.marker([p.lat, p.lng]).addTo(map).bindPopup(`#${p.numero}`);
            }
        });
    }
});

// Funções Globais para os botões do Card
window.remover = async (id) => { if(confirm("Remover este pedido?")) await deleteDoc(doc(db, "pedidos", id)); };
window.editar = async (id, end) => {
    const novo = prompt("Novo endereço:", end);
    if(novo) await updateDoc(doc(db, "pedidos", id), { endereco: novo });
};
