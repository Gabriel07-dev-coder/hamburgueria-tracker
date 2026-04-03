// 1. Configuração Inicial do Mapa em Curitiba
const map = L.map('map').setView([-25.4614, -49.2275], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// 2. Ícone da Hamburgueria (Scooby Dog)
const homeIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.marker([-25.4614, -49.2275], {icon: homeIcon}).addTo(map).bindPopup('Hamburgueria - Scooby Dog');

// 3. Função para Adicionar Novo Pedido (CORRIGIDA)
window.adicionarNovoPedido = function() {
    const id = document.getElementById('pedido-id').value;
    const endereco = document.getElementById('pedido-endereco').value;
    const taxa = document.getElementById('pedido-taxa').value;

    if (id && endereco) {
        // Simulação de coordenadas próximas para teste em Curitiba
        const lat = -25.4614 + (Math.random() - 0.5) * 0.02;
        const lng = -49.2275 + (Math.random() - 0.5) * 0.02;

        // Ação 1: Criar marcador no mapa
        L.marker([lat, lng]).addTo(map).bindPopup(`<b>Pedido: ${id}</b><br>${endereco}`);

        // Ação 2: Adicionar item na lista lateral
        const lista = document.getElementById('lista-pedidos');
        const item = document.createElement('div');
        item.style.padding = "10px";
        item.style.borderBottom = "1px solid #eee";
        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 10px; height: 10px; border-radius: 50%; background: #00ced1;"></div>
                <strong>${id}</strong> - ${endereco} <span style="margin-left: auto;">R$ ${taxa}</span>
            </div>
        `;
        lista.prepend(item); // Adiciona no topo da lista

        // Ação 3: Limpar campos
        document.getElementById('pedido-id').value = '';
        document.getElementById('pedido-endereco').value = '';
        document.getElementById('pedido-taxa').value = '';
        
        console.log(`Pedido ${id} adicionado com sucesso!`);
    } else {
        alert("Preencha pelo menos o N° do pedido e o endereço!");
    }
};

// 4. Carregar Pedidos Iniciais (Mock)
function carregarPedidosIniciais() {
    const pedidosMock = [
        { id: '01', coords: [-25.4625, -49.2300], cor: 'green', rua: 'Rua Itupava' },
        { id: '02', coords: [-25.4600, -49.2200], cor: 'blue', rua: 'Rua Schiller' }
    ];

    pedidosMock.forEach(p => {
        L.marker(p.coords).addTo(map).bindPopup(`Pedido: ${p.id}`);
        const lista = document.getElementById('lista-pedidos');
        const item = document.createElement('div');
        item.innerHTML = `<div style="padding: 5px;">• Pedido ${p.id}: ${p.rua}</div>`;
        lista.appendChild(item);
    });
}

carregarPedidosIniciais();
