import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, Edit2, Save, X, AlertTriangle, CheckCircle, Sparkles, 
  Play, Pause, Activity, Database, Plus, RefreshCw, Power, 
  Terminal, ShieldAlert, Volume2, Compass, Layers, Info, Eye, EyeOff,
  Briefcase, Users, Cpu, Coins, TrendingUp, ShieldCheck, Scale, 
  MessageSquare, Clock, ArrowUpRight, CheckSquare, FileText, Bell, 
  ChevronRight, History, UserCheck, MapPin, TrendingDown,
  Hexagon, Box, Target, Atom, Landmark
} from 'lucide-react';
import CentralPanel from './CentralPanel';
import RightPanel from './RightPanel';
import { CommandCenterProps } from './CommandCenterProps';

export default function CommandCenter({
  speed, setSpeed,
  zoom, setZoom,
  singularity, setSingularity,
  resonance, setResonance,
  density, setDensity,
  proximity, setProximity,
  wind, setWind,
  colorMode, setColorMode,
  pulseFreq, setPulseFreq,
  
  activeRoom, setActiveRoom,
  timeQuarter, setTimeQuarter,

  messages, chatInput, setChatInput, handleSendMessage,
  isAgentConnected, isAgentConnecting, connectAgent, disconnectAgent,
  isAgentDormant, setIsAgentDormant,
  modelConfig, setModelConfig,

  sovrState,
  operationalAnswers,
  createMission,
  toggleTaskDone,
  addMemoryFact,
  deleteMemoryFact,
  toggleDamping,
  resolveApproval,
  reallocateCompute,
  
  yaw, pitch,
  currentTime,
  setShowSettings
}: CommandCenterProps) {

  // Right column active sub-tab for information streams
  const [rightTab, setRightTab] = useState<'comms' | 'calendar' | 'email' | 'contacts' | 'timeline' | 'memory' | 'approvals' | 'config'>('comms');
  
  // Mobile active layout column
  const [mobileTab, setMobileTab] = useState<'nodes' | 'central' | 'right'>('central');
  
  // Local state for adding custom mission form
  const [showAddMission, setShowAddMission] = useState(false);
  const [newMissionName, setNewMissionName] = useState('');
  const [newMissionDept, setNewMissionDept] = useState('Engineering');
  const [newMissionMilestone, setNewMissionMilestone] = useState('');

  // Local state for temporary notification alert toasts
  const [notification, setNotification] = useState<string | null>(null);

  // Situation Room live debate parameters
  const [debateScenario, setDebateScenario] = useState('Acquire our primary Web3 routing layer competitor Titan Corp');
  const [isDebating, setIsDebating] = useState(false);
  const [debateStep, setDebateStep] = useState(0);
  const [debateLogs, setDebateLogs] = useState<{ sender: string; role: string; text: string; time: string; avatar: string }[]>([]);
  const [debateResult, setDebateResult] = useState<{ risk: number; readiness: number; impact: number; summary: string } | null>(null);

  // Triggering visual/audio alerts
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Dynamically compute quarterly metrics directly from the live SOVR core database
  const totalDebits = sovrState.ledger.filter(l => l.type === 'DEBIT').reduce((acc, l) => acc + l.amountUsd, 0);
  const totalCredits = sovrState.ledger.filter(l => l.type === 'CREDIT').reduce((acc, l) => acc + l.amountUsd, 0);
  const treasuryBalance = totalCredits - totalDebits;

  const quarterMetrics = {
    health: sovrState.complianceScore,
    growth: sovrState.emergencyDampingActive ? 'STABLE' : '+18.4% SURGE',
    revenue: `$${(treasuryBalance / 1000000).toFixed(2)}M`,
    confidence: sovrState.emergencyDampingActive ? '80%' : '98.5%'
  };

  // Watch for Room transitions to modulate WebGL shaders
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    
    // Log transition into Sovereign room
    sovrState.events.unshift({
      id: 'transition-' + Math.random().toString(36).substring(2, 9),
      timestamp,
      type: 'INFO',
      sourceCore: 'CORE_01',
      message: `Sovereign View shifted to: ${activeRoom.toUpperCase()}`,
      details: `Reconfigured spatial visualization constraints.`
    });

    switch (activeRoom) {
      case 'hq':
        setSpeed(0.2);
        setPulseFreq(5.0);
        setColorMode('cyan');
        setResonance(0.1);
        setSingularity(0.0);
        setProximity(-1.8);
        setWind(1.0);
        break;
      case 'operations':
        setSpeed(0.4);
        setPulseFreq(7.0);
        setColorMode('lime');
        setResonance(0.2);
        setSingularity(0.1);
        setProximity(-1.4);
        setWind(1.8);
        break;
      case 'engineering':
        setSpeed(0.6);
        setPulseFreq(9.5);
        setColorMode('purple');
        setResonance(0.35);
        setSingularity(0.15);
        setProximity(-1.2);
        setWind(2.2);
        break;
      case 'finance':
        setSpeed(0.15);
        setPulseFreq(3.0);
        setColorMode('orange');
        setResonance(0.05);
        setSingularity(0.0);
        setProximity(-2.0);
        setWind(0.8);
        break;
      case 'marketing':
        setSpeed(0.35);
        setPulseFreq(6.0);
        setColorMode('orange');
        setResonance(0.15);
        setSingularity(0.0);
        setProximity(-1.5);
        setWind(1.5);
        break;
      case 'research':
        setSpeed(0.1);
        setPulseFreq(2.0);
        setColorMode('cyan');
        setResonance(0.5);
        setSingularity(0.3);
        setProximity(-2.3);
        setWind(0.4);
        break;
      case 'legal':
        setSpeed(0.05);
        setPulseFreq(1.0);
        setColorMode('cyan');
        setResonance(0.0);
        setSingularity(0.0);
        setProximity(-1.7);
        setWind(0.5);
        break;
      case 'situation':
        setSpeed(0.65);
        setPulseFreq(12.0);
        setColorMode('purple');
        setResonance(0.6);
        setSingularity(0.25);
        setProximity(-1.1);
        setWind(3.0);
        break;
    }
  }, [activeRoom]);

  // Launch simulated Situation Room Debates
  const runSimulationDebate = () => {
    if (!debateScenario.trim()) return;
    setIsDebating(true);
    setDebateStep(1);
    setDebateLogs([]);
    setDebateResult(null);

    setSpeed(1.2);
    setPulseFreq(16.0);
    setResonance(0.85);

    const timestamp = new Date().toLocaleTimeString();
    sovrState.events.unshift({
      id: 'd-' + Math.random().toString(36).substring(2, 9),
      timestamp,
      type: 'AUDIT',
      sourceCore: 'CORE_01',
      message: `DEBATE INITIATED: "${debateScenario}"`,
      details: `Spinning up multi-agent forecasting kernels.`
    });
  };

  // Run subsequent steps of multi-agent debate simulation
  useEffect(() => {
    if (!isDebating || debateStep === 0) return;

    const debateMessages = [
      {
        sender: 'CFO Ledger',
        role: 'Chief Financial Officer',
        avatar: 'FI',
        text: `Financing Review: Moving forward with "${debateScenario}" incurs direct treasury sharding. I estimate a capital outlay of 1.4M USDC. Net yield impact stands at -12% short-term, but forecast an asset appreciation of 3.1x over 18 months if liquidity pools hold stable. High-level recommendation: Proceed, but establish an Arbitrum-backed hedge reservoir.`
      },
      {
        sender: 'CTO Spark',
        role: 'Chief Technology Officer',
        avatar: 'EN',
        text: `Technical Review: Infrastructure-wise, syncing Web3 routing nodes for "${debateScenario}" requires refactoring 14 discrete smart contract interfaces. Standard Kubernetes clusters can ingest the traffic within 180 seconds of proxy realignment. Deploying 8 extra Switzerland servers mitigates latency peaks. Net readiness is high, but we require a strict QA audit gate.`
      },
      {
        sender: 'Legal Guard',
        role: 'General Counsel & Compliance',
        avatar: 'LE',
        text: `Compliance Warning: Executing "${debateScenario}" triggers localized entity and tax disclosures. Recommendation: Structure this as an intellectual property licensing agreement via our Swiss foundation. That mitigates audit hazards and bypasses immediate regulatory escrow constraints entirely.`
      },
      {
        sender: 'COO Flow',
        role: 'Chief Operations Officer',
        avatar: 'OP',
        text: `Operations Summary: Integrating "${debateScenario}" into active pipelines increases administrative bandwidth by 14%. By automating communication routes through our Sentinel API, we reduce founder overhead to near-zero. I recommend a 3-step staggered rollout over 14 days, with immediate teardown of redundant campaign networks.`
      }
    ];

    if (debateStep <= debateMessages.length) {
      const timer = setTimeout(() => {
        const msg = debateMessages[debateStep - 1];
        setDebateLogs(prev => [...prev, { ...msg, time: new Date().toLocaleTimeString() }]);
        setDebateStep(prev => prev + 1);
        
        setResonance(Math.random() * 0.4 + 0.5);
        setSingularity(Math.random() * 0.3 + 0.1);
      }, 3500);
      return () => clearTimeout(timer);
    } else if (debateStep === debateMessages.length + 1) {
      const timer = setTimeout(() => {
        setDebateResult({
          risk: 42,
          readiness: 88,
          impact: 91,
          summary: `The autonomous executive board recommends a structured implementation of "${debateScenario}". By routing contract assets via our Swiss Foundation, we minimize exposure to 42% risk. Operations and engineering frameworks stand fully prepared to execute the deployment sequence immediately.`
        });
        setIsDebating(false);
        setDebateStep(0);
        
        setSpeed(0.2);
        setPulseFreq(5.0);
        setResonance(0.15);

        const timestamp = new Date().toLocaleTimeString();
        sovrState.events.unshift({
          id: 'de-' + Math.random().toString(36).substring(2, 9),
          timestamp,
          type: 'SUCCESS',
          sourceCore: 'CORE_01',
          message: `DEBATE EVALUATION COMPLETE: Merged recommendation compiled.`,
          details: `Rating: 91/100 Net Strategic Impact.`
        });
        showToast("Executive Debate Compiled successfully.");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isDebating, debateStep]);

  const panelProps = {
    speed, setSpeed, zoom, setZoom, singularity, setSingularity,
    resonance, setResonance, density, setDensity, proximity, setProximity,
    wind, setWind, colorMode, setColorMode, pulseFreq, setPulseFreq,
    activeRoom, setActiveRoom, timeQuarter, setTimeQuarter,
    messages, chatInput, setChatInput, handleSendMessage,
    isAgentConnected, isAgentConnecting, connectAgent, disconnectAgent,
    isAgentDormant, setIsAgentDormant, modelConfig, setModelConfig,
    sovrState, operationalAnswers, createMission, toggleTaskDone,
    addMemoryFact, deleteMemoryFact, toggleDamping, resolveApproval, reallocateCompute,
    yaw, pitch,
    rightTab, setRightTab, showAddMission, setShowAddMission,
    newMissionName, setNewMissionName, newMissionDept, setNewMissionDept,
    newMissionMilestone, setNewMissionMilestone, notification, setNotification,
    debateScenario, setDebateScenario, isDebating, setIsDebating,
    debateStep, setDebateStep, debateLogs, setDebateLogs, debateResult, setDebateResult,
    showToast, runSimulationDebate,
    currentTime, setShowSettings,
    mobileTab, setMobileTab
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col pt-16 pb-4 px-4 md:px-6 select-none overflow-hidden text-white">
      
      {/* Dynamic Toast Alert Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-[99] bg-white/[0.05] backdrop-blur-3xl border border-white/[0.08] text-white/90 font-sans font-light text-xs tracking-wide uppercase tracking-[0.2em] px-5 py-2.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-white/90 animate-spin" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Grid Tab Selector */}
      <div className="lg:hidden flex gap-1.5 p-1 bg-white/[0.02] backdrop-blur-3xl border border-white/[0.06] rounded-xl mb-3 shrink-0" id="mobile-tab-selector">
        {[
          { id: 'nodes', label: 'Nodes', icon: Hexagon },
          { id: 'central', label: 'Operations Desk', icon: Cpu },
          { id: 'right', label: 'Comms & Ledger', icon: Terminal }
        ].map((tab) => {
          const isActive = mobileTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setMobileTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[9px] font-sans font-semibold uppercase tracking-widest border transition-all ${
                isActive 
                  ? 'bg-white/[0.08] text-white border-white/[0.15] shadow-[0_2px_8px_rgba(0,0,0,0.2)]' 
                  : 'text-white/40 border-transparent hover:text-white/70'
              }`}
            >
              <Icon size={11} className={isActive ? 'text-cyan-400' : 'text-white/40'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Glass HUD Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden relative">
        
        {/* ROOMS NAVIGATION BAR - Floating Spatial Left Panel */}
        <div className={`lg:col-span-2 flex-col gap-3 h-full overflow-hidden ${mobileTab === 'nodes' ? 'flex' : 'hidden lg:flex'}`} id="rooms-left-panel">
          
          {/* Top-Left Clock & Sovereign Metadata Card */}
          <div className="glass-primary marble-reflection p-4 rounded-[16px] flex flex-col gap-3.5 shrink-0 relative overflow-hidden">
            <div className="absolute inset-x-0 h-[1px] bg-white/[0.08] top-0" />
            
            <div className="flex justify-between items-baseline border-b border-white/[0.04] pb-2.5">
              <span className="text-3xl font-sans font-light tracking-tight text-white/95 tabular-data">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </span>
              <span className="text-[9px] font-sans text-white/45 tracking-widest uppercase font-medium">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="space-y-2.5 font-sans text-[10px]">
              <div className="flex justify-between items-center">
                <span className="text-white/40 uppercase tracking-widest font-light">EIOS Core</span>
                <span className="text-emerald-400 font-medium tracking-wider">99.8% ONLINE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 uppercase tracking-widest font-light">Treasury</span>
                <span className="text-white/85 font-medium tracking-wide tabular-data">$19.36M liquid</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 uppercase tracking-widest font-light">Confidence</span>
                <span className="text-white/85 font-medium tracking-wide tabular-data">97.2%</span>
              </div>
            </div>
          </div>

          {/* Rooms List - Single click transitions entire environment */}
          <div className="flex-1 glass-secondary marble-reflection p-3 rounded-[16px] flex flex-col gap-2 overflow-y-auto relative">
            <div className="absolute inset-x-0 h-[1px] bg-white/[0.06] top-0" />
            <span className="text-[9px] font-sans font-semibold tracking-[0.2em] text-white/40 uppercase px-2 pb-2 block border-b border-white/[0.04] shrink-0">
              Sovereign Nodes
            </span>

            <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-0.5">
              {[
                { id: 'hq', label: 'Executive HQ', desc: 'Sovereign Missions', icon: Hexagon },
                { id: 'operations', label: 'Operations & HR', desc: 'AI Staff Agents', icon: Users },
                { id: 'engineering', label: 'Engineering Node', desc: 'QA & Security scans', icon: Box },
                { id: 'finance', label: 'Treasury & CFO', desc: 'Ledger allocations', icon: Coins },
                { id: 'marketing', label: 'Marketing Hub', desc: 'Pipeline & Brand', icon: Target },
                { id: 'research', label: 'Research Node', desc: 'Knowledge sync', icon: Atom },
                { id: 'legal', label: 'Compliance Gate', desc: 'One-click damping', icon: ShieldCheck },
                { id: 'situation', label: 'Board Council', desc: 'Strategic alignments', icon: Landmark },
              ].map((room) => {
                const isSelected = activeRoom === room.id;
                const Icon = room.icon;
                return (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoom(room.id as any)}
                    className={`w-full text-left p-2.5 rounded-[12px] border transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${
                      isSelected 
                        ? 'bg-white/[0.05] border-cyan-500/25 text-white shadow-[0_4px_20px_rgba(6,182,212,0.12)] ring-1 ring-cyan-500/10'
                        : 'bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/[0.04] text-white/50'
                    }`}
                  >
                    {/* Marble background hint layer */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
                    
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg border flex-shrink-0 transition-colors ${
                        isSelected 
                          ? 'bg-cyan-500/10 border-cyan-500/30' 
                          : 'bg-transparent border-transparent group-hover:bg-white/5 group-hover:border-white/10'
                      }`}>
                        <Icon size={14} className={isSelected ? 'text-cyan-400' : 'text-white/40 group-hover:text-white/70'} />
                      </div>
                      <div className="flex flex-col gap-0.5 leading-tight">
                        <span className={`text-[10px] font-sans font-medium tracking-[0.05em] uppercase transition-colors ${
                          isSelected ? 'text-white font-semibold' : 'group-hover:text-white/80'
                        }`}>
                          {room.label}
                        </span>
                        <span className="text-[9px] font-sans font-normal text-white/40 group-hover:text-white/50 truncate max-w-[110px]">
                          {room.desc}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={12} strokeWidth={2.5} className={`flex-shrink-0 transition-transform duration-300 ${
                      isSelected ? 'transform translate-x-1 text-cyan-400/80' : 'opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <CentralPanel {...panelProps} />

        <RightPanel {...panelProps} />

      </div>
    </div>
  );
}
