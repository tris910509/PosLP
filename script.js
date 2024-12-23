// Produk Data
let products = JSON.parse(localStorage.getItem('products')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || [];
let suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
let members = JSON.parse(localStorage.getItem('members')) || [];
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Helper Functions
function saveData() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
    localStorage.setItem('members', JSON.stringify(members));
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

function renderProducts() {
    const tbody = document.querySelector('#productList');
    tbody.innerHTML = '';
    products.forEach((product, index) => {
        const totalPrice = product.price * (1 - product.discount / 100);
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.supplier}</td>
                <td>${product.unit}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>${product.discount.toFixed(2)}%</td>
                <td>${totalPrice.toFixed(2)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editProduct(${index})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function renderCategories() {
    const select = document.getElementById('productCategory');
    select.innerHTML = '';
    categories.forEach(category => {
        select.innerHTML += `<option value="${category}">${category}</option>`;
    });
}

function renderSuppliers() {
    const select = document.getElementById('productSupplier');
    select.innerHTML = '';
    suppliers.forEach(supplier => {
        select.innerHTML += `<option value="${supplier}">${supplier}</option>`;
    });
}

function renderMembers() {
    const tbody = document.querySelector('#memberList');
    tbody.innerHTML = '';
    members.forEach((member, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${member.name}</td>
                <td>${member.phone}</td>
                <td>${member.totalTransactions || 0}</td>
            </tr>
        `;
    });
}

function renderTransactions() {
    const tbody = document.querySelector('#transactionList');
    tbody.innerHTML = '';
    transactions.forEach((transaction, index) => {
        const product = products.find(p => p.name === transaction.product);
        const member = members.find(m => m.name === transaction.member);
        const totalPrice = product.price * transaction.quantity * (1 - product.discount / 100);
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${transaction.product}</td>
                <td>${transaction.member}</td>
                <td>${transaction.quantity}</td>
                <td>${transaction.date}</td>
                <td>${totalPrice.toFixed(2)}</td>
            </tr>
        `;
    });
}

// Produk CRUD
function addProductFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("productName").value;
    const category = document.getElementById("productCategory").value;
    const supplier = document.getElementById("productSupplier").value;
    const unit = document.getElementById("productUnit").value;
    const price = parseFloat(document.getElementById("productPrice").value);
    const discount = parseFloat(document.getElementById("productDiscount").value || 0);

    products.push({ name, category, supplier, unit, price, discount });
    saveData();
    renderProducts();
    resetProductForm();
}

function editProduct(index) {
    const product = products[index];
    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productSupplier").value = product.supplier;
    document.getElementById("productUnit").value = product.unit;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productDiscount").value = product.discount;
    
    document.querySelector("#addProductForm button").innerText = "Simpan";
    document.querySelector("#addProductForm").onsubmit = (e) => {
        e.preventDefault();
        updateProduct(index);
    };
}

function updateProduct(index) {
    const name = document.getElementById("productName").value;
    const category = document.getElementById("productCategory").value;
    const supplier = document.getElementById("productSupplier").value;
    const unit = document.getElementById("productUnit").value;
    const price = parseFloat(document.getElementById("productPrice").value);
    const discount = parseFloat(document.getElementById("productDiscount").value || 0);

    products[index] = { name, category, supplier, unit, price, discount };
    saveData();
    renderProducts();
    resetProductForm();
}

function deleteProduct(index) {
    products.splice(index, 1);
    saveData();
    renderProducts();
}

function resetProductForm() {
    document.getElementById("productName").value = "";
    document.getElementById("productCategory").value = "";
    document.getElementById("productSupplier").value = "";
    document.getElementById("productUnit").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productDiscount").value = "";
    document.querySelector("#addProductForm button").innerText = "Tambah Produk";
    document.querySelector("#addProductForm").onsubmit = addProductFormSubmit;
}

// Kategori CRUD
function addCategoryFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("categoryName").value;
    categories.push(name);
    saveData();
    renderCategories();
    document.getElementById("categoryName").value = '';
}

document.getElementById("addCategoryForm").onsubmit = addCategoryFormSubmit;

// Supplier CRUD
function addSupplierFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("supplierName").value;
    suppliers.push(name);
    saveData();
    renderSuppliers();
    document.getElementById("supplierName").value = '';
}

document.getElementById("addSupplierForm").onsubmit = addSupplierFormSubmit;

// Member CRUD
function addMemberFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("memberName").value;
    const phone = document.getElementById("memberPhone").value;
    members.push({ name, phone });
    saveData();
    renderMembers();
    document.getElementById("memberName").value = '';
    document.getElementById("memberPhone").value = '';
}

document.getElementById("addMemberForm").onsubmit = addMemberFormSubmit;

// Transaction CRUD
function addTransactionFormSubmit(event) {
    event.preventDefault();
    const product = document.getElementById("transactionProduct").value;
    const member = document.getElementById("transactionMember").value;
    const quantity = parseInt(document.getElementById("transactionQuantity").value);
    const date = document.getElementById("transactionDate").value;

    transactions.push({ product, member, quantity, date });
    saveData();
    renderTransactions();
    document.getElementById("transactionQuantity").value = '';
    document.getElementById("transactionDate").value = '';
}

document.getElementById("addTransactionForm").onsubmit = addTransactionFormSubmit;

// Export CSV
document.getElementById("exportProducts").addEventListener("click", () => {
    exportToCSV('products.csv', products, ["Nama Produk", "Kategori", "Supplier", "Satuan", "Harga", "Diskon", "Total Harga"]);
});

document.getElementById("exportMembers").addEventListener("click", () => {
    exportToCSV('members.csv', members, ["Nama Member", "No. Telepon"]);
});

function exportToCSV(filename, rows, headers) {
    let csvContent = headers.join(",") + "\n";
    rows.forEach(row => {
        csvContent += headers.map(header => row[header]).join(",") + "\n";
    });
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Load Initial Data
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCategories();
    renderSuppliers();
    renderMembers();
    renderTransactions();

    document.getElementById("logoutButton").addEventListener("click", () => {
        document.getElementById("mainNav").classList.add("hidden");
        document.getElementById("admin-login").classList.remove("hidden");
    });

    document.getElementById("loginForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Simple login validation (replace with real validation)
        if (username === 'admin' && password === 'password') {
            document.getElementById("admin-login").classList.add("hidden");
            document.getElementById("mainNav").classList.remove("hidden");
        } else {
            document.getElementById("loginError").classList.remove("hidden");
        }
    });
});
