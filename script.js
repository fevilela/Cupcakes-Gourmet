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


