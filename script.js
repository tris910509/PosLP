let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = null;
let products = JSON.parse(localStorage.getItem("products")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [];

function showLoginForm() {
    document.getElementById("login-register").style.display = "block";
    document.getElementById("register-form").style.display = "none";
}

function showRegisterForm() {
    document.getElementById("login-register").style.display = "block";
    document.getElementById("login-form").style.display = "none";
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem("currentUser", JSON.stringify(user));
        document.getElementById("login-register").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
    } else {
        alert("Email atau Password salah!");
    }
}

function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById("new-email").value;
    const password = document.getElementById("new-password").value;

    if (users.some(user => user.email === email)) {
        alert("Email sudah terdaftar!");
        return;
    }

    const newUser = { email, password, role: "user" };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Pendaftaran berhasil! Silakan login.");
    showLoginForm();
}

function showProducts() {
    document.getElementById("products-section").style.display = "block";
    let productHTML = products.map(product => `
        <div>
            <h3>${product.name}</h3>
            <p>Harga: ${product.price}</p>
            <button onclick="editProduct('${product.id}')">Edit</button>
        </div>
    `).join("");
    document.getElementById("products-list").innerHTML = productHTML;
}

function addProduct() {
    const productName = prompt("Masukkan nama produk");
    const productPrice = prompt("Masukkan harga produk");
    const newProduct = { id: Date.now().toString(), name: productName, price: productPrice };
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    showProducts();
}

function showCategories() {
    document.getElementById("categories-section").style.display = "block";
    let categoryHTML = categories.map(category => `
        <div>
            <h3>${category.name}</h3>
        </div>
    `).join("");
    document.getElementById("categories-list").innerHTML = categoryHTML;
}

function addCategory() {
    const categoryName = prompt("Masukkan nama kategori");
    const newCategory = { id: Date.now().toString(), name: categoryName };
    categories.push(newCategory);
    localStorage.setItem("categories", JSON.stringify(categories));
    showCategories();
}

// Event listeners for login and register
document.getElementById("login-form").addEventListener("submit", handleLogin);
document.getElementById("register-form").addEventListener("submit", handleRegister);
let products = JSON.parse(localStorage.getItem("products")) || [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];



function showTransactions() {
    document.getElementById("transactions-section").style.display = "block";
    let transactionHTML = transactions.map(transaction => `
        <div>
            <h3>Transaksi #${transaction.id}</h3>
            <p>Produk: ${transaction.product.name} (x${transaction.quantity})</p>
            <p>Total Harga: Rp ${transaction.totalPrice}</p>
            <p>Metode Pembayaran: ${transaction.paymentMethod}</p>
            <p>Status Pembayaran: ${transaction.status}</p>
        </div>
    `).join("");
    document.getElementById("transactions-list").innerHTML = transactionHTML;
}


function populateProductList() {
    const productSelect = document.getElementById("product");
    products.forEach(product => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = `${product.name} - Rp ${product.price}`;
        productSelect.appendChild(option);
    });
}





function addTransaction() {
    document.getElementById("transactions-section").style.display = "none";
    document.getElementById("add-transaction-section").style.display = "block";
    populateProductList();
}



function handleTransaction(event) {
    event.preventDefault();
    
    const productId = document.getElementById("product").value;
    const quantity = parseInt(document.getElementById("quantity").value);
    const paymentMethod = document.getElementById("payment-method").value;

    const product = products.find(p => p.id === productId);
    if (!product) {
        alert("Produk tidak ditemukan!");
        return;
    }

    const totalPrice = product.price * quantity;
    const transaction = {
        id: Date.now().toString(),
        product: product,
        quantity: quantity,
        totalPrice: totalPrice,
        paymentMethod: paymentMethod,
        status: "Lunas"
    };

    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    alert("Transaksi berhasil!");
    showTransactions(); // Tampilkan daftar transaksi lagi
    cancelTransaction();
}

function cancelTransaction() {
    document.getElementById("add-transaction-section").style.display = "none";
    document.getElementById("transactions-section").style.display = "block";
}



document.getElementById("transaction-form").addEventListener("submit", handleTransaction);


const shippingCost = parseFloat(document.getElementById("shipping").value) || 0;
const totalPrice = (product.price * quantity) + shippingCost;




































