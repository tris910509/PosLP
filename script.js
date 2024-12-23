// Data Produk, Member, Transaksi, dan User
let products = JSON.parse(localStorage.getItem('products')) || [];
let members = JSON.parse(localStorage.getItem('members')) || [];
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];

// Simpan Data ke Local Storage
function saveData() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('members', JSON.stringify(members));
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('users', JSON.stringify(users));
}

// Render Produk Dropdown
function renderProductsDropdown() {
    const select = document.getElementById('transactionProduct');
    select.innerHTML = '';
    products.forEach(product => {
        select.innerHTML += `<option value="${product.name}" data-price="${product.price}" data-discount="${product.discount}">${product.name}</option>`;
    });
}

// Render Member Dropdown
function renderMembersDropdown() {
    const select = document.getElementById('transactionMember');
    select.innerHTML = '';
    members.forEach(member => {
        select.innerHTML += `<option value="${member.name}">${member.name}</option>`;
    });
}

// Render Transaksi
function renderTransactions() {
    const tbody = document.querySelector('#transactionList');
    tbody.innerHTML = '';
    transactions.forEach((transaction, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${transaction.product}</td>
                <td>${transaction.member}</td>
                <td>${transaction.quantity}</td>
                <td>${transaction.date}</td>
                <td>${transaction.totalPrice.toFixed(2)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editTransaction(${index})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTransaction(${index})">Hapus</button>
                </td>
            </tr>
        `;
    });
}

// Add Transaction
document.getElementById("addTransactionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const productSelect = document.getElementById("transactionProduct");
    const productName = productSelect.value;
    const productDetails = products.find(p => p.name === productName);
    const member = document.getElementById("transactionMember").value;
    const quantity = parseInt(document.getElementById("transactionQuantity").value);
    const date = document.getElementById("transactionDate").value;

    if (productName && member && !isNaN(quantity) && date) {
        const totalPrice = productDetails.price * quantity * (1 - productDetails.discount / 100);
        
        transactions.push({ product: productName, member, quantity, date, totalPrice });
        saveData();
        renderTransactions();
    }
});

// Edit Transaction
function editTransaction(index) {
    const transaction = transactions[index];
    document.getElementById("transactionProduct").value = transaction.product;
    document.getElementById("transactionMember").value = transaction.member;
    document.getElementById("transactionQuantity").value = transaction.quantity;
    document.getElementById("transactionDate").value = transaction.date;

    transactions.splice(index, 1);
    saveData();
    renderTransactions();
}

// Delete Transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    saveData();
    renderTransactions();
}

// Export Transaksi to CSV
document.getElementById("exportTransactions").addEventListener("click", () => {
    exportToCSV('transactions.csv', transactions, ["Produk", "Member", "Jumlah", "Tanggal", "Total Harga"]);
});

// Export Helper Function
function exportToCSV(filename, rows, headers) {
    let csvContent = headers.join(",") + "\n";
    rows.forEach(row => {
        csvContent += headers.map(header => row[header]).join(",") + "\n";
    });
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Login and Access Control
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        redirectToAppropriatePage(user.role);
    } else {
        alert("Username atau password salah!");
    }
}

function redirectToAppropriatePage(role) {
    switch(role) {
        case 'admin':
            window.location.href = 'admin-dashboard.html';
            break;
        case 'cashier':
            window.location.href = 'cashier-dashboard.html';
            break;
        default:
            window.location.href = 'index.html';
            break;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (user) {
        redirectToAppropriatePage(user.role);
    }

    document.getElementById("logoutButton").addEventListener("click", () => {
        sessionStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    });
});
