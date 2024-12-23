// Data barang (disimpan di memori)
let products = [];

// Elemen DOM
const productTable = document.getElementById("productTable");
const addForm = document.getElementById("addForm");
const paymentForm = document.getElementById("paymentForm");
const paymentSummary = document.getElementById("paymentSummary");
const exportButton = document.getElementById("exportButton");

// Fungsi untuk merender tabel
function renderTable() {
  productTable.innerHTML = ""; // Kosongkan tabel

  products.forEach((product, index) => {
    const finalPrice = product.price - (product.price * product.discount / 100);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.unit}</td>
      <td>Rp ${product.price.toLocaleString()}</td>
      <td>${product.discount}%</td>
      <td>Rp ${finalPrice.toLocaleString()}</td>
      <td>
        <button onclick="editProduct(${index})">Edit</button>
        <button onclick="deleteProduct(${index})">Hapus</button>
      </td>
    `;
    productTable.appendChild(row);
  });
}

// Fungsi untuk menambah barang
addForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const unit = document.getElementById("unit").value;
  const price = parseInt(document.getElementById("price").value);
  const discount = parseInt(document.getElementById("discount").value);

  products.push({ name, category, unit, price, discount });
  renderTable();

  // Reset form
  addForm.reset();
});

// Fungsi untuk mengedit barang
function editProduct(index) {
  const product = products[index];

  const newName = prompt("Masukkan nama baru:", product.name);
  const newCategory = prompt("Masukkan kategori baru:", product.category);
  const newUnit = prompt("Masukkan satuan baru:", product.unit);
  const newPrice = prompt("Masukkan harga baru:", product.price);
  const newDiscount = prompt("Masukkan diskon baru (%):", product.discount);

  if (newName && newCategory && newUnit && newPrice && newDiscount) {
    products[index] = {
      name: newName,
      category: newCategory,
      unit: newUnit,
      price: parseInt(newPrice),
      discount: parseInt(newDiscount),
    };
    renderTable();
  }
}

// Fungsi untuk menghapus barang
function deleteProduct(index) {
  if (confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
    products.splice(index, 1);
    renderTable();
  }
}

// Fungsi untuk pembayaran
paymentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const total = products.reduce((sum, product) => {
    return sum + (product.price - (product.price * product.discount / 100));
  }, 0);

  const paymentMethod = document.getElementById("paymentMethod").value;
  const amountPaid = parseInt(document.getElementById("amountPaid").value);

  if (amountPaid >= total) {
    const change = amountPaid - total;
    paymentSummary.textContent = `Metode: ${paymentMethod}, Total: Rp ${total.toLocaleString()}, Kembalian: Rp ${change.toLocaleString()}`;
  } else {
    paymentSummary.textContent = "Uang tidak cukup.";
  }
});

// Fungsi untuk ekspor data
exportButton.addEventListener("click", () => {
  const data = JSON.stringify(products, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "data_barang.json";
  a.click();

  URL.revokeObjectURL(url);
});

// Render awal tabel
renderTable();
