# Auth Backend API - Documentation

## 📋 Project Overview

Authentication REST API menggunakan **Express.js**, **Prisma ORM**, dan **SQLite** dengan fitur:
- User Registration
- User Login dengan JWT
- Protected Dashboard endpoint

---

## 🛠️ Tech Stack

| Technology | Version | Description |
|------------|---------|-------------|
| Node.js | 18+ | Runtime environment |
| Express | 5.2.1 | Web framework |
| Prisma | 7.3.0 | ORM database |
| SQLite | - | Database (via better-sqlite3) |
| bcryptjs | 3.0.3 | Password hashing |
| jsonwebtoken | 9.0.3 | JWT authentication |

---

## 📦 Dependencies (WAJIB)

### Runtime Dependencies (Production)
```json
{
  "@prisma/client": "^7.3.0",     // Prisma ORM Client
  "bcryptjs": "^3.0.3",            // Password hashing
  "cors": "^2.8.6",                // CORS middleware
  "dotenv": "^17.2.4",             // Environment variables
  "express": "^5.2.1",             // Web framework
  "jsonwebtoken": "^9.0.3"         // JWT authentication
}
```

### Development Dependencies
```json
{
  "@prisma/adapter-better-sqlite3": "^7.3.0",  // Prisma SQLite adapter
  "better-sqlite3": "^12.6.2",                  // SQLite driver
  "nodemon": "^3.0.1",                          // Auto-restart dev server
  "prisma": "^7.3.0"                            // Prisma CLI
}
```

---

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Buat file `.env` di root project:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="super-secret-key-123"
PORT=3000
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Push Database Schema
```bash
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```

Server akan berjalan di: `http://localhost:3000`

---

## 📁 Project Structure

```
auth_be/
├── server.js                      # Entry point
├── package.json                   # Dependencies & scripts
├── .env                          # Environment variables
├── dev.db                        # SQLite database
├── prisma/
│   └── schema.prisma             # Database schema
└── src/
    ├── routes/
    │   └── auth.routes.js        # Auth routes
    ├── controllers/
    │   └── auth.js               # Auth controller (register, login, dashboard)
    └── middleware/
        └── jwt.js                # JWT verification middleware
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000
```

### Available Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | API info | No |
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login & get JWT token | No |
| GET | `/api/auth/dashboard` | Get protected data | Yes |

---

## 📝 API Documentation

### 1. Root Endpoint
**GET** `/`

Response:
```json
{
  "message": "Auth API is running",
  "endpoints": {
    "register": "POST /api/auth/register",
    "login": "POST /api/auth/login",
    "dashboard": "GET /api/auth/dashboard"
  }
}
```

---

### 2. Register User
**POST** `/api/auth/register`

Request Body:
```json
{
  "name": "johndoe",
  "password": "password123"
}
```

**Validation Rules:**
- `name`: Required, unique, min 1 character
- `password`: Required, min 6 characters

Success Response (201):
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

Error Responses:

| Status | Message | Description |
|--------|---------|-------------|
| 400 | "Nama dan password harus diisi!" | Missing fields |
| 400 | "Password minimal 6 karakter!" | Password too short |
| 409 | "Nama sudah terdaftar!" | Username already exists |

---

### 3. Login User
**POST** `/api/auth/login`

Request Body:
```json
{
  "name": "johndoe",
  "password": "password123"
}
```

Success Response (200):
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

Error Responses:

| Status | Message | Description |
|--------|---------|-------------|
| 400 | "Nama dan password harus diisi!" | Missing fields |
| 401 | "Nama atau password salah!" | Invalid credentials |

**Token Expiry:** 24 hours

---

### 4. Get Dashboard (Protected)
**GET** `/api/auth/dashboard`

Headers:
```
Authorization: Bearer <token>
```

Success Response (200):
```json
{
  "success": true,
  "message": "Selamat datang di dashboard!",
  "data": {
    "user": {
      "id": 1,
      "name": "johndoe"
    },
    "info": "Ini adalah data yang dilindungi. Hanya user dengan token valid yang bisa mengaksesnya."
  }
}
```

Error Responses:

| Status | Message | Description |
|--------|---------|-------------|
| 401 | "Akses ditolak, token hilang!" | No token provided |
| 403 | "Token tidak valid atau telah kadaluarsa!" | Invalid/expired token |
| 404 | "User tidak ditemukan!" | User not found |

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"johndoe","password":"password123"}'
```

### Login & Get Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"johndoe","password":"password123"}'
```

### Access Protected Dashboard
```bash
curl http://localhost:3000/api/auth/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔒 Security Features

1. **Password Hashing**: Menggunakan bcryptjs dengan salt rounds = 10
2. **JWT Authentication**: Token expires in 24 hours
3. **Protected Routes**: Middleware verifies JWT token
4. **Input Validation**: Server-side validation for all inputs
5. **CORS Enabled**: Cross-origin requests allowed
6. **SQL Injection Protection**: Prisma ORM prevents SQL injection

---

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id       Int    @id @default(autoincrement())
  name     String @unique
  password String
}
```

**Database Location:** `./dev.db` (SQLite)

---

## 📜 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with nodemon |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run Prisma migrations |

---

## 🐛 Troubleshooting

### Server won't start
- Ensure all dependencies are installed: `npm install`
- Check port 3000 is not in use
- Verify `.env` file exists

### Prisma errors
- Run `npx prisma generate` to regenerate client
- Run `npx prisma db push` to sync database

### 404 errors
- Ensure routes are properly imported in `server.js`
- Check route paths match the endpoints

### JWT errors
- Verify `JWT_SECRET` is set in `.env`
- Check token format: `Authorization: Bearer <token>`
- Token expires after 24 hours, login again

---

## 📝 Notes

- This project uses **ES Modules** (`type: "module"` in package.json)
- All imports use ES6 `import/export` syntax
- Database is SQLite for development simplicity
- For production, consider PostgreSQL or MySQL

---

## 📄 License

ISC
