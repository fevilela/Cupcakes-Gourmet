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

document.getElementById("search-icon").addEventListener("click", function () {
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

// Função para abrir o modal (por exemplo, quando o usuário clica no botão "Finalizar Pedido" na página principal)
function openModal() {
    document.getElementById("modal-checkout").style.display = "block"; // Exibe o modal
}

// Função para fechar o modal (pode ser chamada quando o pedido for finalizado ou cancelado)
function closeModal() {
    document.getElementById("modal-checkout").style.display = "none"; // Oculta o modal
}

// Função para confirmar o pedido quando o botão "Finalizar Pedido" é clicado
function confirmOrder(event) {
    event.preventDefault(); // Evita o envio do formulário e recarregamento da página

    const deliveryOption = document.getElementById("delivery-option").value;
    const city = document.getElementById("city").value;
    const cafeteriaCity = "Curitiba";

    // Verifica se a cidade está correta para a entrega
    if (deliveryOption === "delivery" && city.toLowerCase() !== cafeteriaCity.toLowerCase()) {
        alert("Desculpe, a entrega é permitida apenas na cidade de " + cafeteriaCity + ".");
        return;
    }

    // Exibe mensagem de confirmação
    alert("Pedido confirmado! Obrigado por comprar conosco.");

    // Limpa o carrinho de compras e fecha o modal
    cartItems = []; // Limpa o carrinho (ou faça a lógica de remoção)
    updateCart(); // Atualiza o carrinho
    closeModal(); // Fecha o modal de checkout
}

// Associa o evento de clique no botão "Finalizar Pedido"
document.getElementById("finalize-order").addEventListener("click", confirmOrder);


// Abertura do Modal
document.getElementById("finalizarPedidoBtn").addEventListener("click", () => {
    // Verifica se o usuário está logado
    const token = localStorage.getItem("authToken");

    if (!token) {
        openModal();
    } else {
        alert("Você já está logado! Finalizando o pedido...");
        // Aqui você pode continuar com o processo de finalizar pedido
    }
});

// Exibe o Modal
function openModal() {
    document.getElementById("authModal").style.display = "block";
}

// Fecha o Modal
function closeModal() {
    document.getElementById("authModal").style.display = "none";
}

// Alternar entre Login e Cadastro
document.getElementById("switchToRegister").addEventListener("click", () => {
    document.getElementById("authButton").innerText = "Cadastrar";
    document.getElementById("authForm").onsubmit = registerUser;
});

// Login e Cadastro
document.getElementById("authForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Verifica qual ação (login ou cadastro) deve ser realizada
    const authButtonText = document.getElementById("authButton").innerText;

    if (authButtonText === "Entrar") {
        loginUser(email, password);
    } else {
        registerUser(email, password);
    }
});

// Função para Login
async function loginUser(email, password) {
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.token) {
        localStorage.setItem("authToken", data.token); // Armazena o token JWT no localStorage
        closeModal();
        alert("Login bem-sucedido! Agora você pode finalizar o pedido.");
    } else {
        document.getElementById("authError").innerText = data.error || "Erro ao fazer login.";
    }
}

// Função para Cadastro
async function registerUser(email, password) {
    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.message) {
        alert("Cadastro realizado com sucesso! Agora, faça login.");
        document.getElementById("authButton").innerText = "Entrar";
        document.getElementById("authForm").onsubmit = loginUser;
    } else {
        document.getElementById("authError").innerText = data.error || "Erro ao cadastrar.";
    }
}

