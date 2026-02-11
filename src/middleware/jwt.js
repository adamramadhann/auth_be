import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer <token>"

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Akses ditolak, token hilang!"
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store user data from token in request object
        req.user = decoded;

        // Continue to the next middleware/controller
        next();
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: "Token tidak valid atau telah kadaluarsa!"
        });
    }
};
