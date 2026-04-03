// Configuração do Mapa com Leaflet
// Usando coordenadas de Curitiba como exemplo (perto da Itupava)
const map = L.map('map').setView([-25.4614, -49.2275], 13);

// Adiciona as "peças" do mapa (Tema Claro como no modelo)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Define o ícone de partida (Hamburgueria - Central)
const homeIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Marcador da Central (Casa Roxa no modelo)
L.marker([-25.4614, -49.2275], {icon: homeIcon}).addTo(map).bindPopup('Hamburgueria - Scooby Dog');

// Função para gerar os marcadores e a lista (Lógica principal)
function carregarPedidos() {
    const lista = document.getElementById('lista-pedidos');
    lista.innerHTML = ''; // Limpa antes de carregar
    
    // Dados de exemplo baseados no modelo
    const pedidosMock = [
        { id: '01', status: 'entregando', coords: [-25.4625, -49.2300], cor: 'green' },
        { id: '02', status: 'entregando', coords: [-25.4600, -49.2200], cor: 'blue' },
        { id: '03', status: 'entregando', coords: [-25.4630, -49.2250], cor: 'blue' },
        { id: '04', status: 'entregando', coords: [-25.4610, -49.2320], cor: 'blue' },
        { id: '05', status: 'entregando', coords: [-25.4605, -49.2290], cor: 'blue' },
        { id: '06', status: 'entregando', coords: [-25.4590, -49.2260], cor: 'red' },
        { id: '07', status: 'entregando', coords: [-25.4640, -49.2265], cor: 'red' },
        { id: '08', status: 'entregando', coords: [-25.4650, -49.2280], cor: 'red' },
    ];

    pedidosMock.forEach(pedido => {
        // 1. Criar o Marcador no Mapa
        // (Nota: No modelo real, são marcadores personalizados com números)
        // L.circleMarker([lat, lng], {color: 'red'}) é uma opção
        const marcador = L.marker(pedido.coords).addTo(map).bindPopup(`Pedido: ${pedido.id}`);

        // 2. Criar o Item na Lista Lateral
        const item = document.createElement('div');
        item.className = 'pedido-item';
        item.innerHTML = `
            <div class="dot ${pedido.cor}"></div>
            <div class="pedido-id">${pedido.id}</div>
            <div class="pedido-rua">Aguardando Endereço...</div>
            <div class="taxa">calc...</div>
        `;
        lista.appendChild(item);
    });
}

// Inicializa
carregarPedidos();
