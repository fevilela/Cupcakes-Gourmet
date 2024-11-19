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
        listItem.innerHTML =
            `<span>${item.name}</span>
            <span>R$${(item.price * item.quantity).toFixed(2)}</span>
            <div class="cart-item-controls">
                <button onclick="changeQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)">+</button>
                <button onclick="removeItem(${index})">
                    🗑️
                </button>
            </div>`
            ;
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
    // Aqui, você pode pegar informações como o método de entrega e o carrinho.
    const deliveryMethod = document.querySelector("#delivery-method").value; // Exemplo de select
    alert(`Pedido finalizado com a entrega: ${deliveryMethod}`);
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

document.getElementById("search-icon").addEventListener("click", function () {
    const searchInput = document.getElementById("search-input");

    if (!searchInput.style.display || searchInput.style.display === "none") {
        searchInput.style.display = "block";
        searchInput.focus();
    } else {
        searchInput.style.display = "none";
        searchInput.value = "";
        document.getElementById("suggestions").style.display = "none";
    }

});

function selectItem(item) {
    // Insere o nome do item no campo de busca
    document.getElementById("search-input").value = item.getAttribute("data-name");
    document.getElementById("suggestions").style.display = "none"; // Esconde o menu suspenso

    // Rola a página até o item selecionado
    item.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Função que abre o modal de finalizar pedido
function openModal() {
    const modal = document.getElementById("order-modal");
    modal.style.display = "block";
}

// Função que fecha o modal de finalizar pedido
function closeModal() {
    const modal = document.getElementById("order-modal");
    modal.style.display = "none";
}

// Valida os campos obrigatórios para a entrega
function validateDeliveryFields() {
    const address = document.getElementById("address")?.value.trim();
    const number = document.getElementById("number")?.value.trim();
    const neighborhood = document.getElementById("neighborhood")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const city = document.getElementById("city")?.value.trim();

    if (!address || !number || !neighborhood || !phone || !city) {
        alert("Por favor, preencha todos os campos obrigatórios para entrega.");
        return false;
    }

    return true;
}

// Lógica para confirmar o pedido
function finalizeOrder() {
    const deliveryMethod = document.getElementById("delivery-method").value;

    // Verifica se a entrega foi selecionada
    if (!deliveryMethod) {
        alert("Por favor, selecione o método de entrega.");
        return;
    }

    if (deliveryMethod === "entrega" && !validateDeliveryFields()) {
        // Impede a finalização se houver campos inválidos para entrega
        return;
    }

    alert("Pedido finalizado com sucesso! Obrigado por comprar conosco.");
    cartItems = []; // Limpa o carrinho
    updateCart();
    closeModal(); // Fecha o modal
}

// Alterna a exibição dos campos de endereço para entrega
function toggleAddressFields() {
    const deliveryMethod = document.getElementById("delivery-method").value;
    const deliveryFields = document.getElementById("delivery-fields");

    if (deliveryMethod === "entrega") {
        deliveryFields.style.display = "block";
    } else {
        deliveryFields.style.display = "none";
    }
}

// Adiciona evento ao botão "Finalizar Pedido"
document.getElementById("finalize-order-btn").addEventListener("click", finalizeOrder);

// Adiciona evento para alternar os campos de endereço conforme o método de entrega
document.getElementById("delivery-method").addEventListener("change", toggleAddressFields);

// Evento de clique no botão "Saber Mais"
// Evento de clique no botão "Saber Mais"
document.querySelectorAll(".menu .box .know-more-btn").forEach(button => {
    button.addEventListener("click", (event) => {
        event.preventDefault(); // Impede que qualquer outra ação aconteça ao clicar

        const cupcake = button.closest(".box"); // Encontra o cupcake clicado
        const name = cupcake.querySelector("h3").textContent;
        const description = cupcake.getAttribute("data-description");
        const allergens = cupcake.getAttribute("data-allergens");

        // Exibe o modal com as informações
        document.getElementById("modal-title").textContent = name;
        document.getElementById("modal-description").textContent = description;
        document.getElementById("modal-allergens").textContent = "Alergênicos: " + allergens;

        // Exibe o modal
        document.getElementById("modal-more").style.display = "block";
    });
});

// Evento para fechar o modal quando clicar no "X"
document.querySelector(".modal-more .close").addEventListener("click", () => {
    document.getElementById("modal-more").style.display = "none";
});

// Fecha o modal se o usuário clicar fora da área do conteúdo
window.addEventListener("click", (event) => {
    if (event.target === document.getElementById("modal-more")) {
        document.getElementById("modal-more").style.display = "none";
    }
});

// Evento de clique no botão "Adicionar ao Carrinho"
document.querySelectorAll(".menu .box .add-to-cart-btn").forEach(button => {
    button.addEventListener("click", (event) => {
        event.preventDefault(); // Impede que qualquer outra ação aconteça ao clicar

        const cupcake = button.closest(".box"); // Encontra o cupcake clicado
        const itemName = cupcake.querySelector("h3").textContent;
        const itemPrice = cupcake.querySelector(".price").textContent.replace("R$", "").trim();

        // Adiciona o cupcake ao carrinho
        addToCart(itemName, itemPrice);
    });
});