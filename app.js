<script>
    // Ponto de partida (Ex: Scooby Dog)
    const baseCoords = L.latLng(-25.4431, -49.2761); 

    function finalizarComKM(idDiv, nomeRua, coordsDestino) {
        // 1. Remove da lista de ativas
        document.getElementById(idDiv).remove();

        // 2. Calcula KM real usando o Leaflet
        const destino = L.latLng(coordsDestino[0], coordsDestino[1]);
        const distanciaKM = (baseCoords.distanceTo(destino) / 1000).toFixed(2);

        // 3. Adiciona apenas as informações no histórico
        const historico = document.getElementById('historico-entregas');
        const novoCard = document.createElement('div');
        novoCard.className = 'card-historico';
        novoCard.innerHTML = `
            <div style="font-size: 13px; font-weight: bold;">${nomeRua}</div>
            <div style="font-size: 11px; opacity: 0.7;">Distância: ${distanciaKM} km</div>
        `;
        historico.prepend(novoCard); // Coloca a mais recente no topo
    }
</script>
