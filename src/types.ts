export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
}

export interface Mission {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'pending';
  progress: number;
  department: string;
  owner: string;
  milestones: string[];
  tasks: { name: string; done: boolean }[];
}

export interface ApprovalItem {
  id: string;
  title: string;
  category: string;
  riskScore: number;
  description: string;
  status: 'pending' | 'approved' | 'declined';
}

export interface OperationalLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'audit';
  message: string;
  details?: string;
}

export interface ExecutiveAgent {
  name: string;
  role: string;
  department: string;
  capabilities: string[];
  workload: number;
  trustScore: number;
  cost: number;
  status: string;
  avatar: string;
  contextWindow: string;
  experience: string;
}

export interface ModelConfig {
  provider: 'gemini-live' | 'gemini-rest' | 'openai-rest' | 'anthropic-rest' | 'ollama-local' | 'custom-rest';
  modelId: string;
  endpointUrl: string;
  apiKey: string;
  systemInstruction: string;
  customHeaders: string;
  voiceName?: string;
}

