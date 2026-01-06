# Absensi26 Sistem (Realtime)

Sistem absensi berbasis web dengan dukungan **realtime data**, **role-based access control**, dan **bukti kehadiran kamera**.

## 📌 Fitur Utama

### 1. Multi Role System
Sistem memiliki tiga role utama dengan otorisasi berbasis server:
- **Siswa**
- **Guru**
- **Admin**

Semua pengguna login melalui satu halaman autentikasi, namun akses dashboard ditentukan sepenuhnya oleh backend berdasarkan role di database.

---

### 2. Dashboard Siswa
- Absensi **hanya 1 kali per hari**
- Pilihan status:
  - Hadir (wajib foto realtime via kamera)
  - Sakit (wajib keterangan)
  - Izin (wajib keterangan)
  - Tidak masuk
- Snapshot kamera sebagai bukti kehadiran (dengan timestamp server)
- Logout otomatis setelah submit
- Akun terkunci untuk hari tersebut

---

### 3. Dashboard Guru
- Tampilan kartu jurusan:
  - KGS
  - TEK
  - TITL
  - TFLM
  - TKR
  - SIJA
- Setiap jurusan memiliki 6 kelas (kelas 10–12, masing-masing 2 kelas)
- Monitoring kehadiran siswa secara **realtime**
- Riwayat absensi (history) per kelas

---

### 4. Dashboard Admin
- Full CRUD:
  - Data siswa & guru
  - Jurusan & kelas
  - Data absensi
- Reset absensi harian
- Audit log aktivitas admin (siapa, kapan, apa yang diubah)

---

## 🏗️ Tech Stack

### Frontend
- React.js
- Axios
- WebSocket (Socket.io client)

### Backend
- Node.js
- Express.js
- JWT Authentication
- Socket.io
- Bcrypt (password hashing)

### Database
- MySQL
- phpMyAdmin (GUI)

---

## ⚙️ Instalasi & Setup

### 1. Clone Repository
```bash
git clone https://github.com/FKfarell171008/absensi26.git
```

### 2. Backend
```bash
cd backend
npm install
npm run dev
```

#### Buat file .env:
```bash
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=absensi_db
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

farellkurniawan@gmail.com
