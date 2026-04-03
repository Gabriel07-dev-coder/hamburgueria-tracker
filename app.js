// 1. Configurações Iniciais
const baseCoords = L.latLng(-25.4431, -49.2761); 

// 2. Inicializa o Mapa (Foco em Curitiba)
const map = L.map('map').setView([-25.4431, -49.2761], 13);

// 3. Camada do Mapa Escuro (Dark Mode)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// 4. Funções Globais (acessíveis pelo HTML)
window.finalizarComKM = function(idDiv, nomeRua, coordsDestino) {
    const itemSaindo = document.getElementById(idDiv);
    if (itemSaindo) itemSaindo.remove();

    const destino = L.latLng(coordsDestino[0], coordsDestino[1]);
    const distanciaKM = (baseCoords.distanceTo(destino) / 1000).toFixed(2);

    const historico = document.getElementById('historico-entregas');
    const novoCard = document.createElement('div');
    novoCard.className = 'card-historico';
    novoCard.innerHTML = `
        <div style="font-size: 13px; font-weight: bold; color: white;">✅ ${nomeRua}</div>
        <div style="font-size: 11px; opacity: 0.7; color: #00ced1;">Distância: ${distanciaKM} km</div>
    `;
    historico.prepend(novoCard);
};

window.focarRota = function(lat, lng, nome) {
    map.flyTo([lat, lng], 16);
    L.marker([lat, lng]).addTo(map).bindPopup(nome).openPopup();
};
