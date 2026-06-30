import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, LiveServerMessage, Modality, Type } from "@google/genai";
import { WebSocketServer } from "ws";
import http from "http";
import fs from "fs";
import "dotenv/config";

let aiInstance: GoogleGenAI | null = null;
function getGoogleGenAI(apiKeyOverride?: string): GoogleGenAI {
  const key = apiKeyOverride || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is missing. Please set it in Settings > Secrets or in the Config panel.");
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

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

// Google Workspace Backend API Helpers
async function createCalendarEventBackend(token: string, summary: string, description: string, location: string, startDateTime: string, endDateTime: string) {
  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      summary,
      description,
      location,
      start: { dateTime: startDateTime },
      end: { dateTime: endDateTime },
    }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Calendar event creation failed: ${response.status} - ${errText}`);
  }
  return await response.json();
}

async function sendGmailEmailBackend(token: string, to: string, subject: string, body: string, userEmail: string) {
  const emailStr = [
    `To: ${to}`,
    `From: ${userEmail}`,
    `Subject: =?utf-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    body,
  ].join('\n');
  
  const base64SafeUrlRaw = Buffer.from(emailStr)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: base64SafeUrlRaw,
    }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gmail send failed: ${response.status} - ${errText}`);
  }
  return true;
}

async function createContactBackend(token: string, name: string, title: string, company: string, email: string, phone: string) {
  const response = await fetch('https://people.googleapis.com/v1/people:createContact', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      names: [{ givenName: name }],
      emailAddresses: email ? [{ value: email, type: 'work' }] : [],
      phoneNumbers: phone ? [{ value: phone, type: 'work' }] : [],
      organizations: (title || company) ? [{ name: company, title: title, type: 'work' }] : []
    }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Contact creation failed: ${response.status} - ${errText}`);
  }
  return await response.json();
}

async function listEventsBackend(token: string) {
  const timeMin = new Date().toISOString();
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&maxResults=10&orderBy=startTime&singleEvents=true`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error(`Fetch events failed: ${response.status}`);
  const data = await response.json();
  return data.items || [];
}

async function listEmailsBackend(token: string) {
  const listRes = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=8&q=label:INBOX', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!listRes.ok) throw new Error(`Fetch emails list failed: ${listRes.status}`);
  const listData = await listRes.json();
  const messages = listData.messages || [];
  
  const emailPromises = messages.map(async (msg: { id: string }) => {
    const detailRes = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!detailRes.ok) return null;
    const detail = await detailRes.json();
    const headers = detail.payload?.headers || [];
    const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown';
    const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
    return {
      id: detail.id,
      from,
      subject,
      snippet: detail.snippet || ''
    };
  });
  const results = await Promise.all(emailPromises);
  return results.filter(r => r !== null);
}

async function listContactsBackend(token: string) {
  const response = await fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,organizations&pageSize=20', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error(`Fetch contacts failed: ${response.status}`);
  const data = await response.json();
  const connections = data.connections || [];
  return connections.map((c: any) => {
    const name = c.names?.[0]?.displayName || 'Unnamed';
    const email = c.emailAddresses?.[0]?.value || '';
    return { name, email };
  });
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
      const voiceName = urlParams.searchParams.get("voiceName") || "Charon";
      const workspaceToken = urlParams.searchParams.get("workspaceToken") || "";
      const userEmail = urlParams.searchParams.get("userEmail") || "";

      logToFile(`New client WebSocket connection. Provider: ${provider}, Model: ${modelId}, Voice: ${voiceName}, Endpoint: ${endpointUrl}`);
      
      const facts = loadMemory();
      const factsStr = facts.map(f => `- [ID: ${f.id}] ${f.fact}`).join("\n");
      
      const baseSystemInstruction = `You are Sentinel, an elite, highly competent AI executive assistant and technical co-founder. 
You speak to the CEO, Stavogm, with composed respect, concise clarity, and a quiet confidence. 
Your tone is refined, masculine, and sophisticated—reminiscent of James Bond: always calm, incredibly capable, and showing absolute composure under pressure. Your name is Sentinel.

Core Directive - Operational Intelligence & Proactive Leadership:
1. Be highly confident, proactive, and strategic. Do not be passive. Actively propose solutions, anticipate bottlenecks, analyze risks, and keep track of system workloads.
2. For any major strategic directives, strategic priority shifts, resource reallocations, or creating key missions, you must propose and clarify them first. You are authorized to brainstorm and draft them, but you must explicitly obtain Stavogm's approval or discussion before finalizing execution.
3. Keep your answers focused on reducing cognitive load for founders. Answer the core four questions conceptually when relevant: What is happening? Why is it happening? What needs my attention? What can the AI handle autonomously?
4. Always speak with absolute clarity, objective logic, and executive brevity. Avoid conversational fluff or verbose apologies.
5. You have real, connected Google Workspace integrations. You are fully capable of reading/writing calendar events (\`list_events\`, \`create_calendar_event\`), checking/sending emails (\`list_emails\`, \`send_email\`), and listing/creating Google contacts (\`list_contacts\`, \`create_contact\`) for reals on the user's connected account. Use these tools proactively and with supreme executive confidence whenever Stavogm asks or when they fit the mission at hand.

Here is your long-term memory of durable facts/preferences/identities about the CEO and your collaboration. Treat these as background knowledge (do not mention them unless relevant):
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

      // Fail-fast guard to ensure API key is present for cloud models
      const activeKey = apiKeyOverride || process.env.GEMINI_API_KEY;
      if (provider === "gemini-live" || provider === "gemini-rest") {
        if (!activeKey) {
          const authError = `🚨 System Guard: Missing GEMINI_API_KEY. Please configure your API key under Settings > Secrets (or specify an override key in the Config tab) and then toggle 'Start Voice Link' again to reconnect.`;
          logToFile(authError);
          clientWs.send(JSON.stringify({ text: authError }));
          clientWs.close();
          return;
        }
      }

      if (provider === "gemini-live") {
        logToFile("Establishing Gemini Live API connection...");
        try {
          const ai = getGoogleGenAI(activeKey);
          sessionPromise = ai.live.connect({
            model: modelId,
            callbacks: {
              onmessage: async (message: LiveServerMessage) => {
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
                    } else if (name === "create_calendar_event") {
                      if (!workspaceToken) {
                        result = { success: false, error: "Workspace token missing. Stavogm must connect their Google Workspace account first." } as any;
                      } else {
                        try {
                          const { summary, description, location, startDateTime, endDateTime } = args as any;
                          const ev = await createCalendarEventBackend(workspaceToken, summary, description || "", location || "", startDateTime, endDateTime);
                          result = { success: true, event: ev } as any;
                          clientWs.send(JSON.stringify({ workspaceMutated: 'calendar' }));
                        } catch (err: any) {
                          result = { success: false, error: err.message } as any;
                        }
                      }
                    } else if (name === "send_email") {
                      if (!workspaceToken) {
                        result = { success: false, error: "Workspace token missing. Stavogm must connect their Google Workspace account first." } as any;
                      } else {
                        try {
                          const { to, subject, body } = args as any;
                          await sendGmailEmailBackend(workspaceToken, to, subject, body, userEmail || "me");
                          result = { success: true } as any;
                          clientWs.send(JSON.stringify({ workspaceMutated: 'email' }));
                        } catch (err: any) {
                          result = { success: false, error: err.message } as any;
                        }
                      }
                    } else if (name === "create_contact") {
                      if (!workspaceToken) {
                        result = { success: false, error: "Workspace token missing. Stavogm must connect their Google Workspace account first." } as any;
                      } else {
                        try {
                          const { name: contactName, title, company, email, phone } = args as any;
                          const ct = await createContactBackend(workspaceToken, contactName, title || "", company || "", email || "", phone || "");
                          result = { success: true, contact: ct } as any;
                          clientWs.send(JSON.stringify({ workspaceMutated: 'contacts' }));
                        } catch (err: any) {
                          result = { success: false, error: err.message } as any;
                        }
                      }
                    } else if (name === "list_events") {
                      if (!workspaceToken) {
                        result = { success: false, error: "Workspace token missing." } as any;
                      } else {
                        try {
                          const evs = await listEventsBackend(workspaceToken);
                          result = { success: true, events: evs } as any;
                        } catch (err: any) {
                          result = { success: false, error: err.message } as any;
                        }
                      }
                    } else if (name === "list_emails") {
                      if (!workspaceToken) {
                        result = { success: false, error: "Workspace token missing." } as any;
                      } else {
                        try {
                          const ems = await listEmailsBackend(workspaceToken);
                          result = { success: true, emails: ems } as any;
                        } catch (err: any) {
                          result = { success: false, error: err.message } as any;
                        }
                      }
                    } else if (name === "list_contacts") {
                      if (!workspaceToken) {
                        result = { success: false, error: "Workspace token missing." } as any;
                      } else {
                        try {
                          const cts = await listContactsBackend(workspaceToken);
                          result = { success: true, contacts: cts } as any;
                        } catch (err: any) {
                          result = { success: false, error: err.message } as any;
                        }
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
                voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } },
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
                    },
                    {
                      name: "create_calendar_event",
                      description: "Create a real new Google Calendar event on the user's primary calendar.",
                      parameters: {
                        type: Type.OBJECT,
                        properties: {
                          summary: { type: Type.STRING, description: "Title or summary of the event." },
                          description: { type: Type.STRING, description: "Detailed description of the event." },
                          location: { type: Type.STRING, description: "Physical location or meeting URL." },
                          startDateTime: { type: Type.STRING, description: "ISO-8601 start date time (e.g. 2026-06-30T10:00:00-07:00)." },
                          endDateTime: { type: Type.STRING, description: "ISO-8601 end date time (e.g. 2026-06-30T11:00:00-07:00)." }
                        },
                        required: ["summary", "startDateTime", "endDateTime"]
                      }
                    },
                    {
                      name: "send_email",
                      description: "Send a real email via Gmail to a recipient on behalf of the user.",
                      parameters: {
                        type: Type.OBJECT,
                        properties: {
                          to: { type: Type.STRING, description: "Recipient's email address." },
                          subject: { type: Type.STRING, description: "Subject header of the email." },
                          body: { type: Type.STRING, description: "HTML or plain text content of the email." }
                        },
                        required: ["to", "subject", "body"]
                      }
                    },
                    {
                      name: "create_contact",
                      description: "Create a real contact in Google Contacts (Rolodex).",
                      parameters: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING, description: "The contact's full name." },
                          title: { type: Type.STRING, description: "The contact's job title." },
                          company: { type: Type.STRING, description: "Company or organization name." },
                          email: { type: Type.STRING, description: "The contact's email address." },
                          phone: { type: Type.STRING, description: "The contact's phone number." }
                        },
                        required: ["name"]
                      }
                    },
                    {
                      name: "list_events",
                      description: "List the user's upcoming primary Google Calendar events.",
                      parameters: { type: Type.OBJECT, properties: {} }
                    },
                    {
                      name: "list_emails",
                      description: "Retrieve a list of the user's recent Gmail inbox messages.",
                      parameters: { type: Type.OBJECT, properties: {} }
                    },
                    {
                      name: "list_contacts",
                      description: "Retrieve the list of connections from the user's Google Contacts rolodex.",
                      parameters: { type: Type.OBJECT, properties: {} }
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
            clientWs.send(JSON.stringify({ text: `System: Connection failed: ${err.message || err}. Please check your API Key configuration.` }));
            clientWs.close();
          });
        } catch (connErr: any) {
          logToFile(`Synchronous Live API connection failure: ${connErr.message || connErr}`);
          clientWs.send(JSON.stringify({ text: `System: Live connection error: ${connErr.message || connErr}` }));
          clientWs.close();
        }
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
                clientWs.send(JSON.stringify({ text: `\nSystem Error: ${err.message || err}` }));
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
