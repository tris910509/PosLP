// Data pengguna, produk, kategori, dll disimpan dalam localStorage
// Cek dan ambil data dari localStorage saat aplikasi dimuat
function loadDatabase() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let categories = JSON.parse(localStorage.getItem("categories")) || [];
    
    // Anda bisa menambahkan pengelolaan lainnya di sini (pembayaran, ongkir, dll)
}

loadDatabase();
