# 🔐 Authentication API untuk Pemula

> API Autentikasi sederhana dengan Express.js, Prisma, dan SQLite

Dokumentasi lengkap untuk membuat sistem autentikasi (Register & Login) dari awal. Cocok untuk pemula!

---

## 📚 Daftar Isi

- [Apa itu Authentication API?](#apa-itu-authentication-api)
- [Tech Stack yang Digunakan](#tech-stack-yang-digunakan)
- [Persiapan Awal](#persiapan-awal)
- [Step-by-Step Tutorial](#step-by-step-tutorial)
- [Testing API](#testing-api)
- [FAQ](#faq-pertanyaan-yang-sering-ditanyakan)

---

## 🎯 Apa itu Authentication API?

**Authentication API** adalah sistem yang memungkinkan user untuk:
1. **Register** - Membuat akun baru
2. **Login** - Masuk ke sistem dengan username & password
3. **Akses Data Terproteksi** - Mengakses data yang hanya bisa dilihat setelah login

### Analogi Sederhana:

Bayangkan Authentication API seperti **gedung bertingkat**:

| Fitur | Analogi Gedung |
|-------|----------------|
| **Register** | Mendaftar sebagai penghuni gedung |
| **Login** | Menukarkan kartu identitas untuk mendapat kunci akses |
| **JWT Token** | Kunci akses yang diberikan setelah login |
| **Protected Route** | Lantai khusus yang hanya bisa diakses dengan kunci |
| **Middleware** | Satpam yang mengecek kunci sebelum boleh masuk |

---

## 🛠️ Tech Stack yang Digunakan

### Apa itu Tech Stack?

**Tech Stack** = Kumpulan teknologi (tools/library) yang digunakan untuk membangun aplikasi.

| Teknologi | Fungsi | Penjelasan Singkat |
|-----------|--------|-------------------|
| **Node.js** | Runtime environment | Mesin untuk menjalankan JavaScript di server |
| **Express.js** | Web Framework | Kerangka kerja untuk membangun API dengan mudah |
| **Prisma** | ORM (Object-Relational Mapping) | Tool untuk berkomunikasi dengan database tanpa menulis SQL |
| **SQLite** | Database | Database sederhana berupa file (tidak perlu install server) |
| **bcryptjs** | Password Hashing | Mengamankan password dengan enkripsi |
| **JWT** | JSON Web Token | Membuat token untuk autentikasi |
| **CORS** | Cross-Origin Resource Sharing | Mengizinkan frontend mengakses API |

### Menggunakan Teknologi Ini?

✅ **Mudah untuk pemula** - Tidak perlu setup database yang rumit
✅ **SQLite** - Database berupa file, bisa langsung jalan
✅ **Prisma** - SQL otomatis digenerate, kita tulis kode JavaScript saja
✅ **Express** - Framework paling populer untuk Node.js

---

## 📋 Persiapan Awal

### 1. Prerequisites (Yang Harus Disiapkan)

Pastikan sudah menginstall:

- **Node.js** (v18 atau lebih baru) - [Download di sini](https://nodejs.org/)
- **VS Code** atau text editor lainnya - [Download VS Code](https://code.visualstudio.com/)
- **Git** (opsional) - [Download Git](https://git-scm.com/)

### 2. Cek Instalasi

Buka terminal/command prompt dan ketik:

```bash
node --version
# Output: v18.x.x atau lebih

npm --version
# Output: 9.x.x atau lebih
```

Jika muncul versi, berarti sudah terinstall dengan benar! ✅

---

## 🚀 Step-by-Step Tutorial

Ikuti langkah-langkah ini secara berurutan:

### **STEP 1: Membuat Project Baru**

#### Apa itu `npm init`?

`npm init` adalah perintah untuk membuat file `package.json` yang berisi informasi tentang project kita.

```bash
# Buat folder baru
mkdir auth-be
cd auth-be

# Inisialisasi project
npm init -y
```

**Hasilnya:** File `package.json` terbuat otomatis

---

### **STEP 2: Install Dependencies**

#### Apa itu Dependencies?

**Dependencies** = library/kode yang dibuat orang lain yang kita pakai di project kita. Kita tidak perlu menulis semua dari nol!

#### Install semua dependencies yang dibutuhkan:

```bash
# Install Express (web framework)
npm install express cors dotenv

# Install Prisma (database ORM)
npm install prisma @prisma/client

# Install SQLite adapter untuk Prisma
npm install @prisma/adapter-better-sqlite3 better-sqlite3

# Install utilities
npm install bcryptjs jsonwebtoken

# Install dev dependencies (untuk development)
npm install --save-dev nodemon
```

#### Penjelasan Setiap Package:

| Package | Fungsi |
|---------|--------|
| `express` | Framework untuk membuat API |
| `cors` | Mengizinkan frontend (React/Vue) mengakses API |
| `dotenv` | Menyimpan konfigurasi rahasia (password, dll) |
| `prisma` | CLI untuk generate database schema |
| `@prisma/client` | Library untuk query database |
| `@prisma/adapter-better-sqlite3` | Connector Prisma ke SQLite |
| `better-sqlite3` | Driver SQLite |
| `bcryptjs` | Enkripsi password |
| `jsonwebtoken` | Membuat JWT token |
| `nodemon` | Auto-restart server saat ada perubahan kode |

---

### **STEP 3: Konfigurasi package.json**

#### Apa itu `"type": "module"`?

Ini adalah setting untuk menggunakan **ES Modules** (syntax `import/export` modern) bukan CommonJS (`require`).

Update `package.json`:

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

---

### **STEP 4: Setup Prisma (Database)**

#### Apa itu Prisma?

**Prisma** adalah ORM (Object-Relational Mapping) yang memungkinkan kita berkomunikasi dengan database menggunakan JavaScript/TypeScript tanpa menulis SQL secara manual.

#### 4.1 Inisialisasi Prisma

```bash
npx prisma init
```

**Hasilnya:** Folder `prisma/` terbuat dengan file `schema.prisma`

#### 4.2 Define Database Schema

**Schema** = Struktur database (tabel dan kolom apa saja yang ada)

Edit file `prisma/schema.prisma`:

```prisma
// Prisma schema untuk User authentication

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" 
}

// Model User = Tabel users di database
model User {
  id       Sring    @id @default(uuid())  // Primary key, auto increment
  name     String @unique                         // Username, harus unik
  password String                                 // Password (akan di-hash)
}
```

#### Penjelasan Schema:

| Field | Tipe | Penjelasan |
|-------|------|------------|
| `id` | Int | Nomor unik untuk setiap user (1, 2, 3, ...) |
| `name` | String | Username, `@unique` berarti tidak boleh ada 2 user dengan nama sama |
| `password` | String | Password yang sudah di-enkripsi |

#### 4.3 Generate Prisma Client

```bash
npx prisma generate
```

**Apa yang terjadi?** Prisma membuat library JavaScript untuk berkomunikasi dengan database.

#### 4.4 Push ke Database

```bash
npx prisma db push
```

**Hasilnya:** File `dev.db` terbuat (ini adalah database SQLite kita!)

---

### **STEP 5: Setup Environment Variables**

#### Apa itu Environment Variables?

**Environment Variables** = Variabel konfigurasi yang disimpan di file `.env` (seperti password, port, dll). File ini **RAHASIA** dan tidak boleh di-upload ke GitHub!

Buat file `.env` di root project:

```env
# Database URL (SQLite file)
DATABASE_URL="file:./dev.db"

# Secret key untuk JWT (jangan bagikan ke orang lain!)
JWT_SECRET="super-secret-key-change-this-in-production"

# Port untuk server
PORT=3000
```

---

### **STEP 6: Membuat Server**

Buat file `server.js`:

```javascript
// Import library yang dibutuhkan
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";

// Load environment variables dari file .env
dotenv.config();

// Inisialisasi Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());                    // Izinkan CORS
app.use(express.json());            // Parse JSON dari request body

// Routes
app.use("/api/auth", authRoutes);   // Mount auth routes

// Root endpoint (untuk test)
app.get("/", (req, res) => {
    res.json({
        message: "Auth API is running! 🚀",
        endpoints: {
            register: "POST /api/auth/register",
            login: "POST /api/auth/login",
            dashboard: "GET /api/auth/dashboard (protected)"
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════╗
    ║   Auth API Running on port ${PORT}      ║
    ║   http://localhost:${PORT}              ║
    ╚═══════════════════════════════════════╝
    `);
});
```

#### Penjelasan Kode:

| Baris Kode | Penjelasan |
|------------|------------|
| `import ... from ...` | Import library (ES modules syntax) |
| `dotenv.config()` | Load variabel dari file `.env` |
| `app.use(cors())` | Mengizinkan request dari domain lain |
| `app.use(express.json())` | Mengubah request body ke JSON |
| `app.use("/api/auth", authRoutes)` | Mount routes ke path `/api/auth` |
| `app.listen(PORT, ...)` | Menjalankan server di port tertentu |

---

### **STEP 7: Membuat Database Connection**

Buat file `src/config/database.js`:

```javascript
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Buat adapter untuk SQLite
const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL
});

// Buat Prisma Client dengan adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
```

#### Apa ini?

Kita membuat **singleton instance** dari Prisma Client yang akan digunakan di seluruh aplikasi. Jangan membuat instance baru setiap kali!

---

### **STEP 8: Membuat Auth Controller**

**Controller** = Tempat dimana logic bisnis kita ditulis (register, login, dll)

Buat file `src/controllers/authController.js`:

```javascript
import prisma from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ==================== REGISTER ====================
export const register = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Validasi input
        if (!name || !password) {
            return res.status(400).json({
                success: false,
                message: "Nama dan password harus diisi!"
            });
        }

        // Cek apakah user sudah ada
        const existingUser = await prisma.user.findUnique({
            where: { name }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Username sudah terdaftar!"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Buat user baru
        const newUser = await prisma.user.create({
            data: {
                name,
                password: hashedPassword
            },
            select: {
                id: true,
                name: true
            }
        });

        res.status(201).json({
            success: true,
            message: "Registrasi berhasil!",
            data: newUser
        });

    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

// ==================== LOGIN ====================
export const login = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Validasi input
        if (!name || !password) {
            return res.status(400).json({
                success: false,
                message: "Nama dan password harus diisi!"
            });
        }

        // Cari user berdasarkan username
        const user = await prisma.user.findUnique({
            where: { name }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Username atau password salah!"
            });
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Username atau password salah!"
            });
        }

        // Buat JWT token
        const token = jwt.sign(
            { id: user.id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            success: true,
            message: "Login berhasil!",
            data: {
                user: { id: user.id, name: user.name },
                token
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

// ==================== DASHBOARD (Protected) ====================
export const getDashboard = async (req, res) => {
    try {
        // req.user di-set oleh middleware
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan!"
            });
        }

        res.status(200).json({
            success: true,
            message: "Selamat datang di dashboard! 🎉",
            data: {
                user,
                info: "Ini adalah data terproteksi. Hanya user dengan token valid yang bisa mengaksesnya."
            }
        });

    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};
```

#### Penjelasan Fungsi:

| Fungsi | Tugas |
|--------|-------|
| `register` | Menerima data user → Validasi → Hash password → Simpan ke database |
| `login` | Mencari user → Cek password → Buat JWT token → Return token |
| `getDashboard` | Mengambil data user (hanya bisa diakses dengan token valid) |

---

### **STEP 9: Membuat JWT Middleware**

**Middleware** = Fungsi yang dijalankan SEBELUM controller. Biasanya untuk validasi/cek sesuatu.

Buat file `src/middleware/authMiddleware.js`:

```javascript
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    // Ambil token dari header "Authorization: Bearer <token>"
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // Cek apakah token ada
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Akses ditolak! Token hilang."
        });
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Simpan data user ke request object
        req.user = decoded;

        // Lanjut ke controller berikutnya
        next();

    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Token tidak valid atau telah kadaluarsa!"
        });
    }
};
```

#### Alur Middleware:

```
Request → Middleware (cek token) → Controller (proses data)
              ↓
         Token valid? → Lanjut
         Token invalid? → Return error
```

---

### **STEP 10: Membuat Routes**

**Routes** = Mapping antara URL dan function controller

Buat file `src/routes/authRoutes.js`:

```javascript
import express from "express";
import { register, login, getDashboard } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/register - Register user baru (public)
router.post("/register", register);

// POST /api/auth/login - Login dan dapatkan token (public)
router.post("/login", login);

// GET /api/auth/dashboard - Dashboard terproteksi (butuh token)
router.get("/dashboard", verifyToken, getDashboard);

export default router;
```

#### Penjelasan Routes:

| URL | Method | Middleware | Controller | Akses |
|-----|--------|------------|------------|-------|
| `/api/auth/register` | POST | - | register | Public |
| `/api/auth/login` | POST | - | login | Public |
| `/api/auth/dashboard` | GET | verifyToken | getDashboard | Private |

---

### **STEP 11: Buat Struktur Folder**

Pastikan struktur folder seperti ini:

```
auth-be/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   └── database.js        # Prisma client
│   ├── controllers/
│   │   └── authController.js  # Logic bisnis
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   └── routes/
│       └── authRoutes.js      # API routes
├── .env                       # Environment variables (RAHASIA!)
├── .gitignore                # File yang diabaikan git
├── dev.db                     # SQLite database (auto-generated)
├── package.json              # Project config
└── server.js                 # Entry point
```

---

### **STEP 12: Jalankan Server!**

```bash
npm run dev
```

Jika berhasil, akan muncul:

```
╔═══════════════════════════════════════╗
║   Auth API Running on port 3000       ║
║   http://localhost:3000                ║
╚═══════════════════════════════════════╝
```

---

## 🧪 Testing API

Gunakan **Postman**, **Thunder Client** (VS Code extension), atau **cURL** untuk testing.

### Test 1: Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"johndoe","password":"password123"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Registrasi berhasil!",
  "data": {
    "id": 1,
    "name": "johndoe"
  }
}
```

### Test 2: Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"johndoe","password":"password123"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Login berhasil!",
  "data": {
    "user": {
      "id": 1,
      "name": "johndoe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Test 3: Access Dashboard (Protected)

Copy token dari response login, lalu:

```bash
curl http://localhost:3000/api/auth/dashboard \
  -H "Authorization: Bearer PASTE_TOKEN_DISINI"
```

**Response:**
```json
{
  "success": true,
  "message": "Selamat datang di dashboard! 🎉",
  "data": {
    "user": {
      "id": 1,
      "name": "johndoe"
    },
    "info": "Ini adalah data terproteksi..."
  }
}
```

---

## 📖 Konsep-Konsep Penting

### 1. Apa itu Hashing Password?

**Hashing** = Mengubah password menjadi kode acak yang TIDAK BISA dikembalikan ke bentuk asli.

**Kenapa perlu?** Kalau database bocor, hacker tidak bisa melihat password asli user.

**Contoh:**
```
Password asli:  "password123"
Password hash:  "$2b$10$UrTyTILCaZVm7zvtEvZoG.eZwiIIXGhZPDRJ7T.POwApX9cF7ah.a"
```

### 2. Apa itu JWT (JSON Web Token)?

**JWT** = Token berupa string yang berisi data user (terenkripsi).

**Struktur JWT:**
```
Header.Payload.Signature
```

**Contoh:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImpvaG5kb2UifQ.signature
```

**Flow:**
```
1. User login → Server buat JWT
2. Server kirim JWT ke user
3. User simpan JWT (localStorage/cookie)
4. Setiap request, user kirim JWT di header
5. Server cek JWT → Valid → Beri akses
```

### 3. Apa itu Middleware?

**Middleware** = Fungsi di tengah-tengah antara request dan response.

```
Request → Middleware 1 → Middleware 2 → Controller → Response
```

**Analogi:** Pemeriksaan keamanan di bandara:

```
Check-in → Security check → Immigration → Boarding
         ↑ Middleware
```

### 4. Apa itu REST API?

**REST API** = API yang mengikuti arsitektur REST (Representational State Transfer).

**Prinsip utama:**
- Setiap URL = Resource
- Method HTTP = Action (GET, POST, PUT, DELETE)
- Stateless = Setiap request independent

**Contoh:**
```
GET    /api/users       - Ambil semua user
GET    /api/users/1     - Ambil user dengan id 1
POST   /api/users       - Buat user baru
PUT    /api/users/1     - Update user dengan id 1
DELETE /api/users/1     - Hapus user dengan id 1
```

---

## ❓ FAQ (Pertanyaan yang Sering Ditanyakan)

### Q1: Kenapa pakai SQLite bukan MySQL/PostgreSQL?

**Jawab:** SQLite lebih mudah untuk pemula karena:
- ✅ Tidak perlu install database server
- ✅ Database berupa file
- ✅ Cocok untuk development & belajar

Untuk production, disarankan pakai PostgreSQL atau MySQL.

### Q2: Apa bedanya `require` dan `import`?

**Jawab:**
- `require` = CommonJS syntax (lama)
- `import` = ES Modules syntax (baru/modern)

Di tutorial ini kita pakai `import` dengan setting `"type": "module"` di package.json.

### Q3: Kenapa password harus di-hash?

**Jawab:** Kalau database bocor (SQL Injection), hacker tidak bisa melihat password asli user. Hashing one-way → Tidak bisa didekripsi!

### Q4: Apa itu HTTP Status Code?

**Jawab:** Angka yang menunjukkan hasil request:

| Code | Meaning | Contoh |
|------|---------|--------|
| 200 | OK | Sukses |
| 201 | Created | Sukses create data |
| 400 | Bad Request | Input salah/kurang |
| 401 | Unauthorized | Tidak login |
| 403 | Forbidden | Tidak punya akses |
| 404 | Not Found | Resource tidak ditemukan |
| 409 | Conflict | Data sudah ada (duplicate) |
| 500 | Server Error | Error di server |

### Q5: Bagaimana cara deploy ke production?

**Jawab:** Beberapa opsi:
- **Vercel** - Gratis & mudah
- **Railway** - Gratis untuk kecil
- **Render** - Gratis tier
- **Heroku** - Berbayar

Jangan lupa:
1. Ganti `JWT_SECRET` dengan yang kuat
2. Ganti SQLite ke PostgreSQL
3. Set `NODE_ENV=production`

### Q6: Error "Cannot find module"?

**Jawab:** Install dependency yang kurang:
```bash
npm install <nama_module>
```

### Q7: Error "Port already in use"?

**Jawab:** Port 3000 sudah dipakai. Solusi:
1. Matikan proses yang pakai port 3000
2. Atau ganti port di `.env`

---

## 📚 Resources Tambahan

### Belajar Lebih Lanjut:

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT.io](https://jwt.io/) - Understand JWT structure
- [REST API Tutorial](https://restfulapi.net/)

### Video Tutorial (Indonesia):
- [Web Programming UNPAS](https://www.youtube.com/@sandhikagalihWPU) - Express.js
- [Kelas Terbuka](https://www.youtube.com/@kelasterbukaofficial) - Node.js

---

## 🎓 Tips untuk Pemula

1. **Jangan copy paste sembarangan** → Pahami dulu setiap baris kode
2. **Baca error message** → Error message adalah petunjuk
3. **Google error message** → 99% masalah sudah pernah dialami orang lain
4. **Consistent naming** → Pakai camelCase atau snake_case, jangan campur
5. **Comment kode** → Tambahkan keterangan untuk kode kompleks
6. **Git commit sering** → Jaga setiap progress
7. **Tanya komunitas** → Join Discord/Forum programming

---

## 🤝 Contributing

Project ini untuk belajar. Jika ada pertanyaan atau error, tanya saja!

---

## 📄 License

MIT License - Bebas dipakai untuk belajar!

---

**Happy Coding! 🚀**

Dibuat dengan ❤️ untuk pemula yang ingin belajar Authentication API.
