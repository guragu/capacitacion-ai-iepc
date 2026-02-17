import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const modelId = process.env.BEDROCK_MODEL_ID || "openai.gpt-oss-120b-1:0";

function getText(response) {
  const parts = response?.output?.message?.content || [];
  return parts
    .filter((p) => typeof p?.text === "string")
    .map((p) => p.text)
    .join("\n");
}

export async function invokeChat({ systemPrompt, userText, maxTokens }) {
  const cmd = new ConverseCommand({
    modelId,
    system: systemPrompt ? [{ text: systemPrompt }] : undefined,
    messages: [
      { role: "user", content: [{ text: userText }] }
    ],
    inferenceConfig: {
      maxTokens: 3000,
      temperature: 0.3,
      topP: 0.9,
    },
  });

  const res = await client.send(cmd);

  return {
    text: getText(res),
    usage: res?.usage || null,
  };
}
