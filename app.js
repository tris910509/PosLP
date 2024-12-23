let products = JSON.parse(localStorage.getItem("products")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || ["Makanan", "Minuman"];
let suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
let members = JSON.parse(localStorage.getItem("members")) || [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveData() {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("categories", JSON.stringify(categories));
    localStorage.setItem("suppliers", JSON.stringify(suppliers));
    localStorage.setItem("members", JSON.stringify(members));
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function showSection(sectionId) {
    document.querySelectorAll("section").forEach((section) => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");
}

document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "password123") {
        document.getElementById("admin-login").classList.add("hidden");
        document.getElementById("mainNav").classList.remove("hidden");
        showSection("products");
    } else {
        document.getElementById("loginError").classList.remove("hidden");
    }
});

document.getElementById("logoutButton").addEventListener("click", () => {
    document.getElementById("mainNav").classList.add("hidden");
    document.getElementById("admin-login").classList.remove("hidden");
});

document.getElementById("addProductForm").addEventListener("submit", (event) => {
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
    event.target.reset();
});

function renderProducts() {
    const tbody = document.querySelector("#products tbody");
    tbody.innerHTML = "";

    products.forEach((product, index) => {
        const finalPrice = product.price - (product.price * product.discount / 100);
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.supplier}</td>
                <td>${product.unit}</td>
                <td>Rp ${product.price.toLocaleString()}</td>
                <td>${product.discount}%</td>
                <td>Rp ${finalPrice.toLocaleString()}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editProduct(${index})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function renderCategories() {
    const categoryList = document.getElementById("categoryList");
    categoryList.innerHTML = "";
    categories.forEach((category, index) => {
        categoryList.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">${category} <button class="btn btn-danger btn-sm" onclick="deleteCategory(${index})">Hapus</button></li>`;
    });
}

document.getElementById("addCategoryForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const categoryName = document.getElementById("categoryName").value;
    categories.push(categoryName);
    saveData();
    renderCategories();
    event.target.reset();
});

function deleteCategory(index) {
    categories.splice(index, 1);
    saveData();
    renderCategories();
}

// Render Suppliers
function renderSuppliers() {
    const supplierList = document.getElementById("supplierList");
    supplierList.innerHTML = "";
    suppliers.forEach((supplier, index) => {
        supplierList.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">${supplier} <button class="btn btn-danger btn-sm" onclick="deleteSupplier(${index})">Hapus</button></li>`;
    });
}

document.getElementById("addSupplierForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const supplierName = document.getElementById("supplierName").value;
    suppliers.push(supplierName);
    saveData();
    renderSuppliers();
    event.target.reset();
});

function deleteSupplier(index) {
    suppliers.splice(index, 1);
    saveData();
    renderSuppliers();
}

// Render Members
function renderMembers() {
    const membersTableBody = document.querySelector("#members tbody");
    membersTableBody.innerHTML = "";
    members.forEach((member, index) => {
        const totalTransactions = transactions.filter(t => t.member === member.name).length;
        membersTableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${member.name}</td>
                <td>${member.phone}</td>
                <td>${totalTransactions}</td>
            </tr>
        `;
    });
}

document.getElementById("addMemberForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("memberName").value;
    const phone = document.getElementById("memberPhone").value;
    members.push({ name, phone });
    saveData();
    renderMembers();
    event.target.reset();
});

// Render Transactions
function renderTransactions() {
    const transactionsTableBody = document.querySelector("#transactions tbody");
    transactionsTableBody.innerHTML = "";
    transactions.forEach((transaction, index) => {
        transactionsTableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${transaction.product}</td>
                <td>${transaction.member}</td>
                <td>${transaction.quantity}</td>
                <td>${transaction.date}</td>
            </tr>
        `;
    });
}

document.getElementById("addTransactionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const product = document.getElementById("transactionProduct").value;
    const member = document.getElementById("transactionMember").value;
    const quantity = parseInt(document.getElementById("transactionQuantity").value);
    const date = document.getElementById("transactionDate").value;

    transactions.push({ product, member, quantity, date });
    saveData();
    renderTransactions();
    event.target.reset();
});

// Export to CSV
function exportToCSV(dataType, fileName) {
    let data, csv, csvFile, downloadLink;

    if (dataType === "products") {
        data = products;
    } else if (dataType === "members") {
        data = members;
    }

    csv = data.map(item => Object.values(item).join(",")).join("\n");
    csvFile = new Blob([csv], { type: "text/csv" });
    downloadLink = document.createElement("a");
    downloadLink.download = fileName;
    downloadLink.href = URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Helper Functions
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

// Initialize data rendering
renderProducts();
renderCategories();
renderSuppliers();
renderMembers();
renderTransactions();
