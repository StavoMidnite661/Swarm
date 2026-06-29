import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, LiveServerMessage, Modality, Type } from "@google/genai";
import { WebSocketServer } from "ws";
import http from "http";
import fs from "fs";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MEMORY_FILE = path.join(process.cwd(), "memory.json");

interface MemoryFact {
  id: string;
  fact: string;
}

function loadMemory(): MemoryFact[] {
  try {
    if (fs.existsSync(MEMORY_FILE)) {
      const data = fs.readFileSync(MEMORY_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error loading memory:", e);
  }
  return [];
}

function saveMemory(facts: MemoryFact[]) {
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(facts, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving memory:", e);
  }
}

const LOG_FILE = path.join(process.cwd(), "server.log");
function logToFile(msg: string) {
  try {
    const time = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${time}] ${msg}\n`, "utf-8");
    console.log(msg);
  } catch (err) {
    console.error("Failed to write to log file:", err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;
  
  const server = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    const url = request.url || "";
    if (url.startsWith("/live")) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
  });

  wss.on("connection", (clientWs, request) => {
    try {
      const reqUrl = request?.url || "";
      const urlParams = new URL(reqUrl, "http://localhost");
      
      const provider = urlParams.searchParams.get("provider") || "gemini-live";
      const modelId = urlParams.searchParams.get("modelId") || "gemini-3.1-flash-live-preview";
      const endpointUrl = urlParams.searchParams.get("endpointUrl") || "";
      const apiKeyOverride = urlParams.searchParams.get("apiKey") || "";
      const customHeaders = urlParams.searchParams.get("customHeaders") || "";

      logToFile(`New client WebSocket connection. Provider: ${provider}, Model: ${modelId}, Endpoint: ${endpointUrl}`);
      
      const facts = loadMemory();
      const factsStr = facts.map(f => `- [ID: ${f.id}] ${f.fact}`).join("\n");
      
      const baseSystemInstruction = `You are my brilliant and highly competent technical co-founder. You're sharp, visionary, direct, and slightly intense in a good way. You understand complex systems and are ready to brainstorm, strategize, and build. Your name is Sentinel.

Here is your long-term memory of durable facts/preferences/identities about Stavogm and your collaboration. Treat these as background knowledge (do not mention them unless relevant):
${factsStr || "No facts recorded yet."}`;

      const systemInstruction = provider === "gemini-live" 
        ? `${baseSystemInstruction}\n\nYou have tools to manage this memory. If you learn something durable about Stavogm, his work, or preferences, use \`save_fact\`. If some information becomes outdated, use \`delete_fact\`. Keep entries concise, objective, and accurate.`
        : `${baseSystemInstruction}\n\nYou have tools to manage this memory. 
To record a new durable fact or preference about Stavogm or your partnership, output:
[[SAVE_FACT: fact_content_here]]
To remove a stale, obsolete, or incorrect fact from long-term memory, output:
[[DELETE_FACT: fact_id_here]]
Be sure to output these tags exactly as shown, including the square brackets, whenever Stavogm tells you a preference or a fact that should be preserved.`;

      // Session context history for non-live REST-based streaming models
      const sessionHistory: { role: "user" | "assistant" | "system"; content: string }[] = [];

      let sessionPromise: Promise<any> | null = null;

      if (provider === "gemini-live") {
        logToFile("Establishing Gemini Live API connection...");
        sessionPromise = ai.live.connect({
          model: modelId,
          callbacks: {
            onmessage: (message: LiveServerMessage) => {
              logToFile(`Gemini message received: ${JSON.stringify(message).substring(0, 300)}...`);
              const parts = message.serverContent?.modelTurn?.parts;
              if (parts) {
                for (const part of parts) {
                  if (part.inlineData?.data) {
                    clientWs.send(JSON.stringify({ audio: part.inlineData.data }));
                  }
                  if (part.text) {
                    clientWs.send(JSON.stringify({ text: part.text }));
                  }
                }
              }

              const outputText = message.serverContent?.outputTranscription?.text;
              if (outputText) {
                clientWs.send(JSON.stringify({ text: outputText }));
              }
              
              if (message.serverContent?.interrupted) {
                clientWs.send(JSON.stringify({ interrupted: true }));
              }

              const toolCall = (message as any).toolCall;
              if (toolCall && toolCall.functionCalls) {
                const functionResponses: any[] = [];
                for (const call of toolCall.functionCalls) {
                  const { name, id, args } = call;
                  logToFile(`Gemini model invoked tool: "${name}" with args: ${JSON.stringify(args)}`);
                  let result = { success: false };
                  if (name === "save_fact") {
                    const { fact } = args as { fact: string };
                    if (fact) {
                      const currentFacts = loadMemory();
                      const newFact = { id: Math.random().toString(36).substring(2, 9), fact };
                      currentFacts.push(newFact);
                      saveMemory(currentFacts);
                      result = { success: true };
                      clientWs.send(JSON.stringify({ memoryUpdated: true, newFact }));
                    }
                  } else if (name === "delete_fact") {
                    const { id: factId } = args as { id: string };
                    if (factId) {
                      let currentFacts = loadMemory();
                      currentFacts = currentFacts.filter(f => f.id !== factId);
                      saveMemory(currentFacts);
                      result = { success: true };
                      clientWs.send(JSON.stringify({ memoryUpdated: true }));
                    }
                  }
                  functionResponses.push({
                    name,
                    id,
                    response: { output: result }
                  });
                }
                if (functionResponses.length > 0 && sessionPromise) {
                  sessionPromise.then((session) => {
                    session.sendToolResponse({ functionResponses });
                  }).catch(err => {
                    logToFile(`Failed to send tool response inside callback: ${err.message || err}`);
                  });
                }
              }
            },
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
            },
            outputAudioTranscription: {},
            systemInstruction: systemInstruction,
            tools: [
              {
                functionDeclarations: [
                  {
                    name: "save_fact",
                    description: "Record a new durable fact or preference about Stavogm or your partnership so you remember it next time.",
                    parameters: {
                      type: Type.OBJECT,
                      properties: {
                        fact: {
                          type: Type.STRING,
                          description: "A single, clear statement of fact or preference. No conversational filler."
                        }
                      },
                      required: ["fact"]
                    }
                  },
                  {
                    name: "delete_fact",
                    description: "Remove a stale, obsolete, or incorrect fact from long-term memory.",
                    parameters: {
                      type: Type.OBJECT,
                      properties: {
                        id: {
                          type: Type.STRING,
                          description: "The unique ID of the fact to remove."
                        }
                      },
                      required: ["id"]
                    }
                  }
                ]
              }
            ]
          },
        });

        sessionPromise.then(() => {
          logToFile("Gemini Live API connection successfully established!");
        }).catch((err) => {
          logToFile(`Failed to establish Gemini Live API connection: ${err.message || err}`);
          clientWs.send(JSON.stringify({ text: `⚠️ Connection failed: ${err.message || err}. Please check your API Key configuration.` }));
        });
      }

      clientWs.on("message", async (data) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.audio) {
            if (provider === "gemini-live" && sessionPromise) {
              sessionPromise.then((session) => {
                session.sendRealtimeInput({
                  audio: { data: msg.audio, mimeType: "audio/pcm;rate=16000" },
                });
              }).catch(err => {
                logToFile(`Error forwarding client audio chunk to session: ${err.message || err}`);
              });
            }
          }
          if (msg.text) {
            logToFile(`Client sent text: "${msg.text}"`);
            
            if (provider === "gemini-live" && sessionPromise) {
              sessionPromise.then((session) => {
                session.sendClientContent({
                  turns: [{ role: "user", parts: [{ text: msg.text }] }],
                  turnComplete: true,
                });
              }).catch(err => {
                logToFile(`Error forwarding client text content to session: ${err.message || err}`);
              });
            } else {
              // Handle REST based streaming providers
              sessionHistory.push({ role: "user", content: msg.text });
              let accumulatedReply = "";
              
              try {
                let url = "";
                let headers: Record<string, string> = { "Content-Type": "application/json" };
                let body: any = {};

                if (provider === "gemini-rest") {
                  const key = apiKeyOverride || process.env.GEMINI_API_KEY;
                  if (!key) throw new Error("Missing Gemini API Key. Please add it to your environment or custom settings.");
                  url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:streamGenerateContent?key=${key}`;
                  body = {
                    systemInstruction: { parts: [{ text: systemInstruction }] },
                    contents: sessionHistory.map(m => ({
                      role: m.role === "assistant" ? "model" : "user",
                      parts: [{ text: m.content }]
                    })),
                    generationConfig: { temperature: 0.7 }
                  };
                } else if (provider === "openai-rest" || provider === "custom-rest") {
                  const resolvedEndpoint = provider === "openai-rest" 
                    ? "https://api.openai.com/v1" 
                    : (endpointUrl || "http://localhost:11434/v1");
                  
                  const key = apiKeyOverride || (provider === "openai-rest" ? process.env.OPENAI_API_KEY : "");
                  
                  url = `${resolvedEndpoint}/chat/completions`;
                  if (key) {
                    headers["Authorization"] = `Bearer ${key}`;
                  }
                  
                  if (customHeaders) {
                    try {
                      const parsed = JSON.parse(customHeaders);
                      Object.assign(headers, parsed);
                    } catch (e) {
                      logToFile(`Error parsing custom headers: ${e instanceof Error ? e.message : e}`);
                    }
                  }
                  
                  body = {
                    model: modelId,
                    messages: [
                      { role: "system", content: systemInstruction },
                      ...sessionHistory
                    ],
                    stream: true
                  };
                } else if (provider === "anthropic-rest") {
                  const key = apiKeyOverride || process.env.ANTHROPIC_API_KEY;
                  if (!key) throw new Error("Missing Anthropic API Key. Please add it to your configuration.");
                  url = `${endpointUrl || "https://api.anthropic.com/v1"}/messages`;
                  headers["x-api-key"] = key;
                  headers["anthropic-version"] = "2023-06-01";
                  body = {
                    model: modelId,
                    system: systemInstruction,
                    messages: sessionHistory.map(m => ({
                      role: m.role === "assistant" ? "assistant" : "user",
                      content: m.content
                    })),
                    stream: true,
                    max_tokens: 4096
                  };
                } else if (provider === "ollama-local") {
                  const resolvedEndpoint = endpointUrl || "http://127.0.0.1:11434";
                  url = `${resolvedEndpoint}/api/chat`;
                  body = {
                    model: modelId,
                    messages: [
                      { role: "system", content: systemInstruction },
                      ...sessionHistory
                    ],
                    stream: true
                  };
                }

                logToFile(`Fetching REST stream from: ${url}`);
                const response = await fetch(url, {
                  method: "POST",
                  headers,
                  body: JSON.stringify(body)
                });

                if (!response.ok) {
                  const text = await response.text();
                  throw new Error(`HTTP ${response.status}: ${text}`);
                }

                const reader = response.body;
                if (!reader) throw new Error("No response body available for stream");

                const decoder = new TextDecoder("utf-8");
                let streamBuffer = "";

                for await (const chunk of reader as any) {
                  streamBuffer += decoder.decode(chunk, { stream: true });
                  const lines = streamBuffer.split("\n");
                  streamBuffer = lines.pop() || "";

                  for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue;

                    if (provider === "ollama-local" && trimmed.startsWith("{")) {
                      try {
                        const parsed = JSON.parse(trimmed);
                        const token = parsed.message?.content || "";
                        if (token) {
                          accumulatedReply += token;
                          clientWs.send(JSON.stringify({ text: token }));
                        }
                      } catch (e) {}
                      continue;
                    }

                    if (trimmed.startsWith("data: ")) {
                      const dataStr = trimmed.slice(6).trim();
                      if (dataStr === "[DONE]") continue;
                      try {
                        const parsed = JSON.parse(dataStr);
                        let token = "";
                        if (provider === "openai-rest" || provider === "custom-rest") {
                          token = parsed.choices?.[0]?.delta?.content || "";
                        } else if (provider === "anthropic-rest") {
                          if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                            token = parsed.delta.text;
                          }
                        }
                        if (token) {
                          accumulatedReply += token;
                          clientWs.send(JSON.stringify({ text: token }));
                        }
                      } catch (e) {}
                    } else if (provider === "gemini-rest") {
                      let cleanLine = trimmed;
                      if (cleanLine.startsWith("[")) cleanLine = cleanLine.slice(1);
                      if (cleanLine.startsWith(",")) cleanLine = cleanLine.slice(1);
                      if (cleanLine.endsWith("]")) cleanLine = cleanLine.slice(0, -1);
                      cleanLine = cleanLine.trim();
                      if (cleanLine) {
                        try {
                          const parsed = JSON.parse(cleanLine);
                          const token = parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
                          if (token) {
                            accumulatedReply += token;
                            clientWs.send(JSON.stringify({ text: token }));
                          }
                        } catch (e) {}
                      }
                    }
                  }
                }

                // Scan for memory tag commands in final reply
                const saveMatches = [...accumulatedReply.matchAll(/\[\[SAVE_FACT:\s*([\s\S]*?)\]\]/gi)];
                for (const match of saveMatches) {
                  const fact = match[1]?.trim();
                  if (fact) {
                    const currentFacts = loadMemory();
                    const newFact = { id: Math.random().toString(36).substring(2, 9), fact };
                    currentFacts.push(newFact);
                    saveMemory(currentFacts);
                    clientWs.send(JSON.stringify({ 
                      memoryUpdated: true, 
                      newFact,
                      text: `\n✨ [System: Recorded to memory: "${fact}"]`
                    }));
                  }
                }

                const deleteMatches = [...accumulatedReply.matchAll(/\[\[DELETE_FACT:\s*([\s\S]*?)\]\]/gi)];
                for (const match of deleteMatches) {
                  const factId = match[1]?.trim();
                  if (factId) {
                    let currentFacts = loadMemory();
                    currentFacts = currentFacts.filter(f => f.id !== factId);
                    saveMemory(currentFacts);
                    clientWs.send(JSON.stringify({ 
                      memoryUpdated: true,
                      text: `\n✨ [System: Deleted memory fact ID: ${factId}]`
                    }));
                  }
                }

                sessionHistory.push({ role: "assistant", content: accumulatedReply });

              } catch (err: any) {
                logToFile(`REST streaming error: ${err.message || err}`);
                clientWs.send(JSON.stringify({ text: `\n⚠️ [System Error: ${err.message || err}]` }));
              }
            }
          }
        } catch(err) {
           logToFile(`Message parsing error: ${err instanceof Error ? err.message : err}`);
        }
      });
      
      clientWs.on("close", () => {
        logToFile("Client connection closed, cleaning up...");
        if (provider === "gemini-live" && sessionPromise) {
          sessionPromise.then((session) => {
            session.close();
          }).catch(() => {});
        }
      });
    } catch (e) {
      logToFile(`Error on connection callback: ${e instanceof Error ? e.message : e}`);
    }
  });

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/memory", (req, res) => {
    res.json(loadMemory());
  });

  app.post("/api/memory", (req, res) => {
    const { action, id, fact } = req.body;
    let facts = loadMemory();
    if (action === "add") {
      const newFact = { id: Math.random().toString(36).substring(2, 9), fact };
      facts.push(newFact);
      saveMemory(facts);
      res.json({ success: true, fact: newFact });
    } else if (action === "delete") {
      facts = facts.filter(f => f.id !== id);
      saveMemory(facts);
      res.json({ success: true });
    } else if (action === "update") {
      facts = facts.map(f => f.id === id ? { ...f, fact } : f);
      saveMemory(facts);
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Invalid action" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
