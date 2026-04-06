// Use LET em vez de CONST para permitir a reinicialização se necessário
let map;
let totalGanhos = 0;
const baseCoords = [-25.4614, -49.2275]; // Scooby Dog - Itupava

function inicializarMapa() {
    // Resolve o erro "Map container is already initialized"
    if (map !== undefined) {
        map.remove();
    }

    map = L.map('map', { zoomControl: false }).setView(baseCoords, 14);

    // Tema Dark para parecer o app do entregador
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

    // Marcador da Hamburgueria (Referência)
    L.circleMarker(baseCoords, {
        radius: 10, fillColor: "#ff4757", color: "#white", weight: 3, fillOpacity: 1
    }).addTo(map).bindPopup("Scooby Dog - Itupava");
}

window.adicionarNovoPedido = function() {
    const id = document.getElementById('pedido-id').value;
    const endereco = document.getElementById('pedido-endereco').value;
    const taxa = parseFloat(document.getElementById('pedido-taxa').value) || 0;

    if (!id || !endereco) return alert("Preencha os campos!");

    // Simula a posição do entregador no mapa
    const lat = baseCoords[0] + (Math.random() - 0.5) * 0.02;
    const lng = baseCoords[1] + (Math.random() - 0.5) * 0.02;

    const marker = L.circleMarker([lat, lng], {
        radius: 8, fillColor: "#00bcd4", color: "white", weight: 2, fillOpacity: 1
    }).addTo(map);

    // Adiciona o card na lista lateral
    const lista = document.getElementById('lista-pedidos');
    const card = document.createElement('div');
    card.className = 'card-pedido';
    card.style = "background: white; padding: 15px; border-radius: 10px; margin-bottom: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);";
    card.innerHTML = `
        <div style="display:flex; justify-content:space-between; font-weight:bold;">
            <span style="color:#00bcd4;">#${id}</span>
            <span>R$ ${taxa.toFixed(2)}</span>
        </div>
        <div style="font-size:13px; color:#666; margin: 5px 0;">${endereco}</div>
        <button onclick="finalizarEntrega(this, ${taxa}, ${marker._leaflet_id})" style="width:100%; background:#2ed573; color:white; border:none; padding:8px; border-radius:5px; cursor:pointer;">Finalizar</button>
    `;
    lista.prepend(card);
};

window.finalizarEntrega = function(btn, valor, markerId) {
    // Atualiza o painel de ganhos estilo 99
    totalGanhos += valor;
    document.getElementById('valor-total').innerText = `R$ ${totalGanhos.toFixed(2).replace('.', ',')}`;
    
    // Remove o card e o marcador do mapa
    btn.parentElement.remove();
    map.eachLayer((layer) => {
        if (layer._leaflet_id === markerId) map.removeLayer(layer);
    });
};

// Inicia o sistema
inicializarMapa();
