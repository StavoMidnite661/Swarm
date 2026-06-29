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
}

const StatusCard = ({ icon: Icon, title, status, value, colorClass }: any) => (
  <div className="bg-[#03060D]/80 backdrop-blur-md border border-cyan-900/40 p-3 rounded flex items-center gap-3 w-[220px] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
    <div className="p-1.5 rounded bg-[#020408] border border-cyan-900/50 flex-shrink-0">
      <Icon size={14} className={colorClass} strokeWidth={1.5} />
    </div>
    <div className="flex-1">
      <div className="text-[9px] font-mono text-slate-400 tracking-[0.05em] uppercase mb-0.5 leading-none">{title}</div>
      <div className="text-[9px] font-mono text-slate-300 flex items-center gap-1.5 leading-none">
        {status === 'active' && <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />}
        {status === 'sync' && <div className="w-1 h-1 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
        {value}
      </div>
    </div>
  </div>
);

const Metric = ({ label, value, sub, positive, isLast }: any) => (
  <div className={`px-4 py-3 flex flex-col items-start justify-center ${!isLast ? 'border-r border-cyan-900/30' : ''}`}>
    <div className="text-[8px] text-slate-500 font-mono tracking-[0.1em] uppercase mb-1 flex items-center gap-1.5">
      <div className="w-1 h-1 bg-cyan-500/50 rounded-sm" /> {label}
    </div>
    <div className="text-xl font-sans font-medium text-cyan-400 flex items-baseline gap-1.5 tracking-tight">
      {value} 
      {sub && (
        <span className={`text-[9px] font-mono tracking-wide ${positive ? 'text-green-500' : 'text-slate-500'}`}>
          {positive && '↗ '} {sub}
        </span>
      )}
    </div>
  </div>
);

export default function LandingPage({ onLaunch }: LandingPageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
      className="absolute inset-0 z-50 h-screen w-screen overflow-hidden text-slate-300 font-sans selection:bg-cyan-500/30 flex flex-col"
    >
      {/* Background Overlay - partially transparent to show WebGL agent */}
      <div className="absolute inset-0 bg-[#02050A]/70 z-0" />
      
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-cyan-900/30 bg-[#02050A]/50 backdrop-blur-md relative z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Hexagon className="text-cyan-500" size={24} strokeWidth={1.5} />
          <div className="flex flex-col">
            <h1 className="text-white font-sans font-semibold tracking-widest text-xs leading-none mb-1">SOVR ORACLE LEDGER</h1>
            <p className="text-slate-400 text-[8px] font-mono tracking-[0.2em] uppercase leading-none">Executive Operating System</p>
          </div>
        </div>
        
        <nav className="hidden xl:flex items-center gap-8 text-[9px] font-mono tracking-[0.2em] text-slate-300 uppercase">
          <a href="#" className="hover:text-cyan-400 transition-colors">Platform</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Capabilities</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Architecture</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Security</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Developer</a>
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={onLaunch} className="px-4 py-2 rounded text-[9px] font-mono tracking-[0.15em] text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/10 transition-colors flex items-center gap-2">
            LAUNCH CONSOLE <ArrowRight size={12} />
          </button>
          <button onClick={onLaunch} className="px-4 py-2 rounded text-[9px] font-mono tracking-[0.15em] text-white font-semibold bg-gradient-to-r from-cyan-500 via-orange-400 to-orange-500 hover:opacity-90 transition-opacity flex items-center gap-2 border border-transparent">
            REQUEST ACCESS <ArrowRight size={12} />
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative flex-1 flex flex-col justify-center z-10 px-8 py-8 min-h-0">
        <div className="max-w-[1400px] mx-auto w-full h-full relative flex items-center justify-between">
          
          {/* Left Content */}
          <div className="w-full max-w-2xl relative z-10">
            <p className="text-cyan-400 text-[9px] font-mono tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
              Welcome to the future of operations
            </p>
            <h2 className="text-[48px] md:text-[64px] font-sans font-bold text-white leading-[1.05] tracking-tight mb-6">
              THE INTELLIGENCE<br />
              THAT <span className="text-cyan-400">RUNS YOUR</span><br />
              <span className="text-cyan-400">ENTIRE ORGANIZATION</span>
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed mb-8 max-w-xl font-mono tracking-wide">
              SOVR Oracle Ledger is the world's first AI-native executive<br />
              operating system. Autonomous agents, real-time intelligence,<br />
              and verifiable execution—unified on a single source of truth.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={onLaunch} className="px-6 py-3 rounded bg-[#02050A]/50 border border-cyan-500/40 text-cyan-400 text-[10px] font-mono tracking-[0.2em] hover:bg-cyan-500/10 transition-colors flex items-center gap-3 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                ENTER THE CONSOLE <ArrowRight size={14} />
              </button>
              <button className="px-6 py-3 rounded bg-[#02050A]/50 border border-white/10 text-white text-[10px] font-mono tracking-[0.2em] hover:bg-white/5 transition-colors flex items-center gap-3">
                <Play size={14} className="text-cyan-400" fill="currentColor" /> WATCH OVERVIEW
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
              colorClass="text-purple-400" 
            />
            <StatusCard 
              icon={Globe} 
              title="GLOBAL LEDGER" 
              status="sync" 
              value={<span className="text-slate-400">Synchronized</span>} 
              colorClass="text-cyan-400" 
            />
            <StatusCard 
              icon={Network} 
              title="AGENT NETWORK" 
              value={<><span className="text-cyan-400">128</span> <span className="text-slate-400">Active Agents</span></>} 
              colorClass="text-cyan-400" 
            />
            <StatusCard 
              icon={Shield} 
              title="TREASURY STATUS" 
              value={<><span className="text-cyan-400">$19.36M</span> <span className="text-slate-400">Liquid</span></>} 
              colorClass="text-cyan-400" 
            />
            <StatusCard 
              icon={ShieldCheck} 
              title="SYSTEM INTEGRITY" 
              value={<><span className="text-cyan-400">95%</span> <span className="text-slate-400">Secure</span></>} 
              colorClass="text-green-500" 
            />
          </div>
        </div>
      </main>

      {/* Metrics */}
      <section className="border-t border-cyan-900/30 bg-[#02040A]/60 backdrop-blur-md relative z-10 w-full overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: 'none' }}>
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
      <footer className="border-t border-cyan-900/30 px-8 py-5 relative z-10 bg-[#010308]/80 backdrop-blur-md flex-shrink-0">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-8">
            <div className="text-[9px] font-mono text-slate-500 tracking-[0.2em] uppercase leading-snug w-20">
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
              <div className="text-[9px] font-mono text-cyan-500 tracking-[0.1em] mb-1 uppercase">
                Secure. Verifiable. Intelligent.
              </div>
              <div className="text-[8px] font-mono text-slate-500 tracking-wide">
                SOVR Oracle Ledger - The new standard for organizational intelligence.
              </div>
            </div>
            <Hexagon className="text-cyan-900" size={32} strokeWidth={1} />
          </div>

        </div>
      </footer>
    </motion.div>
  );
}

