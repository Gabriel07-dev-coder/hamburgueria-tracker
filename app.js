let map;
let userMarker;
let totalGanhos = 0;

function inicializarMapa() {
    if (map !== undefined) {
        map.remove();
    }

    // Inicializa o mapa com zoom focado para navegação urbana
    map = L.map('map', { zoomControl: false }).setView([-25.4351, -49.2786], 16);

    // Tema Dark estilo "99/Uber" que você validou nos prints
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

    // Ativa o rastreamento em tempo real
    configurarRastreamento();
}

function configurarRastreamento() {
    if (!navigator.geolocation) {
        return alert("Seu navegador não suporta geolocalização.");
    }

    // Função que observa a mudança de posição
    navigator.geolocation.watchPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            const novaPos = [latitude, longitude];

            // Se o marcador do entregador não existir, cria. Se existir, move.
            if (!userMarker) {
                userMarker = L.circleMarker(novaPos, {
                    radius: 10,
                    fillColor: "#00bcd4", // Azul do seu painel de ganhos
                    color: "white",
                    weight: 3,
                    fillOpacity: 1
                }).addTo(map).bindPopup("Você está aqui");
            } else {
                userMarker.setLatLng(novaPos);
            }

            // Centraliza o mapa na sua posição atual
            map.panTo(novaPos);
        },
        (err) => {
            console.error("Erro ao rastrear: ", err);
        },
        {
            enableHighAccuracy: true, // Usa o GPS do celular para maior precisão
            maximumAge: 0,
            timeout: 5000
        }
    );
}

// Mantenha suas funções de adicionar e finalizar pedidos abaixo
window.adicionarNovoPedido = function() {
    const id = document.getElementById('pedido-id').value;
    const endereco = document.getElementById('pedido-endereco').value;
    const taxa = parseFloat(document.getElementById('pedido-taxa').value) || 0;

    if (!id || !endereco) return alert("Preencha os campos!");

    // Gera o marcador de entrega perto da sua posição atual
    const center = userMarker ? userMarker.getLatLng() : map.getCenter();
    const lat = center.lat + (Math.random() - 0.5) * 0.005;
    const lng = center.lng + (Math.random() - 0.5) * 0.005;

    const marker = L.circleMarker([lat, lng], {
        radius: 8, fillColor: "#ff4757", color: "white", weight: 2, fillOpacity: 1
    }).addTo(map);

    const lista = document.getElementById('lista-pedidos');
    const card = document.createElement('div');
    card.className = 'order-item'; 
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
    
    document.getElementById('pedido-id').value = '';
    document.getElementById('pedido-endereco').value = '';
    document.getElementById('pedido-taxa').value = '';
};

window.finalizarEntrega = function(btn, valor, markerId) {
    totalGanhos += valor;
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
