// app.js (Empresa)
let map;
let markerEntregador; // Variável para o ponto móvel

function inicializarMapaEmpresa() {
    map = L.map('map', { zoomControl: false }).setView([-25.4351, -49.2786], 15);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

    // O mapa agora abre LIMPO, sem marcadores fixos
}// app.js (Empresa)
let map;
let markerEntregador; // Variável para o ponto móvel

function inicializarMapaEmpresa() {
    map = L.map('map', { zoomControl: false }).setView([-25.4351, -49.2786], 15);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

    // O mapa agora abre LIMPO, sem marcadores fixos
}
