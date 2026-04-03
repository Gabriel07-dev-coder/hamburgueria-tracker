// Remova as tags <script> daqui!
const baseCoords = L.latLng(-25.4431, -49.2761); 

window.finalizarComKM = function(idDiv, nomeRua, coordsDestino) {
    const itemSaindo = document.getElementById(idDiv);
    if (itemSaindo) itemSaindo.remove();

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
