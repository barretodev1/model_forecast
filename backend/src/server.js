require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../database/db");
const isProd = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT) || 3000;
const app = express()
app.set("trust proxy", 1)

const rawOrigins = (process.env.FRONTEND_ORIGIN || process.env.APP_URL || "").trim();
const allowedOrigins = rawOrigins
    ? rawOrigins.split(",").map((s) => s.trim()).filter(Boolean)
    : (isProd ? [] : ["http://localhost:4200"]);

const corsOptions = {
    origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (allowedOrigins.length === 0) return cb(null, true);
        if (allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error(`CORS bloqueado para: ${origin}`));
    },
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT", "OPTIONS"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json({ limit: "25mb" }));

const API_PREFIX = "/api";

const postBoth = (routePath, handler) => {
    app.post(routePath, handler);
    app.post(`${API_PREFIX}${routePath}`, handler);
};

postBoth("/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Dados obrigatórios faltando" })
        }

        const exists = await pool.query("SELECT id FROM profilesnogoogle WHERE email=$1", [email])
        if (exists.rowCount > 0) {
            return res.status(409).json({ message: "Usuário já existente." })
        }

        const password_hash = await bcrypt.hash(password, 10)
        const result = await pool.query(
            `INSERT INTO public.profilesnogoogle (name, email, password_hash)
             VALUES ($1, $2, $3)
             RETURNING id, name, email`,
            [name, email, password_hash]
        )
        return res.status(201).json({ user: result.rows[0] });

    } catch (e) {
        console.error("REGISTER ERROR:", e);
        return res.status(500).json({ message: "Erro no cadastro.", detail: e.message });
    }
})


app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})