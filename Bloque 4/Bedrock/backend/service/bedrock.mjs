import express from "express";
import { buildPrompt, callBedrock } from "./bedrockClient.mjs";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message, userId } = req.body || {};
    if (!message) return res.status(400).json({ error: "message is required" });

    const { system, messages } = buildPrompt({
      rol: "Rol: Eres un asistente técnico para desarrolladores backend. Responde en español.",
      contexto: `Usuario: ${userId || "anon"}.\nSistema: API /chat en Node.js.`,
      objetivo: "Responder la pregunta de forma accionable y breve.",
      restricciones: [
        "- Si faltan datos, pregunta 1 cosa concreta.",
        "- No más de 8 líneas.",
        "- Si das código, que sea mínimo."
      ].join("\n"),
      inputUsuario: message
    });

    const { text, usage } = await callBedrock({
      system,
      messages,
      maxTokens: 500,
      temperature: 0.3
    });

    res.json({
      answer: text,
      tokensUsed: usage || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "bedrock_error", details: err?.message || String(err) });
  }
});

app.listen(3000, () => console.log("API running on http://localhost:3000"));
