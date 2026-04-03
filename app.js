// Inicialização do Mapa com Tema Escuro
const map = L.map('map').setView([-25.4614, -49.2275], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Exporte o mapa para que o index.html possa usá-lo
window.map = map;
