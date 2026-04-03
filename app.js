// Inicialização do Mapa Dark Mode
const map = L.map('map').setView([-25.4614, -49.2275], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Faz o mapa ser acessível pelas funções do index.html
window.map = map;
