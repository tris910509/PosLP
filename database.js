// Data pengguna, produk, kategori, dll disimpan dalam localStorage
// Cek dan ambil data dari localStorage saat aplikasi dimuat
function loadDatabase() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let categories = JSON.parse(localStorage.getItem("categories")) || [];
    
    // Anda bisa menambahkan pengelolaan lainnya di sini (pembayaran, ongkir, dll)

    
}// Menyimpan transaksi ke localStorage
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Mengambil transaksi dari localStorage
function loadTransactions() {
    transactions = JSON.parse(localStorage.getItem("transactions")) || [];
}

// Memanggil fungsi ini saat aplikasi dimuat
loadTransactions();


loadDatabase();
