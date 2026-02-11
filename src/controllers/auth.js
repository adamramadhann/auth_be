import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Create Prisma client with adapter
const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || "file:./dev.db"
});
const prisma = new PrismaClient({
    adapter
});

/**
 * Register new user
 * @route POST /api/auth/register
 * @body { name: string, password: string }
 */
export const register = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Validation
        if (!name || !password) {
            return res.status(400).json({
                success: false,
                message: "Nama dan password harus diisi!"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password minimal 6 karakter!"
            });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { name }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Nama sudah terdaftar!"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
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

/**
 * Login user
 * @route POST /api/auth/login
 * @body { name: string, password: string }
 */
export const login = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Validation
        if (!name || !password) {
            return res.status(400).json({
                success: false,
                message: "Nama dan password harus diisi!"
            });
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { name }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Nama atau password salah!"
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Nama atau password salah!"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            success: true,
            message: "Login berhasil!",
            data: {
                user: {
                    id: user.id,
                    name: user.name
                },
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

/**
 * Get dashboard data (protected route)
 * @route GET /api/auth/dashboard
 * @header Authorization: Bearer <token>
 */
export const getDashboard = async (req, res) => {
    try {
        // User data from JWT token (attached by verifyToken middleware)
        const userId = req.user.id;

        // Get user data from database
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan!"
            });
        }

        res.status(200).json({
            success: true,
            message: "Selamat datang di dashboard!",
            data: {
                user,
                info: "Ini adalah data yang dilindungi. Hanya user dengan token valid yang bisa mengaksesnya."
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
