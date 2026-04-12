import { db } from './firebase-config.js';
import { collection, addDoc, doc, deleteDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

/**
 * Função para adicionar um novo pedido no Firestore
 * Utiliza Geocoding para converter o endereço em coordenadas para o mapa
 */
export async function adicionarPedido() {
    const inputId = document.getElementById('p-id');
    const inputEnd = document.getElementById('p-end');
    const inputTaxa = document.getElementById('p-taxa');

    // Validação básica para evitar documentos vazios no Firestore
    if (!inputEnd || !inputEnd.value) {
        alert("O endereço é obrigatório para localizar a entrega!");
        return;
    }

    try {
        // Busca coordenadas em Curitiba usando a API do OpenStreetMap (Nominatim)
        const busca = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputEnd.value + ", Curitiba")}`);
        const resultados = await busca.json();

        if (resultados.length > 0) {
            const { lat, lon } = resultados[0];

            // Gravação no Banco de Dados
            await addDoc(collection(db, "pedidos"), {
                numero: inputId.value || "S/N",
                endereco: inputEnd.value,
                taxa: inputTaxa.value || "0,00",
                lat: parseFloat(lat),
                lng: parseFloat(lon),
                status: "pendente",
                criadoEm: serverTimestamp()
            });

            // Limpa os campos para o próximo pedido
            inputId.value = '';
            inputEnd.value = '';
            inputTaxa.value = '';
            console.log("Pedido despachado com sucesso!");
        } else {
            alert("Endereço não encontrado. Verifique a rua e o número.");
        }
    } catch (erro) {
        console.error("Erro na operação de admin:", erro);
        alert("Erro ao conectar com o servidor.");
    }
}

/**
 * Funções de Gerenciamento da Lista
 * Expostas no objeto window para funcionar com os botões gerados dinamicamente no app.js
 */
window.removerPedido = async (id) => {
    if (confirm("Tem certeza que deseja remover este pedido?")) {
        try {
            await deleteDoc(doc(db, "pedidos", id));
        } catch (erro) {
            console.error("Erro ao deletar:", erro);
        }
    }
};

window.editarPedido = async (id, endAtual, taxaAtual) => {
    const novoEnd = prompt("Editar Endereço:", endAtual);
    const novaTaxa = prompt("Editar Taxa:", taxaAtual);

    if (novoEnd !== null) {
        try {
            await updateDoc(doc(db, "pedidos", id), {
                endereco: novoEnd,
                taxa: novaTaxa || taxaAtual
            });
        } catch (erro) {
            console.error("Erro ao atualizar:", erro);
        }
    }
};

// Inicialização segura: Garante que o evento só seja atribuído se o botão existir
document.addEventListener('DOMContentLoaded', () => {
    const btnAdd = document.getElementById('btn-add');
    if (btnAdd) {
        btnAdd.addEventListener('click', adicionarPedido);
    }
});
