# 🚀 Quick Start Guide

Mulai jalankan Auth API dalam 5 menit!

## 📦 Prerequisites

Sebelum mulai, pastikan sudah install:

```bash
# Cek versi Node.js (butuh v18+)
node --version

# Cek versi npm
npm --version
```

Belum install? [Download Node.js di sini](https://nodejs.org/)

---

## ⚡ Setup Super Cepat

### 1. Clone / Download Project

```bash
# Jika pakai Git
git clone <repository-url>
cd auth-be

# Atau download ZIP, extract, lalu masuk ke folder
```

### 2. Install Dependencies

```bash
npm install
```

Tunggu sampai selesai (mungkin butuh 1-2 menit).

### 3. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema ke database
npx prisma db push
```

### 4. Jalankan Server

```bash
npm run dev
```

Server berjalan di: **http://localhost:3000** 🎉

---

## 🧪 Test dalam 1 Menit

### Test di Browser

Buka browser dan akses:

```
http://localhost:3000
```

Akan muncul:

```json
{
  "message": "Auth API is running! 🚀",
  "endpoints": {
    "register": "POST /api/auth/register",
    "login": "POST /api/auth/login",
    "dashboard": "GET /api/auth/dashboard (protected)"
  }
}
```

### Test dengan cURL

Buka terminal baru:

```bash
# 1. Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"admin","password":"admin123"}'

# 2. Login dan dapatkan token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"admin","password":"admin123"}'

# 3. Copy token dari response, lalu test dashboard
curl http://localhost:3000/api/auth/dashboard \
  -H "Authorization: Bearer PASTE_TOKEN_DISINI"
```

---

## 📁 Struktur Project

```
auth-be/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   └── database.js        # Database connection
│   ├── controllers/
│   │   └── authController.js  # Register & Login logic
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   └── routes/
│       └── authRoutes.js      # API routes
├── .env                       # Environment variables
├── package.json              # Dependencies
└── server.js                 # Entry point
```

---

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (with auto-restart) |
| `npm start` | Start production server |
| `npx prisma studio` | Open Prisma Studio (GUI database viewer) |
| `npx prisma generate` | Regenerate Prisma Client |
| `npx prisma db push` | Push schema changes to database |

---

## 🎯 Apa Selanjutnya?

Baca dokumentasi lengkap di:

- **[README.md](./README.md)** - Tutorial lengkap untuk pemula
- **[API.md](./API.md)** - Dokumentasi API endpoints

---

## ❌ Error & Solutions

### Error: "Cannot find module 'prisma'"

```bash
npm install prisma @prisma/client
```

### Error: "Port already in use"

Matikan proses yang pakai port 3000 atau ubah di `.env`:

```env
PORT=3001
```

### Error: "DATABASE_URL not found"

Pastikan file `.env` ada dan berisi:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="super-secret-key"
PORT=3000
```

---

## 🆘 Butuh Bantuan?

1. Cek **[README.md](./README.md)** untuk tutorial detail
2. Baca error message dengan teliti
3. Google error message + "prisma" atau "express"

---

Happy Coding! 🚀
