const express            = require("express");
const morgan             = require("morgan");
const cors               = require("cors");
const GlobalErrorHandler = require("./controllers/error.controller");
const aiRouter           = require("./routers/ai.router");
require("dotenv").config();

const app = express();

/* ── Middleware ──────────────────────────────────────────────── */
const ALLOWED_ORIGINS = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",").map((o) => o.trim());

app.use(cors({
  origin: (origin, cb) => {
    // allow server-to-server / curl (no origin) and listed origins
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ["GET", "POST"],
}));
app.use(express.json({ limit: "32kb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/* ── Routes ──────────────────────────────────────────────────── */
app.use("/api/ai", aiRouter);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

/* ── 404 catch-all ───────────────────────────────────────────── */
app.all("/{*path}", (_req, res) => {
  res.status(404).json({ status: "fail", message: "Route not found" });
});

/* ── Global error handler (must be last) ────────────────────── */
app.use(GlobalErrorHandler);

/* ── Start ───────────────────────────────────────────────────── */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[server] running on port ${PORT} (${process.env.NODE_ENV})`);
});
