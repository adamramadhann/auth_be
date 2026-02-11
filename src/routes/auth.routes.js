import express, { Router } from "express";
import { register, login, getDashboard } from "../controllers/auth.js";
import { verifyToken } from "../middleware/jwt.js";

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post("/register", register);
router.post("/", register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   GET /api/auth/dashboard
 * @desc    Get protected dashboard data
 * @access  Private (requires JWT token)
 */
router.get("/dashboard", verifyToken, getDashboard);

export default router;
