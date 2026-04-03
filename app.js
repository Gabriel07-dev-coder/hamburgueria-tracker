<script>
    // Ponto de partida fixo (Scooby Dog)
    const baseCoords = L.latLng(-25.4431, -49.2761); 

    window.finalizarComKM = function(idDiv, nomeRua, coordsDestino) {
        // 1. Remove da lista de andamento
        const itemSaindo = document.getElementById(idDiv);
        if (itemSaindo) itemSaindo.remove();

        // 2. Calcula KM real usando o Leaflet
        const destino = L.latLng(coordsDestino[0], coordsDestino[1]);
        const distanciaKM = (baseCoords.distanceTo(destino) / 1000).toFixed(2);

        // 3. Adiciona no painel inferior de finalizadas
        const historico = document.getElementById('historico-entregas');
        const card = document.createElement('div');
        card.className = 'card-historico'; // Certifique-se de ter esse CSS
        card.innerHTML = `
            <div style="font-size: 13px; color: white;">✅ ${nomeRua}</div>
            <div style="font-size: 11px; color: #00ced1;">Distância: ${distanciaKM} km</div>
        `;
        
        historico.prepend(card);
    };

    window.focarRota = function(lat, lng, nome) {
        // Move o mapa com efeito suave para o destino
        map.flyTo([lat, lng], 16, { duration: 1.5 });
        L.marker([lat, lng]).addTo(map).bindPopup(nome).openPopup();
    };
</script>
