import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, Play, Hexagon, Globe, Network, Shield, ShieldCheck, 
  Cpu, Activity, Lock, Maximize, BarChart3, Box, Fingerprint
} from 'lucide-react';
import { ModelConfig } from '../types';

interface LandingPageProps {
  onLaunch: () => void;
  modelConfig: ModelConfig;
  setModelConfig: React.Dispatch<React.SetStateAction<ModelConfig>>;
  user: any;
  token: string | null;
  onConnectGoogle: () => Promise<void>;
  onDisconnectGoogle: () => Promise<void>;
}

const StatusCard = ({ icon: Icon, title, status, value, colorClass }: any) => (
  <div className="bg-black/30 backdrop-blur-2xl backdrop-blur-md border border-white/10 p-3 rounded flex items-center gap-3 w-[220px] shadow-2xl shadow-black/50">
    <div className="p-1.5 rounded bg-white/5 border border-white/10 flex-shrink-0">
      <Icon size={14} className={colorClass} strokeWidth={1.5} />
    </div>
    <div className="flex-1">
      <div className="text-[10px] font-sans font-light tracking-wide text-slate-400 tracking-[0.05em] uppercase mb-0.5 leading-none">{title}</div>
      <div className="text-[10px] font-sans font-light tracking-wide text-slate-300 flex items-center gap-1.5 leading-none">
        {status === 'active' && <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />}
        {status === 'sync' && <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />}
        {value}
      </div>
    </div>
  </div>
);

const Metric = ({ label, value, sub, positive, isLast }: any) => (
  <div className={`px-4 py-3 flex flex-col items-start justify-center ${!isLast ? 'border-r border-white/10' : ''}`}>
    <div className="text-[8px] text-slate-500 font-sans font-light tracking-wide tracking-[0.1em] uppercase mb-1 flex items-center gap-1.5">
      <div className="w-1 h-1 bg-white/30 rounded-sm" /> {label}
    </div>
    <div className="text-xl font-sans font-medium text-white/80 flex items-baseline gap-1.5 tracking-tight">
      {value} 
      {sub && (
        <span className={`text-[10px] font-sans font-light tracking-wide tracking-wide ${positive ? 'text-white/80' : 'text-slate-500'}`}>
          {positive && '↗ '} {sub}
        </span>
      )}
    </div>
  </div>
);

export default function LandingPage({ onLaunch, user, onConnectGoogle }: LandingPageProps) {
  const handleLaunch = async () => {
    if (!user) {
      await onConnectGoogle();
    }
    onLaunch();
  };
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
      className="absolute inset-0 z-50 h-screen w-screen overflow-hidden text-slate-300 font-sans selection:bg-white/30 flex flex-col"
    >
      {/* Background Overlay - partially transparent to show WebGL agent */}
      <div className="absolute inset-0 bg-black/20 z-0" />
      
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-black/20 backdrop-blur-md relative z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Hexagon className="text-white/70" size={24} strokeWidth={1.5} />
          <div className="flex flex-col">
            <h1 className="text-white font-sans font-semibold tracking-widest text-xs leading-none mb-1">SOVR ORACLE LEDGER</h1>
            <p className="text-slate-400 text-[10px] font-sans font-light tracking-wide tracking-[0.2em] uppercase leading-none">Executive Operating System</p>
          </div>
        </div>
        
        <nav className="hidden xl:flex items-center gap-8 text-[10px] font-sans font-light tracking-wide tracking-[0.2em] text-slate-300 uppercase">
          <a href="#" className="hover:text-white/80 transition-colors">Platform</a>
          <a href="#" className="hover:text-white/80 transition-colors">Capabilities</a>
          <a href="#" className="hover:text-white/80 transition-colors">Architecture</a>
          <a href="#" className="hover:text-white/80 transition-colors">Security</a>
          <a href="#" className="hover:text-white/80 transition-colors">Developer</a>
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={handleLaunch} className="px-4 py-2 rounded text-[10px] font-sans font-light tracking-wide tracking-[0.15em] text-white/80 border border-white/20 hover:bg-white/10 transition-colors flex items-center gap-2">
            LAUNCH CONSOLE <ArrowRight size={12} />
          </button>
          <button onClick={handleLaunch} className="px-4 py-2 rounded text-[10px] font-sans font-light tracking-wide tracking-[0.15em] text-white font-semibold bg-gradient-to-r from-white/20 to-white/10 bg-white/10 backdrop-blur-md hover:opacity-90 transition-opacity flex items-center gap-2 border border-transparent">
            REQUEST ACCESS <ArrowRight size={12} />
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative flex-1 flex flex-col justify-center z-10 px-8 py-8 min-h-0">
        <div className="max-w-[1400px] mx-auto w-full h-full relative flex items-center justify-between">
          
          {/* Left Content */}
          <div className="w-full max-w-2xl relative z-10">
            <p className="text-white/80 text-[10px] font-sans font-light tracking-wide tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
              Welcome to the future of operations
            </p>
            <h2 className="text-[48px] md:text-[64px] font-sans font-bold text-white leading-[1.05] tracking-tight mb-6">
              THE INTELLIGENCE<br />
              THAT <span className="text-white/80">RUNS YOUR</span><br />
              <span className="text-white/80">ENTIRE ORGANIZATION</span>
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed mb-8 max-w-xl font-sans font-light tracking-wide tracking-wide">
              SOVR Oracle Ledger is the world's first AI-native executive<br />
              operating system. Autonomous agents, real-time intelligence,<br />
              and verifiable execution—unified on a single source of truth.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={handleLaunch} className="px-6 py-3 rounded bg-black/20 border border-white/20 text-white/80 text-[10px] font-sans font-light tracking-wide tracking-[0.2em] hover:bg-white/10 transition-colors flex items-center gap-3 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                ENTER THE CONSOLE <ArrowRight size={14} />
              </button>
              <button className="px-6 py-3 rounded bg-black/20 border border-white/10 text-white text-[10px] font-sans font-light tracking-wide tracking-[0.2em] hover:bg-white/5 transition-colors flex items-center gap-3">
                <Play size={14} className="text-white/80" fill="currentColor" /> WATCH OVERVIEW
              </button>
            </div>
          </div>

          {/* Right Status Cards */}
          <div className="relative z-10 flex flex-col gap-2.5 self-stretch justify-center pr-4">
            <StatusCard 
              icon={Box} 
              title="AI EXECUTIVE CORE" 
              status="active" 
              value={<span className="text-slate-400">Active & Online</span>} 
              colorClass="text-white/60" 
            />
            <StatusCard 
              icon={Globe} 
              title="GLOBAL LEDGER" 
              status="sync" 
              value={<span className="text-slate-400">Synchronized</span>} 
              colorClass="text-white/80" 
            />
            <StatusCard 
              icon={Network} 
              title="AGENT NETWORK" 
              value={<><span className="text-white/80">128</span> <span className="text-slate-400">Active Agents</span></>} 
              colorClass="text-white/80" 
            />
            <StatusCard 
              icon={Shield} 
              title="TREASURY STATUS" 
              value={<><span className="text-white/80">$19.36M</span> <span className="text-slate-400">Liquid</span></>} 
              colorClass="text-white/80" 
            />
            <StatusCard 
              icon={ShieldCheck} 
              title="SYSTEM INTEGRITY" 
              value={<><span className="text-white/80">95%</span> <span className="text-slate-400">Secure</span></>} 
              colorClass="text-white/80" 
            />
          </div>
        </div>
      </main>

      {/* Metrics */}
      <section className="border-t border-white/10 bg-[#02040A]/60 backdrop-blur-md relative z-10 w-full overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: 'none' }}>
        <div className="max-w-[1400px] mx-auto min-w-[1000px] grid grid-cols-6 px-8">
          <Metric label="Total Value Secured" value="$19.36B" sub="+9.4%" positive={true} />
          <Metric label="Live Transactions" value="68" sub="Posted" />
          <Metric label="Latency" value="126ms" sub="Optimal" />
          <Metric label="Prediction Confidence" value="97%" sub="High" />
          <Metric label="Uptime" value="99.99%" sub="All Systems" />
          <Metric label="Global Nodes" value="24" sub="Online" isLast={true} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-5 relative z-10 bg-[#010308]/80 backdrop-blur-md flex-shrink-0">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-8">
            <div className="text-[10px] font-sans font-light tracking-wide text-slate-500 tracking-[0.2em] uppercase leading-snug w-20">
              Trusted by Visionaries
            </div>
            <div className="flex items-center gap-6 opacity-60">
              <div className="flex items-center gap-1.5 text-slate-300 font-sans font-bold tracking-widest text-[11px]">
                <Box size={14} /> SOVR
              </div>
              <div className="flex items-center gap-1.5 text-slate-300 font-sans font-bold tracking-widest text-[11px]">
                <Globe size={14} /> ORACLE
              </div>
              <div className="flex items-center gap-1.5 text-slate-300 font-sans font-bold tracking-widest text-[11px]">
                LEDGER
              </div>
              <div className="flex items-center gap-1.5 text-slate-300 font-sans font-bold tracking-widest text-[11px]">
                <Fingerprint size={14} /> TRUST
              </div>
              <div className="flex items-center gap-1.5 text-slate-300 font-sans font-bold tracking-widest text-[11px]">
                <Hexagon size={14} /> VERITY
              </div>
              <div className="flex items-center gap-1.5 text-slate-300 font-sans font-bold tracking-widest text-[11px]">
                <Cpu size={14} /> QUANTUM
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-sans font-light tracking-wide text-white/70 tracking-[0.1em] mb-1 uppercase">
                Secure. Verifiable. Intelligent.
              </div>
              <div className="text-[10px] font-sans font-light tracking-wide text-slate-500 tracking-wide">
                SOVR Oracle Ledger - The new standard for organizational intelligence.
              </div>
            </div>
            <Hexagon className="text-white/10" size={32} strokeWidth={1} />
          </div>

        </div>
      </footer>
    </motion.div>
  );
}

