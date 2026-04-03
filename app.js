// Ponto de partida: Scooby Dog
const baseCoords = L.latLng(-25.4431, -49.2761);

// Inicializa o mapa focado em Curitiba
const map = L.map('map').setView([-25.4431, -49.2761], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Função unificada para finalizar e calcular KM
window.finalizarComKM = function(idDiv, idInput, coordsDestino) {
    const nomeRua = document.getElementById(idInput).value; // Pega o texto editado
    const item = document.getElementById(idDiv);
    if (item) item.remove();

    const destino = L.latLng(coordsDestino[0], coordsDestino[1]);
    const distanciaKM = (baseCoords.distanceTo(destino) / 1000).toFixed(2);

    const historico = document.getElementById('historico-entregas');
    const card = document.createElement('div');
    card.className = 'card-historico';
    card.innerHTML = `
        <div style="font-size: 13px; color: white; font-weight: bold;">✅ ${nomeRua}</div>
        <div style="font-size: 11px; color: #00ced1;">Distância: ${distanciaKM} km</div>
    `;
    historico.prepend(card);
};
