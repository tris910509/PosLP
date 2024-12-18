let db;
let barangStore;
let transaksiStore;

document.addEventListener("DOMContentLoaded", () => {
    // Inisialisasi IndexedDB
    const request = indexedDB.open("kasirDB", 1);
    
    request.onupgradeneeded = (event) => {
        db = event.target.result;
        barangStore = db.createObjectStore("barang", { keyPath: "id", autoIncrement: true });
        barangStore.createIndex("nama", "nama", { unique: false });

        transaksiStore = db.createObjectStore("transaksi", { keyPath: "id", autoIncrement: true });
        transaksiStore.createIndex("tanggal", "tanggal", { unique: false });
    };

    request.onsuccess = () => {
        db = request.result;
        loadBarang();
    };

    request.onerror = (event) => {
        console.error("Error membuka database", event.target.error);
    };
});

// Fungsi untuk menambahkan barang ke database
function tambahBarang() {
    const nama = document.getElementById("namaBarang").value;
    const harga = document.getElementById("hargaBarang").value;

    if (nama && harga) {
        const transaction = db.transaction(["barang"], "readwrite");
        const store = transaction.objectStore("barang");

        const barang = { nama: nama, harga: parseInt(harga) };
        store.add(barang);

        transaction.oncomplete = () => {
            alert("Barang berhasil ditambahkan");
            loadBarang();
        };

        transaction.onerror = (event) => {
            console.error("Error menambahkan barang", event.target.error);
        };
    }
}

// Fungsi untuk memuat daftar barang
function loadBarang() {
    const transaction = db.transaction(["barang"], "readonly");
    const store = transaction.objectStore("barang");
    const request = store.getAll();

    request.onsuccess = (event) => {
        const listBarang = event.target.result;
        const selectBarang = document.getElementById("selectBarang");
        const listBarangElement = document.getElementById("listBarang");
        
        listBarangElement.innerHTML = "";
        selectBarang.innerHTML = "<option value=''>Pilih Barang</option>";

        listBarang.forEach(barang => {
            const listItem = document.createElement("li");
            listItem.textContent = `${barang.nama} - Rp ${barang.harga}`;
            listBarangElement.appendChild(listItem);

            const option = document.createElement("option");
            option.value = barang.id;
            option.textContent = `${barang.nama} - Rp ${barang.harga}`;
            selectBarang.appendChild(option);
        });
    };

    request.onerror = (event) => {
        console.error("Error memuat barang", event.target.error);
    };
}

// Fungsi untuk menambah barang ke keranjang
let keranjang = [];
let total = 0;

function tambahKeKeranjang() {
    const selectBarang = document.getElementById("selectBarang");
    const jumlah = document.getElementById("jumlahBarang").value;

    const barangId = selectBarang.value;
    if (barangId && jumlah) {
        const transaction = db.transaction(["barang"], "readonly");
        const store = transaction.objectStore("barang");
        const request = store.get(Number(barangId));

        request.onsuccess = (event) => {
            const barang = event.target.result;
            const subtotal = barang.harga * jumlah;
            keranjang.push({ ...barang, jumlah, subtotal });

            total += subtotal;
            updateKeranjang();
        };

        request.onerror = (event) => {
            console.error("Error menambahkan ke keranjang", event.target.error);
        };
    }
}

// Fungsi untuk menampilkan keranjang dan total harga
function updateKeranjang() {
    const keranjangElement = document.getElementById("keranjang");
    const totalElement = document.getElementById("totalHarga");

    keranjangElement.innerHTML = "";
    keranjang.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.nama} x${item.jumlah} - Rp ${item.subtotal}`;
        keranjangElement.appendChild(li);
    });

    totalElement.textContent = total;
}

// Fungsi untuk memproses transaksi
function prosesTransaksi() {
    const transaction = db.transaction(["transaksi"], "readwrite");
    const store = transaction.objectStore("transaksi");

    const tanggal = new Date().toISOString();
    const transaksi = {
        tanggal,
        total,
        detail: keranjang
    };

    store.add(transaksi);

    transaction.oncomplete = () => {
        alert("Transaksi berhasil diproses!");
        keranjang = [];
        total = 0;
        updateKeranjang();
    };

    transaction.onerror = (event) => {
        console.error("Error memproses transaksi", event.target.error);
    };
}
