// ===============================
// FORMAT RUPIAH
// ===============================

function formatRupiah(angka) {
    return "Rp " + Number(angka).toLocaleString("id-ID");
}


// ===============================
// DATA
// ===============================

let barang = JSON.parse(localStorage.getItem("barang")) || [];
let keranjang = [];
let riwayat = JSON.parse(localStorage.getItem("riwayat")) || [];
let preorder = JSON.parse(localStorage.getItem("preorder")) || [];


// ===============================
// NAVIGASI
// ===============================

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });

    document.getElementById(pageId).style.display = "block";

    if (pageId === "barang") {
        tampilkanBarang();
    }

    if (pageId === "transaksi") {
        updateSelectBarang();
    }

    if (pageId === "preorder") {
        tampilkanPreOrder();
    }

    if (pageId === "riwayat") {
        tampilkanRiwayat();
    }
}


// ===============================
// KELOLA BARANG
// ===============================

function tambahBarang() {
    const nama = document.getElementById("namaBarang").value.trim();
    const harga = Number(document.getElementById("hargaBarang").value);
    const stok = Number(document.getElementById("stokBarang").value);

    if (nama === "" || harga <= 0 || stok < 0) {
        alert("Data barang belum lengkap!");
        return;
    }

    barang.push({
        id: Date.now(),
        nama: nama,
        harga: harga,
        stok: stok
    });

    simpanData();

    document.getElementById("namaBarang").value = "";
    document.getElementById("hargaBarang").value = "";
    document.getElementById("stokBarang").value = "";

    tampilkanBarang();
    updateSelectBarang();

    alert("Barang berhasil ditambahkan!");
}


function tampilkanBarang() {
    const tbody = document.getElementById("tabelBarang");
    if (!tbody) return;
    tbody.innerHTML = "";

    barang.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.nama}</td>
                <td>${formatRupiah(item.harga)}</td>
                <td>${item.stok}</td>
                <td>
                    <button onclick="editBarang(${item.id})">Edit</button>
                    <button onclick="hapusBarang(${item.id})">Hapus</button>
                </td>
            </tr>
        `;
    });
}


function editBarang(id) {
    const item = barang.find(b => b.id === id);

    if (!item) return;

    const namaBaru = prompt("Nama barang:", item.nama);
    if (namaBaru === null) return;

    const hargaBaru = prompt("Harga barang:", item.harga);
    if (hargaBaru === null) return;

    const stokBaru = prompt("Stok barang:", item.stok);
    if (stokBaru === null) return;

    if (
        namaBaru.trim() === "" ||
        Number(hargaBaru) <= 0 ||
        Number(stokBaru) < 0
    ) {
        alert("Data tidak valid!");
        return;
    }

    item.nama = namaBaru.trim();
    item.harga = Number(hargaBaru);
    item.stok = Number(stokBaru);

    simpanData();
    tampilkanBarang();
    updateSelectBarang();

    alert("Barang berhasil diubah!");
}

function editBarang(id) {
    const item = barang.find(b => b.id === id);

    if (!item) return;

    const namaBaru = prompt("Nama barang:", item.nama);
    if (namaBaru === null) return;

    const hargaBaru = prompt("Harga barang:", item.harga);
    if (hargaBaru === null) return;

    const stokBaru = prompt("Stok barang:", item.stok);
    if (stokBaru === null) return;

    if (
        namaBaru.trim() === "" ||
        Number(hargaBaru) <= 0 ||
        Number(stokBaru) < 0
    ) {
        alert("Data tidak valid!");
        return;
    }

    item.nama = namaBaru.trim();
    item.harga = Number(hargaBaru);
    item.stok = Number(stokBaru);

    simpanData();
    tampilkanBarang();
    updateSelectBarang();

    alert("Barang berhasil diubah!");
}


// ===============================
// PENCARIAN BARANG
// ===============================

function cariBarang() {
    const keyword = document
        .getElementById("cariBarang")
        .value
        .toLowerCase();

    const tbody = document.getElementById("tabelBarang");

    if (!tbody) return;

    tbody.innerHTML = "";

    barang
        .filter(item => item.nama.toLowerCase().includes(keyword))
        .forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.nama}</td>
                    <td>${formatRupiah(item.harga)}</td>
                    <td>${item.stok}</td>
                    <td>
                        <button onclick="hapusBarang(${item.id})">
                            Hapus
                        </button>
                    </td>
                </tr>
            `;
        });
}


// ===============================
// TRANSAKSI
// ===============================

function updateSelectBarang() {
    const select = document.getElementById("pilihBarang");

    if (!select) return;

    select.innerHTML = `
        <option value="">-- Pilih Barang --</option>
    `;

    barang.forEach(item => {
        select.innerHTML += `
            <option value="${item.id}">
                ${item.nama} - ${formatRupiah(item.harga)} 
                (Stok: ${item.stok})
            </option>
        `;
    });
}


function tambahKeranjang() {
    const id = Number(
        document.getElementById("pilihBarang").value
    );

    const jumlah = Number(
        document.getElementById("jumlahBarang").value
    );

    const item = barang.find(b => b.id === id);

    if (!item) {
        alert("Pilih barang terlebih dahulu!");
        return;
    }

    if (jumlah <= 0) {
        alert("Jumlah barang harus lebih dari 0!");
        return;
    }

    if (jumlah > item.stok) {
        alert("Stok barang tidak cukup!");
        return;
    }

    const sudahAda = keranjang.find(k => k.id === id);

    if (sudahAda) {

        if (sudahAda.jumlah + jumlah > item.stok) {
            alert("Jumlah barang melebihi stok!");
            return;
        }

        sudahAda.jumlah += jumlah;

    } else {

        keranjang.push({
            id: item.id,
            nama: item.nama,
            harga: item.harga,
            jumlah: jumlah
        });
    }

    tampilkanKeranjang();

    document.getElementById("jumlahBarang").value = 1;
}


function tampilkanKeranjang() {
    const tbody = document.getElementById("tabelKeranjang");

    if (!tbody) return;

    tbody.innerHTML = "";

    let total = 0;

    keranjang.forEach((item, index) => {

        const subtotal = item.harga * item.jumlah;

        total += subtotal;

        tbody.innerHTML += `
            <tr>
                <td>${item.nama}</td>
                <td>${item.jumlah}</td>
                <td>${formatRupiah(subtotal)}</td>
                <td>
                    <button onclick="hapusKeranjang(${index})">
                        Hapus
                    </button>
                </td>
            </tr>
        `;
    });

    const totalElement = document.getElementById("total");

    if (totalElement) {
        totalElement.innerText = formatRupiah(total);
    }
}


function hapusKeranjang(index) {
    keranjang.splice(index, 1);

    tampilkanKeranjang();
}


// ===============================
// PEMBAYARAN
// ===============================

function bayar() {

    if (keranjang.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    const pembayaran = Number(
        document.getElementById("pembayaran").value
    );

    let total = 0;

    keranjang.forEach(item => {
        total += item.harga * item.jumlah;
    });

    if (pembayaran <= 0) {
        alert("Masukkan jumlah pembayaran!");
        return;
    }

    if (pembayaran < total) {
        alert(
            "Uang pembayaran kurang!\n\n" +
            "Total: " + formatRupiah(total) + "\n" +
            "Pembayaran: " + formatRupiah(pembayaran)
        );

        return;
    }

    // Kurangi stok
    keranjang.forEach(itemKeranjang => {

        const item = barang.find(
            b => b.id === itemKeranjang.id
        );

        if (item) {
            item.stok -= itemKeranjang.jumlah;
        }
    });

    const kembalian = pembayaran - total;

    document.getElementById("kembalian").innerText =
        formatRupiah(kembalian);

// Simpan transaksi
riwayat.push({
    tanggal: new Date().toLocaleString("id-ID"),
    barang: keranjang.map(item => item.nama).join(", "),
    jumlah: keranjang.reduce((total, item) => total + item.jumlah, 0),
    total: total
});
    simpanData();

    alert(
        "Pembayaran berhasil!\n\n" +
        "Total: " + formatRupiah(total) + "\n" +
        "Bayar: " + formatRupiah(pembayaran) + "\n" +
        "Kembalian: " + formatRupiah(kembalian)
    );

    keranjang = [];

    tampilkanKeranjang();
    tampilkanBarang();
    updateSelectBarang();

    document.getElementById("pembayaran").value = "";
}


// ===============================
// PRE-ORDER
// ===============================
function tambahPreOrder() {
    const pelanggan =
        document.getElementById("namaPelanggan").value.trim();

    const barangPO =
        document.getElementById("barangPreOrder").value.trim();

    const jumlah =
        Number(document.getElementById("jumlahPreOrder").value);

    const tanggal =
        document.getElementById("tanggalAmbil").value;

    const today = new Date();

const hariIni =
    today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");

    if (tanggal === "") {
        alert("Tanggal pengambilan harus diisi!");
        return;
    }

    if (tanggal < hariIni) {
        alert("Tanggal pengambilan tidak boleh sudah lewat!");
        return;
    }

    if (
        pelanggan === "" ||
        barangPO === "" ||
        jumlah <= 0
    ) {
        alert("Data pre-order belum lengkap!");
        return;
    }


    preorder.push({
        id: Date.now(),
        pelanggan: pelanggan,
        barang: barangPO,
        jumlah: jumlah,
        tanggal: tanggal,
        status: "Menunggu"
    });

    simpanData();
    tampilkanPreOrder();

    document.getElementById("namaPelanggan").value = "";
    document.getElementById("barangPreOrder").value = "";
    document.getElementById("jumlahPreOrder").value = 1;
    document.getElementById("tanggalAmbil").value = "";

    alert("Pre-order berhasil disimpan!");
}


function tampilkanPreOrder() {

    const tbody =
        document.getElementById("tabelPreOrder");

    if (!tbody) return;

    tbody.innerHTML = "";

    preorder.forEach(item => {

        tbody.innerHTML += `
            <tr>
                <td>${item.pelanggan}</td>
                <td>${item.barang}</td>
                <td>${item.jumlah}</td>
                <td>${item.tanggal}</td>

                <td>
    <select onchange="ubahStatus(${item.id}, this.value)">
        <option value="Menunggu" ${item.status === "Menunggu" ? "selected" : ""}>
            Menunggu
        </option>

        <option value="Sudah Tersedia" ${item.status === "Sudah Tersedia" ? "selected" : ""}>
            Sudah Tersedia
        </option>

        <option value="Selesai" ${item.status === "Selesai" ? "selected" : ""}>
            Selesai
        </option>
    </select>

    <button onclick="hapusPreOrder(${item.id})">
        Hapus
    </button>
</td>
            </tr>
        `;
    });
}


function ubahStatus(id, statusBaru) {

    const item =
        preorder.find(p => p.id === id);

    if (item) {
        item.status = statusBaru;
        simpanData();
    }
}
function hapusPreOrder(id) {
    if (!confirm("Yakin ingin menghapus pre-order ini?")) {
        return;
    }

    preorder = preorder.filter(item => item.id !== id);

    simpanData();
    tampilkanPreOrder();

    alert("Pre-order berhasil dihapus!");
}

// ===============================
// RIWAYAT TRANSAKSI
// ===============================
function tampilkanRiwayat() {
    const tbody = document.getElementById("tabelRiwayat");

    if (!tbody) return;

    tbody.innerHTML = "";

    riwayat.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.tanggal}</td>
                <td>${item.barang || "-"}</td>
                <td>${item.jumlah || "-"}</td>
                <td>${formatRupiah(item.total)}</td>
            </tr>
        `;
    });
}

function hapusRiwayat() {
    if (riwayat.length === 0) {
        alert("Riwayat masih kosong!");
        return;
    }

    if (!confirm("Yakin ingin menghapus semua riwayat transaksi?")) {
        return;
    }

    riwayat = [];

    simpanData();
    tampilkanRiwayat();

    alert("Semua riwayat berhasil dihapus!");
}

// ===============================
// LOCAL STORAGE
// ===============================

function simpanData() {

    localStorage.setItem(
        "barang",
        JSON.stringify(barang)
    );

    localStorage.setItem(
        "riwayat",
        JSON.stringify(riwayat)
    );

    localStorage.setItem(
        "preorder",
        JSON.stringify(preorder)
    );
}


// ===============================
// JALANKAN SAAT HALAMAN DIBUKA
// ===============================

tampilkanBarang();
updateSelectBarang();
tampilkanPreOrder();
tampilkanRiwayat();