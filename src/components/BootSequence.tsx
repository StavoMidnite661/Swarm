import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [terminalLines, setTerminalLines] = useState<any[]>([]);
  const [headerText, setHeaderText] = useState('');
  const [verText, setVerText] = useState('');
  const [subsysText, setSubsysText] = useState('');
  const [welcomeText, setWelcomeText] = useState('');
  const [welcomeSubText, setWelcomeSubText] = useState('');
  
  const [showTerminal, setShowTerminal] = useState(false);
  const [showDivider1, setShowDivider1] = useState(false);
  const [showDivider2, setShowDivider2] = useState(false);
  const [isTerminalDissolving, setIsTerminalDissolving] = useState(false);
  const [isTerminalHidden, setIsTerminalHidden] = useState(false);
  
  const [showCanvas, setShowCanvas] = useState(false);
  const [showEmblem, setShowEmblem] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const hummingNodeRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);
  const hummingNode2Ref = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);
  const isHummingActiveRef = useRef(false);
  const skippedRef = useRef(false);
  const particlesRef = useRef<any>(null);

  // Audio utility helper
  const initAudio = () => {
    if (audioCtxRef.current) return;
    try {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('[SOVR] Audio Context not supported', e);
    }
  };

  const playTick = () => {
    if (!audioEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 760 + (Math.random() * 80 - 40);
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  };

  const playSubTick = () => {
    if (!audioEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 440 + (Math.random() * 40);
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  };

  const playUnlockChime = () => {
    if (!audioEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    const notes = [92.5, 110, 138.6];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        if (skippedRef.current || !audioEnabled || !audioCtxRef.current) return;
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
          osc.connect(gain).connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 2);
        } catch (e) {}
      }, i * 350);
    });
  };

  const playSovereignBell = () => {
    if (!audioEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    const harmonics = [
      { freq: 65.4, gain: 0.16, decay: 5 },
      { freq: 130.8, gain: 0.07, decay: 3.5 },
      { freq: 196, gain: 0.035, decay: 3 },
      { freq: 261.6, gain: 0.018, decay: 2.5 },
      { freq: 329.6, gain: 0.008, decay: 2 },
    ];
    harmonics.forEach(h => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = h.freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(h.gain, ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + h.decay);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + h.decay + 0.2);
      } catch (e) {}
    });
  };

  const startSentinelHum = () => {
    if (!audioEnabled || hummingNodeRef.current || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 55;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 4);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      hummingNodeRef.current = { osc, gain };

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.frequency.value = 82.5;
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0, ctx.currentTime);
      gain2.gain.linearRampToValueAtTime(0.008, ctx.currentTime + 5);
      osc2.connect(gain2).connect(ctx.destination);
      osc2.start();
      hummingNode2Ref.current = { osc: osc2, gain: gain2 };
    } catch (e) {
      console.warn('[SOVR] Error starting hum:', e);
    }
  };

  const stopSentinelHum = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (hummingNodeRef.current) {
      try {
        hummingNodeRef.current.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
        const osc = hummingNodeRef.current.osc;
        setTimeout(() => {
          try { osc.stop(); } catch(e) {}
        }, 1600);
      } catch (e) {}
      hummingNodeRef.current = null;
    }
    if (hummingNode2Ref.current) {
      try {
        hummingNode2Ref.current.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
        const osc = hummingNode2Ref.current.osc;
        setTimeout(() => {
          try { osc.stop(); } catch(e) {}
        }, 1600);
      } catch (e) {}
      hummingNode2Ref.current = null;
    }
  };

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  // Typewriter effect in React
  const typeText = async (setter: React.Dispatch<React.SetStateAction<string>>, fullText: string, baseSpeed = 55) => {
    let current = '';
    for (let i = 0; i < fullText.length; i++) {
      if (skippedRef.current) {
        setter(fullText);
        return;
      }
      current += fullText[i];
      setter(current);
      if (i % 3 === 0) playSubTick();
      await sleep(baseSpeed + Math.random() * 25);
    }
  };

  const generateDots = (descLength: number) => {
    const total = Math.max(2, 38 - descLength);
    let dots = '';
    for (let i = 0; i < total; i++) {
      dots += Math.random() > 0.5 ? '·' : '.';
    }
    return dots;
  };

  // Particle System Implementation
  class ParticleSystem {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    particles: any[] = [];
    connections = true;
    rafId = 0;
    _onResize: () => void;

    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d')!;
      this.resize();
      this._onResize = () => this.resize();
      window.addEventListener('resize', this._onResize);
    }

    resize() {
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = window.innerWidth * dpr;
      this.canvas.height = window.innerHeight * dpr;
      this.canvas.style.width = window.innerWidth + 'px';
      this.canvas.style.height = window.innerHeight + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    spawnFromTerminal(count = 2200) {
      if (!terminalRef.current) return;
      const rect = terminalRef.current.getBoundingClientRect();
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 40 + Math.random() * 80;
        this.particles.push({
          x: rect.left + Math.random() * rect.width,
          y: rect.top + Math.random() * rect.height,
          vx: 0,
          vy: 0,
          tx: cx + Math.cos(angle) * radius,
          ty: cy + Math.sin(angle) * radius,
          size: Math.random() * 1.6 + 0.3,
          alpha: Math.random() * 0.5 + 0.2,
          maxAlpha: Math.random() * 0.5 + 0.2,
          phase: 'gather',
          orbitSpeed: 0.008 + Math.random() * 0.02,
          orbitRadius: 80 + Math.random() * 100,
          pulseOffset: Math.random() * Math.PI * 2,
          targetBadgeX: 0,
          targetBadgeY: 0
        });
      }
    }

    update(time: number) {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      if (this.connections) {
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.04)';
        ctx.lineWidth = 0.5;
        const checkCount = Math.min(this.particles.length, 200);
        for (let i = 0; i < checkCount; i++) {
          const p = this.particles[i];
          for (let j = i + 1; j < checkCount; j++) {
            const q = this.particles[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const dist = dx * dx + dy * dy;
            if (dist < 2500) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.stroke();
            }
          }
        }
      }

      this.particles.forEach(p => {
        if (p.phase === 'gather') {
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          p.vx += dx * 0.001;
          p.vy += dy * 0.001;
          p.vx *= 0.97;
          p.vy *= 0.97;
          p.x += p.vx;
          p.y += p.vy;
        } else if (p.phase === 'swarm') {
          const ang = Math.atan2(p.y - cy, p.x - cx);
          const r = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2);
          const targetR = p.orbitRadius + Math.sin(time * 0.0008 + p.pulseOffset) * 25;
          const newR = r + (targetR - r) * 0.03;
          const newAng = ang + p.orbitSpeed;
          p.x = cx + Math.cos(newAng) * newR;
          p.y = cy + Math.sin(newAng) * newR;
          p.alpha = p.maxAlpha * (0.7 + 0.3 * Math.sin(time * 0.002 + p.pulseOffset));
        } else if (p.phase === 'assemble') {
          const dx = p.targetBadgeX - p.x;
          const dy = p.targetBadgeY - p.y;
          p.vx += dx * 0.022;
          p.vy += dy * 0.022;
          p.vx *= 0.84;
          p.vy *= 0.84;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = Math.min(p.maxAlpha * 1.5, 0.9);
        } else if (p.phase === 'collapse') {
          p.vx += (cx - p.x) * 0.018;
          p.vy += (cy - p.y) * 0.018;
          p.vx *= 0.85;
          p.vy *= 0.85;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha *= 0.97;
          p.size *= 0.998;
        }
        if (p.alpha > 0.01) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 243, 255, ${p.alpha})`;
          ctx.fill();
        }
      });
    }

    setPhase(phase: string) {
      if (phase === 'assemble') {
        this.connections = false;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const svgScale = 220 / 200;

        const outerHex = samplePolygon([
          {x: 100, y: 15}, {x: 175, y: 57.5}, {x: 175, y: 142.5},
          {x: 100, y: 185}, {x: 25, y: 142.5}, {x: 25, y: 57.5}
        ], 600);

        const innerHex = samplePolygon([
          {x: 100, y: 32}, {x: 158, y: 66}, {x: 158, y: 134},
          {x: 100, y: 168}, {x: 42, y: 134}, {x: 42, y: 66}
        ], 500);

        const sCurves = getSPoints(600);

        this.particles.forEach((p, idx) => {
          p.phase = 'assemble';
          p.vx = 0;
          p.vy = 0;

          let pt = null;
          if (idx < 600) {
            pt = outerHex[idx];
          } else if (idx < 1100) {
            pt = innerHex[idx - 600];
          } else if (idx < 1700) {
            pt = sCurves[idx - 1100];
          }

          if (pt) {
            p.targetBadgeX = cx + (pt.x - 100) * svgScale;
            p.targetBadgeY = cy + (pt.y - 100) * svgScale;
          } else {
            const a = Math.random() * Math.PI * 2;
            const r = 25 + Math.random() * 140;
            p.targetBadgeX = cx + Math.cos(a) * r;
            p.targetBadgeY = cy + Math.sin(a) * r;
          }
        });
      } else {
        this.particles.forEach(p => {
          p.phase = phase;
          if (p.phase === 'collapse') {
            p.vx = 0;
            p.vy = 0;
          }
        });
        if (phase === 'collapse') this.connections = false;
      }
    }

    start() {
      const loop = (time: number) => {
        this.update(time);
        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);
    }

    stop() {
      cancelAnimationFrame(this.rafId);
      window.removeEventListener('resize', this._onResize);
    }
  }

  // Polygon sampler helper
  function samplePolygon(points: { x: number; y: number }[], numPoints: number) {
    const sampled = [];
    const pointsPerSeg = Math.floor(numPoints / points.length);
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      for (let j = 0; j < pointsPerSeg; j++) {
        const t = j / pointsPerSeg;
        sampled.push({
          x: p1.x + (p2.x - p1.x) * t,
          y: p1.y + (p2.y - p1.y) * t
        });
      }
    }
    while (sampled.length < numPoints) {
      sampled.push({ ...points[points.length - 1] });
    }
    return sampled;
  }

  // S curve points sampler
  function getSPoints(totalSPoints: number) {
    const segments = [
      { type: 'bezier', p0: {x:78, y:78}, p1: {x:78, y:66}, p2: {x:92, y:66} },
      { type: 'line', p0: {x:92, y:66}, p1: {x:114, y:66} },
      { type: 'bezier', p0: {x:114, y:66}, p1: {x:128, y:66}, p2: {x:128, y:80} },
      { type: 'bezier', p0: {x:128, y:80}, p1: {x:128, y:92}, p2: {x:114, y:95} },
      { type: 'line', p0: {x:114, y:95}, p1: {x:90, y:98} },
      { type: 'bezier', p0: {x:90, y:98}, p1: {x:76, y:100}, p2: {x:76, y:114} },
      { type: 'bezier', p0: {x:76, y:114}, p1: {x:76, y:128}, p2: {x:92, y:128} },
      { type: 'line', p0: {x:92, y:128}, p1: {x:118, y:128} }
    ];
    
    const sampled: { x: number; y: number }[] = [];
    const pointsPerSeg = Math.floor(totalSPoints / segments.length);
    segments.forEach(seg => {
      for (let i = 0; i < pointsPerSeg; i++) {
        const t = i / pointsPerSeg;
        if (seg.type === 'line') {
          sampled.push({
            x: seg.p0.x + (seg.p1.x - seg.p0.x) * t,
            y: seg.p0.y + (seg.p1.y - seg.p0.y) * t
          });
        } else {
          const mt = 1 - t;
          sampled.push({
            x: mt*mt*seg.p0.x + 2*mt*t*seg.p1.x + t*t*seg.p2.x,
            y: mt*mt*seg.p0.y + 2*mt*t*seg.p1.y + t*t*seg.p2.y
          });
        }
      }
    });
    while (sampled.length < totalSPoints) {
      sampled.push({ x: 118, y: 128 });
    }
    return sampled;
  }

  // Main Boot Sequence Orchestrator
  useEffect(() => {
    let active = true;

    const runBoot = async () => {
      setProgress(0);
      await sleep(1500);
      if (!active || skippedRef.current) return;

      // Show controls and start humming
      setShowControls(true);
      isHummingActiveRef.current = true;
      startSentinelHum();

      // Subsystem Initialization Start
      setShowTerminal(true);
      setProgress(5);

      await typeText(setHeaderText, 'SOVR SENTINEL EXECUTIVE OS', 45);
      if (!active || skippedRef.current) return;

      await sleep(300);
      await typeText(setVerText, 'v3.1.0 · Sovereign Kernel · Build 2026.07', 20);
      if (!active || skippedRef.current) return;

      setProgress(10);
      await sleep(500);
      setShowDivider1(true);

      await sleep(300);
      await typeText(setSubsysText, 'Initializing subsystems...', 30);
      if (!active || skippedRef.current) return;

      await sleep(400);

      // Loading lines sequentially
      const BOOT_LINES = [
        { tag: 'BOOT', desc: 'Loading Sovereign Kernel', delay: 200 },
        { tag: 'BOOT', desc: 'Mounting Agent Fabric', delay: 200 },
        { tag: 'BOOT', desc: 'Initializing Mission Engine', delay: 240 },
        { tag: 'BOOT', desc: 'Loading Organizational Memory', delay: 350 },
        { tag: 'BOOT', desc: 'Restoring Executive Workspace', delay: 300 },
        { tag: 'BOOT', desc: 'Compiling Predictive Models', delay: 400 },
        { tag: 'SYNC', desc: 'Synchronizing Sovereign Ledger', delay: 350 },
        { tag: 'LINK', desc: 'Establishing Workspace Tunnel', delay: 450 },
        { tag: 'LINK', desc: 'Securing Communications Channel', delay: 350 },
        { tag: 'LINK', desc: 'Loading Neural Memory Lattice', delay: 500 },
        { tag: 'AUTH', desc: 'Authenticating Founder', delay: 900, wait: true },
      ];

      for (let i = 0; i < BOOT_LINES.length; i++) {
        if (!active || skippedRef.current) return;
        const item = BOOT_LINES[i];
        const dots = generateDots(item.desc.length);
        
        // Add pending line
        const newLine = {
          id: i.toString(),
          tag: item.tag,
          desc: item.desc,
          dots,
          status: item.wait ? 'WAITING' : 'OK',
          pending: !item.wait
        };

        setTerminalLines(prev => [...prev, newLine]);
        await sleep(item.delay);
        if (!active || skippedRef.current) return;

        if (!item.wait) {
          playTick();
        }

        setProgress(10 + ((i + 1) / BOOT_LINES.length) * 50);
      }

      await sleep(1000);
      if (!active || skippedRef.current) return;

      // Update AUTH status to OK
      setTerminalLines(prev => prev.map(l => l.tag === 'AUTH' ? { ...l, status: 'OK' } : l));
      playTick();
      setProgress(65);

      await sleep(500);
      setShowDivider2(true);
      await sleep(300);

      // Welcome Gustavo
      await typeText(setWelcomeText, 'Founder authenticated.', 45);
      if (!active || skippedRef.current) return;

      await sleep(400);
      await typeText(setWelcomeSubText, 'Welcome back, Stavogm.', 55);
      if (!active || skippedRef.current) return;

      setProgress(85);
      playUnlockChime();
      await sleep(1500);
      if (!active || skippedRef.current) return;

      // Dissolution Phase (Terminal dissolves to particles)
      setProgress(90);
      setShowCanvas(true);

      if (canvasRef.current) {
        const ps = new ParticleSystem(canvasRef.current);
        particlesRef.current = ps;
        ps.spawnFromTerminal(2200);
        ps.start();
      }

      await sleep(200);
      if (!active || skippedRef.current) return;

      setIsTerminalDissolving(true);
      await sleep(1400);
      if (!active || skippedRef.current) return;

      setIsTerminalHidden(true);
      await sleep(400);
      if (!active || skippedRef.current) return;

      // Swarm particles around
      if (particlesRef.current) {
        particlesRef.current.setPhase('swarm');
      }
      await sleep(2000);
      if (!active || skippedRef.current) return;

      // Assemble emblem
      setProgress(95);
      if (particlesRef.current) {
        particlesRef.current.setPhase('assemble');
      }
      await sleep(2200);
      if (!active || skippedRef.current) return;

      // Trigger final emblem animation
      isHummingActiveRef.current = false;
      stopSentinelHum();
      playSovereignBell();
      setShowEmblem(true);
      setProgress(100);

      await sleep(4500);
      if (!active || skippedRef.current) return;

      onComplete();
    };

    runBoot();

    return () => {
      active = false;
      stopSentinelHum();
      if (particlesRef.current) {
        particlesRef.current.stop();
      }
    };
  }, []);

  // Handle Skip Trigger
  const handleSkip = () => {
    skippedRef.current = true;
    isHummingActiveRef.current = false;
    stopSentinelHum();
    
    if (particlesRef.current) {
      particlesRef.current.stop();
      particlesRef.current = null;
    }

    setShowTerminal(false);
    setIsTerminalHidden(true);
    setShowCanvas(false);
    setProgress(100);
    setShowEmblem(true);
    playSovereignBell();

    // Give user 2.5 seconds to appreciate the final holding badge before launching console
    setTimeout(() => {
      onComplete();
    }, 2800);
  };

  // Handle Mute Toggle
  const handleToggleMute = () => {
    initAudio();
    const nextEnabled = !audioEnabled;
    setAudioEnabled(nextEnabled);
    if (!nextEnabled) {
      stopSentinelHum();
    } else {
      if (isHummingActiveRef.current) {
        startSentinelHum();
      }
    }
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [audioEnabled]);

  // Handle first interaction for audio context unlock
  useEffect(() => {
    const unlock = () => {
      initAudio();
      if (isHummingActiveRef.current) {
        startSentinelHum();
      }
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
      document.removeEventListener('touchstart', unlock);
    };
    document.addEventListener('click', unlock);
    document.addEventListener('keydown', unlock);
    document.addEventListener('touchstart', unlock);
    return () => {
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
      document.removeEventListener('touchstart', unlock);
    };
  }, []);

  return (
    <div 
      id="boot-container" 
      className="absolute inset-0 w-screen h-screen bg-black overflow-hidden z-50 select-none font-mono text-[13px] leading-relaxed"
      style={{
        background: 'radial-gradient(ellipse at center, #050a0f 0%, #000 70%)'
      }}
    >
      {/* Scanline & Vignette Overlays */}
      <div className="absolute inset-0 pointer-events-none z-[100] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]" />
      <div className="absolute inset-0 pointer-events-none z-[99]" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />

      {/* Ambient Glows */}
      <div className="absolute w-[600px] h-[600px] rounded-full filter blur-[120px] bg-cyan-950/20 top-1/5 left-1/3 pointer-events-none transition-opacity duration-[3s]" />
      <div className="absolute w-[600px] h-[600px] rounded-full filter blur-[120px] bg-blue-950/10 bottom-[10%] right-1/5 pointer-events-none transition-opacity duration-[3s]" />

      {/* Terminal View */}
      {showTerminal && !isTerminalHidden && (
        <div 
          ref={terminalRef}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] max-w-[90vw] z-10 font-mono text-[13px] tracking-wide text-cyan-100/75 select-none max-h-[80vh] overflow-y-auto pr-2 scrollbar-none transition-all duration-700 ${
            isTerminalDissolving ? 'opacity-0 scale-95 blur-md' : 'opacity-100'
          }`}
        >
          {/* Header titles */}
          <div className="text-white text-[14px] font-medium tracking-[0.06em] leading-none mb-1.5 min-h-[16px]">
            {headerText}
            {headerText.length < 'SOVR SENTINEL EXECUTIVE OS'.length && <span className="inline-block w-2 h-3.5 bg-cyan-100 animate-pulse ml-0.5 align-middle" />}
          </div>
          <div className="text-cyan-100/45 text-[11px] leading-none mb-4 min-h-[12px]">
            {verText}
            {verText.length < 'v3.1.0 · Sovereign Kernel · Build 2026.07'.length && <span className="inline-block w-1.5 h-3 bg-cyan-100/50 animate-pulse ml-0.5 align-middle" />}
          </div>

          {showDivider1 && <div className="text-cyan-100/10 border-t border-cyan-100/10 my-4" />}

          {/* Subsystems subtitle */}
          <div className="text-cyan-100/70 text-[12px] min-h-[16px] mb-4">
            {subsysText}
            {subsysText.length < 'Initializing subsystems...'.length && <span className="inline-block w-2 h-3.5 bg-cyan-100/70 animate-pulse ml-0.5 align-middle" />}
          </div>

          {/* Sequential boot lines */}
          <div className="space-y-1.5 text-cyan-100/75">
            {terminalLines.map((line) => (
              <div key={line.id} className="flex items-center justify-between whitespace-pre leading-none">
                <div className="flex items-center min-w-0 flex-1">
                  <span className="text-cyan-500/55 font-bold mr-4 shrink-0">[{line.tag}]</span>
                  <span className="truncate">{line.desc}</span>
                  <span className="text-cyan-100/10 mx-3 flex-1 overflow-hidden truncate">{line.dots}</span>
                </div>
                <span className={`shrink-0 font-medium tabular-data text-right min-w-[60px] ${
                  line.status === 'OK' ? 'text-emerald-400' : 'text-amber-400 animate-pulse'
                }`}>
                  [{line.status}]
                </span>
              </div>
            ))}
          </div>

          {showDivider2 && <div className="text-cyan-100/10 border-t border-cyan-100/10 my-4" />}

          {/* Auth messages */}
          {welcomeText && (
            <div className="mt-4 text-[14px] font-medium tracking-wide text-white min-h-[20px]">
              {welcomeText}
              {welcomeText.length < 'Founder authenticated.'.length && <span className="inline-block w-2 h-3.5 bg-cyan-100 animate-pulse ml-0.5 align-middle" />}
            </div>
          )}
          {welcomeSubText && (
            <div className="mt-1 text-[13px] font-medium tracking-wide text-cyan-200 min-h-[18px]">
              {welcomeSubText}
              {welcomeSubText.length < 'Welcome back, Stavogm.'.length && <span className="inline-block w-2 h-3.5 bg-cyan-200 animate-pulse ml-0.5 align-middle" />}
            </div>
          )}
        </div>
      )}

      {/* Particle System Canvas */}
      {showCanvas && (
        <canvas ref={canvasRef} id="particle-canvas" className="absolute inset-0 block pointer-events-none z-5" />
      )}

      {/* Emblem & Brand revealed at end of boot */}
      <AnimatePresence>
        {showEmblem && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            id="emblem" 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20 flex flex-col items-center"
          >
            <svg viewBox="0 0 200 200" className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] drop-shadow-[0_0_40px_rgba(0,243,255,0.15)]">
              <defs>
                <filter id="rockTexture" x="0%" y="0%" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
                  <feDiffuseLighting in="noise" lighting-color="#111c24" surfaceScale="2" result="light">
                    <feDistantLight azimuth="45" elevation="60" />
                  </feDiffuseLighting>
                  <feBlend mode="multiply" in="SourceGraphic" in2="light" result="blend" />
                </filter>

                <linearGradient id="rockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1b2832" />
                  <stop offset="50%" stopColor="#0e1822" />
                  <stop offset="100%" stopColor="#050a0f" />
                </linearGradient>

                <linearGradient id="electricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f3ff" />
                  <stop offset="100%" stopColor="#0066cc" />
                </linearGradient>

                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffd700" />
                  <stop offset="100%" stopColor="#b8860b" />
                </linearGradient>

                <filter id="neonBlueGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur1" />
                  <feGaussianBlur stdDeviation="1.5" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur1" />
                    <feMergeNode in="blur2" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Textured hexagon face */}
              <polygon
                points="100,15 175,57.5 175,142.5 100,185 25,142.5 25,57.5"
                fill="url(#rockGrad)"
                stroke="url(#electricGrad)"
                strokeWidth="1.8"
                filter="url(#rockTexture)"
              />

              {/* Circuits */}
              <g stroke="url(#electricGrad)" strokeWidth="1.2" fill="none" filter="url(#neonBlueGlow)" opacity="0.8">
                <path d="M 25,57.5 H 5 L -10,42" />
                <circle cx="-10" cy="42" r="1.5" fill="#00f3ff" />
                <path d="M 25,142.5 H 5 L -10,158" />
                <circle cx="-10" cy="158" r="1.5" fill="#00f3ff" />
                <path d="M 25,100 H 0" />
                <circle cx="0" cy="100" r="1.5" fill="#00f3ff" />
                
                <path d="M 175,57.5 H 195 L 210,42" />
                <circle cx="210" cy="42" r="1.5" fill="#00f3ff" />
                <path d="M 175,142.5 H 195 L 210,158" />
                <circle cx="210" cy="158" r="1.5" fill="#00f3ff" />
                <path d="M 175,100 H 200" />
                <circle cx="200" cy="100" r="1.5" fill="#00f3ff" />
              </g>

              {/* Inner accent */}
              <polygon points="100,28 162,64 162,136 100,172 38,136 38,64" fill="none" stroke="url(#goldGrad)" strokeWidth="0.8" opacity="0.6" />
              <polygon points="100,32 158,66 158,134 100,168 42,134 42,66" fill="none" stroke="#00f3ff" strokeWidth="1" filter="url(#neonBlueGlow)" />

              {/* S Letter */}
              <path d="M 78 78 Q 78 66 92 66 L 114 66 Q 128 66 128 80 Q 128 92 114 95 L 90 98 Q 76 100 76 114 Q 76 128 92 128 L 118 128" fill="none" stroke="#020811" strokeWidth="6" strokeLinecap="round" />
              <path d="M 78 78 Q 78 66 92 66 L 114 66 Q 128 66 128 80 Q 128 92 114 95 L 90 98 Q 76 100 76 114 Q 76 128 92 128 L 118 128" fill="none" stroke="url(#electricGrad)" strokeWidth="4.2" strokeLinecap="round" filter="url(#neonBlueGlow)" />
              <path d="M 78 78 Q 78 66 92 66 L 114 66 Q 128 66 128 80 Q 128 92 114 95 L 90 98 Q 76 100 76 114 Q 76 128 92 128 L 118 128" fill="none" stroke="url(#goldGrad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              <path d="M 78 78 Q 78 66 92 66 L 114 66 Q 128 66 128 80 Q 128 92 114 95 L 90 98 Q 76 100 76 114 Q 76 128 92 128 L 118 128" fill="none" stroke="rgba(240, 253, 255, 0.95)" strokeWidth="1" strokeLinecap="round" />
            </svg>
            
            <div className="mt-9 font-sans text-center">
              <div className="text-[34px] md:text-[38px] font-extralight tracking-[0.3em] text-cyan-50/95 leading-none shadow-sm" style={{ textShadow: '0 0 15px rgba(0,243,255,0.1)' }}>SOVR</div>
              <div className="text-[10px] md:text-[11px] font-normal tracking-[0.5em] text-cyan-400/70 mt-3 leading-none uppercase">S E N T I N E L</div>
              <div className="text-[11px] md:text-[12px] font-light tracking-[0.15em] text-slate-400/60 mt-12 leading-none uppercase">Your Sovereign Executive Intelligence</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Progress Bar */}
      <div 
        id="progress-bar" 
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-400/75 to-cyan-400/10 transition-all duration-300 pointer-events-none z-[200]" 
        style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
      />

      {/* Control Actions Panel (Skip / Mute Toggle) */}
      {showControls && (
        <>
          {/* Skip Button */}
          {progress < 100 && (
            <button 
              id="skip-btn" 
              onClick={handleSkip}
              className="absolute bottom-8 right-8 bg-transparent border border-white/5 hover:border-cyan-500/30 text-slate-400 hover:text-white text-[10px] tracking-[0.2em] px-5 py-2.5 rounded-full cursor-pointer backdrop-blur-md z-[200] font-mono transition-all duration-300"
            >
              SKIP &nbsp;→
            </button>
          )}

          {/* Audio Mute Toggle Indicator */}
          <button 
            id="mute-btn" 
            onClick={handleToggleMute}
            className={`absolute top-8 right-8 w-10 h-10 bg-transparent border border-white/5 text-slate-400 rounded-full cursor-pointer hover:opacity-100 flex items-center justify-center backdrop-blur-md z-[200] font-sans text-sm transition-all duration-300 ${
              audioEnabled ? 'border-cyan-500/20 text-cyan-400/80 opacity-75' : 'text-slate-600 opacity-40'
            }`}
          >
            {audioEnabled ? '♪' : '✕'}
          </button>
        </>
      )}
    </div>
  );
}
