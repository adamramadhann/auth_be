import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({
    limit: "100mb"
}));

// Mount routes
app.use("/api/auth", authRoutes);

// Root endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Auth API is running",
        endpoints: {
            register: "POST /api/auth/register",
            login: "POST /api/auth/login",
            dashboard: "GET /api/auth/dashboard"
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => (console.info(`
        ================
        Auth API running on port ${PORT}
        ================
        http://localhost:${PORT}
        ================
    `))
);