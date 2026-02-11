# 📥 Installation Guide

Panduan langkah demi langkah untuk setup Auth API dari nol.

---

## 🎯 Target Audience

- Pemula yang baru belajar Backend Development
- Yang belum pernah pakai Express.js
- Yang belum pernah pakai Prisma ORM
- Yang ingin belajar membuat Authentication API

---

## 📋 Checklist Sebelum Mulai

Sebelum mulai, pastikan sudah:

- [ ] Install **Node.js** (v18 atau lebih baru)
- [ ] Install **VS Code** atau text editor lainnya
- [ ] Punya koneksi internet (untuk download dependencies)

---

## 🚀 Step-by-Step Installation

### STEP 1: Cek Instalasi Node.js

Buka terminal / command prompt:

```bash
# Cek versi Node.js
node --version
```

**Expected output:**
```
v18.x.x atau lebih
```

**Jika error "command not found":**
- Belum install Node.js
- [Download di sini](https://nodejs.org/) dan install

---

### STEP 2: Buat Folder Project

```bash
# Buat folder baru
mkdir auth-be

# Masuk ke folder
cd auth-be
```

**Penjelasan:**
- `mkdir` = make directory (buat folder)
- `cd` = change directory (masuk ke folder)

---

### STEP 3: Inisialisasi Project

```bash
npm init -y
```

**Yang terjadi:** File `package.json` terbuat otomatis

**Isi package.json:**
```json
{
  "name": "auth-be",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

---

### STEP 4: Install Dependencies

#### 4.1 Install Core Dependencies

```bash
npm install express cors dotenv
```

**Penjelasan:**
- `express` - Framework untuk membuat API
- `cors` - Mengizinkan frontend mengakses API
- `dotenv` - Manage environment variables

**Waktu:** ~10-30 detik (tergantung internet)

#### 4.2 Install Prisma

```bash
npm install prisma @prisma/client
```

**Penjelasan:**
- `prisma` - CLI untuk generate schema
- `@prisma/client` - Library untuk query database

#### 4.3 Install SQLite Adapter

```bash
npm install @prisma/adapter-better-sqlite3 better-sqlite3
```

**Penjelasan:**
- Adapter untuk menghubungkan Prisma dengan SQLite
- SQLite driver untuk Node.js

#### 4.4 Install Utilities

```bash
npm install bcryptjs jsonwebtoken
```

**Penjelasan:**
- `bcryptjs` - Hash password
- `jsonwebtoken` - Generate & verify JWT

#### 4.5 Install Dev Dependencies

```bash
npm install --save-dev nodemon
```

**Penjelasan:**
- `nodemon` - Auto-restart server saat ada perubahan kode
- `--save-dev` = hanya untuk development, tidak dipakai di production

---

### STEP 5: Setup package.json

Buka file `package.json` di VS Code, dan ubah menjadi:

```json
{
  "name": "auth-be",
  "version": "1.0.0",
  "description": "Authentication API untuk pemula",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  },
  "keywords": ["auth", "express", "prisma", "api"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@prisma/client": "^7.3.0",
    "@prisma/adapter-better-sqlite3": "^7.3.0",
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^17.2.4",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3"
  },
  "devDependencies": {
    "better-sqlite3": "^12.6.2",
    "nodemon": "^3.0.1",
    "prisma": "^7.3.0"
  }
}
```

**Yang ditambahkan:**
- `"type": "module"` - Pakai ES modules (import/export)
- `"scripts"` - Command shortcuts
- `"main": "server.js"` - Entry point

---

### STEP 6: Inisialisasi Prisma

```bash
npx prisma init
```

**Yang terjadi:**
- Folder `prisma/` terbuat
- File `prisma/schema.prisma` terbuat
- File `.env` terbuat

**Struktur sekarang:**
```
auth-be/
├── prisma/
│   └── schema.prisma
├── .env
├── package.json
└── package-lock.json
```

---

### STEP 7: Define Database Schema

Buka file `prisma/schema.prisma` dan ubah isinya menjadi:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id       Int    @id @default(autoincrement())
  name     String @unique
  password String
}
```

**Penjelasan Schema:**

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | Int | Primary key, auto increment |
| `name` | String | Username, unique |
| `password` | String | Password (akan di-hash) |

---

### STEP 8: Setup Environment Variables

Buka file `.env` dan pastikan isinya:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="super-secret-key-change-this-in-production"
PORT=3000
```

**⚠️ PENTING:** Jangan upload file `.env` ke GitHub!

---

### STEP 9: Generate Prisma Client

```bash
npx prisma generate
```

**Yang terjadi:**
- Prisma meng-generate library JavaScript untuk query database
- File ter-generate di `node_modules/@prisma/client/`

**Expected output:**
```
✔ Generated Prisma Client to node_modules/@prisma/client in XXXms
```

---

### STEP 10: Push Database Schema

```bash
npx prisma db push
```

**Yang terjadi:**
- Database SQLite (`dev.db`) terbuat
- Tabel `User` ter-create

**Expected output:**
```
✔ The database is now in sync with the Prisma schema
```

**Struktur sekarang:**
```
auth-be/
├── prisma/
│   └── schema.prisma
├── dev.db          ← Database SQLite
├── .env
├── package.json
└── package-lock.json
```

---

### STEP 11: Buat Struktur Folder

```bash
# Buat folder-folder yang dibutuhkan
mkdir -p src/config
mkdir -p src/controllers
mkdir -p src/middleware
mkdir -p src/routes
```

**Penjelasan:**
- `mkdir -p` = make directory dengan create parent folders
- `-p` = tidak error jika folder sudah ada

---

### STEP 12: Buat File-File Project

Buat file-file berikut sesuai isi yang tertera di dokumentasi utama:

#### 12.1 Database Config
Buat file `src/config/database.js`:

```javascript
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

export default prisma;
```

#### 12.2 Auth Middleware
Buat file `src/middleware/authMiddleware.js`:

```javascript
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Akses ditolak! Token hilang."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Token tidak valid atau telah kadaluarsa!"
        });
    }
};
```

#### 12.3 Auth Controller
Buat file `src/controllers/authController.js` dengan isi lengkap dari dokumentasi.

#### 12.4 Auth Routes
Buat file `src/routes/authRoutes.js`:

```javascript
import express from "express";
import { register, login, getDashboard } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/dashboard", verifyToken, getDashboard);

export default router;
```

#### 12.5 Server Entry Point
Buat file `server.js` dengan isi lengkap dari dokumentasi.

---

### STEP 13: Jalankan Server!

```bash
npm run dev
```

**Expected output:**
```
╔═══════════════════════════════════════╗
║   Auth API Running on port 3000       ║
║   http://localhost:3000                ║
╚═══════════════════════════════════════╝
```

🎉 **Selamat! Server sudah berjalan!**

---

## 🧪 Test Instalasi

### Test 1: Buka di Browser

Akses: http://localhost:3000

Harus muncul JSON response:
```json
{
  "message": "Auth API is running! 🚀",
  ...
}
```

### Test 2: Test Register

Buka terminal baru:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"test","password":"test123"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Registrasi berhasil!",
  "data": {
    "id": 1,
    "name": "test"
  }
}
```

---

## ❌ Troubleshooting

### Error: "Cannot find module 'xyz'"

**Solusi:**
```bash
npm install
```

Atau install module yang missing:
```bash
npm install <nama_module>
```

---

### Error: "Port already in use"

**Solusi 1:** Matikan proses yang pakai port 3000
```bash
# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Solusi 2:** Ganti port di `.env`:
```env
PORT=3001
```

---

### Error: "DATABASE_URL not found"

**Solusi:** Pastikan file `.env` ada dan isinya benar:
```env
DATABASE_URL="file:./dev.db"
```

---

### Error: "Prisma Client not generated"

**Solusi:** Generate Prisma Client:
```bash
npx prisma generate
```

---

### Error: "Invalid Prisma Schema"

**Solusi:** Cek file `prisma/schema.prisma`, pastikan formatnya benar.

---

### Error: "Cannot import PrismaClient"

**Solusi:**
1. Pastikan `"type": "module"` di `package.json`
2. Pastikan pakai `import` bukan `require`

---

## ✅ Verifikasi Instalasi

Gunakan checklist ini untuk memastikan semua sudah terinstall dengan benar:

### File Structure Check

- [ ] `package.json` ada dan sudah di-setup
- [ ] `prisma/schema.prisma` ada
- [ ] `.env` ada dengan DATABASE_URL dan JWT_SECRET
- [ ] `dev.db` (database) ada
- [ ] Folder `src/` ada dengan subfolder:
  - [ ] `src/config/database.js`
  - [ ] `src/controllers/authController.js`
  - [ ] `src/middleware/authMiddleware.js`
  - [ ] `src/routes/authRoutes.js`
- [ ] `server.js` ada

### Functionality Check

- [ ] `npm run dev` bisa dijalankan tanpa error
- [ ] Buka `http://localhost:3000` muncul JSON response
- [ ] POST `/api/auth/register` berhasil
- [ ] POST `/api/auth/login` berhasil dan return token
- [ ] GET `/api/auth/dashboard` dengan token berhasil

---

## 📚 Next Steps

Setelah instalasi selesai:

1. **Baca README.md** - Tutorial lengkap untuk pemula
2. **Baca API.md** - Dokumentasi API endpoints
3. **Test API** - Pakai Postman atau cURL
4. **Modifikasi** - Tambah fitur baru sesuai kebutuhan

---

## 🆘 Butuh Bantuan?

Jika ada error:

1. Baca error message dengan teliti
2. Google error message
3. Cek dokumentasi:
   - [README.md](./README.md)
   - [API.md](./API.md)
   - [QUICK_START.md](./QUICK_START.md)

---

**Happy Coding! 🚀**
