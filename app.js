let map;
let totalGanhos = 0;
const baseCoords = [-25.4614, -49.2275]; // Scooby Dog - Itupava

function inicializarMapa() {
    if (map !== undefined) {
        map.remove();
    }

    map = L.map('map', { zoomControl: false }).setView(baseCoords, 15);

    // Tema Dark essencial para o estilo 99
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

    L.circleMarker(baseCoords, {
        radius: 10, fillColor: "#ff4757", color: "white", weight: 3, fillOpacity: 1
    }).addTo(map).bindPopup("Scooby Dog");
}

window.adicionarNovoPedido = function() {
    const id = document.getElementById('pedido-id').value;
    const endereco = document.getElementById('pedido-endereco').value;
    const taxa = parseFloat(document.getElementById('pedido-taxa').value) || 0;

    if (!id || !endereco) return alert("Preencha os campos!");

    const lat = baseCoords[0] + (Math.random() - 0.5) * 0.01;
    const lng = baseCoords[1] + (Math.random() - 0.5) * 0.01;

    const marker = L.circleMarker([lat, lng], {
        radius: 8, fillColor: "#00bcd4", color: "white", weight: 2, fillOpacity: 1
    }).addTo(map);

    // Inserção na sua nova .bottom-sheet
    const lista = document.getElementById('lista-pedidos');
    const card = document.createElement('div');
    card.className = 'order-item'; // Usando a classe do seu CSS
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
    
    // Limpa os campos para o próximo
    document.getElementById('pedido-id').value = '';
    document.getElementById('pedido-endereco').value = '';
    document.getElementById('pedido-taxa').value = '';
};

window.finalizarEntrega = function(btn, valor, markerId) {
    totalGanhos += valor;
    
    // ATENÇÃO: O ID aqui deve ser o que está dentro da sua .value no CSS
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
