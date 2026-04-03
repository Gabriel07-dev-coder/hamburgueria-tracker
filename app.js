<script>
    // Ponto de partida (Ex: Scooby Dog - R. Itupava)
    const baseCoords = L.latLng(-25.4431, -49.2761); 

    function finalizarComKM(idDiv, nomeRua, coordsDestino) {
        // 1. Remove da lista de andamento
        const itemSaindo = document.getElementById(idDiv);
        if (itemSaindo) itemSaindo.remove();

        // 2. Calcula KM real usando o Leaflet
        const destino = L.latLng(coordsDestino[0], coordsDestino[1]);
        const distanciaKM = (baseCoords.distanceTo(destino) / 1000).toFixed(2);

        // 3. Adiciona no painel inferior de finalizadas
        const historico = document.getElementById('historico-entregas');
        const card = document.createElement('div');
        card.className = 'card-historico';
        card.innerHTML = `
            <div style="font-size: 13px; color: white;">✅ ${nomeRua}</div>
            <div style="font-size: 11px; color: #00ced1;">Distância: ${distanciaKM} km</div>
        `;
        
        historico.prepend(card); // Adiciona no início da lista
    }

    // Função para mover o mapa quando clicar na rua
    function focarRota(lat, lng, nome) {
        map.flyTo([lat, lng], 16, { duration: 1.5 });
        L.marker([lat, lng]).addTo(map).bindPopup(nome).openPopup();
    }
</script>
