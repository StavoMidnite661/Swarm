import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, Edit2, Save, X, AlertTriangle, CheckCircle, Sparkles, 
  Play, Pause, Activity, Database, Plus, RefreshCw, Power, 
  Terminal, ShieldAlert, Volume2, Compass, Layers, Info, Eye, EyeOff,
  Briefcase, Users, Cpu, Coins, TrendingUp, ShieldCheck, Scale, 
  MessageSquare, Clock, ArrowUpRight, CheckSquare, FileText, Bell, 
  ChevronRight, History, UserCheck, MapPin, TrendingDown
} from 'lucide-react';
import { ChatMessage, Mission, ApprovalItem, OperationalLog, ExecutiveAgent } from '../types';

interface CommandCenterProps {
  speed: number;
  setSpeed: (v: number) => void;
  zoom: number;
  setZoom: (v: number) => void;
  singularity: number;
  setSingularity: (v: number) => void;
  resonance: number;
  setResonance: (v: number) => void;
  density: number;
  setDensity: (v: number) => void;
  proximity: number;
  setProximity: (v: number) => void;
  wind: number;
  setWind: (v: number) => void;
  colorMode: string;
  setColorMode: (v: string) => void;
  pulseFreq: number;
  setPulseFreq: (v: number) => void;
  
  activeRoom: 'hq' | 'operations' | 'engineering' | 'finance' | 'marketing' | 'research' | 'legal' | 'situation';
  setActiveRoom: (v: 'hq' | 'operations' | 'engineering' | 'finance' | 'marketing' | 'research' | 'legal' | 'situation') => void;
  timeQuarter: '2025-q4' | '2026-q1' | '2026-q2' | '2026-q3' | '2026-q4';
  setTimeQuarter: (v: '2025-q4' | '2026-q1' | '2026-q2' | '2026-q3' | '2026-q4') => void;

  messages: ChatMessage[];
  chatInput: string;
  setChatInput: (v: string) => void;
  handleSendMessage: () => void;
  isAgentConnected: boolean;
  isAgentConnecting: boolean;
  connectAgent: () => void;
  disconnectAgent: () => void;
  isAgentDormant: boolean;
  setIsAgentDormant: (v: boolean) => void;

  memories: { id: string; fact: string }[];
  manualMemoryInput: string;
  setManualMemoryInput: (v: string) => void;
  addMemory: (fact: string) => void;
  deleteMemory: (id: string) => void;
  updateMemory: (id: string, text: string) => void;
  editingMemoryId: string | null;
  setEditingMemoryId: (id: string | null) => void;
  editingMemoryValue: string;
  setEditingMemoryValue: (text: string) => void;
  
  yaw: number;
  pitch: number;

  logs: OperationalLog[];
  setLogs: React.Dispatch<React.SetStateAction<OperationalLog[]>>;
  approvals: ApprovalItem[];
  setApprovals: React.Dispatch<React.SetStateAction<ApprovalItem[]>>;
  missions: Mission[];
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>;
}

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

  memories, manualMemoryInput, setManualMemoryInput, addMemory, deleteMemory, updateMemory,
  editingMemoryId, setEditingMemoryId, editingMemoryValue, setEditingMemoryValue,
  
  yaw, pitch,
  logs, setLogs,
  approvals, setApprovals,
  missions, setMissions
}: CommandCenterProps) {

  // Right column active sub-tab for information streams
  const [rightTab, setRightTab] = useState<'comms' | 'timeline' | 'memory' | 'approvals'>('comms');
  
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

  // EIOS Autonomous Executive Agents
  const executiveAgents: ExecutiveAgent[] = [
    {
      name: 'COO Flow',
      role: 'Chief Operations Officer',
      department: 'Operations',
      capabilities: ['Process Optimization', 'SLA Orchestration', 'Transient Agent Spawning', 'Resource Sharding'],
      workload: timeQuarter === '2025-q4' ? 25 : timeQuarter === '2026-q1' ? 38 : timeQuarter === '2026-q4' ? 88 : 42,
      trustScore: 99.8,
      cost: 0.12,
      status: 'MONITORING_PIPELINES',
      avatar: '❖',
      contextWindow: '128k tokens',
      experience: 'L5 Autonomous Executive'
    },
    {
      name: 'CTO Spark',
      role: 'Chief Technology Officer',
      department: 'Engineering',
      capabilities: ['GPU Vector Pipelines', 'Spanner Sharding', 'QA Continuous Synthesizing', 'Smart-Contract Verification'],
      workload: timeQuarter === '2025-q4' ? 45 : timeQuarter === '2026-q1' ? 55 : timeQuarter === '2026-q4' ? 95 : 68,
      trustScore: 98.4,
      cost: 0.18,
      status: 'OPTIMIZING_SHADERS',
      avatar: '⚡',
      contextWindow: '1M tokens',
      experience: 'L6 Core Compiler'
    },
    {
      name: 'CFO Ledger',
      role: 'Chief Financial Officer',
      department: 'Finance',
      capabilities: ['Liquidity Balancing', 'Gas Price Hedging', 'Treasury Forecasting', 'Automated Micro-Auditing'],
      workload: timeQuarter === '2025-q4' ? 10 : timeQuarter === '2026-q2' ? 12 : timeQuarter === '2026-q4' ? 65 : 15,
      trustScore: 99.9,
      cost: 0.15,
      status: 'HEDGING_RESERVES',
      avatar: '⚖',
      contextWindow: '256k tokens',
      experience: 'L5 Risk Accountant'
    },
    {
      name: 'CMO Campaign',
      role: 'Chief Marketing Officer',
      department: 'Marketing',
      capabilities: ['Social Reach Optimization', 'Semantic Brand Generation', 'CTR Attribution Models'],
      workload: timeQuarter === '2025-q4' ? 35 : timeQuarter === '2026-q1' ? 40 : timeQuarter === '2026-q4' ? 70 : 55,
      trustScore: 94.2,
      cost: 0.10,
      status: 'AGGREGATING_STATS',
      avatar: '✦',
      contextWindow: '64k tokens',
      experience: 'L4 Growth Optimizer'
    },
    {
      name: 'Legal Guard',
      role: 'General Counsel & Compliance',
      department: 'Legal',
      capabilities: ['SEC Rules Compliance', 'Smart Contract Hazard Scanning', 'Entity Structuring'],
      workload: timeQuarter === '2025-q4' ? 50 : timeQuarter === '2026-q1' ? 30 : timeQuarter === '2026-q4' ? 85 : 40,
      trustScore: 100.0,
      cost: 0.20,
      status: 'GUARDING_COMPLIANCE',
      avatar: '🛡',
      contextWindow: '512k tokens',
      experience: 'L6 Compliance Kernel'
    }
  ];

  // Map quarterly configurations to change the metrics
  const getQuarterMetrics = () => {
    switch (timeQuarter) {
      case '2025-q4':
        return { health: 81, activeMissions: 1, revenue: '$1.2M', growth: '+15%', confidence: '84%', risk: 'MODERATE' };
      case '2026-q1':
        return { health: 86, activeMissions: 2, revenue: '$2.4M', growth: '+38%', confidence: '89%', risk: 'STABLE' };
      case '2026-q2':
        return { health: 91, activeMissions: 2, revenue: '$4.1M', growth: '+62%', confidence: '94%', risk: 'STABLE' };
      case '2026-q3':
        return { health: 95, activeMissions: 2, revenue: '$7.8M', growth: '+94%', confidence: '97%', risk: 'MINIMAL' };
      case '2026-q4':
        return { health: 99, activeMissions: 4, revenue: '$15.5M', growth: '+188%', confidence: '99%', risk: 'NONE (PREDICTIVE)' };
    }
  };

  const quarterMetrics = getQuarterMetrics();

  // Watch for Room transitions to modulate shader variables!
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    
    // Add event log on room enter
    setLogs(prev => [
      { 
        id: Math.random().toString(), 
        timestamp, 
        type: 'info', 
        message: `Entered Sovereign Room: ${activeRoom.toUpperCase()}`,
        details: `Reconfigured spatial environment presets.`
      },
      ...prev
    ]);

    // Modulate WebGL parameters depending on room to make Center Orb living!
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
        // Prepare intense parameters for the situation debate
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

  // Handle temporal shift warning
  const handleTimeShift = (qVal: '2025-q4' | '2026-q1' | '2026-q2' | '2026-q3' | '2026-q4') => {
    setTimeQuarter(qVal);
    const timestamp = new Date().toLocaleTimeString();
    
    // Shift color modes on timeline shift to visually confirm time travel
    if (qVal === '2025-q4') {
      setColorMode('orange');
      setSpeed(0.1);
    } else if (qVal === '2026-q1') {
      setColorMode('purple');
      setSpeed(0.25);
    } else if (qVal === '2026-q2') {
      setColorMode('lime');
      setSpeed(0.35);
    } else if (qVal === '2026-q3') {
      setColorMode('cyan');
      setSpeed(0.2);
    } else if (qVal === '2026-q4') {
      setColorMode('cyan');
      setSpeed(0.75);
      setSingularity(0.4);
    }

    setLogs(prev => [
      { 
        id: Math.random().toString(), 
        timestamp, 
        type: 'warning', 
        message: `TEMPORAL TIME SHIFT: Moved company viewport to ${qVal.toUpperCase()}`,
        details: `Simulating active financial ledgers and agent utilization schemas.`
      },
      ...prev
    ]);
    showToast(`Time Machine aligned to ${qVal.toUpperCase()}`);
  };

  // Add a new tactical mission
  const handleCreateMission = () => {
    if (!newMissionName.trim()) return;
    const timestamp = new Date().toLocaleTimeString();

    const newM: Mission = {
      id: 'm-' + Math.random().toString(36).substring(2, 9),
      name: newMissionName,
      status: 'active',
      progress: 0,
      department: newMissionDept,
      owner: newMissionDept === 'Engineering' ? 'CTO Spark' : newMissionDept === 'Finance' ? 'CFO Ledger' : newMissionDept === 'Marketing' ? 'CMO Campaign' : 'COO Flow',
      milestones: newMissionMilestone ? [newMissionMilestone] : ['Decompose high-level strategic objectives'],
      tasks: [
        { name: 'Initial goal parsing and task allocation matrix', done: false },
        { name: 'Verify regulatory and capital constraints', done: false }
      ]
    };

    setMissions(prev => [...prev, newM]);
    setLogs(prev => [
      { id: Math.random().toString(), timestamp, type: 'success', message: `Spawned New Mission: "${newMissionName}"`, details: `Delegated to autonomous owner ${newM.owner}.` },
      ...prev
    ]);

    setNewMissionName('');
    setNewMissionMilestone('');
    setShowAddMission(false);
    showToast(`Mission active: ${newM.owner} assigned`);
  };

  // Toggle subtask inside mission
  const toggleTask = (missionId: string, taskIdx: number) => {
    setMissions(prev => prev.map(m => {
      if (m.id !== missionId) return m;
      const updatedTasks = m.tasks.map((t, idx) => idx === taskIdx ? { ...t, done: !t.done } : t);
      const doneCount = updatedTasks.filter(t => t.done).length;
      const progress = Math.round((doneCount / updatedTasks.length) * 100);
      return { ...m, tasks: updatedTasks, progress, status: progress === 100 ? 'completed' : 'active' };
    }));
  };

  // Add compliance gate sign-offs
  const handleResolveApproval = (id: string, action: 'approved' | 'declined') => {
    const timestamp = new Date().toLocaleTimeString();
    const item = approvals.find(a => a.id === id);
    if (!item) return;

    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: action } : a));
    setLogs(prev => [
      { 
        id: Math.random().toString(), 
        timestamp, 
        type: action === 'approved' ? 'success' : 'warning', 
        message: `COMPLIANCE GATE ${action.toUpperCase()}: ${item.title}`, 
        details: `Founder Stavogm signed authorization code and recorded to event-log.` 
      },
      ...prev
    ]);
    showToast(`Compliance decision recorded: ${action.toUpperCase()}`);
  };

  // Launch simulated Situation Room Debates
  const runSimulationDebate = () => {
    if (!debateScenario.trim()) return;
    setIsDebating(true);
    setDebateStep(1);
    setDebateLogs([]);
    setDebateResult(null);

    // Speed up WebGL uniforms to represent heavy organizational reasoning!
    setSpeed(1.2);
    setPulseFreq(16.0);
    setResonance(0.85);

    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [
      { id: Math.random().toString(), timestamp, type: 'audit', message: `STAMPEDE_DEBATE INITIATED: "${debateScenario}"`, details: `Spinning up multi-agent forecasting kernels.` },
      ...prev
    ]);
  };

  // Run subsequent steps of multi-agent debate simulation
  useEffect(() => {
    if (!isDebating || debateStep === 0) return;

    const debateMessages = [
      {
        sender: 'CFO Ledger',
        role: 'Chief Financial Officer',
        avatar: '⚖',
        text: `Financing Review: Moving forward with "${debateScenario}" incurs direct treasury sharding. I estimate a capital outlay of 1.4M USDC. Net yield impact stands at -12% short-term, but forecast an asset appreciation of 3.1x over 18 months if liquidity pools hold stable. High-level recommendation: Proceed, but establish an Arbitrum-backed hedge reservoir.`
      },
      {
        sender: 'CTO Spark',
        role: 'Chief Technology Officer',
        avatar: '⚡',
        text: `Technical Review: Infrastructure-wise, syncing Titan's Web3 routing nodes requires refactoring 14 discrete smart contract interfaces. Standard Kubernetes clusters can ingest the traffic within 180 seconds of proxy realignment. Deploying 8 extra Switzerland servers mitigates latency peaks. Net readiness is high, but we require a strict QA audit gate.`
      },
      {
        sender: 'Legal Guard',
        role: 'General Counsel & Compliance',
        avatar: '🛡',
        text: `Compliance Warning: Titan is registered under a secondary APAC entity. Direct merge triggers local tax disclosures. Recommendation: Structure this as an intellectual property licensing agreement via our Swiss foundation. That mitigates audit hazards and bypasses immediate regulatory escrow constraints entirely.`
      },
      {
        sender: 'COO Flow',
        role: 'Chief Operations Officer',
        avatar: '❖',
        text: `Operations Summary: Merging workflows increases administrative bandwidth by 14%. By automating communication routes through our Sentinel API, we reduce founder overhead to near-zero. I recommend a 3-step staggered rollout over 14 days, with immediate teardown of redundant campaign networks.`
      }
    ];

    if (debateStep <= debateMessages.length) {
      const timer = setTimeout(() => {
        const msg = debateMessages[debateStep - 1];
        setDebateLogs(prev => [...prev, { ...msg, time: new Date().toLocaleTimeString() }]);
        setDebateStep(prev => prev + 1);
        
        // Slightly modulate WebGL singularity and resonance on speech
        setResonance(Math.random() * 0.4 + 0.5);
        setSingularity(Math.random() * 0.3 + 0.1);
      }, 3500);
      return () => clearTimeout(timer);
    } else if (debateStep === debateMessages.length + 1) {
      // Complete debate and render executive result scorecard!
      const timer = setTimeout(() => {
        setDebateResult({
          risk: 42,
          readiness: 88,
          impact: 91,
          summary: `The autonomous executive board recommends a structured acquisition of Titan's key assets. By routing contract assets via our Swiss Foundation, we minimize exposure to 42% risk. Operations and engineering frameworks stand fully prepared to execute the deployment sequence immediately.`
        });
        setIsDebating(false);
        setDebateStep(0);
        
        // Restore WebGL uniforms
        setSpeed(0.2);
        setPulseFreq(5.0);
        setResonance(0.15);

        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [
          { id: Math.random().toString(), timestamp, type: 'success', message: `DEBATE EVALUATION COMPLETE: Merged recommendation compiled.`, details: `Rating: 91/100 Net Strategic Impact.` },
          ...prev
        ]);
        showToast("Executive Debate Compiled successfully.");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isDebating, debateStep]);

  return (
    <div className="absolute inset-0 z-20 flex flex-col pt-16 pb-4 px-4 md:px-6 select-none overflow-hidden text-white">
      
      {/* Dynamic Toast Alert Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-[99] bg-zinc-950/90 backdrop-blur-md border border-cyan-500/30 text-cyan-400 font-mono text-[9px] uppercase tracking-[0.2em] px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.15)] flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Glass HUD Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden relative">
        
        {/* ROOMS NAVIGATION BAR - Floating Spatial Left Panel */}
        <div className="lg:col-span-3 flex flex-col gap-3 h-full overflow-hidden">
          
          {/* Company Global Health Index - Bloomberg Style */}
          <div className="bg-zinc-950/80 backdrop-blur-md border border-white/5 rounded-xl p-4 flex flex-col gap-2 relative shadow-xl overflow-hidden shrink-0">
            {/* Visual scan line effect */}
            <div className="absolute inset-x-0 h-0.5 bg-cyan-400/10 top-0 animate-pulse" />
            
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-bold">SOVR STATE CORE</span>
              <span className="px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[8px] font-mono rounded">SECURE</span>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl font-mono tracking-tight text-white font-bold">{quarterMetrics.health}%</span>
              <span className="text-emerald-400 font-mono text-[9px] flex items-center gap-0.5">
                <TrendingUp size={10} />
                {quarterMetrics.growth}
              </span>
            </div>

            {/* Simulated Live Sparkline using pure SVGs */}
            <div className="h-6 w-full opacity-60 mt-1">
              <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient-spark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path 
                  d={timeQuarter === '2025-q4' ? 'M0,15 L25,12 L50,14 L75,18 L100,16' : 
                     timeQuarter === '2026-q1' ? 'M0,15 L25,10 L50,12 L75,8 L100,9' :
                     timeQuarter === '2026-q2' ? 'M0,15 L25,10 L50,8 L75,5 L100,6' :
                     'M0,18 L20,15 L40,11 L60,8 L80,3 L100,2'} 
                  fill="none" 
                  stroke="#22d3ee" 
                  strokeWidth="1.5" 
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

            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5 text-[9px] font-mono text-zinc-500">
              <div>
                <span className="block text-zinc-600">TREASURY:</span>
                <span className="text-zinc-300 font-bold">{quarterMetrics.revenue}</span>
              </div>
              <div>
                <span className="block text-zinc-600">PREDICTION CONF:</span>
                <span className="text-zinc-300 font-bold">{quarterMetrics.confidence}</span>
              </div>
            </div>
          </div>

          {/* Rooms List - Single click transitions entire environment */}
          <div className="flex-1 bg-zinc-950/80 backdrop-blur-md border border-white/5 rounded-xl p-3 flex flex-col gap-1.5 shadow-xl overflow-y-auto">
            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest px-2 pb-1 block border-b border-white/5">
              SPATIAL CONTROL ROOMS
            </span>

            {[
              { id: 'hq', label: 'Executive Command', desc: 'Core EIOS, Health & Missions', color: 'border-cyan-500/20 text-cyan-400', glow: 'shadow-[0_0_15px_rgba(34,211,238,0.1)]' },
              { id: 'operations', label: 'Operations & HR', desc: 'Workflow & Executive Agents', color: 'border-lime-500/20 text-lime-400', glow: 'shadow-[0_0_15px_rgba(132,204,22,0.1)]' },
              { id: 'engineering', label: 'Engineering Node', desc: 'Codebase, QA & Security Scans', color: 'border-fuchsia-500/20 text-fuchsia-400', glow: 'shadow-[0_0_15px_rgba(217,70,239,0.1)]' },
              { id: 'finance', label: 'Treasury & CFO', desc: 'Ledger Allocations & Charts', color: 'border-amber-500/20 text-amber-400', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.1)]' },
              { id: 'marketing', label: 'Marketing & Brand', desc: 'Pipeline Metrics & Outreach', color: 'border-orange-500/20 text-orange-400', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.1)]' },
              { id: 'research', label: 'Research & Intel', desc: 'Long-Term Database Sync', color: 'border-cyan-500/20 text-cyan-400', glow: 'shadow-[0_0_15px_rgba(6,182,212,0.1)]' },
              { id: 'legal', label: 'Legal & Risk Gate', desc: 'Compliance & One-Click Damping', color: 'border-rose-500/20 text-rose-400', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.1)]' },
              { id: 'situation', label: 'Simulation room', desc: 'Macro Strategy debates', color: 'border-indigo-500/20 text-indigo-400', glow: 'shadow-[0_0_15px_rgba(99,102,241,0.1)]' },
            ].map((room) => {
              const isSelected = activeRoom === room.id;
              return (
                <button
                  key={room.id}
                  onClick={() => setActiveRoom(room.id as any)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all duration-300 flex items-center justify-between group ${
                    isSelected 
                      ? 'bg-white/5 border-white/20 text-white shadow-lg ' + room.glow
                      : 'bg-transparent border-white/0 hover:bg-white/5 hover:border-white/5 text-zinc-400'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-mono uppercase tracking-wider font-bold transition-colors ${
                      isSelected ? 'text-white' : 'group-hover:text-white'
                    }`}>
                      {room.label}
                    </span>
                    <span className="text-[8px] font-mono text-zinc-500 mt-0.5">
                      {room.desc}
                    </span>
                  </div>
                  <ChevronRight size={12} className={`transition-transform duration-300 ${
                    isSelected ? 'transform translate-x-1 text-cyan-400' : 'text-zinc-600 group-hover:text-zinc-400'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE ROOM DISPLAY - Central Glass Panel Area */}
        <div className="lg:col-span-5 flex flex-col gap-3 h-full overflow-hidden">
          
          <div className="flex-1 bg-zinc-950/75 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-4 shadow-2xl relative overflow-y-auto">
            
            {/* Header of Active Room with dynamic theme badges */}
            <div className="flex justify-between items-start border-b border-white/5 pb-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                  <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                    SECURE NODE ACTIVE // ROOM_{activeRoom.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-white font-mono text-sm tracking-wide uppercase font-bold mt-1">
                  {activeRoom === 'hq' && 'Executive Headquarters'}
                  {activeRoom === 'operations' && 'Operations & HR Hub'}
                  {activeRoom === 'engineering' && 'Engineering Core Node'}
                  {activeRoom === 'finance' && 'Sovereign Treasury'}
                  {activeRoom === 'marketing' && 'Brand & Marketing Matrix'}
                  {activeRoom === 'research' && 'Strategic Memory Base'}
                  {activeRoom === 'legal' && 'Compliance & Risk Center'}
                  {activeRoom === 'situation' && 'Situation Simulation Room'}
                </h3>
              </div>

              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-[8px] text-zinc-400">
                TIME: {timeQuarter.toUpperCase()}
              </span>
            </div>

            {/* ROOM 1: HQ (EXECUTIVE COMMAND) */}
            {activeRoom === 'hq' && (
              <div className="flex-1 flex flex-col gap-4">
                
                {/* Live stats layout */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-1">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">ACTIVE DELEGATIONS</span>
                    <span className="text-lg font-mono text-white font-bold">{quarterMetrics.activeMissions} / 3</span>
                    <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden mt-1">
                      <div 
                        className="bg-cyan-400 h-full rounded-full" 
                        style={{ width: `${(quarterMetrics.activeMissions / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-1">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">PREDICTIVE STABILITY</span>
                    <span className="text-lg font-mono text-cyan-300 font-bold">{quarterMetrics.risk}</span>
                    <span className="text-[8px] font-mono text-zinc-500 mt-1 uppercase">RISK TOLERANCE Baseline</span>
                  </div>
                </div>

                {/* Tactical Missions List */}
                <div className="flex-1 flex flex-col gap-3 min-h-[180px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-bold">STRATEGIC MISSIONS</span>
                    <button 
                      onClick={() => setShowAddMission(!showAddMission)}
                      className="px-2 py-1 bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 font-mono text-[8px] uppercase tracking-wider rounded hover:bg-cyan-500/25 transition-all flex items-center gap-1"
                    >
                      <Plus size={10} />
                      <span>New Mission</span>
                    </button>
                  </div>

                  {/* Add Mission Popover */}
                  {showAddMission && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-zinc-950/90 border border-white/10 rounded-xl flex flex-col gap-2 text-[9px] font-mono"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-zinc-500 uppercase">MISSION NAME</label>
                          <input 
                            type="text" 
                            placeholder="Deconstruct routing layer..." 
                            value={newMissionName}
                            onChange={(e) => setNewMissionName(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded p-1.5 text-white"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-zinc-500 uppercase">ASSIGN OWNER</label>
                          <select 
                            value={newMissionDept}
                            onChange={(e) => setNewMissionDept(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded p-1.5 text-zinc-300"
                          >
                            <option value="Engineering">CTO Spark</option>
                            <option value="Finance">CFO Ledger</option>
                            <option value="Marketing">CMO Campaign</option>
                            <option value="Operations">COO Flow</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500 uppercase">FIRST KEY MILESTONE</label>
                        <input 
                          type="text" 
                          placeholder="Audit transaction hashes..." 
                          value={newMissionMilestone}
                          onChange={(e) => setNewMissionMilestone(e.target.value)}
                          className="bg-black/40 border border-white/10 rounded p-1.5 text-white"
                        />
                      </div>

                      <div className="flex gap-2 justify-end pt-1">
                        <button 
                          onClick={() => setShowAddMission(false)}
                          className="px-2 py-1 text-zinc-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleCreateMission}
                          className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded hover:bg-cyan-500/20"
                        >
                          Activate
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[220px]">
                    {missions.map((m) => (
                      <div key={m.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-2 relative">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-white leading-tight block">
                              {m.name}
                            </span>
                            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5 block">
                              DEPT: {m.department} // OWNER: {m.owner}
                            </span>
                          </div>
                          
                          <span className={`px-1.5 py-0.5 font-mono text-[7px] tracking-widest uppercase rounded border ${
                            m.status === 'completed' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          }`}>
                            {m.status}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase">
                            <span>EXECUTION RATE</span>
                            <span className="text-zinc-300">{m.progress}%</span>
                          </div>
                          <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                m.status === 'completed' ? 'bg-emerald-400' : 'bg-cyan-400'
                              }`} 
                              style={{ width: `${m.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Subtasks inside missions */}
                        <div className="border-t border-white/5 pt-2 space-y-1.5">
                          {m.tasks.map((t, idx) => (
                            <button
                              key={idx}
                              onClick={() => toggleTask(m.id, idx)}
                              className="w-full text-left flex items-start gap-2 group text-[8px] font-mono text-zinc-400 hover:text-white transition-colors"
                            >
                              <div className={`w-3 h-3 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                                t.done ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' : 'border-zinc-700'
                              }`}>
                                {t.done && <CheckCircle size={8} />}
                              </div>
                              <span className={t.done ? 'line-through text-zinc-600' : ''}>
                                {t.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            )}

            {/* ROOM 2: OPERATIONS & HR */}
            {activeRoom === 'operations' && (
              <div className="flex-1 flex flex-col gap-3">
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-bold">AUTONOMOUS AGENTS INVENTORY</span>
                
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[340px]">
                  {executiveAgents.map((agent, i) => (
                    <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-2 relative group hover:border-lime-500/20 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400 text-lg font-mono">
                            {agent.avatar}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-mono font-bold text-white">{agent.name}</span>
                            <span className="text-[8px] font-mono text-zinc-500 uppercase">{agent.role}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="px-1.5 py-0.5 bg-lime-500/10 border border-lime-500/25 text-lime-400 font-mono text-[7px] tracking-wider rounded">
                            {agent.status}
                          </span>
                          <span className="block text-[7px] font-mono text-zinc-500 mt-1 uppercase">
                            TRUST SCORE: {agent.trustScore}%
                          </span>
                        </div>
                      </div>

                      {/* Capabilities */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {agent.capabilities.map((c, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-zinc-900 border border-white/5 text-[7px] font-mono text-zinc-400 rounded">
                            {c}
                          </span>
                        ))}
                      </div>

                      {/* CPU Utilization Load bar */}
                      <div className="border-t border-white/5 pt-2 space-y-1">
                        <div className="flex justify-between text-[7px] font-mono text-zinc-500">
                          <span>AGENT CPU LOAD</span>
                          <span className="text-lime-300 font-bold">{agent.workload}%</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-lime-400 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${agent.workload}%` }}
                          />
                        </div>
                      </div>

                      {/* Extra info displayed on hover */}
                      <div className="grid grid-cols-3 gap-2 mt-1 pt-1.5 text-[8px] font-mono text-zinc-500 border-t border-white/5 opacity-50 group-hover:opacity-100 transition-opacity">
                        <div>
                          <span className="text-zinc-600 block">COST:</span>
                          <span className="text-zinc-300">${agent.cost}/hr</span>
                        </div>
                        <div>
                          <span className="text-zinc-600 block">CONTEXT:</span>
                          <span className="text-zinc-300">{agent.contextWindow}</span>
                        </div>
                        <div>
                          <span className="text-zinc-600 block">TIER:</span>
                          <span className="text-zinc-300">{agent.experience}</span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ROOM 3: ENGINEERING */}
            {activeRoom === 'engineering' && (
              <div className="flex-1 flex flex-col gap-3">
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-bold">SYSTEM HEALTH & LIVE REPOSITORY</span>

                {/* Simulated Commits logs */}
                <div className="p-3.5 bg-black/50 border border-white/5 rounded-xl font-mono text-[8.5px] text-zinc-400 space-y-2">
                  <div className="text-zinc-500 uppercase text-[8px] tracking-wider font-bold border-b border-white/5 pb-1 flex justify-between">
                    <span>Repository Timeline</span>
                    <span className="text-fuchsia-400 animate-pulse">LIVE FEED</span>
                  </div>
                  <p className="flex justify-between">
                    <span className="text-zinc-500">[17:15:22] FE: <strong className="text-zinc-200">refactor webgl spatial coordinates</strong></span>
                    <span className="text-emerald-400">MERGED</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-zinc-500">[16:58:04] BE: <strong className="text-zinc-200">optimize fast-SQLite memory cache</strong></span>
                    <span className="text-emerald-400">MERGED</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-zinc-500">[15:40:11] QA: <strong className="text-zinc-200">synthetic end-to-end sandbox pass</strong></span>
                    <span className="text-fuchsia-400">ALL GREEN</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-zinc-500">[14:12:59] BE: <strong className="text-zinc-200">sharding database triggers in Zurich</strong></span>
                    <span className="text-emerald-400">MERGED</span>
                  </p>
                </div>

                {/* Code Security & Scanners */}
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-3 mt-1">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-bold text-white uppercase">SECURITY INTEGRITY GAUNTLET</span>
                      <span className="text-[7.5px] font-mono text-zinc-500 uppercase mt-0.5">Dynamic Smart-Contract vulnerability scanner</span>
                    </div>

                    <button 
                      onClick={() => {
                        showToast("Running Security scan...");
                        setLogs(prev => [
                          { id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), type: 'audit', message: 'ENGINEERING SCAN: Integrity secure. Zero vulnerable injection vectors found.', details: 'Audited 4 active smart contracts.' },
                          ...prev
                        ]);
                      }}
                      className="px-3 py-1.5 bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 font-mono text-[8px] uppercase tracking-wider rounded hover:bg-fuchsia-500/20 transition-all font-bold"
                    >
                      Run Security Scan
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center pt-1 border-t border-white/5">
                    <div>
                      <span className="text-[14px] font-mono text-white font-bold block">100%</span>
                      <span className="text-[7.5px] font-mono text-zinc-500 uppercase block mt-0.5">TLS ENCRYPTION</span>
                    </div>
                    <div>
                      <span className="text-[14px] font-mono text-emerald-400 font-bold block">0</span>
                      <span className="text-[7.5px] font-mono text-zinc-500 uppercase block mt-0.5">CONTRACT EXPLOITS</span>
                    </div>
                    <div>
                      <span className="text-[14px] font-mono text-white font-bold block">12.1ms</span>
                      <span className="text-[7.5px] font-mono text-zinc-500 uppercase block mt-0.5">LAMBDA RESOLUTION</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ROOM 4: FINANCE */}
            {activeRoom === 'finance' && (
              <div className="flex-1 flex flex-col gap-3">
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-bold">TREASURY BREAKDOWN & FORECASTS</span>

                {/* Treasury allocations */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl">
                    <span className="text-[7px] font-mono text-zinc-500 uppercase block">USDC RESERVES</span>
                    <span className="text-sm font-mono text-white font-bold block mt-0.5">$4.2M</span>
                  </div>
                  <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl">
                    <span className="text-[7px] font-mono text-zinc-500 uppercase block">ETH TRUST NODE</span>
                    <span className="text-sm font-mono text-white font-bold block mt-0.5">$2.1M</span>
                  </div>
                  <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl">
                    <span className="text-[7px] font-mono text-zinc-500 uppercase block">ARBITRUM POOL</span>
                    <span className="text-sm font-mono text-white font-bold block mt-0.5">$1.5M</span>
                  </div>
                </div>

                {/* Custom animated SVG Chart */}
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex-1 flex flex-col gap-1.5 min-h-[160px]">
                  <div className="flex justify-between items-center border-b border-white/5 pb-1 text-[8px] font-mono text-zinc-500">
                    <span>FINANCIAL GROWTH PROJECTION (USDC)</span>
                    <span className="text-amber-400 font-bold">{quarterMetrics.revenue} Net CAP</span>
                  </div>

                  {/* SVG Chart */}
                  <div className="flex-1 w-full relative pt-2">
                    <svg className="w-full h-full min-h-[110px]" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <linearGradient id="gradient-chart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                      </linearGradient>
                      
                      {/* Grid lines */}
                      <line x1="0" y1="10" x2="100" y2="10" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="0.5" />
                      <line x1="0" y1="20" x2="100" y2="20" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="0.5" />
                      <line x1="0" y1="30" x2="100" y2="30" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="0.5" />

                      {/* Interactive coordinates points */}
                      <path 
                        d={timeQuarter === '2025-q4' ? 'M0,35 L25,32 L50,28 L75,25 L100,22' :
                           timeQuarter === '2026-q1' ? 'M0,35 L25,28 L50,22 L75,18 L100,14' :
                           timeQuarter === '2026-q2' ? 'M0,35 L25,24 L50,18 L75,12 L100,8' :
                           'M0,35 L20,30 L40,22 L60,14 L80,6 L100,2'}
                        fill="none" 
                        stroke="#f59e0b" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                      />
                      <path 
                        d={timeQuarter === '2025-q4' ? 'M0,35 L25,32 L50,28 L75,25 L100,22 L100,40 L0,40 Z' :
                           timeQuarter === '2026-q1' ? 'M0,35 L25,28 L50,22 L75,18 L100,14 L100,40 L0,40 Z' :
                           timeQuarter === '2026-q2' ? 'M0,35 L25,24 L50,18 L75,12 L100,8 L100,40 L0,40 Z' :
                           'M0,35 L20,30 L40,22 L60,14 L80,6 L100,2 L100,40 L0,40 Z'}
                        fill="url(#gradient-chart)"
                      />
                    </svg>

                    <div className="absolute bottom-1 inset-x-0 flex justify-between px-1 text-[7px] font-mono text-zinc-600">
                      <span>2025 Q4</span>
                      <span>2026 Q1</span>
                      <span>2026 Q2</span>
                      <span>2026 Q3 (CURRENT)</span>
                      <span>2026 Q4 (PROJECTION)</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ROOM 5: MARKETING */}
            {activeRoom === 'marketing' && (
              <div className="flex-1 flex flex-col gap-3">
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-bold">OUTREACH CHANNELS & PIPELINE STATUS</span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-1">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase">MONTHLY AD SPEND</span>
                    <span className="text-base font-mono text-white font-bold">$12,400</span>
                    <span className="text-[7.5px] font-mono text-emerald-400 uppercase">ROAS: 4.8x average</span>
                  </div>

                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-1">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase">ACQUISITION COST (CAC)</span>
                    <span className="text-base font-mono text-white font-bold">$4.10 / user</span>
                    <span className="text-[7.5px] font-mono text-emerald-400 uppercase">Target: &lt; $5.00</span>
                  </div>
                </div>

                {/* Outreach pipelines */}
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex-1 flex flex-col gap-2.5 max-h-[180px] overflow-y-auto">
                  <span className="text-[7.5px] font-mono text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-1">
                    ACTIVE MARKETING NODES
                  </span>

                  {[
                    { name: 'X / Twitter Growth Bot', reach: '45.1k reach', ctr: '3.4% CTR', active: true },
                    { name: 'Github Organic Star campaign', reach: '180k devs', ctr: '1.2% fork rate', active: true },
                    { name: 'Discord Dev Ambassador channels', reach: '12.4k users', ctr: '8.5% conversion', active: true },
                    { name: 'Decentralized SEO Hub nodes', reach: '5.2k daily', ctr: '2.1% clickthrough', active: false }
                  ].map((node, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[8.5px] font-mono text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${node.active ? 'bg-orange-400' : 'bg-zinc-700'}`} />
                        <span>{node.name}</span>
                      </div>

                      <div className="text-right text-zinc-500">
                        <span>{node.reach}</span>
                        <span className="mx-1 text-zinc-700">//</span>
                        <span className="text-orange-400 font-bold">{node.ctr}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ROOM 6: RESEARCH (MEMORY DATABASE) */}
            {activeRoom === 'research' && (
              <div className="flex-1 flex flex-col gap-3">
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-bold">LONG-TERM MEMORY GRAPH INTEGRITY</span>

                <div className="font-mono text-[8px] text-zinc-500 leading-relaxed bg-white/5 border border-white/5 p-3 rounded-xl">
                  <p>
                    ● <span className="text-cyan-400 font-bold">CO-FOUNDER COGNITIVE CACHE</span>. 
                    These facts represent the long-term context that Sentinel injects into the Gemini Live Session. Read and persist organizational variables dynamically.
                  </p>
                </div>

                {/* Memories List */}
                <div className="flex-1 overflow-y-auto space-y-2 max-h-[180px] pr-1">
                  {memories.length === 0 ? (
                    <div className="h-[80px] flex flex-col items-center justify-center text-center opacity-40">
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">
                        Fact-Base empty. Seed blueprints on alerts tab.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {memories.map((m) => (
                        <div key={m.id} className="group flex flex-col gap-1 p-2 rounded bg-white/5 border border-white/5 hover:border-cyan-500/10 transition-all">
                          {editingMemoryId === m.id ? (
                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={editingMemoryValue}
                                onChange={(e) => setEditingMemoryValue(e.target.value)}
                                className="flex-1 bg-black/60 border border-white/10 rounded px-2 py-1 text-[8px] font-mono text-white focus:outline-none"
                              />
                              <button
                                onClick={() => updateMemory(m.id, editingMemoryValue)}
                                className="p-1 text-white hover:text-green-400 transition-colors"
                              >
                                <Save size={10} />
                              </button>
                              <button
                                onClick={() => setEditingMemoryId(null)}
                                className="p-1 text-white hover:text-red-400 transition-colors"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-[9px] font-mono text-zinc-300 leading-normal break-words flex-1">
                                {m.fact}
                              </span>
                              <div className="flex gap-1.5 opacity-20 group-hover:opacity-100 transition-opacity shrink-0">
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

                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="MANUALLY INJECT BUSINESS DIRECTIVE..." 
                    value={manualMemoryInput}
                    onChange={(e) => setManualMemoryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && manualMemoryInput.trim()) {
                        addMemory(manualMemoryInput);
                        setManualMemoryInput('');
                      }
                    }}
                    className="w-full bg-white/5 border border-white/5 rounded-lg pl-4 pr-16 py-2.5 text-[9px] font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/30" 
                  />
                  <button 
                    disabled={!manualMemoryInput.trim()}
                    onClick={() => {
                      addMemory(manualMemoryInput);
                      setManualMemoryInput('');
                    }}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-20 rounded-md font-mono text-[8px] uppercase tracking-widest transition-all"
                  >
                    Index Fact
                  </button>
                </div>

              </div>
            )}

            {/* ROOM 7: LEGAL (RISK & COMPLIANCE HUD) */}
            {activeRoom === 'legal' && (
              <div className="flex-1 flex flex-col gap-3">
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-bold">COMPLIANCE DECISIONS GATEWAY</span>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[320px]">
                  {approvals.map((item) => (
                    <div key={item.id} className="p-3.5 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-2 relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-1.5 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[7px] uppercase tracking-widest rounded">
                            {item.category} // RISK: {item.riskScore}%
                          </span>
                          <span className="text-[10px] font-mono font-bold text-white mt-1.5 block">
                            {item.title}
                          </span>
                        </div>

                        <span className={`px-1.5 py-0.5 font-mono text-[7px] tracking-widest uppercase rounded border ${
                          item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          item.status === 'declined' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <p className="text-[8.5px] font-mono text-zinc-400 leading-normal">
                        {item.description}
                      </p>

                      {item.status === 'pending' && (
                        <div className="flex gap-2 justify-end border-t border-white/5 pt-2">
                          <button
                            onClick={() => handleResolveApproval(item.id, 'declined')}
                            className="px-2.5 py-1 bg-rose-500/15 border border-rose-500/25 text-rose-400 hover:bg-rose-500/25 font-mono text-[8px] uppercase tracking-wider rounded transition-all"
                          >
                            Decline & Lock
                          </button>
                          <button
                            onClick={() => handleResolveApproval(item.id, 'approved')}
                            className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25 font-mono text-[8px] uppercase tracking-wider rounded transition-all font-bold"
                          >
                            Approve Execute
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ROOM 8: SITUATION ROOM */}
            {activeRoom === 'situation' && (
              <div className="flex-1 flex flex-col gap-3">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-bold block">
                    Macro Strategy Simulation Board
                  </span>
                  <p className="text-[8px] font-mono text-zinc-500 leading-normal">
                    Enter a plan and trigger a simulated internal debate between your Chief Operations, Financial, Technology and Legal executives to forecast risk coordinates.
                  </p>
                </div>

                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Enter macro plan description..." 
                    value={debateScenario}
                    onChange={(e) => setDebateScenario(e.target.value)}
                    disabled={isDebating}
                    className="w-full bg-white/5 border border-white/5 rounded-lg pl-4 pr-24 py-3 text-[9px] font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/30 uppercase" 
                  />
                  <button 
                    disabled={isDebating || !debateScenario.trim()}
                    onClick={runSimulationDebate}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 disabled:opacity-20 rounded-md font-mono text-[8px] uppercase tracking-widest transition-all font-bold"
                  >
                    {isDebating ? 'SIMULATING...' : 'Run Simulation'}
                  </button>
                </div>

                {/* Debate Conversation Feed */}
                <div className="flex-1 border border-white/5 rounded-xl bg-black/50 overflow-hidden flex flex-col min-h-[160px] max-h-[220px]">
                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                    {debateLogs.length === 0 && !isDebating && (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                        <Terminal className="w-5 h-5 text-zinc-600" />
                        <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 mt-1.5">
                          Debate Logs standby
                        </span>
                      </div>
                    )}

                    {isDebating && debateLogs.length === 0 && (
                      <div className="h-full flex items-center justify-center text-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                        <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-wider animate-pulse font-bold">
                          Assembling AI executive board...
                        </span>
                      </div>
                    )}

                    {debateLogs.map((log, idx) => (
                      <div key={idx} className="flex gap-2 items-start p-1.5 rounded bg-white/5 border border-white/5">
                        <div className="w-6 h-6 rounded bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 text-xs shrink-0 font-mono mt-0.5">
                          {log.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <span className="text-[8px] font-mono font-bold text-white uppercase">{log.sender}</span>
                            <span className="text-[6.5px] font-mono text-zinc-600">{log.time}</span>
                          </div>
                          <p className="text-[8px] font-mono text-zinc-400 leading-normal mt-0.5 break-words">
                            {log.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated Result Scorecard */}
                {debateResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl flex flex-col gap-2 font-mono"
                  >
                    <span className="text-[8px] font-mono text-indigo-400 uppercase font-bold tracking-widest border-b border-white/5 pb-1 block">
                      SYNTHESIZED EVALUATION SCORECARD
                    </span>

                    <div className="grid grid-cols-3 gap-2 text-center pt-1">
                      <div>
                        <span className="text-xs text-rose-400 font-bold block">{debateResult.risk}%</span>
                        <span className="text-[6px] text-zinc-500 uppercase block">NET RISK</span>
                      </div>
                      <div>
                        <span className="text-xs text-emerald-400 font-bold block">{debateResult.readiness}%</span>
                        <span className="text-[6px] text-zinc-500 uppercase block">OPS READINESS</span>
                      </div>
                      <div>
                        <span className="text-xs text-white font-bold block">+{debateResult.impact}%</span>
                        <span className="text-[6px] text-zinc-500 uppercase block">STRATEGIC GAIN</span>
                      </div>
                    </div>

                    <p className="text-[8px] text-zinc-400 leading-normal border-t border-white/5 pt-2 italic">
                      " {debateResult.summary} "
                    </p>

                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => {
                          setDebateResult(null);
                          setDebateScenario('');
                        }}
                        className="px-2.5 py-1 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700 text-[8px] uppercase rounded"
                      >
                        Dismiss Analysis
                      </button>
                      <button
                        onClick={() => {
                          handleResolveApproval('a-' + Math.random().toString(), 'approved');
                          setDebateResult(null);
                          setDebateScenario('');
                          showToast("Executive Decision Authorized!");
                        }}
                        className="px-3 py-1 bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 hover:bg-indigo-500/25 text-[8px] uppercase font-bold rounded"
                      >
                        Authorize Decision Execution
                      </button>
                    </div>

                  </motion.div>
                )}

              </div>
            )}

          </div>

          {/* ORGANIZATIONAL TIME MACHINE SLIDER - Cinematic Parallax Bottom Control */}
          <div className="bg-zinc-950/80 backdrop-blur-md border border-white/5 rounded-xl p-3 flex flex-col gap-1.5 shadow-xl shrink-0">
            <div className="flex justify-between items-center text-[8px] font-mono">
              <span className="text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-1">
                <History size={10} className="text-cyan-400" />
                Sovereign Time Machine
              </span>
              <span className="text-cyan-400 font-bold uppercase">VIEWPORT TEMPORAL FILTER</span>
            </div>

            <div className="flex items-center gap-2 pt-1 font-mono text-[8px] text-zinc-500">
              {['2025-q4', '2026-q1', '2026-q2', '2026-q3', '2026-q4'].map((qVal) => (
                <button
                  key={qVal}
                  onClick={() => handleTimeShift(qVal as any)}
                  className={`flex-1 py-1 px-1 rounded transition-all border text-center font-bold ${
                    timeQuarter === qVal 
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' 
                      : 'bg-transparent border-transparent hover:border-white/5 hover:text-zinc-300'
                  }`}
                >
                  {qVal.toUpperCase()}
                  {qVal === '2026-q3' && ' (CURR)'}
                  {qVal === '2026-q4' && ' (FCST)'}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* SECURE COMMS & AUDIT STREAM - Glass Right Panel */}
        <div className="lg:col-span-4 flex flex-col gap-3 h-full overflow-hidden">
          
          <div className="flex-1 bg-zinc-950/75 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-4 shadow-2xl overflow-hidden relative">
            
            {/* Tab switcher */}
            <div className="flex gap-2 border-b border-white/5 pb-2 shrink-0 font-mono text-[9px]">
              <button
                onClick={() => setRightTab('comms')}
                className={`px-2 py-1.5 rounded transition-all border flex items-center gap-1 ${
                  rightTab === 'comms' ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400 font-bold' : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <MessageSquare size={10} />
                <span>SENTINEL</span>
              </button>

              <button
                onClick={() => setRightTab('timeline')}
                className={`px-2 py-1.5 rounded transition-all border flex items-center gap-1 ${
                  rightTab === 'timeline' ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400 font-bold' : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Terminal size={10} />
                <span>TIMELINE</span>
              </button>

              <button
                onClick={() => setRightTab('memory')}
                className={`px-2 py-1.5 rounded transition-all border flex items-center gap-1 ${
                  rightTab === 'memory' ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400 font-bold' : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Database size={10} />
                <span>DATABASE</span>
              </button>

              <button
                onClick={() => setRightTab('approvals')}
                className={`px-2 py-1.5 rounded transition-all border flex items-center gap-1 relative ${
                  rightTab === 'approvals' ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400 font-bold' : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <ShieldCheck size={10} />
                <span>RISKS</span>
                {approvals.filter(a => a.status === 'pending').length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border border-zinc-950 flex items-center justify-center text-[6px] text-white">
                    {approvals.filter(a => a.status === 'pending').length}
                  </span>
                )}
              </button>
            </div>

            {/* TAB CONTENT: SENTINEL VOIP & CHAT */}
            {rightTab === 'comms' && (
              <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                
                {/* Voice link controller */}
                <div className="flex flex-col gap-2.5 p-3.5 bg-white/5 border border-white/5 rounded-xl shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-white text-[10px] font-mono uppercase font-bold tracking-wider">
                        Secure Audio Link
                      </span>
                      <span className="text-[7.5px] font-mono text-zinc-400 mt-0.5">
                        Active real-time bidirectional PCM stream
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={isAgentConnected ? disconnectAgent : connectAgent}
                        disabled={isAgentConnecting || isAgentDormant}
                        className={`px-2.5 py-1 rounded font-mono text-[8px] uppercase tracking-wider transition-all border ${
                          isAgentDormant ? 'opacity-30 cursor-not-allowed border-zinc-800 text-zinc-500' :
                          isAgentConnecting ? 'bg-cyan-900/40 text-cyan-500 border-cyan-800 animate-pulse' :
                          isAgentConnected ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/25 font-bold' : 
                          'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {isAgentConnecting ? 'CONNECTING...' : isAgentConnected ? 'STREAM ACTIVE' : 'Start Voice Link'}
                      </button>

                      <button
                        onClick={() => setIsAgentDormant(!isAgentDormant)}
                        className={`px-2 py-1 rounded font-mono text-[8px] uppercase tracking-wider border transition-all ${
                          isAgentDormant ? 'bg-red-500/10 text-red-400 border-red-500/30 font-bold' : 'bg-white/5 text-zinc-400 border-white/5 hover:border-white/10'
                        }`}
                      >
                        {isAgentDormant ? 'WAKE SENTINEL' : 'FORCE SLEEP'}
                      </button>
                    </div>
                  </div>

                  {/* Reactive Sound wave graph */}
                  {isAgentConnected && (
                    <div className="flex items-center gap-3 border-t border-white/5 pt-2">
                      <div className="flex items-center gap-1 w-20 shrink-0">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
                        </span>
                        <span className="text-[7.5px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                          {(window as any)._agentAudio > 0 ? 'Transmitting' : 'Monitoring'}
                        </span>
                      </div>
                      
                      <div className="flex-1 flex gap-0.5 items-end h-3.5 overflow-hidden">
                        {[...Array(16)].map((_, idx) => {
                          const isSustained = (window as any)._agentAudio > 0.05;
                          const heightPct = isSustained ? Math.floor(Math.random() * 80) + 20 : Math.floor(Math.random() * 15) + 5;
                          return (
                            <div 
                              key={idx} 
                              className={`flex-1 rounded-t-sm transition-all duration-100 ${isSustained ? 'bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'bg-zinc-800'}`}
                              style={{ height: `${heightPct}%` }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Comms Chat messages container */}
                <div className="flex-1 border border-white/5 rounded-xl bg-black/40 overflow-hidden flex flex-col relative min-h-[140px]">
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-30 p-2">
                        <Terminal className="w-5 h-5 text-zinc-600" />
                        <div className="text-[8px] font-mono text-zinc-500 tracking-widest uppercase font-bold">
                          Secure Comms Logs Empty
                        </div>
                        <p className="text-[7.5px] font-mono text-zinc-600 max-w-[220px] leading-normal">
                          Start Sentinel Voice Link above or type a strategic command below to invoke direct co-founder routing.
                        </p>
                      </div>
                    ) : (
                      messages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className="text-[6.5px] font-mono text-zinc-500 uppercase tracking-widest mb-0.5">
                            {msg.sender === 'user' ? 'FOUNDER_STAVOGM' : 'EIOS_SENTINEL'}
                          </div>
                          <div className={`px-2.5 py-1.5 rounded-xl text-[8.5px] font-mono whitespace-pre-wrap max-w-[95%] border leading-relaxed ${
                            msg.sender === 'user' 
                              ? 'bg-cyan-950/20 text-cyan-300 border-cyan-500/20' 
                              : msg.text.startsWith('✨') 
                                ? 'bg-emerald-950/15 text-emerald-300 border-emerald-500/20'
                                : 'bg-white/5 text-zinc-300 border-white/5'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Text transmission input */}
                <div className="relative shrink-0">
                  <input 
                    type="text" 
                    placeholder="TRANSMIT EXECUTIVE COMMAND..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    className="w-full bg-white/5 border border-white/5 rounded-lg pl-3 pr-16 py-2.5 text-[8.5px] font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/30 uppercase" 
                  />
                  <button 
                    disabled={!chatInput.trim()}
                    onClick={handleSendMessage}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-20 rounded-md font-mono text-[7.5px] uppercase tracking-widest transition-all"
                  >
                    Transmit
                  </button>
                </div>

              </div>
            )}

            {/* TAB CONTENT: TIMELINE LOGS (Operational Event Stream) */}
            {rightTab === 'timeline' && (
              <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-1 block shrink-0">
                  REPLAYABLE OPERATIONAL TIMELINE
                </span>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[180px]">
                  {logs.map((log) => (
                    <div key={log.id} className="p-2 bg-white/5 border border-white/5 rounded-lg text-[8px] font-mono flex gap-2 items-start hover:bg-white/10 transition-colors">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 ${
                        log.type === 'success' ? 'bg-emerald-400 shadow-[0_0_5px_#34d399]' :
                        log.type === 'warning' ? 'bg-rose-400 shadow-[0_0_5px_#f87171]' :
                        log.type === 'audit' ? 'bg-indigo-400 shadow-[0_0_5px_#818cf8]' :
                        'bg-cyan-400 shadow-[0_0_5px_#22d3ee]'
                      }`} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-[6.5px] text-zinc-500 font-bold">
                          <span>{log.timestamp} // {log.type.toUpperCase()}</span>
                        </div>
                        <p className="text-zinc-300 leading-normal mt-0.5 break-words">
                          {log.message}
                        </p>
                        {log.details && (
                          <p className="text-[7px] text-zinc-500 leading-normal mt-0.5 uppercase">
                            • {log.details}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: CO-FOUNDER MEMORIES LIST */}
            {rightTab === 'memory' && (
              <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-1 block shrink-0">
                  STRATEGIC FACTS SYNCED
                </span>

                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 min-h-[180px]">
                  {memories.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center opacity-30">
                      <span className="text-[8px] font-mono uppercase">Database Empty</span>
                    </div>
                  ) : (
                    memories.map((m) => (
                      <div key={m.id} className="p-2 bg-zinc-900/60 border border-white/5 rounded text-[8.5px] font-mono leading-relaxed text-zinc-300 break-words hover:border-cyan-500/20 transition-all">
                        {m.fact}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: RISKS & WARNINGS GATEWAY */}
            {rightTab === 'approvals' && (
              <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-1 block shrink-0">
                  HIGH-RISK DECISIONS WAITING SIGN-OFF
                </span>

                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 min-h-[180px]">
                  
                  {/* WebGL anomalies warnings */}
                  {resonance > 0.7 && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-start gap-2 animate-pulse font-mono">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider block">
                          Extreme Space Resonance Warning
                        </span>
                        <span className="text-[7.5px] text-zinc-400 leading-normal block mt-0.5 uppercase">
                          Resonance at {(resonance * 100).toFixed(0)}% exceeds structural boundaries. Warping raymarching coordinates.
                        </span>
                        <button 
                          onClick={() => {
                            setResonance(0.1);
                            showToast("Resonance Damped Successfully");
                          }}
                          className="px-2 py-0.5 bg-rose-400/20 hover:bg-rose-400/30 text-rose-300 text-[7px] uppercase font-bold rounded border border-rose-500/20 mt-1.5 transition-all"
                        >
                          Damp Resonance
                        </button>
                      </div>
                    </div>
                  )}

                  {singularity > 0.7 && (
                    <div className="p-3 bg-fuchsia-500/10 border border-fuchsia-500/25 rounded-xl flex items-start gap-2 font-mono">
                      <AlertTriangle className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-[9px] font-bold text-fuchsia-400 uppercase tracking-wider block">
                          Singularity Gravity Well Collapse
                        </span>
                        <span className="text-[7.5px] text-zinc-400 leading-normal block mt-0.5 uppercase">
                          Lensing well is extremely dense. Optical light vectors are experiencing infinite time-horizon warping.
                        </span>
                        <button 
                          onClick={() => {
                            setSingularity(0.0);
                            showToast("Singularity Stabilized Successfully");
                          }}
                          className="px-2 py-0.5 bg-fuchsia-400/20 hover:bg-fuchsia-400/30 text-fuchsia-300 text-[7px] uppercase font-bold rounded border border-fuchsia-500/20 mt-1.5 transition-all"
                        >
                          Stabilize Singularity
                        </button>
                      </div>
                    </div>
                  )}

                  {approvals.filter(a => a.status === 'pending').length === 0 && resonance <= 0.7 && singularity <= 0.7 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-4 gap-2">
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                      <span className="text-[8px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                        Compliance Clear
                      </span>
                      <p className="text-[7px] font-mono text-zinc-600">
                        Zero pending security hazards or unapproved financial transactions found.
                      </p>
                    </div>
                  )}

                  {approvals.filter(a => a.status === 'pending').map((item) => (
                    <div key={item.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-1.5 text-[8.5px] font-mono hover:bg-white/10 transition-all">
                      <div className="flex justify-between items-start">
                        <span className="px-1 py-0.5 bg-rose-500/10 border border-rose-500/25 text-rose-400 font-bold text-[6.5px] rounded">
                          {item.category} // HAZARD: {item.riskScore}%
                        </span>
                      </div>
                      
                      <span className="text-white font-bold leading-snug">
                        {item.title}
                      </span>
                      
                      <p className="text-zinc-500 text-[7.5px] leading-normal">
                        {item.description}
                      </p>

                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          onClick={() => handleResolveApproval(item.id, 'declined')}
                          className="px-2 py-0.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[7px] uppercase rounded"
                        >
                          Veto
                        </button>
                        <button
                          onClick={() => handleResolveApproval(item.id, 'approved')}
                          className="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 font-bold text-[7px] uppercase rounded"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Core HUD diagnostics parameters - Space Hologram */}
          <div className="bg-zinc-950/80 backdrop-blur-md border border-white/5 rounded-xl p-3 flex flex-col gap-1 shadow-xl shrink-0 font-mono text-[8.5px]">
            <div className="flex justify-between text-zinc-500 border-b border-white/5 pb-1">
              <span>EIOS PHYSICAL UNIFORMS</span>
              <span className="text-cyan-400">ACTIVE GPU</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-zinc-400 uppercase pt-1">
              <div className="flex justify-between">
                <span>Azimuth Angle:</span>
                <span className="text-zinc-200">{(yaw * (180/Math.PI)).toFixed(1)}°</span>
              </div>
              <div className="flex justify-between">
                <span>Pitch Elev:</span>
                <span className="text-zinc-200">{(pitch * (180/Math.PI)).toFixed(1)}°</span>
              </div>
              <div className="flex justify-between">
                <span>Field Zoom:</span>
                <span className="text-zinc-200">{zoom.toFixed(2)}u</span>
              </div>
              <div className="flex justify-between">
                <span>Orb velocity:</span>
                <span className="text-zinc-200">{speed.toFixed(2)}x</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
