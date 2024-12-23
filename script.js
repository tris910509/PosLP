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
    const tbody = document.querySelector('#products tbody');
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
                    <button class="btn btn-sm btn-warning" onclick="editProduct(${index})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${index})">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function renderCategories() {
    const select = document.getElementById('productCategory');
    const categoryList = document.getElementById('categoryList');
    select.innerHTML = '';
    categoryList.innerHTML = '';
    categories.forEach(category => {
        select.innerHTML += `<option value="${category}">${category}</option>`;
        categoryList.innerHTML += `<li class="list-group-item">${category}</li>`;
    });
}

function renderSuppliers() {
    const select = document.getElementById('productSupplier');
    const supplierList = document.getElementById('supplierList');
    select.innerHTML = '';
    supplierList.innerHTML = '';
    suppliers.forEach(supplier => {
        select.innerHTML += `<option value="${supplier}">${supplier}</option>`;
        supplierList.innerHTML += `<li class="list-group-item">${supplier}</li>`;
    });
}

function renderMembers() {
    const tbody = document.querySelector('#members tbody');
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
    const tbody = document.querySelector('#transactions tbody');
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
    exportToCSV(products, "products.csv");
});

document.getElementById("exportMembers").addEventListener("click", () => {
    exportToCSV(members, "members.csv");
});

function exportToCSV(data, fileName) {
    const csv = data.map(row => Object.values(row).join(',')).join('\n');
    const csvFile = new Blob([csv], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    downloadLink.download = fileName;
    downloadLink.href = URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Login
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === 'admin' && password === 'password123') {
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('mainNav').classList.remove('hidden');
        showSection('products');
    } else {
        document.getElementById('loginError').classList.remove('hidden');
    }
});

document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

// Initial Render
renderProducts();
renderCategories();
renderSuppliers();
renderMembers();
renderTransactions();
