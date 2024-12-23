// Variabel data
let products = JSON.parse(localStorage.getItem("products")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || ["Makanan", "Minuman"];
let suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
let members = JSON.parse(localStorage.getItem("members")) || [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Variabel untuk autentikasi admin
const adminUsername = "admin";
const adminPassword = "password123";

// Fungsi penyimpanan ke localStorage
function saveData() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("categories", JSON.stringify(categories));
  localStorage.setItem("suppliers", JSON.stringify(suppliers));
  localStorage.setItem("members", JSON.stringify(members));
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Login Admin
document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === adminUsername && password === adminPassword) {
    document.getElementById("admin-login").classList.add("hidden");
    document.getElementById("mainNav").classList.remove("hidden");
    showSection("products");
  } else {
    document.getElementById("loginError").classList.remove("hidden");
  }
});

// Logout Admin
function logout() {
  document.getElementById("mainNav").classList.add("hidden");
  document.getElementById("admin-login").classList.remove("hidden");
}

// Fungsi untuk menampilkan bagian tertentu
function showSection(sectionId) {
  document.querySelectorAll("section").forEach((section) => section.classList.add("hidden"));
  document.getElementById(sectionId).classList.remove("hidden");
}

// Fungsi untuk merender produk
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
          <button onclick="editProduct(${index})">Edit</button>
          <button onclick="deleteProduct(${index})">Hapus</button>
        </td>
      </tr>
    `;
  });
}

// Tambah Barang
document.getElementById("addProductForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("productName").value;
  const category = document.getElementById("productCategory").value;
  const supplier = document.getElementById("productSupplier").value;
  const unit = document.getElementById("productUnit").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const discount = parseFloat(document.getElementById("productDiscount").value);

  products.push({ name, category, supplier, unit, price, discount });
  saveData();
  renderProducts();
  event.target.reset();
});

// Fungsi untuk merender kategori
function renderCategories() {
  const categoryDropdown = document.getElementById("productCategory");
  const categoryList = document.getElementById("categoryList");
  categoryDropdown.innerHTML = "";
  categoryList.innerHTML = "";

  categories.forEach((category, index) => {
    categoryDropdown.innerHTML += `<option value="${category}">${category}</option>`;
    categoryList.innerHTML += `
      <li>
        ${category}
        <button onclick="deleteCategory(${index})">Hapus</button>
      </li>
    `;
  });
}

// Tambah Kategori
document.getElementById("addCategoryForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const categoryName = document.getElementById("categoryName").value;
  categories.push(categoryName);
  saveData();
  renderCategories();
  event.target.reset();
});

// Fungsi untuk menghapus kategori
function deleteCategory(index) {
  categories.splice(index, 1);
  saveData();
  renderCategories();
}

// Fungsi untuk merender supplier
function renderSuppliers() {
  const supplierDropdown = document.getElementById("productSupplier");
  const supplierList = document.getElementById("supplierList");
  supplierDropdown.innerHTML = "";
  supplierList.innerHTML = "";

  suppliers.forEach((supplier, index) => {
    supplierDropdown.innerHTML += `<option value="${supplier.name}">${supplier.name}</option>`;
    supplierList.innerHTML += `
      <li>
        ${supplier.name} (${supplier.contact})
        <button onclick="deleteSupplier(${index})">Hapus</button>
      </li>
    `;
  });
}

// Tambah Supplier
document.getElementById("addSupplierForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const supplierName = document.getElementById("supplierName").value;
  const supplierContact = document.getElementById("supplierContact").value;
  suppliers.push({ name: supplierName, contact: supplierContact });
  saveData();
  renderSuppliers();
  event.target.reset();
});

// Hapus Supplier
function deleteSupplier(index) {
  suppliers.splice(index, 1);
  saveData();
  renderSuppliers();
}

// Fungsi untuk merender member
function renderMembers() {
  const memberTableBody = document.querySelector("#memberTable tbody");
  memberTableBody.innerHTML = "";

  members.forEach((member, index) => {
    memberTableBody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${member.name}</td>
        <td>${member.discount}%</td>
        <td>
          <button onclick="editMember(${index})">Edit</button>
          <button onclick="deleteMember(${index})">Hapus</button>
        </td>
      </tr>
    `;
  });
}

// Tambah Member
document.getElementById("addMemberForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const memberName = document.getElementById("memberName").value;
  const memberDiscount = parseFloat(document.getElementById("memberDiscount").value);

  members.push({ name: memberName, discount: memberDiscount });
  saveData();
  renderMembers();
  event.target.reset();
});

// Hapus Member
function deleteMember(index) {
  members.splice(index, 1);
  saveData();
  renderMembers();
}

// Fungsi untuk mengedit produk
function editProduct(index) {
  const product = products[index];
  document.getElementById("productName").value = product.name;
  document.getElementById("productCategory").value = product.category;
  document.getElementById("productSupplier").value = product.supplier;
  document.getElementById("productUnit").value = product.unit;
  document.getElementById("productPrice").value = product.price;
  document.getElementById("productDiscount").value = product.discount;

  document.getElementById("addProductForm").onsubmit = (event) => {
    event.preventDefault();
    product.name = document.getElementById("productName").value;
    product.category = document.getElementById("productCategory").value;
    product.supplier = document.getElementById("productSupplier").value;
    product.unit = document.getElementById("productUnit").value;
    product.price = parseFloat(document.getElementById("productPrice").value);
    product.discount = parseFloat(document.getElementById("productDiscount").value);

    saveData();
    renderProducts();
    document.getElementById("addProductForm").reset();
    document.getElementById("addProductForm").onsubmit = addProduct;
  };
}

// Fungsi untuk menghapus produk
function deleteProduct(index) {
  products.splice(index, 1);
  saveData();
  renderProducts();
}

// Fungsi untuk menambahkan produk ke transaksi
function addProductToCart(index) {
  const product = products[index];
  const memberDiscount = document.getElementById("transactionMember").value ? members.find(m => m.name === document.getElementById("transactionMember").value)?.discount : 0;
  const transactionDiscount = parseFloat(document.getElementById("transactionDiscount").value);
  const finalPrice = product.price - (product.price * (product.discount + transactionDiscount + memberDiscount) / 100);

  const transaction = transactions.find(t => t.product.name === product.name);

  if (transaction) {
    transaction.quantity++;
    transaction.totalPrice = transaction.quantity * finalPrice;
  } else {
    transactions.push({
      product,
      quantity: 1,
      totalPrice: finalPrice,
    });
  }

  saveData();
  renderCart();
}

// Fungsi untuk merender keranjang belanja
function renderCart() {
  const cartTableBody = document.getElementById("cartTableBody");
  cartTableBody.innerHTML = "";

  transactions.forEach((transaction, index) => {
    cartTableBody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${transaction.product.name}</td>
        <td>${transaction.quantity}</td>
        <td>Rp ${transaction.totalPrice.toLocaleString()}</td>
        <td>
          <button onclick="editTransaction(${index})">Edit</button>
          <button onclick="deleteTransaction(${index})">Hapus</button>
        </td>
      </tr>
    `;
  });

  const totalAmount = transactions.reduce((sum, t) => sum + t.totalPrice, 0);
  document.getElementById("totalAmount").textContent = `Total: Rp ${totalAmount.toLocaleString()}`;
}

// Fungsi untuk menghapus transaksi
function deleteTransaction(index) {
  transactions.splice(index, 1);
  saveData();
  renderCart();
}

// Fungsi untuk mengedit transaksi
function editTransaction(index) {
  const transaction = transactions[index];
  document.getElementById("transactionProductName").value = transaction.product.name;
  document.getElementById("transactionProductQuantity").value = transaction.quantity;

  document.getElementById("transactionForm").onsubmit = (event) => {
    event.preventDefault();
    transaction.quantity = parseInt(document.getElementById("transactionProductQuantity").value);
    transaction.totalPrice = transaction.quantity * (transaction.product.price - (transaction.product.price * transaction.product.discount / 100));
    saveData();
    renderCart();
    document.getElementById("transactionForm").reset();
    document.getElementById("transactionForm").onsubmit = processTransaction;
  };
}

// Fungsi untuk proses transaksi
document.getElementById("transactionForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const memberName = document.getElementById("transactionMember").value;
  const memberDiscount = memberName ? members.find(m => m.name === memberName)?.discount : 0;
  const transactionDiscount = parseFloat(document.getElementById("transactionDiscount").value);
  const finalTotal = transactions.reduce((sum, t) => sum + t.totalPrice, 0);
  const totalPay = finalTotal - (finalTotal * (transactionDiscount + memberDiscount) / 100);

  const paymentMethod = document.getElementById("transactionPayment").value;

  transactions.push({ items: [...transactions], totalPay, paymentMethod, date: new Date() });
  saveData();
  renderCart();
  alert("Transaksi berhasil!");
});

// Fungsi untuk merender laporan penjualan
function generateReport() {
  const reportDate = document.getElementById("reportDate").value;
  const filteredTransactions = transactions.filter(t => t.date.toISOString().split('T')[0] === reportDate);
  
  renderReport(filteredTransactions);
}

function renderReport(data) {
  const salesData = data.map(t => t.totalPay);
  const labels = data.map(t => t.date.toISOString().split('T')[0]);

  const ctx = document.getElementById('salesChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Total Penjualan',
        data: salesData,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false
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

// Fungsi untuk export laporan
function exportReport() {
  const reportDate = document.getElementById("reportDate").value;
  const filteredTransactions = transactions.filter(t => t.date.toISOString().split('T')[0] === reportDate);
  let csvContent = "data:text/csv;charset=utf-8,No,Tanggal,Total Pembayaran\n";
  
  filteredTransactions.forEach((transaction, index) => {
    csvContent += `${index + 1},${transaction.date.toISOString().split('T')[0]},${transaction.totalPay.toLocaleString()}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "laporan_penjualan.csv");
  document.body.appendChild(link); 
  link.click();
}
