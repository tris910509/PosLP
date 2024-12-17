// Mendapatkan elemen dari DOM
const form = document.getElementById("form-tambah-produk");
const produkList = document.getElementById("produk-list");
const namaProdukInput = document.getElementById("nama-produk");
const hargaProdukInput = document.getElementById("harga-produk");

// Menyimpan produk dalam localStorage (jika ada)
let produkArray = JSON.parse(localStorage.getItem("produk")) || [];

// Fungsi untuk menampilkan produk
function tampilkanProduk() {
    produkList.innerHTML = "";
    produkArray.forEach((produk, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${produk.nama}</strong> - Rp. ${produk.harga}
            <button onclick="hapusProduk(${index})">Hapus</button>
        `;
        produkList.appendChild(li);
    });
}

// Fungsi untuk menambah produk
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const namaProduk = namaProdukInput.value.trim();
    const hargaProduk = hargaProdukInput.value.trim();

    if (namaProduk && hargaProduk) {
        const produkBaru = {
            nama: namaProduk,
            harga: hargaProduk,
        };

        // Menambahkan produk ke array
        produkArray.push(produkBaru);

        // Simpan ke localStorage
        localStorage.setItem("produk", JSON.stringify(produkArray));

        // Reset form input
        namaProdukInput.value = "";
        hargaProdukInput.value = "";

        // Menampilkan produk yang terbaru
        tampilkanProduk();
    }
});

// Fungsi untuk menghapus produk
function hapusProduk(index) {
    produkArray.splice(index, 1);
    localStorage.setItem("produk", JSON.stringify(produkArray));
    tampilkanProduk();
}

// Menampilkan produk pada saat pertama kali halaman dimuat
tampilkanProduk();

