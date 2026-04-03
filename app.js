// Ponto de partida (Scooby Dog)
const baseCoords = L.latLng(-25.4431, -49.2761); 

// 1. Inicializa o mapa (Garante que a div 'map' receba o conteúdo)
const map = L.map('map').setView([-25.4431, -49.2761], 13);

// 2. Adiciona as "peças" do mapa escuro
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// 3. Função para finalizar e calcular KM
window.finalizarComKM = function(idDiv, nomeRua, coordsDestino) {
    const itemSaindo = document.getElementById(idDiv);
    if (itemSaindo) itemSaindo.remove();

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

// 4. Função para focar no destino ao clicar
window.focarRota = function(lat, lng, nome) {
    map.flyTo([lat, lng], 16);
    L.marker([lat, lng]).addTo(map).bindPopup(nome).openPopup();
};
