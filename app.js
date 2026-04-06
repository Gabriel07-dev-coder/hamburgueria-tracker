// 1. CONFIGURAÇÃO ÚNICA DO MAPA (Evita o erro de "already initialized")
if (typeof map !== 'undefined') {
    map.remove(); // Remove o mapa anterior se existir para evitar o erro
}

// Coordenadas base da Scooby Dog (Itupava)
const centerCoords = [-25.4614, -49.2275];

const map = L.map('map', { 
    zoomControl: false,
    attributionControl: false 
}).setView(centerCoords, 14);

// Tema Dark para estilo 99/Uber
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

// 2. ÍCONES E MARCADORES
// Marcador da Hamburgueria (Referência Fixa)
const homeIcon = L.divIcon({
    className: 'home-marker',
    html: '<div style="background:#ff4757; width:15px; height:15px; border-radius:50%; border:3px solid white; box-shadow: 0 0 10px rgba(255,71,87,0.5);"></div>',
    iconSize: [15, 15]
});
L.marker(centerCoords, { icon: homeIcon }).addTo(map).bindPopup("<b>Scooby Dog - Itupava</b>");

// 3. LÓGICA DE GANHOS
let totalGanhos = 0;
function atualizarGanhos(valor) {
    totalGanhos += parseFloat(valor);
    const display = document.getElementById('valor-total');
    if (display) display.innerText = `R$ ${totalGanhos.toFixed(2).replace('.', ',')}`;
}

// 4. ADICIONAR NOVO PEDIDO (Sincronizado com os inputs)
window.adicionarNovoPedido = function() {
    const id = document.getElementById('pedido-id').value;
    const endereco = document.getElementById('pedido-endereco').value;
    const taxaInput = document.getElementById('pedido-taxa').value;
    const taxa = taxaInput ? parseFloat(taxaInput.replace(',', '.')) : 0.00;

    if (!id || !endereco) return alert("Preencha os campos obrigatórios!");

    // Simulação de coordenada próxima ao endereço
    const lat = centerCoords[0] + (Math.random() - 0.5) * 0.02;
    const lng = centerCoords[1] + (Math.random() - 0.5) * 0.02;

    // Marcador de Pedido estilo 99
    const marker = L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: "#00bcd4", // Azul estilo 99
        color: "#fff",
        weight: 2,
        fillOpacity: 1
    }).addTo(map).bindPopup(`<b>Pedido #${id}</b><br>${endereco}`);

    // Criar Card na Lista
    const lista = document.getElementById('lista-pedidos');
    const card = document.createElement('div');
    card.className = 'card-pedido';
    card.innerHTML = `
        <div style="padding: 15px; border-bottom: 1px solid #eee; background: #fff; margin-bottom: 5px; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #00bcd4; font-weight: bold;">#${id}</span>
                <span style="font-size: 12px; color: #888;">Taxa: R$ ${taxa.toFixed(2)}</span>
            </div>
            <div style="font-size: 14px; margin: 8px 0;">${endereco}</div>
            <button onclick="finalizarPedido(this, ${taxa}, ${marker._leaflet_id})" style="width: 100%; padding: 5px; background: #2ed573; color: white; border: none; border-radius: 4px; cursor: pointer;">Finalizar</button>
        </div>
    `;
    lista.prepend(card);

    // Limpar campos
    document.getElementById('pedido-id').value = '';
    document.getElementById('pedido-endereco').value = '';
    document.getElementById('pedido-taxa').value = '';
};

// 5. FINALIZAR PEDIDO (
