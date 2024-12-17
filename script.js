// Mendapatkan elemen dari DOM
const formProduk = document.getElementById("form-tambah-produk");
const produkList = document.getElementById("produk-list");
const kategoriList = document.getElementById("kategori-list");
const supplierList = document.getElementById("supplier-list");
const transaksiList = document.getElementById("laporan-list");
const penggunaList = document.getElementById("pengguna-list");

let produkArray = JSON.parse(localStorage.getItem("produk")) || [];
let kategoriArray = JSON.parse(localStorage.getItem("kategori")) || [];
let supplierArray = JSON.parse(localStorage.getItem("supplier")) || [];
let transaksiArray = JSON.parse(localStorage.getItem("transaksi")) || [];
let penggunaArray = JSON.parse(localStorage.getItem("pengguna")) || [];

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

// Fungsi untuk menambahkan produk
formProduk.addEventListener("submit", function (e) {
    e.preventDefault();

    const namaProduk = document.getElementById("nama-produk").value;
    const hargaProduk = document.getElementById("harga-produk").value;

    if (namaProduk && hargaProduk) {
        const produkBaru = {
            nama: namaProduk,
            harga: parseInt(hargaProduk),
        };

        produkArray.push(produkBaru);
        localStorage.setItem("produk", JSON.stringify(produkArray));

        // Reset form input
        document.getElementById("nama-produk").value = "";
        document.getElementById("harga-produk").value = "";

        tampilkanProduk();
    }
});

// Fungsi untuk menghapus produk
function hapusProduk(index) {
    produkArray.splice(index, 1);
    localStorage.setItem("produk", JSON.stringify(produkArray));
    tampilkanProduk();
}

// Menampilkan data pada halaman kategori, supplier, dan laporan
function tampilkanKategori() {
    kategoriList.innerHTML = "";
    kategoriArray.forEach((kategori, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${kategori.nama}</strong>`;
        kategoriList.appendChild(li);
    });
}

function tampilkanSupplier() {
    supplierList.innerHTML = "";
    supplierArray.forEach((supplier, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${supplier.nama}</strong>`;
        supplierList.appendChild(li);
    });
}

function tampilkanLaporan() {
    transaksiList.innerHTML = "";
    transaksiArray.forEach((transaksi, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p>Transaksi ${index + 1} | Produk: ${transaksi.produk} | Jumlah: ${transaksi.jumlah} | Total Bayar: Rp. ${transaksi.totalBayar} | Tanggal: ${transaksi.tanggal}</p>
        `;
        transaksiList.appendChild(div);
    });
}

function tampilkanPengguna() {
    penggunaList.innerHTML = "";
    penggunaArray.forEach((pengguna, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${pengguna.nama}</strong>`;
        penggunaList.appendChild(li);
    });
}

// Memanggil fungsi untuk menampilkan data saat halaman dimuat
if (produkList) tampilkanProduk();
if (kategoriList) tampilkanKategori();
if (supplierList) tampilkanSupplier();
if (transaksiList) tampilkanLaporan();
if (penggunaList) tampilkanPengguna();
