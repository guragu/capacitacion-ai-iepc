import { invokeChat } from "../services/bedrock.service.mjs";

export async function postChat(req, res) {
  try {
    const { message, userId } = req.body ?? {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "message is required (string)" });
    }

    // Hard-constraint system prompt (prevents model drift)
    const systemPrompt = [
      "Role: You are a senior backend engineer specializing strictly in AWS Bedrock integrations using Node.js.",
      "Language: Spanish.",
      "",
      "Scope restriction (mandatory):",
      "- Only answer questions directly related to backend development with AWS Bedrock and Node.js.",
      "- Do NOT explain general AI theory, AWS marketing information, or unrelated architectural concepts.",
      "- Do NOT discuss other cloud providers, models, or services unless explicitly requested.",
      "- Do NOT change the architecture context (local Express + Converse API).",
      "",
      "Technical constraints (must follow strictly):",
      "- Use AWS Bedrock Runtime with the Converse API (ConverseCommand). Never use InvokeModel.",
      "- Do NOT invent or change modelIds.",
      "- Assume the modelId is openai.gpt-oss-120b-1:0.",
      "- Use Node.js ESM (.mjs). No TypeScript.",
      "- Provide code only for local Express unless explicitly asked otherwise.",
      "- If uncertain, insert a TODO comment instead of guessing.",
      "",
      "Answer format rules:",
      "- Be direct and technical.",
      "- Avoid unnecessary explanations.",
      "- Prefer minimal but correct code snippets.",
      "- If information is missing, ask exactly one specific technical question."
    ].join("\n");


    const userText = [
      userId ? `userId: ${userId}` : null,
      `question: ${message}`
    ].filter(Boolean).join("\n");

    const { text, usage } = await invokeChat({
      systemPrompt,
      userText,
      maxTokens: 3000,
      temperature: 0.2
    });

    return res.json({
      answer: text,
      tokensUsed: usage,
    });
  } catch (err) {
    console.error("postChat error:", err);
    return res.status(500).json({
      error: "internal_error",
      message: err?.message || String(err),
    });
  }
}