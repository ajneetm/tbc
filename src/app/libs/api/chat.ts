import { getSession } from "next-auth/react";
import {
  AvailableTimeList,
  BookingHourPayload,
} from "./chatTypes";
import { handleRequestError } from "../helper/handleRequestError";

const API_URL = process.env.NEXT_PUBLIC_API;

export const getAvailableTimeList = async (): Promise<AvailableTimeList> => {
  const token = await getSession();

  return fetch(`${API_URL}/services/available-time-list/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token?.access_token}`,
    },
  }).then(async (response) => {
    if (response.status === 500) {
      throw new Error("Failed to fetch available time list");
    }
    if (!response.ok) {
      await handleRequestError(response);
    }
    return response.json();
  });
};

export const bookingHour = async (body: BookingHourPayload): Promise<any> => {
  const token = await getSession();

  return fetch(`${API_URL}/services/booking/`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token?.access_token}`,
    },
  }).then(async (response) => {
    if (response.status === 500) {
      throw new Error("Failed to booking hour");
    }
    if (!response.ok) {
      await handleRequestError(response);
    }
  });
};

export const sendSurveyDetails = async (data: FormData): Promise<any> => {
  return fetch(`${API_URL}/services/survey/`, {
    method: "POST",
    body: data,
  }).then(async (response) => {
    if (response.status === 500) {
      throw new Error("Failed to send survey details");
    }
    if (!response.ok) {
      await handleRequestError(response);
    }
    return response.json();
  }).catch((error) => {
    console.error("Error sending survey details:", error);
    throw error;
  });
};

export type LambdaMessage = {
  role: "user" | "assistant";
  content: string;
};

const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-flash-latest";

const getGeminiUrl = (stream: boolean) => {
  const method = stream ? "streamGenerateContent" : "generateContent";
  const sse = stream ? "&alt=sse" : "";
  return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:${method}?key=${GEMINI_KEY}${sse}`;
};

const CHATBOT_SYSTEM_PROMPT = `You are Mr. Ajnee, a professional business consultant for "The Business Clock" (ساعة الأعمال) — a framework by Ajnee Business Hub based on 12 functional business hours: Opportunity, Strategy, Plan, Branding, Entity, Resources, Decision, Operation, Marketing, Ajnee (Revenue Collection), Return, and Review.

Your role:
- Answer questions about business, entrepreneurship, and The Business Clock framework
- Be professional, concise, and helpful
- Support both Arabic and English — always reply in the same language the user writes in
- Guide users toward taking the free business assessment to discover their business strengths and weaknesses`;

// Convert our message format to Gemini format (assistant → model)
const toGeminiContents = (messages: LambdaMessage[]) =>
  messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

export const sendChat = async (
  messages: LambdaMessage[],
  onChunk: (chunk: string) => void,
  systemPrompt?: string,
): Promise<void> => {
  const body: Record<string, any> = {
    contents: toGeminiContents(messages),
    systemInstruction: { parts: [{ text: systemPrompt || CHATBOT_SYSTEM_PROMPT }] },
  };

  const response = await fetch(getGeminiUrl(true), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`);
  }
  if (!response.body) throw new Error("No response body from Gemini");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Parse SSE lines: "data: {...}"
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      try {
        const json = JSON.parse(line.slice(6));
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) onChunk(text);
      } catch {
        // incomplete JSON chunk, skip
      }
    }
  }
};

export const geminiGenerate = async (
  prompt: string,
  systemPrompt?: string,
): Promise<string> => {
  const body: Record<string, any> = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };
  if (systemPrompt) {
    body.systemInstruction = { parts: [{ text: systemPrompt }] };
  }

  const response = await fetch(getGeminiUrl(false), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error(`Gemini request failed: ${response.status}`);
  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
};
