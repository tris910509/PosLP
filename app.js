// Elemen DOM
const productContainer = document.getElementById("product-container");
const categoryFilter = document.getElementById("category-filter");
const cartItemsList = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");
const checkoutBtn = document.getElementById("checkout-btn");
const loginSection = document.getElementById("login-section");
const posSection = document.getElementById("pos-section");
const userRoleDisplay = document.getElementById("user-role");
const paymentMethodSelect = document.getElementById("payment-method");

let products = [];
let categories = [];
let suppliers = [];
let paymentMethods = [];
let users = [];
let cart = [];
let currentUser = null;
let transactions = [];

// Ambil data produk, kategori, supplier, dan pengguna
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data.products;
        categories = data.categories;
        suppliers = data.suppliers;
        paymentMethods = data.payment_methods;
        populateCategories();
        displayProducts();
    })
    .catch(error => console.error('Error fetching products:', error));

fetch('users.json')
    .then(response => response.json())
    .then(data => {
        users = data;
    })
    .catch(error => console.error('Error fetching users:', error));

fetch('transactions.json')
    .then(response => response.json())
    .then(data => {
        transactions = data.transactions;
        updateSalesChart();
    })
    .catch(error => console.error('Error fetching transactions:', error));

// Memperbarui kategori produk
function populateCategories() {
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.innerText = category.name;
        categoryFilter.appendChild(option);
    });
}

// Menampilkan produk berdasarkan kategori
categoryFilter.addEventListener('change', () => {
    displayProducts(categoryFilter.value);
});

// Menampilkan produk
function displayProducts(categoryId = '') {
    productContainer.innerHTML = "";
    const filteredProducts = categoryId 
        ? products.filter(product => product.category === categories.find(cat => cat.id == categoryId).name)
        : products;

    filteredProducts.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product-item");
        productElement.innerHTML = `
            <span>${product.name}</span>
            <span>Rp ${product.price}</span>
            <button onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
        `;
        productContainer.appendChild(productElement);
    });
}

// Login
document.getElementById('login-btn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    currentUser = users.find(user => user.username === username && user.password === password);
    if (currentUser) {
        loginSection.style.display = 'none';
        posSection.style.display = 'block';
        userRoleDisplay.innerText = currentUser.role;
    } else {
        alert("Username atau password salah.");
    }
});

// Menambahkan produk ke keranjang
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCart();
    }
}

// Memperbarui keranjang
function updateCart() {
    cartItemsList.innerHTML = "";
    let total = 0;
    cart.forEach((item, index) => {
        const cartItem = document.createElement("li");
        cartItem.innerHTML = `
            ${item.name} - Rp ${item.price}
            <button onclick="removeFromCart(${index})">Hapus</button>
        `;
        cartItemsList.appendChild(cartItem);
        total += item.price;
    });
    totalPriceElement.innerText = `Rp ${total}`;
}

// Menghapus produk dari keranjang
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Menangani checkout
checkoutBtn.addEventListener('click', () => {
    const paymentMethod = paymentMethodSelect.value;
    if (cart.length > 0) {
        const total = parseInt(totalPriceElement.innerText.replace('Rp ', '').replace(',', ''));
        const transaction = {
            user: currentUser.username,
            date: new Date().toLocaleString(),
            total: total,
            paymentMethod: paymentMethod
        };
        transactions.push(transaction);
        updateSalesChart();
        alert(`Transaksi selesai. Metode pembayaran: ${paymentMethod}. Total: Rp ${total}`);
        cart = [];
        updateCart();
    } else {
        alert("Keranjang kosong.");
    }
});

// Membuat laporan grafik penjualan
function updateSalesChart() {
    const salesData = transactions.reduce((acc, transaction) => {
        const month = new Date(transaction.date).getMonth();
        if (!acc[month]) acc[month] = 0;
        acc[month] += transaction.total;
        return acc;
    }, []);

    const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Penjualan Bulanan',
                data: salesData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
