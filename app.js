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
    const tbody = document.querySelector("#productTable tbody");
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
    const categoryDropdown = document.getElementById("productCategory");
    categoryDropdown.innerHTML = "";
    categories.forEach((category, index) => {
        categoryDropdown.innerHTML += `<option value="${category}">${category}</option>`;
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

// Render Suppliers, Members, and Transactions similar to Products
// ...

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
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Other functions (renderTransactions, member transactions, etc.) remain similar to the original script
