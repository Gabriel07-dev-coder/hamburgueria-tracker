// Inicialização do Mapa com tema mais limpo
const map = L.map('map', { zoomControl: false }).setView([-25.4614, -49.2275], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
L.control.zoom({ position: 'bottomright' }).addTo(map);

// Função para adicionar pedido com visual de card
window.adicionarNovoPedido = function() {
    const id = document.getElementById('pedido-id').value;
    const endereco = document.getElementById('pedido-endereco').value;
    const taxa = document.getElementById('pedido-taxa').value || "0.00";

    if (!id || !endereco) return alert("Preencha os campos!");

    // Simulação de Coordenadas (Em produção, use uma API de Geocoding)
    const lat = -25.4614 + (Math.random() - 0.5) * 0.03;
    const lng = -49.2275 + (Math.random() - 0.5) * 0.03;

    // Marcador Circular Profissional
    L.circleMarker([lat, lng], {
        radius: 10, fillOpacity: 0.9, color: 'white', weight: 2, fillColor: '#ff4757'
    }).addTo(map).bindPopup(`<b>Pedido #${id}</b><br>${endereco}`);

    // Criar Card na Barra Lateral
    const lista = document.getElementById('lista-pedidos');
    const card = document.createElement('div');
    card.className = 'card-pedido';
    card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <span class="status-badge status-active">A caminho</span>
            <span style="font-weight: bold; color: var(--primary);">#${id}</span>
        </div>
        <div style="margin-top: 10px; font-size: 14px; color: #555;">${endereco}</div>
        <div style="margin-top: 8px; display: flex; justify-content: space-between; font-size: 12px; color: #888;">
            <span>Taxa: R$ ${taxa}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="border:none; background:none; color:red; cursor:pointer;">Remover</button>
        </div>
    `;
    lista.prepend(card);

    // Limpar inputs
    document.getElementById('pedido-id').value = '';
    document.getElementById('pedido-endereco').value = '';
};
