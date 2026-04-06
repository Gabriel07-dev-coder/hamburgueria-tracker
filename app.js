let map;
let totalGanhos = 0;

// Corrigido para Visconde de Nácar, 1440 - Onde você realmente está testando
const baseCoords = [-25.4351, -49.2786]; 

function inicializarMapa() {
    if (map !== undefined) {
        map.remove();
    }

    // Zoom 16 para detalhamento urbano do Centro de Curitiba
    map = L.map('map', { zoomControl: false }).setView(baseCoords, 16);

    // Tema Dark que você escolheu para o app do entregador
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

    L.circleMarker(baseCoords, {
        radius: 10, fillColor: "#ff4757", color: "white", weight: 3, fillOpacity: 1
    }).addTo(map).bindPopup("<b>Scooby Dog</b><br>Centro");
}

window.adicionarNovoPedido = function() {
    const id = document.getElementById('pedido-id').value;
    const endereco = document.getElementById('pedido-endereco').value;
    const taxa = parseFloat(document.getElementById('pedido-taxa').value) || 0;

    if (!id || !endereco) return alert("Preencha os campos!");

    // Fator de dispersão menor para os pedidos não caírem no meio do mato
    const lat = baseCoords[0] + (Math.random() - 0.5) * 0.006;
    const lng = baseCoords[1] + (Math.random() - 0.5) * 0.006;

    const marker = L.circleMarker([lat, lng], {
        radius: 8, fillColor: "#00bcd4", color: "white", weight: 2, fillOpacity: 1
    }).addTo(map);

    const lista = document.getElementById('lista-pedidos');
    const card = document.createElement('div');
    card.className = 'order-item'; // Classe do seu CSS atualizado
    card.innerHTML = `
        <div class="order-info">
            <span class="order-number">#${id}</span>
            <span class="order-address">${endereco}</span>
        </div>
        <div style="text-align: right;">
            <div style="font-weight: bold; margin-bottom: 5px;">R$ ${taxa.toFixed(2)}</div>
            <button class="btn-finalizar" onclick="finalizarEntrega(this, ${taxa}, ${marker._leaflet_id})">Finalizar</button>
        </div>
    `;
    lista.prepend(card);
    
    // Limpeza automática para você não perder tempo
    document.getElementById('pedido-id').value = '';
    document.getElementById('pedido-endereco').value = '';
    document.getElementById('pedido-taxa').value = '';
};

window.finalizarEntrega = function(btn, valor, markerId) {
    totalGanhos += valor;
    
    // Atualiza o painel de ganhos estilo 99 que você montou
    const displayGanhos = document.getElementById('valor-total');
    if(displayGanhos) {
        displayGanhos.innerText = `R$ ${totalGanhos.toFixed(2).replace('.', ',')}`;
    }
    
    btn.closest('.order-item').remove();
    map.eachLayer((layer) => {
        if (layer._leaflet_id === markerId) map.removeLayer(layer);
    });
};

inicializarMapa();
