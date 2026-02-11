import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({
    limit: "100mb"
}));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => (console.info(`
        ================
        run port ${PORT}
        ================
    `))
);