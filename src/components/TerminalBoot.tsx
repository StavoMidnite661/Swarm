import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const BOOT_LINES = [
  { tag: 'BOOT', text: 'Loading Sovereign Kernel', status: 'OK' },
  { tag: 'BOOT', text: 'Mounting Agent Fabric', status: 'OK' },
  { tag: 'BOOT', text: 'Initializing Mission Engine', status: 'OK' },
  { tag: 'BOOT', text: 'Loading Organizational Memory', status: 'OK' },
  { tag: 'BOOT', text: 'Restoring Executive Workspace', status: 'OK' },
  { tag: 'BOOT', text: 'Compiling Predictive Models', status: 'OK' },
  { tag: 'SYNC', text: 'Synchronizing Sovereign Ledger', status: 'OK' },
  { tag: 'LINK', text: 'Establishing Google Workspace Tunnel', status: 'OK' },
  { tag: 'LINK', text: 'Securing Communications Channel', status: 'OK' },
  { tag: 'LINK', text: 'Loading Neural Memory Lattice', status: 'OK' },
  { tag: 'AUTH', text: 'Authenticating Founder', status: 'WAIT' },
];

export default function TerminalBoot({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<'blink' | 'os_name' | 'booting' | 'authenticated' | 'fade'>('blink');
  const [completedLines, setCompletedLines] = useState<{ tag: string, text: string, status: string, done: boolean }[]>([]);
  const audioCtx = useRef<AudioContext | null>(null);

  const playTick = () => {
    if (!audioCtx.current) return;
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    osc.frequency.value = 800;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.02, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + 0.08);
    osc.connect(gain).connect(audioCtx.current.destination);
    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.1);
  };

  useEffect(() => {
    const runSequence = async () => {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Phase 0: Blink
      await new Promise(r => setTimeout(r, 1500));
      setStage('os_name');
      
      // Phase 1: OS Name
      await new Promise(r => setTimeout(r, 2000));
      setStage('booting');
      
      // Phase 2: Boot Sequence
      for (let i = 0; i < BOOT_LINES.length; i++) {
        const item = BOOT_LINES[i];
        setCompletedLines(prev => [...prev, { ...item, done: false }]);
        await new Promise(r => setTimeout(r, i < 3 ? 250 : 500));
        
        setCompletedLines(prev => prev.map((line, idx) => 
          idx === i ? { ...line, done: true } : line
        ));
        if (!item.text.includes('Authenticating')) playTick();
      }
      
      // Phase 3: Auth
      await new Promise(r => setTimeout(r, 1200));
      setStage('authenticated');
      
      // Phase 6: Fade
      await new Promise(r => setTimeout(r, 2000));
      setStage('fade');
      await new Promise(r => setTimeout(r, 1000));
      onComplete();
    };

    runSequence();
    return () => { audioCtx.current?.close(); };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-black p-12 font-mono text-xs overflow-hidden z-[100] transition-opacity duration-1000 ${stage === 'fade' ? 'opacity-0' : 'opacity-100'}`}>
      {stage === 'blink' && (
        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="text-zinc-300">_</motion.span>
      )}
      
      {stage === 'os_name' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="text-zinc-200">
          SOVR SENTINEL EXECUTIVE OS<br/>
          v3.1.0 · Sovereign Kernel<br/><br/>
          Initializing...
        </motion.div>
      )}

      {stage === 'booting' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {completedLines.map((line, index) => (
            <div key={index} className="flex gap-4 w-full max-w-lg mb-1">
              <span className="text-zinc-600 w-16">[{line.tag}]</span>
              <span className="flex-1 text-zinc-300">{line.text}</span>
              <span className="w-16 text-right text-zinc-100">{line.done ? '[ OK ]' : <span className="animate-pulse text-zinc-100">[ WAIT ]</span>}</span>
            </div>
          ))}
          <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="text-zinc-300">_</motion.span>
        </motion.div>
      )}
      
      {stage === 'authenticated' && (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-base text-zinc-100">
           Founder authenticated.<br/>
           Welcome back, Gustavo.
         </motion.div>
      )}
    </div>
  );
}
