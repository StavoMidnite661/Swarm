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
import { Trash2, Edit2, Save, X } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
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
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Long-Term Memory State
  const [memories, setMemories] = useState<{ id: string; fact: string }[]>([]);
  const [manualMemoryInput, setManualMemoryInput] = useState('');
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [editingMemoryValue, setEditingMemoryValue] = useState('');
  
  const pendingMsgRef = useRef<string | null>(null);
  const [isAgentConnecting, setIsAgentConnecting] = useState(false);
  const [isAgentConnected, setIsAgentConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const fetchMemories = async () => {
    try {
      const res = await fetch("/api/memory");
      if (res.ok) {
        const data = await res.json();
        setMemories(data);
      }
    } catch (err) {
      console.error("Failed to load memories", err);
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

  useEffect(() => {
    fetchMemories();
  }, []);

  useEffect(() => {
    (window as any)._isDormant = isAgentDormant;
    if (isAgentDormant && isAgentConnected && ws) {
       ws.close();
    }
  }, [isAgentDormant, isAgentConnected, ws]);

  const colors = {
    cyan: [0.0, 0.8, 1.0],
    orange: [1.0, 0.4, 0.0],
    purple: [0.7, 0.2, 1.0],
    lime: [0.6, 1.0, 0.0]
  };
  const [audioStarted, setAudioStarted] = useState(false);
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
    setIsAgentConnecting(true);
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const newWs = new WebSocket(`${protocol}//${location.host}/live`);
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
    }
  }

  const disconnectAgent = () => {
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
        uv += vec2(-0.15, 0.15);
        
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

  const applyLandscape = (landscape: any) => {
    const settings = landscape.settings;
    if (settings.speed !== undefined) setSpeed(settings.speed);
    if (settings.lighting !== undefined) setLighting(settings.lighting);
    if (settings.zoom !== undefined) setZoom(settings.zoom);
    if (settings.yaw !== undefined) setYaw(settings.yaw);
    if (settings.pitch !== undefined) setPitch(settings.pitch);
    if (settings.proximity !== undefined) setProximity(settings.proximity);
    if (settings.wind !== undefined) setWind(settings.wind);
    if (settings.density !== undefined) setDensity(settings.density);
    if (settings.isPaused !== undefined) setIsPaused(settings.isPaused);
    if (settings.colorMode !== undefined) setColorMode(settings.colorMode);
    setIsCollapsed(true);
    
    // Update Environment Audio
    if (audioContextRef.current && envFilterRef.current && envGainRef.current && landscape.audio) {
      const ctx = audioContextRef.current;
      const audio = landscape.audio;
      envFilterRef.current.type = audio.type as BiquadFilterType;
      envFilterRef.current.frequency.setTargetAtTime(audio.freq, ctx.currentTime, 0.5);
      envFilterRef.current.Q.setTargetAtTime(audio.q, ctx.currentTime, 0.5);
      envGainRef.current.gain.setTargetAtTime(audio.gain, ctx.currentTime, 0.5);
    }

    // Trigger audio movement
    movementRef.current = 1.0;
  };

  const landscapes = [
    {
      id: 'core',
      name: 'The Core',
      image: 'https://lh3.googleusercontent.com/pw/AP1GczMdSHG7AfLrUH_b3sLjtG340ZEp3eywkEuo5n7zrFw-TfA0ZwJBk7Ry0z9yWoGSW9leVAtzxqOrrBbxa_VPAh46gowm9Cop5uqMyGl0LR4JnrVHqfO7-ssNRjbpI8uy_hj0md_X8tI8K5C1eF6XJBL5=w2606-h1416-s-no-gm?authuser=0',
      settings: {
        speed: 0.5,
        lighting: 1.2,
        zoom: 1.5,
        yaw: 0,
        pitch: 0,
        proximity: 0,
        wind: 1.0,
        density: 0.8,
        isPaused: false,
        colorMode: 'cyan'
      },
      audio: {
        freq: 150,
        q: 8,
        type: 'lowpass',
        gain: 0.2
      }
    },
    {
      id: 'storm',
      name: 'Plasma Storm',
      image: 'https://lh3.googleusercontent.com/pw/AP1GczO4s-8i-WwoohnEi6cV3q_g5g8Y0kqm6XJSBL51Pitm5HCtRk4ywtjVn0HfhCRA3ehY9j1MN7AaElD4Lw7EsXx3r1mPaznRSu5K9LXsGstebQVBKONjxdqPVsBlnjyJO1wsyfSk8p2hF2FvqKBKUjNd=w2192-h1480-s-no-gm?authuser=0',
      settings: {
        speed: 1.2,
        lighting: 1.5,
        zoom: 1.8,
        proximity: -2.2,
        wind: 3.5,
        density: 0.5,
        yaw: 19 * (Math.PI / 180),
        pitch: -14 * (Math.PI / 180),
        isPaused: false,
        colorMode: 'purple'
      },
      audio: {
        freq: 400,
        q: 0.5,
        type: 'bandpass',
        gain: 0.25
      }
    },
    {
      id: 'hive',
      name: 'Neon Hive',
      image: 'https://lh3.googleusercontent.com/pw/AP1GczODtYaSgO3R8EPfEfgpsmGlugQJoXtx-AYNAo9mAJHW9Gc9lJ8h6NR3joe7491Qk5rdmdblFTtJLp657-w9V0R2wCBcZ0MEvtLXk23C2puJtXzuMF6mCPcscvOayF1vBSzJZ039_z6xlNyk1cYo1AmX=w2146-h1320-s-no-gm?authuser=0',
      settings: {
        speed: 0.30,
        lighting: 1.0,
        zoom: 2.2,
        proximity: -1.85,
        wind: 0.5,
        density: 0.9,
        yaw: -189 * (Math.PI / 180),
        pitch: -5 * (Math.PI / 180),
        isPaused: false,
        colorMode: 'lime'
      },
      audio: {
        freq: 800,
        q: 15,
        type: 'bandpass',
        gain: 0.18
      }
    },
    {
      id: 'solar',
      name: 'Solar Anomaly',
      image: 'https://lh3.googleusercontent.com/pw/AP1GczMBmxjrTBIebX8DF9LfMixa96_mmrTIQHKeWBlHk-EhqL4e1qPnMerboxyhTpD1uT9hYhdKFQ7ujQpoMRwjOmjX6Yqes7K8XR_n_mC3dfq_AoOwx3DIH49PYvgGUEu9oLyuEMqBX1ii_KwhJG58MLrS=w2628-h1658-s-no-gm?authuser=0',
      settings: {
        speed: 0.8,
        lighting: 1.8,
        zoom: 1.2,
        yaw: -185 * (Math.PI / 180),
        pitch: 79 * (Math.PI / 180),
        proximity: -1.06,
        wind: 1.5,
        density: 0.7,
        isPaused: false,
        colorMode: 'orange'
      },
      audio: {
        freq: 1200,
        q: 4,
        type: 'lowpass',
        gain: 0.15
      }
    }
  ];

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
    <div className="fixed inset-0 bg-black overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      
      {/* Entry Lobby Overlay */}
      <AnimatePresence>
        {!audioStarted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 z-[100] flex items-center justify-center md:p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-full h-full md:h-auto md:max-w-2xl bg-white/5 backdrop-blur-2xl md:border md:border-white/10 md:rounded-[32px] p-8 md:p-12 md:shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-y-auto md:overflow-hidden relative flex flex-col justify-center"
            >
              {/* Decorative background glow */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />

              <div className="relative space-y-8">
                <div className="space-y-4">
                  <h2 className="text-white font-mono text-2xl md:text-3xl tracking-[0.3em] uppercase">
                    Sentinel Swarm
                  </h2>
                  <div className="h-px w-24 bg-gradient-to-r from-cyan-500 to-transparent" />
                </div>

                <div className="space-y-6 text-white/60 font-mono text-xs md:text-sm leading-relaxed tracking-wide">
                  <p>
                    You are about to witness a futuristic hive-mind in action. 
                    This experience is powered by a <span className="text-cyan-400">Real-time Volumetric Shader</span>—rendering an energetic, smoky environment alive with electrical charges and a swarm of sentinel entities revolving slowly.
                  </p>
                  <p>
                    Unlike a video, this universe is being generated live by your hardware. It is a living, breathing digital dimension that you can manipulate and explore.
                  </p>
                </div>

                {/* Landscape Previews */}
                <div className="grid grid-cols-3 gap-4">
                  {landscapes.slice(0, 3).map((l) => (
                    <div key={l.id} className="space-y-2 group">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-white/5">
                        <img 
                          src={l.image} 
                          alt={l.name} 
                          className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="text-[8px] uppercase tracking-widest text-white/20 text-center group-hover:text-white/60 transition-colors">
                        {l.name}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <button 
                    onClick={startAudio}
                    className="w-full py-4 bg-white text-black font-mono text-xs uppercase tracking-[0.3em] rounded-full hover:bg-cyan-400 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] active:scale-95"
                  >
                    Initiate Sequence
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI Panel */}
      <div className={`fixed z-50 ${isCollapsed ? 'top-6 right-6' : 'inset-0 md:top-6 md:right-6 md:inset-auto'} ${isAgentDormant ? 'opacity-30 hover:opacity-100 transition-opacity duration-1000' : 'transition-opacity duration-500'}`}>
        <AnimatePresence>
          {audioStarted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="w-full h-full flex flex-col items-end justify-start"
            >
              {isCollapsed ? (
                <motion.button 
                  key="collapsed"
                  layoutId="system-panel"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  onClick={() => setIsCollapsed(false)}
                  className="w-10 h-10 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all shadow-2xl group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white/80 transition-colors" />
                </motion.button>
              ) : (
                <motion.div 
                  key="expanded"
                  layoutId="system-panel"
                  transition={{ 
                    type: 'spring', 
                    damping: 25, 
                    stiffness: 200
                  }}
                  className="w-full h-full md:w-[280px] md:h-auto bg-black/40 backdrop-blur-xl md:border md:border-white/10 md:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                >
                    {/* Header / Toggle */}
                    <div className="border-b border-white/10">
                      <button 
                        onClick={() => setIsCollapsed(true)}
                        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white/80 transition-colors" />
                          <h2 className="text-white/80 font-mono text-[10px] uppercase tracking-widest">System Interface</h2>
                        </div>
                        <span className="text-white/20 font-mono text-[10px]">
                          [ - ]
                        </span>
                      </button>

                      <div className="flex px-4 pt-4 gap-4 flex-wrap">
                        <button 
                          onClick={() => setActiveTab('chat')}
                          className={`text-[9px] font-mono uppercase tracking-widest pb-3 -mb-[1px] border-b transition-all ${activeTab === 'chat' ? 'text-white border-white' : 'text-white/30 border-transparent hover:text-white/60'}`}
                        >
                          Data Link
                        </button>
                        <button 
                          onClick={() => setActiveTab('memory')}
                          className={`text-[9px] font-mono uppercase tracking-widest pb-3 -mb-[1px] border-b transition-all ${activeTab === 'memory' ? 'text-white border-white' : 'text-white/30 border-transparent hover:text-white/60'}`}
                        >
                          Memory
                        </button>
                        <button 
                          onClick={() => setActiveTab('controls')}
                          className={`text-[9px] font-mono uppercase tracking-widest pb-3 -mb-[1px] border-b transition-all ${activeTab === 'controls' ? 'text-white border-white' : 'text-white/30 border-transparent hover:text-white/60'}`}
                        >
                          Controls
                        </button>
                        <button 
                          onClick={() => setActiveTab('minimap')}
                          className={`text-[9px] font-mono uppercase tracking-widest pb-3 -mb-[1px] border-b transition-all ${activeTab === 'minimap' ? 'text-white border-white' : 'text-white/30 border-transparent hover:text-white/60'}`}
                        >
                          Minimap
                        </button>
                      </div>
                    </div>
                    
                    <div className="px-6 pb-6 space-y-6 flex-1 md:max-h-[600px] overflow-y-auto">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {activeTab === 'controls' && (
              <div className="space-y-4 pt-4">
                {/* Voice Agent Toggle */}
                <div className="flex flex-col gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono uppercase tracking-tighter text-cyan-400 font-bold drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">Cosmic Sentinel</span>
                        {isAgentDormant && <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />}
                      </div>
                      <span className="text-[8px] font-mono text-white/40">Voice Interface</span>
                    </div>
                    <button 
                      onClick={isAgentConnected ? disconnectAgent : connectAgent}
                      disabled={isAgentConnecting || isAgentDormant}
                      className={`px-4 py-2 rounded-full font-mono text-[9px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] ${
                        isAgentDormant ? 'opacity-30 cursor-not-allowed ' : ''
                      }${
                        isAgentConnecting ? 'bg-cyan-900/50 text-cyan-500 border border-cyan-800 animate-pulse' :
                        isAgentConnected ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]' : 
                        'bg-white/5 text-white/60 border border-white/20 hover:bg-white/10'
                      }`}
                    >
                      {isAgentConnecting ? 'Connecting...' : isAgentConnected ? 'Connected (Tap to Disconnect)' : 'Initialize Link'}
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setIsAgentDormant(!isAgentDormant)}
                    className={`w-full py-2 rounded font-mono text-[9px] uppercase tracking-widest border transition-all ${
                      isAgentDormant ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white/60'
                    }`}
                  >
                    {isAgentDormant ? 'Wake Sentinel' : 'Stand Down / Sleep Mode'}
                  </button>
                </div>

                {/* Pause Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase tracking-tighter text-white/40">Auto-Rotation</span>
                  <button 
                    onClick={() => setIsPaused(!isPaused)}
                    className={`px-3 py-1 rounded-full font-mono text-[9px] uppercase tracking-widest transition-all ${isPaused ? 'bg-white/5 text-white/40 border border-white/10' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'}`}
                  >
                    {isPaused ? 'Paused' : 'Active'}
                  </button>
                </div>

                {/* Speed Control */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter">
                    <span className="text-white/40">Temporal Speed</span>
                    <span className="text-white/80">{speed.toFixed(2)}x</span>
                  </div>
                  <input 
                    type="range" min="0" max="2" step="0.01" value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white/60"
                  />
                </div>

                {/* Lighting Control */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter">
                    <span className="text-white/40">Luminance</span>
                    <span className="text-white/80">{lighting.toFixed(2)}x</span>
                  </div>
                  <input 
                    type="range" min="0" max="2" step="0.01" value={lighting}
                    onChange={(e) => setLighting(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white/60"
                  />
                </div>

                {/* Zoom Control */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter">
                    <span className="text-white/40">Focal Zoom</span>
                    <span className="text-white/80">{zoom.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" min="1.2" max="3" step="0.01" value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white/60"
                  />
                </div>

                {/* Proximity Control */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter">
                    <span className="text-white/40">Proximity</span>
                    <span className="text-white/80">{proximity.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" min="-2.5" max="0.5" step="0.01" value={proximity}
                    onChange={(e) => setProximity(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white/60"
                  />
                </div>

                {/* Wind Control */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter">
                    <span className="text-white/40">Wind Intensity</span>
                    <span className="text-white/80">{wind.toFixed(2)}x</span>
                  </div>
                  <input 
                    type="range" min="0" max="5" step="0.01" value={wind}
                    onChange={(e) => setWind(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white/60"
                  />
                </div>

                {/* Swarm Density */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter">
                    <span className="text-white/40">Swarm Density</span>
                    <span className="text-white/80">{(density * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.01" value={density}
                    onChange={(e) => setDensity(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white/60"
                  />
                </div>

                {/* Pulse Frequency */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter">
                    <span className="text-white/40">Pulse Frequency</span>
                    <span className="text-white/80">{pulseFreq.toFixed(1)} Hz</span>
                  </div>
                  <input 
                    type="range" min="0.5" max="20" step="0.1" value={pulseFreq}
                    onChange={(e) => setPulseFreq(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white/60"
                  />
                </div>

                {/* Quantum Resonance (The Anomaly) */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter">
                    <span className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] font-bold">Quantum Resonance</span>
                    <span className="text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] font-bold">{(resonance * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.01" value={resonance}
                    onChange={(e) => setResonance(parseFloat(e.target.value))}
                    className="w-full h-1 bg-cyan-900/50 rounded-full appearance-none cursor-pointer accent-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                  />
                  <p className="text-[10px] text-cyan-400/60 leading-tight">
                    Warning: Increasing resonance will fracture local space-time and induce temporal echoes.
                  </p>
                </div>

                {/* Void Singularity */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter">
                    <span className="text-fuchsia-500 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)] font-bold">Void Singularity</span>
                    <span className="text-fuchsia-400 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)] font-bold">{(singularity * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.01" value={singularity}
                    onChange={(e) => setSingularity(parseFloat(e.target.value))}
                    className="w-full h-1 bg-fuchsia-900/50 rounded-full appearance-none cursor-pointer accent-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.5)]"
                  />
                  <p className="text-[10px] text-fuchsia-400/60 leading-tight">
                    Collapse the core into an absolute void. Induces gravitational lensing and accretion disk ignition.
                  </p>
                </div>

                {/* Yaw Control */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter">
                    <span className="text-white/40">Horizontal Axis</span>
                    <span className="text-white/80">{(yaw * (180/Math.PI)).toFixed(0)}°</span>
                  </div>
                  <input 
                    type="range" min={-Math.PI} max={Math.PI} step="0.01" value={yaw}
                    onChange={(e) => setYaw(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white/60"
                  />
                </div>

                {/* Pitch Control */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter">
                    <span className="text-white/40">Vertical Axis</span>
                    <span className="text-white/80">{(pitch * (180/Math.PI)).toFixed(0)}°</span>
                  </div>
                  <input 
                    type="range" min={-Math.PI/2} max={Math.PI/2} step="0.01" value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white/60"
                  />
                </div>

                {/* Color Mode Control */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono uppercase tracking-tighter text-white/40">Atmospheric Hue</span>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.keys(colors).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setColorMode(mode)}
                        className={`h-6 rounded-md border transition-all ${
                          colorMode === mode 
                            ? 'border-white/40 ring-1 ring-white/20' 
                            : 'border-white/5 hover:border-white/20'
                        }`}
                        style={{ 
                          backgroundColor: `rgb(${(colors as any)[mode][0]*255}, ${(colors as any)[mode][1]*255}, ${(colors as any)[mode][2]*255}, 0.3)` 
                        }}
                        title={mode}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="pt-4 h-full max-h-[400px] flex flex-col gap-4">
                <div className="flex-1 border border-white/10 rounded-xl bg-white/5 overflow-hidden flex flex-col relative">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-50">
                        <svg className="w-8 h-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div className="text-[10px] font-mono text-white tracking-widest uppercase">
                          Drag & Drop Files Here
                        </div>
                        <div className="text-[8px] font-mono text-white/60 tracking-wider">
                          Supports Images, PDF, Markdown, TXT
                        </div>
                      </div>
                    ) : (
                      messages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest mb-1">{msg.sender === 'user' ? 'Traveler' : 'Sentinel'}</div>
                          <div className={`px-3 py-2 rounded-xl text-[10px] font-mono whitespace-pre-wrap max-w-[90%] ${msg.sender === 'user' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-white/5 text-white/80 border border-white/10'}`}>
                            {msg.text}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {messages.length === 0 && <input type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" title="Upload files to Sentinel" />}
                </div>
                <div className="relative">
                   <input 
                     type="text" 
                     placeholder="TRANSMIT MESSAGE TO SENTINEL..." 
                     value={chatInput}
                     onChange={(e) => setChatInput(e.target.value)}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter') {
                         handleSendMessage();
                       }
                     }}
                     className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-16 py-3 text-[10px] font-mono text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors" 
                   />
                   <button 
                     disabled={!chatInput.trim()}
                     onClick={handleSendMessage}
                     className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 hover:text-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed rounded-full font-mono text-[9px] uppercase tracking-widest transition-all">
                      Send
                   </button>
                </div>
              </div>
            )}

            {activeTab === 'memory' && (
              <div className="pt-4 h-full max-h-[400px] flex flex-col gap-4">
                <div className="flex-1 border border-white/10 rounded-xl bg-white/5 overflow-hidden flex flex-col relative min-h-[220px]">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest border-b border-white/5 pb-2 flex justify-between items-center">
                      <span>Durable Memories</span>
                      <span className="text-[8px] text-white/40">{memories.length} entries</span>
                    </div>

                    {memories.length === 0 ? (
                      <div className="h-[120px] flex flex-col items-center justify-center text-center space-y-2 opacity-50">
                        <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">
                          No facts indexed
                        </span>
                        <p className="text-[8px] font-mono text-white/30 max-w-[180px]">
                          Tell Sentinel things about yourself in voice or chat to automatically write long-term memories.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {memories.map((m) => (
                          <div key={m.id} className="group flex flex-col gap-1.5 p-2 rounded bg-white/5 border border-white/10 hover:border-cyan-500/25 transition-all">
                            {editingMemoryId === m.id ? (
                              <div className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={editingMemoryValue}
                                  onChange={(e) => setEditingMemoryValue(e.target.value)}
                                  className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-[9px] font-mono text-white focus:outline-none focus:border-cyan-500/50"
                                />
                                <button
                                  onClick={() => updateMemory(m.id, editingMemoryValue)}
                                  className="p-1 text-white/60 hover:text-green-400 transition-colors"
                                  title="Save Fact"
                                >
                                  <Save size={10} />
                                </button>
                                <button
                                  onClick={() => setEditingMemoryId(null)}
                                  className="p-1 text-white/60 hover:text-red-400 transition-colors"
                                  title="Cancel"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-[9px] font-mono text-white/80 leading-relaxed break-words flex-1">
                                  {m.fact}
                                </span>
                                <div className="flex gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => {
                                      setEditingMemoryId(m.id);
                                      setEditingMemoryValue(m.fact);
                                    }}
                                    className="p-0.5 hover:text-cyan-400 transition-colors"
                                    title="Edit memory"
                                  >
                                    <Edit2 size={10} />
                                  </button>
                                  <button
                                    onClick={() => deleteMemory(m.id)}
                                    className="p-0.5 hover:text-red-400 transition-colors"
                                    title="Delete memory"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Manually input a new memory */}
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="MANUALLY INDEX FACT..." 
                    value={manualMemoryInput}
                    onChange={(e) => setManualMemoryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && manualMemoryInput.trim()) {
                        addMemory(manualMemoryInput);
                      }
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-16 py-3 text-[10px] font-mono text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors" 
                  />
                  <button 
                    disabled={!manualMemoryInput.trim()}
                    onClick={() => addMemory(manualMemoryInput)}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 hover:text-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed rounded-full font-mono text-[9px] uppercase tracking-widest transition-all"
                  >
                    Index
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'minimap' && (
              <div className="pt-4 space-y-6">
                <div className="relative aspect-square w-full bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                  {/* Grid Background */}
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  
                  {/* The Sphere Visualization */}
                  <div className="relative w-40 h-40">
                    {/* Core Sphere */}
                    <div className="absolute inset-0 rounded-full border border-white/20 bg-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]" />
                    
                    {/* Orbital Rings */}
                    <div className="absolute inset-0 rounded-full border border-white/10 scale-75 rotate-45" />
                    <div className="absolute inset-0 rounded-full border border-white/10 scale-75 -rotate-45" />
                    
                    {/* User Position Dot */}
                    {(() => {
                      const r = 80; // Radius of the visualization sphere
                      
                      // Initial position (0, 0, -1)
                      let x = 0;
                      let y = 0;
                      let z = -1;
                      
                      // Pitch rotation (YZ plane)
                      const cosP = Math.cos(pitch);
                      const sinP = Math.sin(pitch);
                      const py = y * cosP - z * sinP;
                      const pz = y * sinP + z * cosP;
                      y = py;
                      z = pz;
                      
                      // Yaw rotation (XZ plane)
                      const cosY = Math.cos(yaw);
                      const sinY = Math.sin(yaw);
                      const yx = x * cosY - z * sinY;
                      const yz = x * sinY + z * cosY;
                      x = yx;
                      z = yz;
                      
                      // Project to 2D (simple orthographic for the minimap look)
                      const screenX = 80 + x * r;
                      const screenY = 80 + y * r;
                      const opacity = z > 0 ? 1 : 0.3; // Dim if behind the sphere
                      const scale = 1 + z * 0.5; // Scale based on depth
                      
                      return (
                        <div 
                          className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)] transition-all duration-100"
                          style={{ 
                            left: `${screenX}px`, 
                            top: `${screenY}px`,
                            transform: `translate(-50%, -50%) scale(${scale})`,
                            opacity: opacity,
                            zIndex: z > 0 ? 10 : 0
                          }}
                        />
                      );
                    })()}

                    {/* Center Point */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/60 rounded-full blur-[1px]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter">
                    <span className="text-white/40">Vector Coordinates</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                      <span className="text-[8px] text-white/20 block mb-1">AZIMUTH</span>
                      <span className="text-[10px] text-white/80 font-mono">{(yaw * (180/Math.PI)).toFixed(1)}°</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                      <span className="text-[8px] text-white/20 block mb-1">ELEVATION</span>
                      <span className="text-[10px] text-white/80 font-mono">{(pitch * (180/Math.PI)).toFixed(1)}°</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                      <span className="text-[8px] text-white/20 block mb-1">PROXIMITY</span>
                      <span className="text-[10px] text-white/80 font-mono">{Math.abs(proximity).toFixed(2)}u</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                      <span className="text-[8px] text-white/20 block mb-1">MAGNIFICATION</span>
                      <span className="text-[10px] text-white/80 font-mono">{zoom.toFixed(2)}x</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
