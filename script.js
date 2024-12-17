// Mendapatkan elemen dari DOM
const formProduk = document.getElementById("form-tambah-produk");
const produkList = document.getElementById("produk-list");
const namaProdukInput = document.getElementById("nama-produk");
const hargaProdukInput = document.getElementById("harga-produk");

const formTransaksi = document.getElementById("form-transaksi");
const produkIdInput = document.getElementById("produk-id");
const jumlahProdukInput = document.getElementById("jumlah-produk");
const alamatInput = document.getElementById("alamat");
const ongkirInput = document.getElementById("ongkir");
const totalPembayaran = document.getElementById("total-pembayaran");

// Menyimpan data produk dalam localStorage (jika ada)
let produkArray = JSON.parse(localStorage.getItem("produk")) || [];
let transaksiArray = JSON.parse(localStorage.getItem("transaksi")) || [];

// Fungsi untuk menampilkan daftar produk
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
formProduk.addEventListener("submit", function (e) {
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

// Fungsi untuk mengelola transaksi pembayaran
formTransaksi.addEventListener("submit", function (e) {
    e.preventDefault();

    const produkId = parseInt(produkIdInput.value);
    const jumlahProduk = parseInt(jumlahProdukInput.value);
    const alamat = alamatInput.value.trim();
    const ongkir = parseInt(ongkirInput.value);

    if (!produkId || !jumlahProduk || !alamat || !ongkir) {
        alert("Semua field harus diisi.");
        return;
    }

    const produk = produkArray[produkId - 1];
    if (!produk) {
        alert("Produk tidak ditemukan.");
        return;
    }

    const totalHarga = produk.harga * jumlahProduk;
    const totalBayar = totalHarga + ongkir;

    // Menyimpan transaksi dalam array
    const transaksi = {
        produk: produk.nama,
        jumlah: jumlahProduk,
        totalHarga: totalHarga,
        ongkir: ongkir,
        alamat: alamat,
        totalBayar: totalBayar,
        tanggal: new Date().toLocaleString(),
    };

    transaksiArray.push(transaksi);
    localStorage.setItem("transaksi", JSON.stringify(transaksiArray));

    // Menampilkan total pembayaran
    totalPembayaran.textContent = totalBayar.toLocaleString();

    // Reset form transaksi
    produkIdInput.value = "";
    jumlahProdukInput.value = "";
    alamatInput.value = "";
    ongkirInput.value = "";
});

// Fungsi untuk menampilkan laporan supplier
function lihatLaporanSupplier() {
    const laporanWindow = window.open("", "_blank", "width=800,height=600");
    laporanWindow.document.write("<h1>Laporan Supplier</h1>");
    transaksiArray.forEach((transaksi, index) => {
        laporanWindow.document.write(`
            <p>Transaksi ${index + 1}: ${transaksi.produk} (Jumlah: ${transaksi.jumlah}) - Rp. ${transaksi.totalBayar}</p>
        `);
    });
}

// Menampilkan produk pada saat pertama kali halaman dimuat
tampilkanProduk();
