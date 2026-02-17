import express from "express";
import chatRoutes from "./routes/chat.routes.mjs";

const app = express();

app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use(chatRoutes);

export default app;
