// Configuração da base (Scooby Dog)
const baseCoords = L.latLng(-25.4431, -49.2761);

// Inicializa o mapa uma única vez
const map = L.map('map').setView([-25.4431, -49.2761], 13);
window.map = map; // Exporta para o focarRota funcionar

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

// Função para finalizar entrega
window.finalizarComKM = function(idDiv, nomeRua, coordsDestino) {
    const item = document.getElementById(idDiv);
    if (item) item.remove();

    const destino = L.latLng(coordsDestino[0], coordsDestino[1]);
    const distanciaKM = (baseCoords.distanceTo(destino) / 1000).toFixed(2);

    const historico = document.getElementById('historico-entregas');
    const card = document.createElement('div');
    card.className = 'card-historico';
    card.innerHTML = `
        <div style="font-size: 13px; color: white;">✅ ${nomeRua}</div>
        <div style="font-size: 11px; color: #00ced1;">Distância: ${distanciaKM} km</div>
    `;
    historico.prepend(card);
};

// Função para focar no mapa
window.finalizarEntregaEditada = function(idDiv, idInput, coordsDestino) {
    const nomeRuaEditado = document.getElementById(idInput).value; // Pega o que foi digitado
    
    // Chama a lógica de KM que você já tem
    finalizarComKM(idDiv, nomeRuaEditado, coordsDestino);
};
