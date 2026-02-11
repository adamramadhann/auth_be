# 📖 API Documentation

Dokumentasi lengkap untuk semua endpoint Authentication API.

---

## 🔗 Base URL

```
http://localhost:3000
```

---

## 📋 Daftar Endpoint

| No. | Method | Endpoint | Deskripsi | Auth |
|----|--------|----------|-----------|------|
| 1 | GET | `/` | Cek status API | No |
| 2 | POST | `/api/auth/register` | Register user baru | No |
| 3 | POST | `/api/auth/login` | Login & dapat token | No |
| 4 | GET | `/api/auth/dashboard` | Akses data terproteksi | Yes |

---

## 🔍 Detail Endpoint

### 1. Get API Status

Cek apakah API sudah berjalan.

#### Request

```http
GET /
```

#### Response

**Status:** `200 OK`

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

---

### 2. Register User

Membuat akun user baru.

#### Request

```http
POST /api/auth/register
Content-Type: application/json
```

**Body:**

```json
{
  "name": "johndoe",
  "password": "password123"
}
```

| Field | Type | Required | Deskripsi |
|-------|------|----------|-----------|
| `name` | string | ✅ Yes | Username (unique, min 1 karakter) |
| `password` | string | ✅ Yes | Password (min 6 karakter) |

#### Response

**Success (201 Created):**

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

**Error Responses:**

| Status | Body | Penyebab |
|--------|------|----------|
| `400` | `{"success": false, "message": "Nama dan password harus diisi!"}` | Field kosong |
| `400` | `{"success": false, "message": "Password minimal 6 karakter!"}` | Password terlalu pendek |
| `409` | `{"success": false, "message": "Username sudah terdaftar!"}` | Username sudah dipakai |
| `500` | `{"success": false, "message": "Terjadi kesalahan pada server"}` | Server error |

#### Example (cURL)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "johndoe",
    "password": "password123"
  }'
```

---

### 3. Login User

Login dan mendapatkan JWT token.

#### Request

```http
POST /api/auth/login
Content-Type: application/json
```

**Body:**

```json
{
  "name": "johndoe",
  "password": "password123"
}
```

| Field | Type | Required | Deskripsi |
|-------|------|----------|-----------|
| `name` | string | ✅ Yes | Username |
| `password` | string | ✅ Yes | Password |

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "message": "Login berhasil!",
  "data": {
    "user": {
      "id": 1,
      "name": "johndoe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImpvaG5kb2UiLCJpYXQiOjE2OTc4NzY4MDAsImV4cCI6MTY5Nzk2MzIwMH0.xyz..."
  }
}
```

**Error Responses:**

| Status | Body | Penyebab |
|--------|------|----------|
| `400` | `{"success": false, "message": "Nama dan password harus diisi!"}` | Field kosong |
| `401` | `{"success": false, "message": "Username atau password salah!"}` | Kredensial salah |
| `500` | `{"success": false, "message": "Terjadi kesalahan pada server"}` | Server error |

#### Example (cURL)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "name": "johndoe",
    "password": "password123"
  }'
```

#### Cara Pakai Token

Setelah login, simpan token dan gunakan untuk request ke endpoint yang butuh auth:

```bash
# Simpan token ke variable
TOKEN="paste_token_disini"

# Pakai token di request
curl http://localhost:3000/api/auth/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

---

### 4. Get Dashboard (Protected)

Akses data yang terproteksi. Butuh JWT token yang valid.

#### Request

```http
GET /api/auth/dashboard
Authorization: Bearer <token>
```

**Headers:**

| Header | Type | Required | Deskripsi |
|--------|------|----------|-----------|
| `Authorization` | string | ✅ Yes | Format: `Bearer <jwt_token>` |

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "message": "Selamat datang di dashboard! 🎉",
  "data": {
    "user": {
      "id": 1,
      "name": "johndoe"
    },
    "info": "Ini adalah data terproteksi. Hanya user dengan token valid yang bisa mengaksesnya."
  }
}
```

**Error Responses:**

| Status | Body | Penyebab |
|--------|------|----------|
| `401` | `{"success": false, "message": "Akses ditolak! Token hilang."}` | Token tidak ada di header |
| `403` | `{"success": false, "message": "Token tidak valid atau telah kadaluarsa!"}` | Token invalid/expired |
| `404` | `{"success": false, "message": "User tidak ditemukan!"}` | User terhapus |
| `500` | `{"success": false, "message": "Terjadi kesalahan pada server"}` | Server error |

#### Example (cURL)

```bash
# 1. Login dulu untuk dapat token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"johndoe","password":"password123"}'

# 2. Copy token dari response, lalu:
curl http://localhost:3000/api/auth/dashboard \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🔐 Authentication Flow

### Diagram

```
┌─────────┐                  ┌─────────┐
│  Client │                  │  Server │
└────┬────┘                  └────┬────┘
     │                            │
     │  1. POST /register         │
     │  {name, password}          │
     ├───────────────────────────>│
     │                            │ Create user (hash password)
     │  201 {id, name}            │
     │<───────────────────────────┤
     │                            │
     │  2. POST /login            │
     │  {name, password}          │
     ├───────────────────────────>│
     │                            │ Verify password
     │                            │ Generate JWT
     │  200 {user, token}         │
     │<───────────────────────────┤
     │                            │
     │  3. GET /dashboard         │
     │  Authorization: Bearer...  │
     ├───────────────────────────>│
     │                            │ Verify token
     │  200 {user, data}          │
     │<───────────────────────────┘
```

### Penjelasan

1. **Register** → User kirim username & password → Server simpan (password di-hash)
2. **Login** → User kirim username & password → Server cek → Return JWT token
3. **Access Protected** → User kirim JWT token → Server verify → Return data

---

## 🧪 Testing Examples

### Menggunakan cURL

#### 1. Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"admin","password":"admin123"}'
```

#### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"admin","password":"admin123"}'
```

#### 3. Access Dashboard
```bash
# Set token variable
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"admin","password":"admin123"}' \
  | grep -o '"token":"[^"]*"' \
  | cut -d'"' -f4)

# Access dashboard
curl http://localhost:3000/api/auth/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

---

### Menggunakan JavaScript (fetch)

```javascript
// 1. Register
await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'admin',
    password: 'admin123'
  })
});

// 2. Login
const loginRes = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'admin',
    password: 'admin123'
  })
});

const { data } = await loginRes.json();
const token = data.token;

// 3. Access Dashboard
const dashboardRes = await fetch('http://localhost:3000/api/auth/dashboard', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const dashboardData = await dashboardRes.json();
console.log(dashboardData);
```

---

### Menggunakan Axios

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000'
});

// 1. Register
await API.post('/api/auth/register', {
  name: 'admin',
  password: 'admin123'
});

// 2. Login
const { data } = await API.post('/api/auth/login', {
  name: 'admin',
  password: 'admin123'
});

const token = data.data.token;

// 3. Access Dashboard
const dashboard = await API.get('/api/auth/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

console.log(dashboard.data);
```

---

## 📊 HTTP Status Codes

| Code | Status | Meaning |
|------|--------|---------|
| `200` | OK | Request berhasil |
| `201` | Created | Data berhasil dibuat |
| `400` | Bad Request | Request tidak valid (missing field, dll) |
| `401` | Unauthorized | Tidak login / token tidak ada |
| `403` | Forbidden | Token invalid / expired |
| `404` | Not Found | Resource tidak ditemukan |
| `409` | Conflict | Data sudah ada (duplicate) |
| `500` | Internal Server Error | Error di server |

---

## 🔒 Security Notes

### Best Practices

1. ✅ **Password Hashing** → Password di-hash menggunakan bcrypt (salt rounds: 10)
2. ✅ **JWT Token** → Token expires dalam 24 jam
3. ✅ **HTTPS** → Gunakan HTTPS di production (bukan HTTP)
4. ✅ **Environment Variables** → Simpan JWT_SECRET di `.env` (jangan hardcode)
5. ✅ **Input Validation** → Validasi semua input dari user

### Untuk Production

1. ❌ **Jangan gunakan default JWT_SECRET** → Ganti dengan random string yang panjang
2. ❌ **Jangan kirim password di plain text** → Selalu gunakan HTTPS
3. ❌ **Jangan simpan token di localStorage** (vulnerable to XSS) → Gunakan httpOnly cookie
4. ✅ **Ganti SQLite ke PostgreSQL** → Untuk production
5. ✅ **Tambah rate limiting** → Mencegah brute force attack
6. ✅ **Tambah password strength validation** → Minimal 8 karakter, kombinasi huruf & angka

---

## 🛠️ Tools untuk Testing

### 1. Postman

Download di: https://www.postman.com/downloads/

**Setup:**
1. Create new collection
2. Add requests:
   - POST `{{base_url}}/api/auth/register`
   - POST `{{base_url}}/api/auth/login`
   - GET `{{base_url}}/api/auth/dashboard`

### 2. Thunder Client (VS Code Extension)

Install di VS Code:
1. Open Extensions (Ctrl+Shift+X)
2. Search "Thunder Client"
3. Install

### 3. Insomnia

Download di: https://insomnia.rest/

---

## 📝 Response Format

Semua response menggunakan format yang konsisten:

### Success Response

```json
{
  "success": true,
  "message": "Pesan sukses",
  "data": {
    // Data yang diminta
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Pesan error"
}
```

---

## 🔄 Changelog

### Version 1.0.0
- ✅ Register endpoint
- ✅ Login endpoint
- ✅ Protected dashboard endpoint
- ✅ JWT authentication
- ✅ Password hashing dengan bcrypt
- ✅ SQLite database dengan Prisma

---

## 📞 Support

Jika ada pertanyaan atau error, cek:

1. **[README.md](./README.md)** - Tutorial lengkap
2. **[QUICK_START.md](./QUICK_START.md)** - Quick setup guide
3. Console error message
4. Google error message

---

**Happy Coding! 🚀**
