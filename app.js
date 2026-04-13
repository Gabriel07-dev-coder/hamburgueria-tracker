import { db } from './firebase-config.js';
import { collection, onSnapshot, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const map = L.map('map').setView([-25.4351, -49.2786], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

// Botão Despachar
document.getElementById('btn-add').onclick = async () => {
    const end = document.getElementById('p-end').value;
    if (!end) return alert("Digite o endereço!");

    // Converte endereço em coordenadas
    const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(end + ", Curitiba")}`);
    const data = await resp.json();

    if (data.length > 0) {
        await addDoc(collection(db, "pedidos"), {
            numero: document.getElementById('p-id').value,
            endereco: end,
            taxa: document.getElementById('p-taxa').value,
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            criadoEm: serverTimestamp()
        });
        alert("Pedido despachado!");
    } else {
        alert("Endereço não encontrado em Curitiba!");
    }
};
