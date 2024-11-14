// Elementos da barra lateral e contadores
const cartSidebar = document.getElementById("cart-sidebar");
const cartItemsList = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const totalPriceElement = document.getElementById("total-price");

// Array para armazenar os itens do carrinho
let cartItems = [];

// Função para abrir e fechar o carrinho
function toggleCart() {
    cartSidebar.classList.toggle("open");
}

function closeCart() {
    cartSidebar.classList.remove("open");
}

// Função para adicionar item ao carrinho
function addToCart(itemName, itemPrice) {
    const itemIndex = cartItems.findIndex(item => item.name === itemName);

    if (itemIndex > -1) {
        // Se o item já estiver no carrinho, aumenta a quantidade
        cartItems[itemIndex].quantity += 1;
    } else {
        // Se for um item novo, adiciona ao array
        cartItems.push({ name: itemName, price: parseFloat(itemPrice), quantity: 1 });
    }

    updateCart();
}

// Função para atualizar o carrinho
function updateCart() {
    // Limpa a lista de itens e atualiza com os itens do carrinho
    cartItemsList.innerHTML = "";
    let total = 0;
    let itemCount = 0;

    cartItems.forEach((item, index) => {
        total += item.price * item.quantity;
        itemCount += item.quantity;

        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span>${item.name}</span>
            <span>R$${(item.price * item.quantity).toFixed(2)}</span>
            <div class="cart-item-controls">
                <button onclick="changeQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)">+</button>
                <button onclick="removeItem(${index})">
                    🗑️
                </button>
            </div>
        `;
        cartItemsList.appendChild(listItem);
    });

    // Atualiza o total e o contador do carrinho
    cartCount.textContent = itemCount;
    totalPriceElement.textContent = `R$${total.toFixed(2)}`;
}

// Função para alterar a quantidade de um item
function changeQuantity(index, change) {
    cartItems[index].quantity += change;

    // Remove o item se a quantidade chegar a zero
    if (cartItems[index].quantity === 0) {
        cartItems.splice(index, 1);
    }
    updateCart();
}

// Função para remover um item do carrinho
function removeItem(index) {
    cartItems.splice(index, 1);
    updateCart();
}

// Função para finalizar o pedido
function finalizeOrder() {
    alert("Pedido finalizado com sucesso!");
    cartItems = []; // Limpa o carrinho
    updateCart();
}

// Evento de clique nos botões "Adicionar ao Carrinho"
document.querySelectorAll(".menu .box .btn").forEach(button => {
    button.addEventListener("click", (event) => {
        event.preventDefault();

        // Extrai o nome e o preço do item
        const itemName = button.parentElement.querySelector("h3").textContent;
        const itemPrice = button.parentElement.querySelector(".price").textContent.replace("R$", "").trim();

        // Adiciona o item ao carrinho
        addToCart(itemName, itemPrice);
    });
});

function searchItems() {
    const searchQuery = document.getElementById("search-input").value.toLowerCase().trim();
    const suggestionsContainer = document.getElementById("suggestions");

    // Limpa as sugestões a cada nova busca
    suggestionsContainer.innerHTML = "";

    if (!searchQuery) {
        suggestionsContainer.style.display = "none"; // Esconde o menu se não houver consulta
        return;
    }

    const items = document.querySelectorAll(".menu .box");
    const matchingItems = Array.from(items).filter(item => {
        const itemName = item.getAttribute("data-name").toLowerCase();
        return itemName.includes(searchQuery);
    });

    if (matchingItems.length > 0) {
        // Exibe o contêiner de sugestões
        suggestionsContainer.style.display = "block";

        matchingItems.forEach(item => {
            const suggestion = document.createElement("div");
            suggestion.textContent = item.getAttribute("data-name");
            suggestion.onclick = () => selectItem(item); // Função para selecionar o item
            suggestionsContainer.appendChild(suggestion);
        });
    } else {
        // Se não encontrar nada, exibe uma mensagem
        const noResult = document.createElement("div");
        noResult.textContent = "Nenhum item encontrado";
        noResult.style.color = "#999";
        suggestionsContainer.appendChild(noResult);
        suggestionsContainer.style.display = "block"; // Exibe o menu mesmo sem resultados
    }
}

document.getElementById("search-icon").addEventListener("click", function() {
    const searchInput = document.getElementById("search-input");
    
    // Alterna a visibilidade do campo de pesquisa
    if (searchInput.style.display === "none" || searchInput.style.display === "") {
        searchInput.style.display = "block"; // Exibe a barra de pesquisa
        searchInput.focus(); // Coloca o cursor na barra de pesquisa
    } else {
        searchInput.style.display = "none"; // Oculta a barra de pesquisa
        searchInput.value = ""; // Limpa o campo de pesquisa
        document.getElementById("suggestions").style.display = "none"; // Esconde sugestões
    }
});

function selectItem(item) {
    // Insere o nome do item no campo de busca
    document.getElementById("search-input").value = item.getAttribute("data-name");
    document.getElementById("suggestions").style.display = "none"; // Esconde o menu suspenso
    
    // Rola a página até o item selecionado
    item.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Função para abrir o modal de checkout
function openModal() {
    const modal = document.getElementById("checkout-modal");
    modal.style.display = "block";
}

// Função para fechar o modal de checkout
function closeModal() {
    const modal = document.getElementById("checkout-modal");
    modal.style.display = "none";
}

// Opcional: Fecha o modal quando o usuário clica fora dele
window.onclick = function(event) {
    const modal = document.getElementById("checkout-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

// Função para finalizar o pedido
function submitOrder() {
    const address = document.getElementById("address").value.trim();
    const cep = document.getElementById("cep").value.trim();

    // Validar se o CEP é de Curitiba (exemplo: "80xxxx-xxx")
    const curitibaCepRegex = /^[0-9]{5}-[0-9]{3}$/; // Expressão regular simples para validar o formato de CEP
    const isCuritiba = curitibaCepRegex.test(cep);

    if (!address || !cep) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (!isCuritiba) {
        // Exibe um alerta de erro se o CEP não for de Curitiba
        alert("Desculpe, entregamos apenas em Curitiba.");
    } else {
        // Fechar o modal
        closeModal();

        // Mostrar mensagem de agradecimento
        alert("Pedido finalizado com sucesso! Agradecemos a sua preferência.");
        
        // Limpa o carrinho após finalizar o pedido
        cartItems = []; 
        updateCart();
    }
}

// // Evento para fechar o modal se clicar fora dele
// window.onclick = function(event) {
//     const modal = document.getElementById("checkout-modal");
//     if (event.target === modal) {
//         closeModal();
//     }
// };



