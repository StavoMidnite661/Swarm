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
  setShowSettings,
  token
}: CommandCenterProps) {

  // Right column active sub-tab for information streams
  const [rightTab, setRightTab] = useState<'comms' | 'calendar' | 'email' | 'contacts' | 'timeline' | 'memory' | 'approvals' | 'config'>('comms');
  
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
    token
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

      {/* Main Glass HUD Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden relative">
        
        {/* ROOMS NAVIGATION BAR - Floating Spatial Left Panel */}
        <div className="lg:col-span-2 flex flex-col gap-3 h-full overflow-hidden">
          
          {/* Company Global Health Index - Bloomberg Style */}
          <div className="bg-gradient-to-br from-[#121212] to-[#050505] backdrop-blur-[40px] border border-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.6)] rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden shrink-0">
            {/* Ambient Subsurface Glow */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-accent-violet opacity-5 blur-[50px]" />
            
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-sans font-medium tracking-[0.2em] text-white/30 uppercase">System Time</span>
              <span className="text-white/70 font-sans font-light tracking-wide">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="text-[9px] font-sans text-white/30">{currentTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>

            <div className="flex items-baseline gap-2 pt-2 border-t border-white/[0.03]">
              <span className="text-2xl font-sans font-light text-white tabular-data">{quarterMetrics.health}%</span>
              <span className="text-white/30 font-sans font-light text-[10px] tracking-wide tabular-data">
                {quarterMetrics.growth}
              </span>
            </div>

            {/* Sparkline */}
            <div className="h-6 w-full opacity-30">
              <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient-spark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path 
                  d={timeQuarter === '2025-q4' ? 'M0,15 L25,12 L50,14 L75,18 L100,16' : 
                     timeQuarter === '2026-q1' ? 'M0,15 L25,10 L50,12 L75,8 L100,9' :
                     timeQuarter === '2026-q2' ? 'M0,15 L25,10 L50,8 L75,5 L100,6' :
                     'M0,18 L20,15 L40,11 L60,8 L80,3 L100,2'} 
                  fill="none" 
                  stroke="#8b5cf6" 
                  strokeWidth="1" 
                  strokeLinecap="round" 
                />
                <path 
                  d={timeQuarter === '2025-q4' ? 'M0,15 L25,12 L50,14 L75,18 L100,16 L100,20 L0,20 Z' : 
                     timeQuarter === '2026-q1' ? 'M0,15 L25,10 L50,12 L75,8 L100,9 L100,20 L0,20 Z' :
                     timeQuarter === '2026-q2' ? 'M0,15 L25,10 L50,8 L75,5 L100,6 L100,20 L0,20 Z' :
                     'M0,18 L20,15 L40,11 L60,8 L80,3 L100,2 L100,20 L0,20 Z'} 
                  fill="url(#gradient-spark)" 
                />
              </svg>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2 border-t border-white/[0.03] text-[9px] font-sans font-medium tracking-[0.2em] text-white/30 uppercase">
              <div>
                <span className="block opacity-50">Treasury</span>
                <span className="text-white/70 font-light tabular-data text-xs">{quarterMetrics.revenue}</span>
              </div>
              <div>
                <span className="block opacity-50">Confidence</span>
                <span className="text-white/70 font-light tabular-data text-xs">{quarterMetrics.confidence}</span>
              </div>
            </div>
          </div>

          {/* Rooms List - Single click transitions entire environment */}
          <div className="flex-1 bg-gradient-to-br from-[#121212] to-[#050505] backdrop-blur-[40px] border border-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.6)] rounded-2xl p-2 flex flex-col gap-1 overflow-y-auto">
            <span className="text-[9px] font-sans font-medium tracking-[0.2em] text-white/30 uppercase px-3 py-3 mb-1">
              Control
            </span>

            {[
              { id: 'hq', label: 'Executive Command', icon: Hexagon },
              { id: 'operations', label: 'Operations & HR', icon: Users },
              { id: 'engineering', label: 'Engineering Node', icon: Box },
              { id: 'finance', label: 'Treasury & CFO', icon: Coins },
              { id: 'marketing', label: 'Marketing & Brand', icon: Target },
              { id: 'research', label: 'Research & Intel', icon: Atom },
              { id: 'legal', label: 'Legal & Risk Gate', icon: ShieldCheck },
              { id: 'situation', label: 'Board Alignments', icon: Landmark },
            ].map((room) => {
              const isSelected = activeRoom === room.id;
              const Icon = room.icon;
              return (
                <button
                  key={room.id}
                  onClick={() => setActiveRoom(room.id as any)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-300 flex items-center gap-4 group ${
                    isSelected 
                      ? 'bg-white/[0.08] border-white/[0.15] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.3)]'
                      : 'bg-transparent border-transparent hover:bg-white/[0.03] hover:border-white/[0.04] text-white/40'
                  }`}
                >
                  <div className={`p-2 rounded-lg border transition-colors ${isSelected ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent group-hover:bg-white/5 group-hover:border-white/10'}`}>
                    <Icon size={16} className={isSelected ? 'text-accent-cyan' : 'text-white/30 group-hover:text-white/60'} />
                  </div>
                  <span className={`text-[11px] font-sans font-medium tracking-[0.1em] uppercase transition-colors ${
                    isSelected ? 'text-white' : 'group-hover:text-white/70'
                  }`}>
                    {room.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <CentralPanel {...panelProps} />

        <RightPanel {...panelProps} />

      </div>
    </div>
  );
}
