// Sem a tag <script>
const baseCoords = L.latLng(-25.4431, -49.2761);

// Inicializa o mapa (isso tira a tela preta)
const map = L.map('map').setView([-25.4431, -49.2761], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

window.finalizarComKM = function(idDiv, nomeRua, coordsDestino) {
    // Sua lógica de cálculo aqui...
}
