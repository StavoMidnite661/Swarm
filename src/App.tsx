/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { pcmToBase64, playAudioChunk, resetAudioPlayback } from './lib/audioUtils';
import { 
  Trash2, Edit2, Save, X, AlertTriangle, CheckCircle, Sparkles, 
  Play, Pause, Activity, Database, Plus, RefreshCw, Power, 
  Terminal, ShieldAlert, Volume2, Compass, Layers, Info, Eye, EyeOff,
  Briefcase, Users, Cpu, Coins, TrendingUp, ShieldCheck, Scale, 
  MessageSquare, Clock, ArrowUpRight, CheckSquare, FileText, Bell, 
  ChevronRight, History, UserCheck, MapPin, TrendingDown
} from 'lucide-react';
import { initAuthListener, googleSignIn, googleSignOut } from './lib/workspaceUtils';
import CommandCenter from './components/CommandCenter';
import LandingPage from './components/LandingPage';
import WelcomeModal from './components/WelcomeModal';
import SettingsModal from './components/SettingsModal';
import ExecutiveBriefing from './components/ExecutiveBriefing';
import BootSequence from './components/BootSequence';
import { useSOVRKernel } from './kernel/useSOVRKernel';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
}

interface Mission {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'pending';
  progress: number;
  department: string;
  owner: string;
  milestones: string[];
  tasks: { name: string; done: boolean }[];
}

interface ApprovalItem {
  id: string;
  title: string;
  category: string;
  riskScore: number;
  description: string;
  status: 'pending' | 'approved' | 'declined';
}

interface OperationalLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'audit';
  message: string;
  details?: string;
}

interface ModelConfig {
  provider: 'gemini-live' | 'gemini-rest' | 'openai-rest' | 'anthropic-rest' | 'ollama-local' | 'custom-rest';
  modelId: string;
  endpointUrl: string;
  apiKey: string;
  systemInstruction: string;
  customHeaders: string;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const {
    state: sovrState,
    setQuarter,
    setRoom,
    createMission,
    toggleTaskDone,
    addMemoryFact,
    deleteMemoryFact,
    toggleDamping,
    resolveApproval,
    reallocateCompute,
    operationalAnswers
  } = useSOVRKernel();
  
  // Interactive UI Room and Time states
  const [activeRoom, setActiveRoom] = useState<'hq' | 'operations' | 'engineering' | 'finance' | 'marketing' | 'research' | 'legal' | 'situation'>('hq');
  const [timeQuarter, setTimeQuarter] = useState<'2025-q4' | '2026-q1' | '2026-q2' | '2026-q3' | '2026-q4'>('2026-q3');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [bootStarted, setBootStarted] = useState(false);
  const [bootCompleted, setBootCompleted] = useState(false);
  const [briefingCompleted, setBriefingCompleted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleConnectGoogle = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
      }
    } catch (err: any) {
      console.error('Landing Google Login Error:', err);
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      await googleSignOut();
      setUser(null);
      setToken(null);
    } catch (err: any) {
      console.error('Landing Google Disconnect Error:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = initAuthListener(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSetActiveRoom = (room: typeof activeRoom) => {
    setActiveRoom(room);
    setRoom(room);
  };

  const handleSetTimeQuarter = (q: typeof timeQuarter) => {
    setTimeQuarter(q);
    setQuarter(q);
  };

  // Situation Room live debate simulation
  const [debateScenario, setDebateScenario] = useState('Acquire our primary Web3 routing layer competitor Titan Corp');
  const [isDebating, setIsDebating] = useState(false);
  const [debateLogs, setDebateLogs] = useState<{ sender: string; role: string; text: string; time: string; avatar: string }[]>([]);
  const [debateStep, setDebateStep] = useState(0);
  const [debateResult, setDebateResult] = useState<{ risk: number; readiness: number; impact: number; summary: string } | null>(null);

  // Core WebGL state parameters
  const [speed, setSpeed] = useState(0.2);
  const [lighting, setLighting] = useState(1.0);
  const [zoom, setZoom] = useState(1.69);
  const [yaw, setYaw] = useState(33 * (Math.PI / 180));
  const [pitch, setPitch] = useState(-17 * (Math.PI / 180));
  const [proximity, setProximity] = useState(-1.8);
  const [wind, setWind] = useState(1.0);
  const [density, setDensity] = useState(0.8);
  const [pulseFreq, setPulseFreq] = useState(5.0);
  const [resonance, setResonance] = useState(0.0);
  const [singularity, setSingularity] = useState(0.0);
  const [colorMode, setColorMode] = useState('cyan');
  const [isPaused, setIsPaused] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'controls' | 'chat' | 'memory' | 'minimap'>('chat');
  const [isAgentDormant, setIsAgentDormant] = useState(false);
  
  const [modelConfig, setModelConfig] = useState<ModelConfig>(() => {
    try {
      const saved = localStorage.getItem('sentinel_model_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing saved model config:', e);
    }
    return {
      provider: 'gemini-live',
      modelId: 'gemini-3.1-flash-live-preview',
      endpointUrl: '',
      apiKey: '',
      systemInstruction: 'You are Sentinel, an elite, highly competent AI executive assistant and technical co-founder. You speak to the CEO, Stavogm, with composed respect, concise clarity, and a quiet confidence. Your tone is refined, masculine, and sophisticated—reminiscent of James Bond: always calm, incredibly capable, and showing absolute composure under pressure. Your name is Sentinel.',
      customHeaders: '',
      voiceName: 'Charon'
    };
  });

  useEffect(() => {
    localStorage.setItem('sentinel_model_config', JSON.stringify(modelConfig));
  }, [modelConfig]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Long-Term Memory State
  const [memories, setMemories] = useState<{ id: string; fact: string }[]>([]);
  const [manualMemoryInput, setManualMemoryInput] = useState('');
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [editingMemoryValue, setEditingMemoryValue] = useState('');
  
  // Operational Timeline Event Stream
  const [logs, setLogs] = useState<OperationalLog[]>([
    { id: '1', timestamp: '17:24:10', type: 'info', message: 'EIOS Sovereign Orbit initialized successfully.' },
    { id: '2', timestamp: '17:24:11', type: 'success', message: 'Primary core WebGL gravitational shader bound on GPU port 3000.' },
    { id: '3', timestamp: '17:24:12', type: 'audit', message: 'Founder signature Stavogm authenticated. Access levels: EXECUTIVE_ADMIN.' }
  ]);

  // High-hazard Compliance approvals gate
  const [approvals, setApprovals] = useState<ApprovalItem[]>([
    { id: 'a1', title: 'Liquidate Sovereign Reserve Pool', category: 'FINANCIAL', riskScore: 89, description: 'Convert $2.4M USD stablecoin reserves into Ethereum yielding nodes on Arbitrum network.', status: 'pending' },
    { id: 'a2', title: 'Merge Core Routing Smart Contracts', category: 'ENGINEERING', riskScore: 65, description: 'Deploy version v2.10 of the decentralized routing gateway, completely bypassing legacy DNS controls.', status: 'pending' },
    { id: 'a3', title: 'Terminate Secondary APAC Marketing Campaign', category: 'MARKETING', riskScore: 22, description: 'Directly archive APAC autonomous advertising nodes to preserve $40k/monthly treasury.', status: 'pending' }
  ]);

  // Company Missions state
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 'm1',
      name: 'Launch Sovereign Cloud Cluster Node',
      status: 'active',
      progress: 68,
      department: 'Engineering',
      owner: 'CTO Spark',
      milestones: ['Setup Kubernetes Clusters', 'Install Redis Caching', 'Secure TLS Handshakes'],
      tasks: [
        { name: 'Deploy 8 bare-metal containers on Swiss cloud network', done: true },
        { name: 'Implement strict TLS client certificates', done: true },
        { name: 'Auto-replicate Redis cluster state across Frankfurt', done: false }
      ]
    },
    {
      id: 'm2',
      name: 'Refactor Autonomous Treasury Strategy',
      status: 'active',
      progress: 40,
      department: 'Finance',
      owner: 'CFO Ledger',
      milestones: ['Audit gas consumption rates', 'Deploy yield compounding scripts', 'Formulate tax mitigation reserves'],
      tasks: [
        { name: 'Audit gas consumption on main contracts', done: true },
        { name: 'Deploy smart compounders to Uniswap pools', done: false },
        { name: 'Allocate 10% to sovereign cash reserve', done: false }
      ]
    },
    {
      id: 'm3',
      name: 'Deploy Decentralized Customer Experience Framework',
      status: 'completed',
      progress: 100,
      department: 'Operations',
      owner: 'COO Flow',
      milestones: ['Train CS LLM with company blueprints', 'Deploy chat interface widget'],
      tasks: [
        { name: 'Pre-train customer-success LLM with EIOS guidelines', done: true },
        { name: 'Deploy real-time live support chat widget', done: true }
      ]
    }
  ]);

  const pendingMsgRef = useRef<string | null>(null);
  const wasConnectedBeforeSleepRef = useRef(false);
  const [isAgentConnecting, setIsAgentConnecting] = useState(false);
  const [isAgentConnected, setIsAgentConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const fetchMemories = async (retryCount = 0) => {
    try {
      const res = await fetch("/api/memory");
      if (res.ok) {
        const data = await res.json();
        setMemories(data);
      }
    } catch (err) {
      if (retryCount < 2) {
        setTimeout(() => fetchMemories(retryCount + 1), 2000);
      } else {
        console.warn("Could not load memories after retries. The backend might still be starting up.", err);
      }
    }
  };

  const addMemory = async (factText: string) => {
    if (!factText.trim()) return;
    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', fact: factText })
      });
      if (res.ok) {
        setManualMemoryInput('');
        fetchMemories();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteMemory = async (id: string) => {
    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      if (res.ok) {
        fetchMemories();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateMemory = async (id: string, newFact: string) => {
    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', id, fact: newFact })
      });
      if (res.ok) {
        setEditingMemoryId(null);
        fetchMemories();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const seedFounderBlueprints = async () => {
    const defaultFacts = [
      "Stavogm is Chief Executive Officer (CEO). Style: ultra-minimal, high-leverage decisions.",
      "Primary Mission: Redefine full-stack architectures and eliminate organizational noise.",
      "Preference: Prefers high-contrast, low-cognitive-load spatial user interfaces."
    ];
    for (const fact of defaultFacts) {
      await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', fact })
      });
    }
    fetchMemories();
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const prevDormantRef = useRef(isAgentDormant);

  useEffect(() => {
    (window as any)._isDormant = isAgentDormant;
    
    // Falling asleep edge
    if (isAgentDormant && !prevDormantRef.current) {
      if (isAgentConnected || isAgentConnecting) {
        wasConnectedBeforeSleepRef.current = true;
        if (ws) {
          ws.close();
        }
      }
    }
    
    // Waking up or waiting for close to finish before waking up
    if (!isAgentDormant && wasConnectedBeforeSleepRef.current) {
      if (!isAgentConnected && !isAgentConnecting) {
        wasConnectedBeforeSleepRef.current = false;
        connectAgent();
      }
    }

    prevDormantRef.current = isAgentDormant;
  }, [isAgentDormant, isAgentConnected, isAgentConnecting, ws]);

  const colors = {
    cyan: [0.0, 0.8, 1.0],
    orange: [1.0, 0.4, 0.0],
    purple: [0.7, 0.2, 1.0],
    lime: [0.6, 1.0, 0.0]
  };
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    if (!audioStarted) {
      // Landing page state
      (window as any)._shaderOffsetX = -0.05;
      (window as any)._shaderOffsetY = 0.0;
      (window as any)._shaderZoom = 1.2;
      setYaw(33 * (Math.PI / 180));
      setPitch(-17 * (Math.PI / 180));
      setIsAgentDormant(false);
    } else if (!briefingCompleted) {
      // Briefing stage: Center the camera perfectly and keep it slow & majestic
      (window as any)._shaderOffsetX = 0.0;
      (window as any)._shaderOffsetY = 0.0;
      (window as any)._shaderZoom = 1.05;
      (window as any)._shaderSpeed = 0.25;
    } else {
      // Entry animation after briefing completed
      let start = performance.now();
      const duration = 2800; // 2.8s transition
      const startYaw = yaw;
      const targetYaw = startYaw + (Math.PI * 2);
      const startOffsetX = 0.0;
      const targetOffsetX = -0.15;
      const startOffsetY = 0.0;
      const targetOffsetY = 0.15;
      const startZoom = 1.05;
      const targetZoom = 1.69;

      const animateEntry = (time: number) => {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1.0);
        const ease = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        setYaw(startYaw + (targetYaw - startYaw) * ease);
        (window as any)._shaderOffsetX = startOffsetX + (targetOffsetX - startOffsetX) * ease;
        (window as any)._shaderOffsetY = startOffsetY + (targetOffsetY - startOffsetY) * ease;
        (window as any)._shaderZoom = startZoom + (targetZoom - startZoom) * ease;

        if (progress < 1.0) {
          requestAnimationFrame(animateEntry);
        } else {
          setIsAgentDormant(true);
        }
      };
      
      requestAnimationFrame(animateEntry);
    }
  }, [audioStarted, briefingCompleted, setYaw, setPitch, setIsAgentDormant]);

  const noiseGainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const envFilterRef = useRef<BiquadFilterNode | null>(null);
  const envGainRef = useRef<GainNode | null>(null);
  const movementRef = useRef(0);

  const startAudio = () => {
    if (audioStarted) return;
    
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;

    // Resume context (browser security)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // 1. Base Synth Drone
    const osc = ctx.createOscillator();
    const droneGain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(50, ctx.currentTime);
    droneGain.gain.setValueAtTime(0.1, ctx.currentTime);
    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(150, ctx.currentTime);
    osc.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(ctx.destination);
    osc.start();

    // 2. Data/Electric Chirps
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(2500, ctx.currentTime);
    noiseFilter.Q.setValueAtTime(15, ctx.currentTime);
    filterRef.current = noiseFilter;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.05, ctx.currentTime); // Base whisper
    noiseGainRef.current = noiseGain;

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start();

    // 3. Environment Texture (Landscape specific)
    const envSource = ctx.createBufferSource();
    envSource.buffer = noiseBuffer;
    envSource.loop = true;

    const envFilter = ctx.createBiquadFilter();
    envFilter.type = 'lowpass';
    envFilter.frequency.setValueAtTime(200, ctx.currentTime);
    envFilterRef.current = envFilter;

    const envGain = ctx.createGain();
    envGain.gain.setValueAtTime(0.1, ctx.currentTime);
    envGainRef.current = envGain;

    envSource.connect(envFilter);
    envFilter.connect(envGain);
    envGain.connect(ctx.destination);
    envSource.start();

    setAudioStarted(true);
  };

  const connectAgent = async () => {
    setIsAgentDormant(false);
    setIsAgentConnecting(true);
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const queryParams = new URLSearchParams({
        provider: modelConfig.provider,
        modelId: modelConfig.modelId,
        endpointUrl: modelConfig.endpointUrl || '',
        apiKey: modelConfig.apiKey || '',
        customHeaders: modelConfig.customHeaders || '',
        voiceName: modelConfig.voiceName || 'Charon',
        workspaceToken: token || '',
        userEmail: user?.email || ''
      }).toString();

      const newWs = new WebSocket(`${protocol}//${location.host}/live?${queryParams}`);
      const inputAudioCtx = new AudioContext({ sampleRate: 16000 });
      const outputAudioCtx = new AudioContext({ sampleRate: 24000 });
      const analyser = outputAudioCtx.createAnalyser();
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      let pollRef: number;
      const pollAudio = () => {
        if (outputAudioCtx.state === 'running') {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
               sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            (window as any)._agentAudio = avg / 255.0; // Normalize 0 to 1
        }
        pollRef = requestAnimationFrame(pollAudio);
      };
      pollAudio();

      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = inputAudioCtx.createMediaStreamSource(stream);
        const processor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
        source.connect(processor);
        processor.connect(inputAudioCtx.destination);

        processor.onaudioprocess = (e) => {
          if (newWs.readyState === WebSocket.OPEN) {
            const base64 = pcmToBase64(e.inputBuffer.getChannelData(0));
            newWs.send(JSON.stringify({ audio: base64 }));
          }
        };
      } catch (micErr) {
        console.warn("Microphone access not available or denied. Using text-only input mode.", micErr);
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          sender: 'agent',
          text: `System: Microphone access denied or unavailable. Voice input is disabled. You can still use text chat.`
        }]);
      }

      newWs.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.audio) {
           playAudioChunk(outputAudioCtx, msg.audio, analyser);
        }
        if (msg.text) {
           setMessages(prev => {
             const last = prev[prev.length - 1];
             if (last && last.sender === 'agent') {
               return [...prev.slice(0, -1), { ...last, text: last.text + msg.text }];
             }
             return [...prev, { id: Math.random().toString(), sender: 'agent', text: msg.text }];
           });
        }
        if (msg.memoryUpdated) {
           fetchMemories();
           if (msg.newFact) {
              setMessages(prev => [...prev, {
                id: Math.random().toString(),
                sender: 'agent',
                text: `✨ [System: Recorded to co-founder memory: "${msg.newFact.fact}"]`
              }]);
           }
        }
        if (msg.workspaceMutated) {
          window.dispatchEvent(new CustomEvent('workspace-mutated', { detail: { action: msg.workspaceMutated } }));
        }
        if (msg.interrupted) {
           resetAudioPlayback();
           (window as any)._agentAudio = 0;
        }
      };

      newWs.onopen = () => {
        setIsAgentConnected(true);
        setIsAgentConnecting(false);
        setWs(newWs);
        if (pendingMsgRef.current) {
          newWs.send(JSON.stringify({ text: pendingMsgRef.current }));
          pendingMsgRef.current = null;
        }
      };

      newWs.onerror = (e) => {
        console.error("Agent WebSocket connection error", e);
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          sender: 'agent',
          text: `System: Network or connection error occurred with the AI agent. Please check your configuration.`
        }]);
      };

      newWs.onclose = () => {
        setIsAgentConnected(false);
        setWs(null);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        if (inputAudioCtx.state !== 'closed') {
          inputAudioCtx.close().catch(() => {});
        }
        if (outputAudioCtx.state !== 'closed') {
          outputAudioCtx.close().catch(() => {});
        }
        cancelAnimationFrame(pollRef);
        (window as any)._agentAudio = 0;
      };

    } catch (err) {
      console.error("Failed to connect agent", err);
      setIsAgentConnecting(false);
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'agent',
        text: `System: Connection setup failed. Please try again.`
      }]);
    }
  }

  const disconnectAgent = () => {
    wasConnectedBeforeSleepRef.current = false;
    if (ws) {
      ws.close();
    }
  }

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const textToSend = chatInput;
    setMessages(prev => [...prev, { id: Math.random().toString(), sender: 'user', text: textToSend }]);
    setChatInput('');

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ text: textToSend }));
    } else {
      pendingMsgRef.current = textToSend;
      connectAgent();
    }
  }

  // Audio modulation loop
  useEffect(() => {
    if (!audioStarted) return;

    let frame: number;
    const updateAudio = () => {
      if (noiseGainRef.current && filterRef.current) {
        const ctx = audioContextRef.current!;
        
        // Decay movement
        movementRef.current *= 0.95;
        
        // Modulate volume based on movement
        const targetGain = 0.05 + movementRef.current * 0.4;
        noiseGainRef.current.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.1);
        
        // Modulate filter frequency (creature "chirps")
        const targetFreq = 500 + movementRef.current * 4000 + Math.sin(Date.now() * 0.005) * 200;
        filterRef.current.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.1);
      }
      frame = requestAnimationFrame(updateAudio);
    };
    
    frame = requestAnimationFrame(updateAudio);
    return () => cancelAnimationFrame(frame);
  }, [audioStarted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // --- SHADER SOURCES ---
    const vsSource = `
      attribute vec4 aVertexPosition;
      void main() {
        gl_Position = aVertexPosition;
      }
    `;

    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_rotation;
      uniform vec3 u_color;
      uniform float u_speed;
      uniform float u_lighting;
      uniform float u_zoom;
      uniform float u_depth;
      uniform float u_wind;
      uniform float u_density;
      uniform float u_pulseFreq;
      uniform float u_resonance;
      uniform float u_singularity;
      uniform float u_agentAudio;
      uniform sampler2D u_prevFrame;
      uniform vec2 u_offset;

      #define MAX_STEPS 100
      #define SURF_DIST 0.01
      #define MAX_DIST 30.0
      
      // --- UTILS ---
      float hash(vec3 p) {
        p = fract(p * vec3(123.34, 456.21, 789.18));
        p += dot(p, p.yzx + 19.19);
        return fract((p.x + p.y) * p.z);
      }

      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x),
                       mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
                   mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
                       mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
      }

      float fbm(vec3 p) {
        float v = 0.0;
        float a = 0.5;
        vec3 shift = vec3(100);
        for (int i = 0; i < 4; ++i) {
          v += a * noise(p);
          p = p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      mat2 rot(float a) {
        float s = sin(a), c = cos(a);
        return mat2(c, -s, s, c);
      }

      // --- SENTINEL MATH ---
      float sdOctahedron( vec3 p, float s ) {
        p = abs(p);
        return (p.x+p.y+p.z-s)*0.57735027;
      }
      
      float sdTorus( vec3 p, vec2 t ) {
        vec2 q = vec2(length(p.xz)-t.x,p.y);
        return length(q)-t.y;
      }

      float map(vec3 p, out float mat) {
        vec3 pos = p;
        float t = u_time * u_speed;
        
        // --- VOID SINGULARITY SPATIAL WARP ---
        float distToCenter = length(pos);
        if (u_singularity > 0.0) {
            float fallIn = exp(-distToCenter * 0.15) * u_singularity * 2.5;
            pos *= (1.0 + fallIn);
        }
        
        // --- RINGS ---
        float ringDist = 1e10;
        
        // Ring 1
        vec3 rp1 = p;
        rp1.xy *= rot(t * 0.15);
        rp1.xz *= rot(t * 0.25);
        float r1 = sdTorus(rp1, vec2(10.0, 0.03));
        
        // Ring 2
        vec3 rp2 = p;
        rp2.yz *= rot(t * -0.2);
        rp2.xy *= rot(t * 0.1);
        float r2 = sdTorus(rp2, vec2(12.5, 0.015));
        
        // Ring 3
        vec3 rp3 = p;
        rp3.xz *= rot(t * 0.08);
        rp3.yz *= rot(t * 0.3);
        float r3 = sdTorus(rp3, vec2(15.0, 0.06));
        
        ringDist = min(r1, min(r2, r3));
        
        // --- SENTINELS ---
        // Central vortex twisting
        float r = length(pos.xz);
        pos.xz *= rot(t * 0.3 + r * 0.2);
        pos.y += sin(r * 1.5 - t * 2.0) * 0.5;
        
        // Grid for sentinels
        float spacing = mix(6.0, 1.0, u_density);
        vec3 id = floor(pos / spacing);
        vec3 q = mod(pos, spacing) - spacing * 0.5;
        
        // Randomize Sentinel positions and rotations
        float h = hash(id);
        vec3 offset = vec3(hash(id + 1.0), hash(id + 2.0), hash(id + 3.0)) * 2.0 - 1.0;
        
        // Quantum Resonance Fracture
        vec3 fracQ = q;
        fracQ = abs(fracQ) - (u_resonance * 0.5 * (sin(t * 5.0 + h * 10.0) * 0.5 + 0.5));
        q = mix(q, fracQ, u_resonance);
        
        q += offset * 0.5;
        
        float audioMod = u_agentAudio * 15.0; // Agent's voice intensity modulates rotation
        
        q.xy *= rot(t * (h * 2.0 + 1.0) + audioMod);
        q.xz *= rot(t * (h * 1.5 + 0.5) + audioMod);
        
        float sentinel = sdOctahedron(q, 0.1 + h * 0.15 + u_agentAudio * 1.5);
        
        // Bound the swarm to a torus-like region
        float swarmDist = length(p);
        float bounds = max(swarmDist - 13.0, 5.0 - swarmDist);
        sentinel = max(sentinel, bounds);
        
        // --- CORE ---
        vec3 cp = p;
        float coreTime = t * 0.15;
        cp.xz *= rot(coreTime);
        cp.xy *= rot(coreTime * 0.7);
        float gasDisplacement = fbm(cp * 2.0) * 0.4;
        float core = length(p) - (2.5 + gasDisplacement);
        
        float res = core;
        mat = 1.0; // Core
        
        if (sentinel < res) {
          res = sentinel;
          mat = 2.0; // Sentinel
        }
        
        if (ringDist < res) {
          res = ringDist;
          mat = 3.0; // Rings
        }
        
        return res;
      }
      
      float getDist(vec3 p) {
        float m; return map(p, m);
      }

      vec3 getNormal(vec3 p) {
        vec2 e = vec2(0.01, 0.0);
        return normalize(vec3(
          getDist(p + e.xyy) - getDist(p - e.xyy),
          getDist(p + e.yxy) - getDist(p - e.yxy),
          getDist(p + e.yyx) - getDist(p - e.yyx)
        ));
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
        
        // Shift camera offset slightly for asymmetric look
        uv += u_offset;
        
        float screenCenterDist = length(uv);
        float lensWarp = exp(-screenCenterDist * 3.0) * u_singularity * 1.5;
        vec2 warpedUV = uv - normalize(uv) * lensWarp;
        
        vec3 ro = vec3(0.0, 0.0, u_depth - 24.0);
        vec3 rd = normalize(vec3(warpedUV, u_zoom));
        
        float pitch = u_rotation.y;
        float yaw = u_rotation.x;
        ro.yz *= rot(pitch);
        rd.yz *= rot(pitch);
        ro.xz *= rot(yaw);
        rd.xz *= rot(yaw);

        float t = 0.0;
        float mat = 0.0;
        float sentinelGlow = 0.0;
        float coreGlow = 0.0;
        float electricGlow = 0.0;
        float smoke = 0.0;
        
        bool hit = false;
        
        for (int i = 0; i < MAX_STEPS; i++) {
          vec3 p = ro + rd * t;
          float d = map(p, mat);
          
          float distToCenter = length(p);
          
          // Volumetric gas/smoke inside the central sphere region
          if (distToCenter < 18.0) {
              vec3 q = p * 0.5;
              float warp = fbm(q + u_time * 0.1 * u_wind);
              float s = fbm(q + warp * 2.0 - u_time * 0.2 * u_wind);
              
              // Fade out at edges of sphere
              float edgeFade = smoothstep(18.0, 8.0, distToCenter);
              smoke += s * edgeFade * 0.015 * u_density;
              
              // Electricity / flashes inside the gas
              float lightning = smoothstep(0.7, 1.0, fbm(p * 2.0 - u_time * vec3(1.0, 2.0, 3.0)));
              float flash = smoothstep(0.95, 1.0, sin(u_time * 10.0 + p.x + p.y + p.z));
              electricGlow += (lightning * edgeFade * 0.1 + flash * lightning * 0.3) * u_wind;
          }
          
          if (mat == 1.0) {
              coreGlow += 0.03 / (0.01 + d * d);
          } else if (mat == 2.0) {
              sentinelGlow += 0.015 / (0.01 + d * d);
          } else if (mat == 3.0) {
              electricGlow += 0.02 / (0.005 + d * d); // Rings glow
          }
          
          if (d < SURF_DIST) {
            hit = true;
            break;
          }
          if (t > MAX_DIST) break;
          t += d;
        }

        vec3 color = vec3(0.01, 0.0, 0.03);
        
        // Background Stars/Particles
        vec2 starUV = uv * 100.0;
        if (u_singularity > 0.0) {
            float starWarp = u_singularity * exp(-length(uv) * 4.0) * 15.0;
            starUV *= rot(starWarp);
        }
        float stars = fbm(vec3(starUV, u_time * 0.05));
        color += vec3(0.5, 0.8, 1.0) * pow(smoothstep(0.6, 1.0, stars), 5.0) * mix(0.5, 2.5, u_singularity);
        
        // Gas Colors
        vec3 gasBase = mix(vec3(0.05, 0.1, 0.2), u_color, 0.6);
        vec3 gasHighlight = mix(vec3(0.8, 0.9, 1.0), u_color, 0.3);
        color += mix(gasBase, gasHighlight, smoke * 1.5) * smoke * 2.0;
        
        // Electricity Colors
        vec3 sparkColor = mix(vec3(0.9, 0.95, 1.0), u_color, 0.2);
        color += sparkColor * electricGlow * u_lighting;
        
        // Core Glow volumetric
        color += u_color * coreGlow * 0.02 * u_lighting;

        if (hit) {
          vec3 p = ro + rd * t;
          vec3 n = getNormal(p);
          
          if (mat == 2.0) { // Sentinel
             vec3 baseCol = vec3(0.02);
             vec3 lightDir = normalize(vec3(0.0, 0.0, 0.0) - p);
             float diff = max(dot(n, lightDir), 0.0);
             
             float rim = pow(1.0 - max(dot(n, -rd), 0.0), 2.0);
             
             color = baseCol;
             color += u_color * diff * u_lighting * 1.5;
             color += sparkColor * rim * u_lighting;
             
             float pulse = sin(u_time * u_pulseFreq + hash(floor(p/2.5)) * 6.28) * 0.5 + 0.5;
             color += u_color * pulse * 0.8;
          } else if (mat == 1.0) { // Core
             vec3 cp = p;
             float coreTime = u_time * u_speed * 0.15;
             cp.xz *= rot(coreTime);
             cp.xy *= rot(coreTime * 0.7);
             
             vec3 q = cp * 1.5;
             float warp = fbm(q + u_time * 0.2);
             float gasMix = fbm(q + warp * 2.0 - u_time * 0.1);
             float gasMix2 = fbm(q * 2.0 - warp * 1.5 + u_time * 0.3);
             
             vec3 gasCol1 = u_color;
             vec3 gasCol2 = mix(vec3(0.9, 0.95, 1.0), u_color, 0.4);
             vec3 gasCol3 = vec3(0.01, 0.02, 0.05);
             
             float pattern = smoothstep(0.1, 0.9, gasMix * gasMix2 * 3.0);
             
             float corePulse = sin(u_time * u_pulseFreq) * 0.5 + 0.5;
             vec3 baseCoreCol = mix(gasCol3, mix(gasCol1, gasCol2, gasMix), pattern);
             vec3 coreFinal = baseCoreCol * (1.0 + gasMix2 * 2.0 + corePulse * 1.5) * u_lighting;
             
             float rim = pow(1.0 - max(dot(n, -rd), 0.0), 1.5);
             coreFinal += gasCol2 * rim * 2.0 * u_lighting;
             
             vec3 bhColor = vec3(0.0);
             float eventHorizon = pow(1.0 - max(dot(n, -rd), 0.0), 8.0);
             bhColor += mix(vec3(0.9, 0.95, 1.0), u_color, 0.2) * eventHorizon * 10.0;
             color += mix(coreFinal, bhColor, u_singularity);
          } else if (mat == 3.0) { // Rings
             vec3 lightDir = normalize(vec3(0.0, 0.0, 0.0) - p);
             float diff = max(dot(n, lightDir), 0.0);
             float rim = pow(1.0 - max(dot(n, -rd), 0.0), 2.0);
             vec3 ringFinal = mix(u_color, vec3(1.0), 0.7) * (diff * 0.5 + 0.5) * u_lighting * 2.0;
             ringFinal += sparkColor * rim * u_lighting * 2.0;
             
             vec3 accretion = mix(vec3(1.0, 0.8, 0.5), vec3(0.2, 0.6, 1.0), u_color.r);
             accretion = mix(accretion, sparkColor, 0.5) * (3.0 + sin(u_time * 30.0 + length(p) * 20.0)) * 2.5;
             
             color += mix(ringFinal, accretion, u_singularity);
          }
        }
        
        float fogAmount = clamp((t - 1.0) / (MAX_DIST - 1.0), 0.0, 1.0);
        vec3 finalFogColor = vec3(0.01, 0.02, 0.03);
        color = mix(color, finalFogColor, fogAmount);

        color += u_color * sentinelGlow * 0.02 * u_lighting;

        color = pow(color, vec3(0.4545));
        
        // --- QUANTUM RESONANCE TEMPORAL ECHOES ---
        vec2 screenUV = gl_FragCoord.xy / u_resolution.xy;
        vec2 feedbackUV = screenUV - 0.5;
        // The feedback spirals inward and twists
        feedbackUV *= (1.0 - 0.015 * u_resonance - 0.02 * u_singularity);
        feedbackUV *= rot(0.02 * u_resonance * sin(u_time * 0.5) + u_singularity * 0.03);
        feedbackUV += 0.5;
        
        // Chromatic aberration based on resonance
        float aberration = 0.008 * u_resonance;
        float prevR = texture2D(u_prevFrame, feedbackUV + vec2(aberration, 0.0)).r;
        float prevG = texture2D(u_prevFrame, feedbackUV).g;
        float prevB = texture2D(u_prevFrame, feedbackUV - vec2(aberration, 0.0)).b;
        
        vec3 prev = vec3(prevR, prevG, prevB);
        float decay = mix(0.85, 0.98, u_resonance); // Higher resonance = longer infinite trails
        color = max(color, prev * decay);
        
        // Core temporal flash
        float centerDist = length(screenUV - 0.5);
        color += u_color * u_resonance * 0.15 * exp(-centerDist * 5.0) * (sin(u_time * 15.0) * 0.5 + 0.5);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // --- WEBGL SETUP ---
    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([-1, 1, 1, 1, -1, -1, 1, -1]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, 'aVertexPosition');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const rotationLoc = gl.getUniformLocation(program, 'u_rotation');
    const speedLoc = gl.getUniformLocation(program, 'u_speed');
    const lightLoc = gl.getUniformLocation(program, 'u_lighting');
    const zoomLoc = gl.getUniformLocation(program, 'u_zoom');
    const depthLoc = gl.getUniformLocation(program, 'u_depth');
    const windLoc = gl.getUniformLocation(program, 'u_wind');
    const densityLoc = gl.getUniformLocation(program, 'u_density');
    const pulseFreqLoc = gl.getUniformLocation(program, 'u_pulseFreq');
    const resonanceLoc = gl.getUniformLocation(program, 'u_resonance');
    const singularityLoc = gl.getUniformLocation(program, 'u_singularity');
    const agentAudioLoc = gl.getUniformLocation(program, 'u_agentAudio');
    const colorLoc = gl.getUniformLocation(program, 'u_color');
    const prevFrameLoc = gl.getUniformLocation(program, 'u_prevFrame');
    const offsetLoc = gl.getUniformLocation(program, 'u_offset');

    const prevTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, prevTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, window.innerWidth, window.innerHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    let isDragging = false;
    let lastMouseX = 0, lastMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      
      const newYaw = ((window as any)._shaderYaw || 0) - dx * 0.01;
      const newPitch = ((window as any)._shaderPitch || 0) + dy * 0.01;
      const clampedPitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newPitch));
      
      (window as any)._shaderYaw = newYaw;
      (window as any)._shaderPitch = clampedPitch;
      
      // Trigger audio movement
      movementRef.current = Math.min(1.0, movementRef.current + 0.05);
      
      // We don't call setYaw/setPitch here to avoid 60fps React re-renders during drag
      // But we might want to if we want the sliders to move.
      // Let's use a small trick: update state only occasionally or use a ref for the UI to poll?
      // Actually, for "precise control", the user expects the sliders to move.
      // Let's try updating state. If it's too slow, we'll optimize.
      setYaw(newYaw);
      setPitch(clampedPitch);
      
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (prevTexture) {
        gl.bindTexture(gl.TEXTURE_2D, prevTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
    };
    window.addEventListener('resize', resize);
    resize();

    let animationFrameId: number;
    let lastTime = 0;

    const render = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      gl.uniform1f(timeLoc, time * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      
      // Update rotation if not paused
      if (!(window as any)._shaderPaused) {
        const currentYaw = (window as any)._shaderYaw || 0;
        const currentSpeed = (window as any)._shaderSpeed || 1.0;
        const newYaw = currentYaw + 0.00001 * currentSpeed * deltaTime;
        (window as any)._shaderYaw = newYaw;
        // Sync back to React state so the slider moves
        setYaw(newYaw);
      }

      gl.uniform2f(rotationLoc, (window as any)._shaderYaw || 0, (window as any)._shaderPitch || 0);
      
      const isDormant = (window as any)._isDormant;
      const dormantFactor = isDormant ? 0.1 : 1.0;
      
      const getVal = (key: string, fallback: number) => {
        const val = (window as any)[key];
        return typeof val === 'number' ? val : fallback;
      };

      gl.uniform1f(speedLoc, getVal('_shaderSpeed', 1.0) * dormantFactor);
      gl.uniform1f(lightLoc, getVal('_shaderLighting', 1.0) * (isDormant ? 0.2 : 1.0));
      gl.uniform1f(zoomLoc, getVal('_shaderZoom', 1.2));
      gl.uniform1f(depthLoc, getVal('_shaderDepth', -1.8));
      gl.uniform1f(windLoc, getVal('_shaderWind', 1.0) * dormantFactor);
      gl.uniform1f(densityLoc, getVal('_shaderDensity', 0.8));
      gl.uniform1f(pulseFreqLoc, isDormant ? 0.5 : getVal('_shaderPulseFreq', 5.0));
      gl.uniform1f(resonanceLoc, getVal('_shaderResonance', 0.0) * dormantFactor);
      gl.uniform1f(singularityLoc, getVal('_shaderSingularity', 0.0) * dormantFactor);
      gl.uniform1f(agentAudioLoc, getVal('_agentAudio', 0.0));
      
      const offsetX = getVal('_shaderOffsetX', -0.15);
      const offsetY = getVal('_shaderOffsetY', 0.15);
      gl.uniform2f(offsetLoc, offsetX, offsetY);

      const c = (window as any)._shaderColor || [0.0, 0.8, 1.0];
      gl.uniform3f(colorLoc, c[0], c[1], c[2]);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, prevTexture);
      gl.uniform1i(prevFrameLoc, 0);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.bindTexture(gl.TEXTURE_2D, prevTexture);
      gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, canvas.width, canvas.height, 0);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);


  // Sync state to window for the render loop to pick up
  useEffect(() => {
    (window as any)._shaderSpeed = speed;
    (window as any)._shaderLighting = lighting;
    (window as any)._shaderZoom = zoom;
    (window as any)._shaderYaw = yaw;
    (window as any)._shaderPitch = pitch;
    (window as any)._shaderPaused = isPaused;
    (window as any)._shaderDepth = proximity;
    (window as any)._shaderWind = wind;
    (window as any)._shaderDensity = density;
    (window as any)._shaderPulseFreq = pulseFreq;
    (window as any)._shaderResonance = resonance;
    (window as any)._shaderSingularity = singularity;
    (window as any)._shaderColor = (colors as any)[colorMode];
  }, [speed, lighting, zoom, yaw, pitch, isPaused, proximity, wind, density, pulseFreq, resonance, singularity, colorMode]);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden font-sans">
      <canvas ref={canvasRef} className="w-full h-full block" />
      
      {/* Entry Lobby / Immersive Landing Page Overlay */}
      <AnimatePresence>
        {!bootStarted && (
          <LandingPage
            onLaunch={() => setBootStarted(true)}
            modelConfig={modelConfig}
            setModelConfig={setModelConfig}
            user={user}
            token={token}
            onConnectGoogle={handleConnectGoogle}
            onDisconnectGoogle={handleDisconnectGoogle}
          />
        )}
      </AnimatePresence>

      {/* Cinematic Boot Sequence Overlay */}
      <AnimatePresence>
        {bootStarted && !bootCompleted && (
          <BootSequence
            onComplete={() => {
              setBootCompleted(true);
              startAudio();
            }}
          />
        )}
      </AnimatePresence>

      {/* Cinematic Executive Briefing Overlay */}
      <AnimatePresence>
        {audioStarted && bootCompleted && !briefingCompleted && (
          <ExecutiveBriefing 
            onComplete={() => setBriefingCompleted(true)} 
            setYaw={setYaw} 
          />
        )}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      {audioStarted && briefingCompleted && (
        <div className="absolute top-0 inset-x-0 h-16 z-40 bg-black/20 backdrop-blur-[40px] border-b border-white/[0.04] flex items-center justify-between px-6 shadow-[0_4px_32px_rgba(0,0,0,0.5)] animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"></span>
              </span>
              <span className="text-white/90 font-sans text-[11px] font-medium uppercase tracking-[0.2em]">
                Executive Console
              </span>
            </div>
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-white/[0.08]">
              <span className="font-sans text-[9px] text-white/40 uppercase tracking-[0.15em] font-medium">
                Sentinel Audio Link
              </span>
              <span className={`font-sans text-[9px] uppercase tracking-widest font-medium ${isAgentConnected ? 'text-white/80 animate-pulse' : 'text-white/30'}`}>
                {isAgentConnecting ? 'Establishing...' : isAgentConnected ? 'Secure Stream Online' : 'Link Standby'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5 font-sans text-[10px] text-white/40">
            <div className="hidden lg:flex items-center gap-5 tabular-data">
              <div className="flex items-center gap-1.5">
                <span className="text-white/30 uppercase tracking-widest text-[9px]">Azimuth</span>
                <span className="text-white/70 font-medium">{(yaw * (180/Math.PI)).toFixed(1)}°</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white/30 uppercase tracking-widest text-[9px]">Elevation</span>
                <span className="text-white/70 font-medium">{(pitch * (180/Math.PI)).toFixed(1)}°</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white/30 uppercase tracking-widest text-[9px]">Proximity</span>
                <span className="text-white/70 font-medium">{Math.abs(proximity).toFixed(2)}u</span>
              </div>
            </div>

            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="px-4 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] rounded-md text-white/80 transition-all text-[9px] uppercase tracking-widest flex items-center gap-2 font-medium font-sans shadow-sm"
            >
              {isCollapsed ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-white/80" />
                  <span>Restore Command Deck</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-white/40" />
                  <span>Collapse Deck (Full View)</span>
                </>
              )}
            </button>

            <button 
              onClick={() => {
                setBootStarted(false);
                setBootCompleted(false);
                setAudioStarted(false);
                setBriefingCompleted(false);
                // Also disconnect agents if connected
                if (isAgentConnected) {
                  disconnectAgent();
                }
              }}
              className="px-4 py-2 bg-white text-black hover:bg-white/90 border border-white rounded-md transition-all text-[9px] uppercase tracking-widest flex items-center gap-1.5 font-medium font-sans shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Decouple Deck</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Command Deck Grid */}
      <AnimatePresence>
        {audioStarted && briefingCompleted && !isCollapsed && (
          <CommandCenter
            speed={speed}
            setSpeed={setSpeed}
            zoom={zoom}
            setZoom={setZoom}
            singularity={singularity}
            setSingularity={setSingularity}
            resonance={resonance}
            setResonance={setResonance}
            density={density}
            setDensity={setDensity}
            proximity={proximity}
            setProximity={setProximity}
            wind={wind}
            setWind={setWind}
            colorMode={colorMode}
            setColorMode={setColorMode}
            pulseFreq={pulseFreq}
            setPulseFreq={setPulseFreq}
            
            activeRoom={activeRoom}
            setActiveRoom={handleSetActiveRoom}
            timeQuarter={timeQuarter}
            setTimeQuarter={handleSetTimeQuarter}
            currentTime={currentTime}
            setShowSettings={setShowSettings}

            messages={messages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleSendMessage={handleSendMessage}
            isAgentConnected={isAgentConnected}
            isAgentConnecting={isAgentConnecting}
            connectAgent={connectAgent}
            disconnectAgent={disconnectAgent}
            isAgentDormant={isAgentDormant}
            setIsAgentDormant={setIsAgentDormant}

            modelConfig={modelConfig}
            setModelConfig={setModelConfig}

            // SOVR Systems Operating System Kernel bindings
            sovrState={sovrState}
            operationalAnswers={operationalAnswers}
            createMission={createMission}
            toggleTaskDone={toggleTaskDone}
            addMemoryFact={addMemoryFact}
            deleteMemoryFact={deleteMemoryFact}
            toggleDamping={toggleDamping}
            resolveApproval={resolveApproval}
            reallocateCompute={reallocateCompute}
            
            yaw={yaw}
            pitch={pitch}
          />
        )}
      </AnimatePresence>



      {/* Floater when system panel collapsed */}
      {audioStarted && briefingCompleted && isCollapsed && (
        <div className="absolute bottom-6 right-6 z-40">
          <motion.button 
            layoutId="system-panel-trigger"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsCollapsed(false)}
            className="px-5 py-3 bg-black/60 backdrop-blur-3xl hover:bg-black/80 border border-white/15 rounded-xl font-mono text-[10px] text-white/80 uppercase tracking-widest flex items-center gap-2.5 shadow-2xl transition-all"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
            </span>
            <span>Restore Command Deck</span>
          </motion.button>
        </div>
      )}
    </div>
  );
}
