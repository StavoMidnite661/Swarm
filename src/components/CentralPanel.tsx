import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, Edit2, Save, X, AlertTriangle, CheckCircle, Sparkles, 
  Play, Pause, Activity, Database, Plus, RefreshCw, Power, 
  Terminal, ShieldAlert, Volume2, Compass, Layers, Info, Eye, EyeOff,
  Briefcase, Users, Cpu, Coins, TrendingUp, ShieldCheck, Scale, 
  MessageSquare, Clock, ArrowUpRight, CheckSquare, FileText, Bell, 
  ChevronRight, History, UserCheck, MapPin, TrendingDown
} from 'lucide-react';
import { PanelProps } from './CommandCenterProps';
import WorkspaceConsole from './WorkspaceConsole';

export default function CentralPanel(props: PanelProps) {
  const {
    speed, setSpeed, zoom, setZoom, singularity, setSingularity,
    resonance, setResonance, density, setDensity, proximity, setProximity,
    wind, setWind, colorMode, setColorMode, pulseFreq, setPulseFreq,
    activeRoom, setActiveRoom, timeQuarter, setTimeQuarter,
    messages, chatInput, setChatInput, handleSendMessage,
    isAgentConnected, isAgentConnecting, connectAgent, disconnectAgent,
    isAgentDormant, setIsAgentDormant, modelConfig, setModelConfig,
    yaw, pitch,
    rightTab, setRightTab, showAddMission, setShowAddMission,
    newMissionName, setNewMissionName, newMissionDept, setNewMissionDept,
    newMissionMilestone, setNewMissionMilestone, notification, setNotification,
    debateScenario, setDebateScenario, isDebating, setIsDebating,
    debateStep, setDebateStep, debateLogs, setDebateLogs, debateResult, setDebateResult,
    showToast, runSimulationDebate,
    
    // SOVR OS Core Bindings
    sovrState,
    operationalAnswers,
    createMission,
    toggleTaskDone,
    addMemoryFact,
    deleteMemoryFact,
    toggleDamping,
    reallocateCompute
  } = props;

  // Local state declarations for advanced systems views
  const [executiveView, setExecutiveView] = React.useState<'briefing' | 'feed' | 'workspace'>('briefing');
  const [selectedTwinNode, setSelectedTwinNode] = React.useState<string>('Executive');
  const [twinViewMode, setTwinViewMode] = React.useState<'graph' | 'orb'>('graph');
  const [operationsView, setOperationsView] = React.useState<'list' | 'dependencies'>('dependencies');
  const [selectedMissionIdForDependency, setSelectedMissionIdForDependency] = React.useState<string>('m1');
  const [selectedMemoryCategory, setSelectedMemoryCategory] = React.useState<string>('ALL');
  const [newMemoryCat, setNewMemoryCat] = React.useState<'STRATEGIC' | 'OPERATIONAL' | 'INCIDENT' | 'FINANCIAL'>('STRATEGIC');
  const [reallocatedViaBriefing, setReallocatedViaBriefing] = React.useState<boolean>(false);

  // Phase IV: Autonomous Enterprise local states
  const [isWorkforceExpanded, setIsWorkforceExpanded] = React.useState<boolean>(false);
  const [workforceSize, setWorkforceSize] = React.useState<number>(28);
  const [selectedApiRoute, setSelectedApiRoute] = React.useState<string>('/kernel');
  const [apiResponseText, setApiResponseText] = React.useState<string>('');
  const [isTestingApi, setIsTestingApi] = React.useState<boolean>(false);
  const [hqViewSubTab, setHqViewSubTab] = React.useState<'twins' | 'physics' | 'sandbox'>('twins');
  const [orgWeights, setOrgWeights] = React.useState<Record<string, number>>({
    'Engineering': 32,
    'Finance': 18,
    'Legal': 9,
    'Operations': 25,
    'Research': 16
  });
  const [strategicDecisions, setStrategicDecisions] = React.useState([
    {
      id: 'D-802',
      title: 'Zurich Cluster Realignment Protocol',
      proposer: 'CTO Spark',
      debaters: ['CTO Spark', 'CFO Ledger', 'COO Flow'],
      evidence: 'Latency on Swiss routing endpoints exceeded standard 120ms margin.',
      status: 'APPROVED & EXECUTED',
      outcome: 'Mitigated peaks by 40%. Zurich node ping resolved to 48ms.',
      lessons: 'Dedicated routing segments minimize global context leaks.'
    },
    {
      id: 'D-801',
      title: 'Arbitrum Escrow Sharding Strategy',
      proposer: 'CFO Ledger',
      debaters: ['CFO Ledger', 'Legal Guard', 'COO Flow'],
      evidence: 'Gas overhead on L1 mainnet reached critical thresholds.',
      status: 'APPROVED & EXECUTED',
      outcome: 'Reduced fee expenditures by 82.5% through asynchronous rollups.',
      lessons: 'Pre-seed gas containers during low-congestion intervals.'
    }
  ]);
  const [newDecisionTitle, setNewDecisionTitle] = React.useState('');
  const [newDecisionProposer, setNewDecisionProposer] = React.useState('COO Flow');
  const [newDecisionOutcome, setNewDecisionOutcome] = React.useState('');

  const handleTestApi = (route: string) => {
    setIsTestingApi(true);
    setApiResponseText('// Transmitting TLS 1.3 handshake...\n// Negotiated Cipher: ECDHE-RSA-AES256-GCM-SHA384\n// Connection established with EIOS Micro-Gateway.');
    setTimeout(() => {
      let json = '';
      if (route === '/kernel') {
        json = JSON.stringify({
          status: "NOMINAL",
          uptime: "148,291s",
          version: "EIOS_v4.1.2-beta",
          constitution: "Sovereign Governance Shards Active",
          scheduler: {
            active_cron: "*/5 * * * *",
            last_ping: "0.2s ago",
            pending_jobs: 3
          },
          reallocations_count: 14
        }, null, 2);
      } else if (route === '/agents') {
        json = JSON.stringify({
          active_departments: ["Engineering", "Operations", "Finance", "Legal", "Research"],
          workforce: {
            permanent: 12,
            temporary: workforceSize - 12,
            aggregate: workforceSize
          },
          sub_agents_nodes: 12,
          average_heartbeat_latency: "1.4s"
        }, null, 2);
      } else if (route === '/missions') {
        json = JSON.stringify({
          active_missions: sovrState.missions.map((m: any) => ({ id: m.id, name: m.name, dept: m.dept, progress: m.progress, dependencies: m.dependencies || [] })),
          critical_path_integrity: "98.8%",
          queue_depth: sovrState.missions.filter((m: any) => m.progress < 100).length
        }, null, 2);
      } else if (route === '/memory') {
        json = JSON.stringify({
          total_facts_synced: sovrState.memoryNodes?.length || 18,
          decision_ledger_count: strategicDecisions.length,
          latest_decisions: strategicDecisions,
          context_retrieval_latency: "4ms"
        }, null, 2);
      }
      setApiResponseText(json);
      setIsTestingApi(false);
    }, 700);
  };

  // Helpers for legacy compatibility
  const handleCreateMission = () => {
    if (!newMissionName.trim()) return;
    createMission(newMissionName, newMissionDept);
    setNewMissionName('');
    setNewMissionMilestone('');
    setShowAddMission(false);
    showToast(`Strategic Mission authorized: ${newMissionDept} queue activated`);
  };

  const handleTimeShift = (qVal: '2025-q4' | '2026-q1' | '2026-q2' | '2026-q3' | '2026-q4') => {
    setTimeQuarter(qVal);
    // Modulate WebGL parameters depending on temporal coordinate
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
    showToast(`Time Machine coordinated to ${qVal.toUpperCase()}`);
  };

  return (
    <>
      {/* ACTIVE ROOM DISPLAY - Central Glass Panel Area */}
      <div className={`lg:col-span-4 flex-col gap-3 h-full overflow-hidden ${props.mobileTab === 'central' ? 'flex' : 'hidden lg:flex'}`} id="central-glass-container">
        
        <div className="flex-1 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-3xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 border-t-white/30 border-l-white/20 rounded-2xl p-5 flex flex-col gap-4 shadow-2xl relative overflow-hidden">
          
          {/* Header of Active Room with dynamic theme badges - Sticky and Non-Scrolling */}
          <div className="flex justify-between items-start border-b border-white/[0.08] pb-3 shrink-0">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${sovrState.emergencyDampingActive ? 'bg-white/40 animate-pulse' : 'bg-white/80 animate-ping'} shrink-0`} />
                <span className="text-xs font-sans font-light tracking-wide text-white/90 uppercase tracking-widest font-bold">
                  {sovrState.emergencyDampingActive ? 'EMERGENCY DAMPING PROTOCOL ACTIVE' : 'Sovereign OS Kernel Core Enabled'}
                </span>
              </div>
              <h3 className="text-white font-sans font-light tracking-wide text-sm tracking-wide uppercase font-bold mt-1">
                {activeRoom === 'hq' && 'Core 01: Executive Command'}
                {activeRoom === 'operations' && 'Core 02: Mission Engine'}
                {activeRoom === 'engineering' && 'Core 03: Agent Fabric'}
                {activeRoom === 'finance' && 'Core 04: Workflow Engine'}
                {activeRoom === 'marketing' && 'Core 05: Oracle Ledger'}
                {activeRoom === 'research' && 'Core 06: Memory Engine'}
                {activeRoom === 'legal' && 'Core 07: Observability Dashboard'}
                {activeRoom === 'situation' && 'Core 08: Sovereign Simulation'}
              </h3>
            </div>

            <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded font-sans font-light text-xs tracking-wide text-white/60">
              TIME: {timeQuarter.toUpperCase()}
            </span>
          </div>

          {/* Independent Scroll Area below Sticky Header */}
          <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-4 flex flex-col" id="central-panel-scrollable-content">

            {/* CORE 01: EXECUTIVE COMMAND */}
          {activeRoom === 'hq' && (
            <div className="flex-1 flex flex-col gap-4" id="executive-briefing-container">
              
              {/* ORGANIZATIONAL INTELLIGENCE & CONFIDENCE HEADER */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                
                {/* Confidence Meter Widget */}
                <div className="md:col-span-1 p-4 border border-white/[0.08] bg-white/[0.03] backdrop-blur-[32px] rounded-[16px] flex flex-col justify-between relative overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.5)] min-h-[220px]" id="confidence-meter-card">
                  <div className="absolute inset-x-0 h-[1px] bg-white/[0.08] top-0" />
                  <div className="absolute -right-6 -bottom-6 opacity-[0.03] pointer-events-none">
                    <ShieldCheck className="w-24 h-24 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-sans text-white/50 font-medium tracking-[0.15em] uppercase">
                      <ShieldCheck size={11} className="opacity-50" />
                      <span>Sovereign Confidence</span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-sans font-light text-white tracking-wide tabular-data">{sovrState.organizationalConfidence || 98}%</span>
                      <span className="text-[11px] text-white/40 font-sans font-medium uppercase tracking-[0.1em]">SLA Safe</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 mt-3">
                    <div className="w-full bg-transparent h-[1px] overflow-hidden border-b border-white/[0.08] relative">
                      <div 
                        className="absolute top-0 left-0 h-full bg-white/40 transition-all duration-500" 
                        style={{ width: `${sovrState.organizationalConfidence || 98}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-sans text-white/40 uppercase tracking-widest">
                      <span>Min (85%)</span>
                      <span>Nominal (95%)</span>
                      <span>Max (100%)</span>
                    </div>
                  </div>
                  
                  <p className="text-[11px] text-white/40 leading-relaxed font-sans mt-2.5 border-t border-white/[0.04] pt-2">
                    Auto-calculated from mission success (100%), error zero-margin, and 100% compliance checks.
                  </p>
                </div>

                {/* Cost Intelligence Ledger */}
                <div className="md:col-span-2 p-4 border border-white/[0.08] bg-white/[0.03] backdrop-blur-[32px] rounded-[16px] flex flex-col justify-between relative overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.5)] min-h-[220px]" id="cost-ledger-card">
                  <div className="absolute inset-x-0 h-[1px] bg-white/[0.08] top-0" />
                  <div className="absolute -right-6 -bottom-6 opacity-[0.03] pointer-events-none">
                    <Coins className="w-24 h-24 text-white" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-sans text-white/50 font-medium tracking-[0.15em] uppercase">
                        <Coins size={11} className="opacity-50" />
                        <span>Cost Intelligence Ledger</span>
                      </div>
                      <div className="flex items-baseline gap-1.5 mt-2">
                        <span className="text-4xl font-sans font-light text-white tracking-wide tabular-data">${(sovrState.spendTodayUsd || 62.35).toFixed(2)}</span>
                        <span className="text-[11px] text-white/40 font-sans font-medium uppercase tracking-[0.1em]">Estimated Today's Spend</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-light text-white block tabular-data">$0.17</span>
                      <span className="text-[10px] text-white/40 font-sans uppercase tracking-widest mt-0.5">Avg Cost / Mission</span>
                    </div>
                  </div>

                  <div className="mt-3.5 space-y-2 border-t border-white/[0.04] pt-3">
                    <div className="flex justify-between text-[10px] font-sans text-white/40 uppercase tracking-widest mb-1">
                      <span>Core Share Allocations:</span>
                      <span>Compute Cost Share</span>
                    </div>
                    <div className="flex items-center justify-between text-center font-sans">
                      {Object.entries(sovrState.departmentCosts || { 'Operations': 8.52, 'Engineering': 36.62, 'Finance': 4.92, 'Marketing': 5.00, 'Legal': 7.29 }).map(([dept, cost], idx, arr) => (
                        <React.Fragment key={dept}>
                          <div className="flex-1">
                            <span className="block text-white/50 truncate text-[10px] uppercase tracking-wider">{dept}</span>
                            <span className="text-white/90 font-light block mt-0.5 tabular-data">${cost.toFixed(2)}</span>
                          </div>
                          {idx < arr.length - 1 && <div className="w-[1px] h-6 bg-white/[0.04] mx-2" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Phase IV: EIOS COMPANY PULSE & PREDICTIVE FORECASTER */}
              <div className="p-4 border border-white/[0.08] bg-white/[0.03] backdrop-blur-[32px] rounded-[16px] space-y-3.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden" id="eios-company-pulse-card">
                <div className="absolute inset-x-0 h-[1px] bg-white/[0.08] top-0" />
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                  <div className="flex items-center gap-1.5">
                    <Activity size={12} className="opacity-50" />
                    <span className="text-[11px] font-sans font-medium text-white/50 uppercase tracking-[0.15em]">Company Pulse & Predictive Forecast</span>
                  </div>
                  <span className="px-2 py-0.5 border border-white/[0.08] text-white/60 text-[10px] font-sans rounded uppercase tracking-widest">
                    Pulse Rate: Normal (72 bpm)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                  {/* Pulse Grid */}
                  <div className="md:col-span-7 grid grid-cols-3 gap-[1px] text-center font-sans bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden">
                    <div className="p-2 bg-[#080808] flex flex-col justify-between">
                      <span className="block text-[10px] text-white/40 uppercase font-medium tracking-widest">Momentum</span>
                      <span className="text-[13px] font-light text-white/90 flex items-center justify-center gap-1 mt-0.5 uppercase">
                        <TrendingUp size={10} className="opacity-50" />
                        <span>Surging</span>
                      </span>
                    </div>
                    <div className="p-2 bg-[#080808] flex flex-col justify-between">
                      <span className="block text-[10px] text-white/40 uppercase font-medium tracking-widest">Execution Rate</span>
                      <span className="text-[13px] font-light text-white/90 mt-0.5 block tabular-data">98%</span>
                    </div>
                    <div className="p-2 bg-[#080808] flex flex-col justify-between">
                      <span className="block text-[10px] text-white/40 uppercase font-medium tracking-widest">Innovation Index</span>
                      <span className="text-[13px] font-light text-white/90 mt-0.5 block tabular-data">84%</span>
                    </div>
                    <div className="p-2 bg-[#080808] flex flex-col justify-between">
                      <span className="block text-[10px] text-white/40 uppercase font-medium tracking-widest">Compliance Stat</span>
                      <span className="text-[13px] font-light text-white/90 mt-0.5 block tabular-data">100%</span>
                    </div>
                    <div className="p-2 bg-[#080808] flex flex-col justify-between">
                      <span className="block text-[10px] text-white/40 uppercase font-medium tracking-widest">Financial Stability</span>
                      <span className="text-[13px] font-light text-white/90 mt-0.5 block tabular-data">92%</span>
                    </div>
                    <div className="p-2 bg-[#080808] flex flex-col justify-between">
                      <span className="block text-[10px] text-white/40 uppercase font-medium tracking-widest">Knowledge Growth</span>
                      <span className="text-[13px] font-light text-white/90 mt-0.5 block tabular-data">+14%/wk</span>
                    </div>
                    <div className="p-2 bg-[#080808] flex flex-col justify-between">
                      <span className="block text-[10px] text-white/40 uppercase font-medium tracking-widest">Recovery Time</span>
                      <span className="text-[13px] font-light text-white/90 mt-0.5 block tabular-data">2.1s</span>
                    </div>
                    <div className="p-2 bg-[#080808] flex flex-col justify-between">
                      <span className="block text-[10px] text-white/40 uppercase font-medium tracking-widest">Decision Latency</span>
                      <span className="text-[13px] font-light text-white/90 mt-0.5 block tabular-data">1.4s</span>
                    </div>
                    <div className="p-2 bg-[#080808] flex flex-col justify-between">
                      <span className="block text-[10px] text-white/40 uppercase font-medium tracking-widest">Harmony Score</span>
                      <span className="text-[13px] font-light text-white/90 mt-0.5 block tabular-data">96%</span>
                    </div>
                  </div>

                  {/* Predictive Forecast */}
                  <div className="md:col-span-5 p-3 bg-transparent border border-white/[0.08] rounded-xl space-y-2.5 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-sans text-white/90 uppercase tracking-[0.15em] block font-medium">Predictive Foresight Index</span>
                      <span className="text-[10px] font-sans text-white/40 block uppercase tracking-widest mt-0.5">Real-Time Temporal Projections</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-sans border-b border-white/[0.04] pb-1">
                        <div className="flex items-center gap-1.5 text-white/70">
                          <span className="opacity-40">●</span>
                          <span className="uppercase tracking-wider">Engineering Queue</span>
                        </div>
                        <span className="text-white font-medium uppercase tracking-wider">Critical &lt; 3h</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-sans border-b border-white/[0.04] pb-1">
                        <div className="flex items-center gap-1.5 text-white/70">
                          <span className="opacity-40">●</span>
                          <span className="uppercase tracking-wider">Research Memory</span>
                        </div>
                        <span className="text-white/80 font-medium uppercase tracking-wider">Saturation &lt; 9h</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-sans">
                        <div className="flex items-center gap-1.5 text-white/70">
                          <span className="opacity-40">●</span>
                          <span className="uppercase tracking-wider">Treasury Balance</span>
                        </div>
                        <span className="text-white/60 font-medium uppercase tracking-wider">Surplus Stable</span>
                      </div>
                    </div>

                    <p className="text-[11px] font-sans text-white/40 leading-relaxed border-t border-white/[0.04] pt-2 mt-1">
                      Sovereign OS has pre-scheduled automated task realignments and spun up 4 micro-agents to manage upcoming context shifts.
                    </p>
                  </div>
                </div>
              </div>

              {/* OPERATIONAL INTELLIGENCE / CO-FOUNDER EXECUTIVE BRIEFING HUB */}
              <div className="border border-white/[0.08] rounded-[16px] bg-white/[0.03] backdrop-blur-[32px] p-5 space-y-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden" id="executive-intelligence-hub">
                <div className="absolute inset-x-0 h-[1px] bg-white/[0.08] top-0" />
                <div className="absolute top-0 right-0 p-2 opacity-[0.03]">
                  <Cpu className="w-16 h-16 text-white" />
                </div>
                
                 {/* Header Switcher */}
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 opacity-50" />
                    <span className="text-[11px] font-sans font-medium tracking-[0.15em] text-white/90 uppercase">
                      Executive Briefing & Operations Console
                    </span>
                  </div>
                  <div className="flex gap-1 bg-transparent border border-white/[0.08] p-0.5 rounded-lg">
                    <button
                      onClick={() => setExecutiveView('briefing')}
                      className={`px-3 py-1.5 text-[10px] font-sans tracking-widest uppercase rounded-md transition-all ${
                        executiveView === 'briefing' ? 'bg-white/[0.06] text-white border border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.2)]' : 'text-zinc-500 hover:text-white/80 border border-transparent'
                      }`}
                    >
                      Co-Founder Brief
                    </button>
                    <button
                      onClick={() => setExecutiveView('workspace')}
                      className={`px-3 py-1.5 text-[10px] font-sans tracking-widest uppercase rounded-md transition-all ${
                        executiveView === 'workspace' ? 'bg-white/[0.06] text-white border border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.2)]' : 'text-zinc-500 hover:text-white/80 border border-transparent'
                      }`}
                    >
                      Workspace Nodes
                    </button>
                    <button
                      onClick={() => setExecutiveView('feed')}
                      className={`px-3 py-1.5 text-[10px] font-sans tracking-widest uppercase rounded-md transition-all ${
                        executiveView === 'feed' ? 'bg-white/[0.06] text-white border border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.2)]' : 'text-zinc-500 hover:text-white/80 border border-transparent'
                      }`}
                    >
                      Diagnostics Feed
                    </button>
                  </div>
                </div>

                {executiveView === 'briefing' && (
                  <div className="space-y-5" id="cofounder-briefing-view">
                    <div className="text-zinc-400 font-sans font-light text-[13px] tracking-wide">
                      Good evening <span className="text-white font-medium">Gustavo</span>.
                    </div>
                    
                    <ul className="space-y-4 font-sans text-xs font-light text-white/80 tracking-wide leading-relaxed pl-1">
                      <li className="flex items-start gap-4">
                        <span className="text-[10px] font-sans font-medium text-white/50 uppercase tracking-[0.15em] shrink-0 mt-0.5 w-24">Engineering</span>
                        <span>Completed <span className="text-white font-medium">14 missions</span> today. Autonomous nodes deployed Zurich servers successfully.</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="text-[10px] font-sans font-medium text-white/50 uppercase tracking-[0.15em] shrink-0 mt-0.5 w-24">Finance</span>
                        <span>Treasury is operating safely within reserve and escrow thresholds. Current liquid sharding: <span className="text-white font-medium">nominal</span>.</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="text-[10px] font-sans font-medium text-white/50 uppercase tracking-[0.15em] shrink-0 mt-0.5 w-24">Research</span>
                        <span>Discovered <span className="text-white font-medium">three critical architectural improvements</span> in long-term semantic archives.</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="text-[10px] font-sans font-medium text-white/50 uppercase tracking-[0.15em] shrink-0 mt-0.5 w-24">Marketing</span>
                        <span>Campaign goals exceeded by <span className="text-white font-medium tabular-data">18%</span> with full oracle ledger validations.</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="text-[10px] font-sans font-medium text-white/50 uppercase tracking-[0.15em] shrink-0 mt-0.5 w-24">Legal</span>
                        <span>One high-priority <span className="text-white font-medium underline cursor-pointer hover:text-white/80 transition-colors" onClick={() => { if(setRightTab) { setRightTab('approvals'); showToast("Routing to approvals panel..."); } }}>legal compliance review</span> requires manual approval in the sidebar.</span>
                      </li>
                    </ul>

                    <div className="border-t border-white/[0.04] pt-4 mt-2">
                      <div className="p-4 border border-white/[0.08] bg-transparent rounded-xl space-y-3 relative overflow-hidden">
                        <div className="absolute inset-x-0 h-[1px] bg-white/[0.04] top-0" />
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 opacity-60" />
                          <span className="text-[11px] font-sans text-white/90 font-medium uppercase tracking-[0.15em]">AI Chief of Staff Recommendation</span>
                        </div>
                        <p className="text-[13px] font-sans font-light text-white/80 leading-relaxed">
                          "I recommend reallocating <span className="text-white font-medium">6 compute cores</span> from <span className="text-white font-medium">Research</span> to <span className="text-white font-medium">Engineering</span> until deployment concludes to prevent latency drift."
                        </p>
                        <div className="grid grid-cols-2 gap-px bg-white/[0.04] border border-white/[0.08] rounded-lg text-center text-[11px] font-sans overflow-hidden">
                          <div className="p-2 bg-[#080808]">
                            <span className="text-white/40 block uppercase text-[10px] tracking-widest">Estimated Improvement</span>
                            <span className="text-white/90 font-light text-xs mt-1 block tracking-wide">+12% Throughput</span>
                          </div>
                          <div className="p-2 bg-[#080808]">
                            <span className="text-white/40 block uppercase text-[10px] tracking-widest">Estimated Cost Savings</span>
                            <span className="text-white/90 font-light text-xs mt-1 block tracking-wide tabular-data">$184/Day Saved</span>
                          </div>
                        </div>
                        <div className="pt-2 flex justify-end">
                          {reallocatedViaBriefing ? (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 border border-white/[0.08] text-white/60 text-[10px] font-sans uppercase rounded-md tracking-widest">
                              <CheckCircle size={12} className="opacity-50" />
                              <span>Recommendation Executed</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                if (reallocateCompute) {
                                  const success = reallocateCompute('Research', 'Engineering', 6);
                                  if (success) {
                                    setReallocatedViaBriefing(true);
                                    showToast("Chief of Staff: Compute reallocated! Research -6 Cores | Engineering +6 Cores.");
                                  } else {
                                    showToast("Error: Research has insufficient cores.");
                                  }
                                } else {
                                  // Fallback direct mutation
                                  if (sovrState.computeAllocation) {
                                    sovrState.computeAllocation['Research'] = (sovrState.computeAllocation['Research'] || 34) - 6;
                                    sovrState.computeAllocation['Engineering'] = (sovrState.computeAllocation['Engineering'] || 28) + 6;
                                    setReallocatedViaBriefing(true);
                                    showToast("Chief of Staff: Compute reallocated! Research -6 Cores | Engineering +6 Cores.");
                                  }
                                }
                              }}
                              className="px-4 py-2 border border-white/[0.08] hover:bg-white/[0.04] text-white rounded-md text-[10px] uppercase tracking-widest font-sans font-medium transition-all"
                            >
                              Execute System Reallocation
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Phase IV: Sovereign Dynamic Workforce scaling */}
                    <div className="p-3 border border-white/10 bg-white/[0.01] rounded-xl space-y-2.5">
                      <div className="flex justify-between items-center border-b border-white/[0.05] pb-2">
                        <div className="flex items-center gap-1.5">
                          <Users size={12} className="text-white/60" />
                          <span className="text-[10px] font-sans text-white/60 uppercase tracking-wider font-semibold">Dynamic Workforce Manager</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                          <span className="text-[9px] font-sans text-zinc-400 uppercase font-semibold">{workforceSize} Active Nodes</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[11px] font-sans">
                          <span className="text-zinc-400">Autonomous Autoscaling Gate</span>
                          <button
                            onClick={() => {
                              setIsWorkforceExpanded(!isWorkforceExpanded);
                              if (!isWorkforceExpanded) {
                                setWorkforceSize(48);
                                showToast("Dynamic Workforce: Autonomous scaling enabled. Capacity set to 48 nodes.");
                              } else {
                                setWorkforceSize(28);
                                showToast("Dynamic Workforce: Restored default capacity configuration (28 nodes).");
                              }
                            }}
                            className={`px-2 py-1 text-[9px] font-sans uppercase rounded border transition-all ${
                              isWorkforceExpanded
                                ? 'bg-white/10 border-white/20 text-white font-medium'
                                : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
                            }`}
                          >
                            {isWorkforceExpanded ? 'Active (Auto)' : 'Manual Cap'}
                          </button>
                        </div>

                        {/* Slider to adjust size manually if on manual cap */}
                        <div className="space-y-1 text-[10px] font-sans">
                          <div className="flex justify-between text-zinc-400 text-[9px] uppercase tracking-wider font-medium">
                            <span>Agent Concurrency Depth</span>
                            <span className="text-white font-semibold">{workforceSize} Node Cores</span>
                          </div>
                          <input
                            type="range"
                            min="12"
                            max="64"
                            value={workforceSize}
                            disabled={isWorkforceExpanded}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setWorkforceSize(val);
                            }}
                            className="w-full accent-white cursor-pointer opacity-80 hover:opacity-100 disabled:opacity-40"
                          />
                          <div className="flex justify-between text-[8px] text-zinc-500">
                            <span>Min (12 Permanent Roles)</span>
                            <span>Max (64 Clusters)</span>
                          </div>
                        </div>

                        <p className="text-[10px] font-sans text-white/50 leading-relaxed italic pt-1 border-t border-white/[0.04]">
                          Governed execution applies: Agent roles are containerized as ephemeral pods and are spun down when the dependency tree clears.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {executiveView === 'workspace' && (
                  <WorkspaceConsole showToast={showToast} />
                )}

                {executiveView === 'feed' && (
                  <div className="space-y-3.5 divide-y divide-white/[0.06]" id="four-questions-feed">
                    {operationalAnswers.map((item, idx) => (
                      <div key={idx} className={`pt-3 ${idx === 0 ? 'pt-0' : ''} space-y-1`}>
                        <div className="flex justify-between items-center text-[10px] font-sans font-semibold tracking-wide uppercase">
                          <span className="text-white/65">{item.question}</span>
                          {item.urgency === 'CRITICAL' && (
                            <span className="px-1.5 py-0.2 bg-white/10 border border-white/20 text-white/90 text-[8px] rounded uppercase font-sans animate-pulse font-semibold">
                              Critical Attention Required
                            </span>
                          )}
                          {item.urgency === 'LOW' && (
                            <span className="px-1.5 py-0.2 bg-white/5 border border-white/10 text-white/70 text-[8px] rounded uppercase font-sans font-semibold">
                              Managed by Sovereign OS
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-sans font-light tracking-wide text-white/90 leading-relaxed">
                          {item.answer}
                        </p>
                        {item.systemSummary && (
                          <div className="text-[9px] font-sans text-white/40 uppercase tracking-wide font-medium">
                            {item.systemSummary}
                          </div>
                        )}
                        {item.actionableLink === 'approvals' && (
                          <button 
                            onClick={() => { if(setRightTab) { setRightTab('approvals'); showToast("Routing to approvals..."); } }}
                            className="mt-1.5 text-[10px] text-white/90 hover:text-white flex items-center gap-1 underline font-sans font-semibold tracking-wider"
                          >
                            <ArrowUpRight size={10} />
                            <span>Resolve compliance hazards in Core 05</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CO-FOUNDER COGNITIVE TWIN & EIOS OPERATING SYSTEM VIEWS */}
              <div className="border border-white/10 rounded-xl bg-white/[0.03] backdrop-blur-3xl p-4 space-y-3 relative overflow-hidden flex flex-col gap-1.5" id="cognitive-twin-panel">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/[0.08] pb-2.5 gap-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-white/60" />
                    <span className="text-[10px] font-sans text-white/60 uppercase tracking-wider font-semibold">Sovereign Executive OS Environment</span>
                  </div>
                  <div className="flex gap-1 bg-zinc-950/40 p-1 border border-white/10 rounded-lg">
                    <button
                      onClick={() => setHqViewSubTab('twins')}
                      className={`px-2 py-0.5 text-[9px] font-sans tracking-wide uppercase rounded transition-all ${
                        hqViewSubTab === 'twins' ? 'bg-white/10 text-white border border-white/20' : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      Digital Twins
                    </button>
                    <button
                      onClick={() => setHqViewSubTab('physics')}
                      className={`px-2 py-0.5 text-[9px] font-sans tracking-wide uppercase rounded transition-all ${
                        hqViewSubTab === 'physics' ? 'bg-white/10 text-white border border-white/20' : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      Org Physics
                    </button>
                    <button
                      onClick={() => setHqViewSubTab('sandbox')}
                      className={`px-2 py-0.5 text-[9px] font-sans tracking-wide uppercase rounded transition-all ${
                        hqViewSubTab === 'sandbox' ? 'bg-white/10 text-white border border-white/20' : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      API Sandbox
                    </button>
                  </div>
                </div>

                {/* Sub-tab selection indicator subheader */}
                {hqViewSubTab === 'twins' && (
                  <div className="flex justify-between items-center bg-white/[0.01] p-1 rounded border border-white/[0.08] text-[10px] font-sans">
                    <span className="text-white/45 font-semibold uppercase tracking-wider text-[8px]">Organizational Graph Graphics</span>
                    <div className="flex gap-1 bg-zinc-900/40 p-0.5 border border-white/5 rounded">
                      <button
                        onClick={() => setTwinViewMode('graph')}
                        className={`px-1.5 py-0.2 text-[8px] font-sans uppercase rounded ${
                          twinViewMode === 'graph' ? 'bg-white/10 text-white' : 'text-zinc-500'
                        }`}
                      >
                        Graph view
                      </button>
                      <button
                        onClick={() => setTwinViewMode('orb')}
                        className={`px-1.5 py-0.2 text-[8px] font-sans uppercase rounded ${
                          twinViewMode === 'orb' ? 'bg-white/10 text-white' : 'text-zinc-500'
                        }`}
                      >
                        Orb view
                      </button>
                    </div>
                  </div>
                )}

                {hqViewSubTab === 'twins' && (
                  <>
                    {twinViewMode === 'orb' ? (
                  <div className="h-[240px] bg-white/[0.01] rounded-xl border border-white/5 flex flex-col items-center justify-center text-center p-6 gap-3">
                    <div className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-900/40 flex items-center justify-center text-zinc-400 animate-spin" style={{ animationDuration: '15s' }}>
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-semibold text-white uppercase font-sans tracking-wider">Orbital Singularity Engaged</h5>
                      <p className="text-[10px] text-zinc-500 leading-relaxed max-w-xs mt-1">
                        The full-screen WebGL cosmic backdrop is synced. Rotate or zoom with mouse controls on the background canvas to warp spacetime density.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="relative h-[240px] bg-black/40 rounded-xl border border-white/10 overflow-hidden">
                      <svg viewBox="0 0 600 240" className="w-full h-full">
                        <defs>
                          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                          <filter id="glow-rose" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>

                        {/* CONNECTION LINES WITH PARTICLES ANIMATING */}
                        <g id="connections">
                          {/* Executive to Engineering */}
                          <path id="path-eng" d="M 300 120 L 140 60" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                          <circle r="3" fill="#a855f7" filter="url(#glow-cyan)">
                            <animateMotion dur="2.5s" repeatCount="indefinite" path="M 300 120 L 140 60" />
                          </circle>

                          {/* Executive to Finance */}
                          <path id="path-fin" d="M 300 120 L 460 60" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                          <circle r="3" fill="#f59e0b">
                            <animateMotion dur="3s" repeatCount="indefinite" path="M 300 120 L 460 60" />
                          </circle>

                          {/* Executive to Operations */}
                          <path id="path-ops" d="M 300 120 L 140 180" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                          <circle r="3" fill="#10b981">
                            <animateMotion dur="3.5s" repeatCount="indefinite" path="M 300 120 L 140 180" />
                          </circle>

                          {/* Executive to Research */}
                          <path id="path-res" d="M 300 120 L 460 180" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                          <circle r="3" fill="#6366f1">
                            <animateMotion dur="4s" repeatCount="indefinite" path="M 300 120 L 460 180" />
                          </circle>

                          {/* Executive to Legal (Glows Amber/Rose because legal review is pending) */}
                          <path id="path-leg" d="M 300 120 L 300 30" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                          <circle r="4" fill="#f43f5e" filter="url(#glow-rose)">
                            <animateMotion dur="1.8s" repeatCount="indefinite" path="M 300 120 L 300 30" />
                          </circle>

                          {/* Executive to Oracle */}
                          <path id="path-orc" d="M 300 120 L 300 210" stroke="rgba(6, 182, 212, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                          <circle r="3" fill="#06b6d4">
                            <animateMotion dur="2.8s" repeatCount="indefinite" path="M 300 120 L 300 210" />
                          </circle>
                        </g>

                        {/* INTERACTIVE NODES */}
                        <g id="nodes">
                          {/* Executive Core (Center) */}
                          <g className="cursor-pointer font-sans" onClick={() => setSelectedTwinNode('Executive')}>
                            <circle cx={300} cy={120} r={20} className={`transition-all ${selectedTwinNode === 'Executive' ? 'fill-white/10 stroke-white/40 stroke-2' : 'fill-black/80 stroke-white/20'}`} />
                            <circle cx={300} cy={120} r={13} className="fill-white/10 stroke-white/40 animate-pulse" />
                            <text x={300} y={123} textAnchor="middle" className="fill-white font-sans font-bold text-[8px] tracking-wider">CORE</text>
                          </g>

                          {/* Engineering (CTO Spark) */}
                          <g className="cursor-pointer" onClick={() => setSelectedTwinNode('Engineering')}>
                            <circle cx={140} cy={60} r={16} className={`transition-all ${selectedTwinNode === 'Engineering' ? 'fill-white/10 stroke-white/40 stroke-2' : 'fill-black/80 stroke-white/20'}`} />
                            <text x={140} y={63} textAnchor="middle" className="fill-white/80 font-sans text-[8px] font-semibold">CTO</text>
                            <text x={140} y={90} textAnchor="middle" className="fill-zinc-500 font-sans text-[7px] uppercase tracking-wider">Engineering</text>
                          </g>

                          {/* Finance (CFO Ledger) */}
                          <g className="cursor-pointer" onClick={() => setSelectedTwinNode('Finance')}>
                            <circle cx={460} cy={60} r={16} className={`transition-all ${selectedTwinNode === 'Finance' ? 'fill-white/10 stroke-white/40 stroke-2' : 'fill-black/80 stroke-white/20'}`} />
                            <text x={460} y={63} textAnchor="middle" className="fill-white/80 font-sans text-[8px] font-semibold">CFO</text>
                            <text x={460} y={90} textAnchor="middle" className="fill-zinc-500 font-sans text-[7px] uppercase tracking-wider">Finance</text>
                          </g>

                          {/* Operations (COO Flow) */}
                          <g className="cursor-pointer" onClick={() => setSelectedTwinNode('Operations')}>
                            <circle cx={140} cy={180} r={16} className={`transition-all ${selectedTwinNode === 'Operations' ? 'fill-white/10 stroke-white/40 stroke-2' : 'fill-black/80 stroke-white/20'}`} />
                            <text x={140} y={183} textAnchor="middle" className="fill-white/80 font-sans text-[8px] font-semibold">COO</text>
                            <text x={140} y={210} textAnchor="middle" className="fill-zinc-500 font-sans text-[7px] uppercase tracking-wider">Operations</text>
                          </g>

                          {/* Research (Intel Engine) */}
                          <g className="cursor-pointer" onClick={() => setSelectedTwinNode('Research')}>
                            <circle cx={460} cy={180} r={16} className={`transition-all ${selectedTwinNode === 'Research' ? 'fill-white/10 stroke-white/40 stroke-2' : 'fill-black/80 stroke-white/20'}`} />
                            <text x={460} y={183} textAnchor="middle" className="fill-white/80 font-sans text-[8px] font-semibold">INT</text>
                            <text x={460} y={210} textAnchor="middle" className="fill-zinc-500 font-sans text-[7px] uppercase tracking-wider">Research</text>
                          </g>

                          {/* Legal (glowing amber/rose because it is blocked/attention required) */}
                          <g className="cursor-pointer animate-pulse" onClick={() => setSelectedTwinNode('Legal')}>
                            <circle cx={300} cy={30} r={14} className={`transition-all ${selectedTwinNode === 'Legal' ? 'fill-white/10 stroke-white/40 stroke-2' : 'fill-white/10 stroke-white/20'}`} />
                            <text x={300} y={33} textAnchor="middle" className="fill-white/80 font-sans text-[8px] font-semibold">LAW</text>
                            <text x={300} y={12} textAnchor="middle" className="fill-white/80 font-sans text-[7px] uppercase tracking-wider font-bold">Compliance Blocker</text>
                          </g>

                          {/* Oracle */}
                          <g className="cursor-pointer" onClick={() => setSelectedTwinNode('Oracle')}>
                            <circle cx={300} cy={210} r={14} className={`transition-all ${selectedTwinNode === 'Oracle' ? 'fill-white/10 stroke-white/40 stroke-2' : 'fill-black/80 stroke-white/20'}`} />
                            <text x={300} y={213} textAnchor="middle" className="fill-white/80 font-sans text-[8px] font-semibold">ORC</text>
                            <text x={300} y={235} textAnchor="middle" className="fill-zinc-500 font-sans text-[7px] uppercase tracking-wider">Oracle Ledger</text>
                          </g>
                        </g>
                      </svg>
                    </div>

                    {/* Dynamic Detail Overlay for Selected Twin Node */}
                    {selectedTwinNode && (
                      <div className="p-3 border border-white/10 bg-white/[0.01] rounded-xl space-y-2 relative transition-all duration-300">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-sans text-white/40 uppercase tracking-wide font-medium">System Diagnostic Profile</span>
                            <h5 className="text-white font-sans font-bold text-xs uppercase mt-0.5">
                              {selectedTwinNode === 'Executive' && 'Sovereign Executive Core (Chief of Staff)'}
                              {selectedTwinNode === 'Engineering' && 'Core 03 Agent Fabric (CTO Shard)'}
                              {selectedTwinNode === 'Finance' && 'Core 04 Workflow Engine (CFO Ledger)'}
                              {selectedTwinNode === 'Operations' && 'Core 02 Mission Engine (COO Flow)'}
                              {selectedTwinNode === 'Research' && 'Core 06 Memory Engine (Intel Hub)'}
                              {selectedTwinNode === 'Legal' && 'Core 07 Observability Guard (Law-Compliance)'}
                              {selectedTwinNode === 'Oracle' && 'Core 05 Ledger & Feeds (Queue Monitor)'}
                            </h5>
                          </div>
                          <span className={`px-1.5 py-0.5 text-[8px] font-sans uppercase rounded font-semibold border ${
                            selectedTwinNode === 'Legal' 
                              ? 'bg-white/10 text-white/90 border-white/20 animate-pulse' 
                              : 'bg-white/5 text-white/70 border-white/10'
                          }`}>
                            {selectedTwinNode === 'Legal' ? 'Action Required' : 'Nominal State'}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 py-1.5 border-t border-b border-white/[0.05] text-[9.5px] font-sans text-white/70">
                          <div>
                            <span className="text-white/40 block uppercase text-[7px] tracking-wide">Operational Health</span>
                            <span className={`font-semibold mt-0.5 block ${selectedTwinNode === 'Legal' ? 'text-white/40' : 'text-white/80'}`}>
                              {selectedTwinNode === 'Executive' && '98.5%'}
                              {selectedTwinNode === 'Engineering' && '95.2%'}
                              {selectedTwinNode === 'Finance' && '100%'}
                              {selectedTwinNode === 'Operations' && '92.0%'}
                              {selectedTwinNode === 'Research' && '100%'}
                              {selectedTwinNode === 'Legal' && '84.0%'}
                              {selectedTwinNode === 'Oracle' && '99.1%'}
                            </span>
                          </div>
                          <div>
                            <span className="text-white/40 block uppercase text-[7px] tracking-wide">Compute Cores</span>
                            <span className="text-white font-semibold mt-0.5 block">
                              {selectedTwinNode === 'Executive' && `${sovrState.computeAllocation?.['Executive'] || 12} Cores`}
                              {selectedTwinNode === 'Engineering' && `${sovrState.computeAllocation?.['Engineering'] || 28} Cores`}
                              {selectedTwinNode === 'Finance' && `${sovrState.computeAllocation?.['Finance'] || 8} Cores`}
                              {selectedTwinNode === 'Operations' && 'Dynamic Reserve'}
                              {selectedTwinNode === 'Research' && `${sovrState.computeAllocation?.['Research'] || 34} Cores`}
                              {selectedTwinNode === 'Legal' && `${sovrState.computeAllocation?.['Legal'] || 6} Cores`}
                              {selectedTwinNode === 'Oracle' && 'System Sync'}
                            </span>
                          </div>
                          <div>
                            <span className="text-white/40 block uppercase text-[7px] tracking-wide">Thread Status</span>
                            <span className={`font-semibold mt-0.5 block ${selectedTwinNode === 'Legal' ? 'text-white/40' : 'text-white/80'}`}>
                              {selectedTwinNode === 'Legal' ? 'Blocked' : 'Nominal'}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] font-sans font-light text-white/60 leading-relaxed">
                          {selectedTwinNode === 'Executive' && 'Coordinates inter-departmental workflows, executes real-time core swaps, and hosts the Sentinel AI persona acting as co-founder.'}
                          {selectedTwinNode === 'Engineering' && 'Distributed processing layer hosting autonomous code-compilers and containerization modules. High deployment affinity.'}
                          {selectedTwinNode === 'Finance' && 'Manages smart compounders and tracks gas optimizations. Treasury operating safely within automated SLA ranges.'}
                          {selectedTwinNode === 'Operations' && 'Synthesizes task lists into real-time operational trees. Oversees task completion queues and maps strategic dependencies.'}
                          {selectedTwinNode === 'Research' && 'Stores long-term archives, historical decision logs, and cryptographically signed memory folders.'}
                          {selectedTwinNode === 'Legal' && 'Monitors escrow compliance and flags transactions that exceed variance. ALERT: 1 compliance review is blocked in sidebar approvals!'}
                          {selectedTwinNode === 'Oracle' && 'Synchronizes off-chain event logs and tracks message feeds across the Sovereign OS microservices.'}
                        </p>

                        {selectedTwinNode === 'Legal' && (
                          <div className="pt-1 flex justify-end">
                            <button
                              onClick={() => {
                                  if (setRightTab) {
                                    setRightTab('approvals');
                                    showToast("Teleporting to Co-founder Audit Board...");
                                  }
                              }}
                              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white/90 hover:text-white rounded-lg text-[10px] uppercase font-sans font-semibold tracking-wider transition-all animate-bounce"
                            >
                              Resolve Compliance Approvals
                            </button>
                          </div>
                        )}
                        {selectedTwinNode === 'Engineering' && (
                          <div className="pt-1 flex justify-end">
                            <button
                              onClick={() => {
                                setActiveRoom('engineering');
                                showToast("Teleporting to Core 03: Agent Fabric...");
                              }}
                              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white/90 hover:text-white rounded-lg text-[10px] uppercase font-sans font-semibold tracking-wider transition-all"
                            >
                              Teleport to Agent Fabric
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

                {/* hqViewSubTab === 'physics' (Sovereign Physics & Weight Balancer) */}
                {hqViewSubTab === 'physics' && (
                  <div className="space-y-3.5 py-1 animate-fadeIn">
                    <div className="p-3 bg-white/[0.01] border border-white/10 rounded-xl space-y-2.5">
                      <div className="flex justify-between items-center border-b border-white/[0.05] pb-2">
                        <div>
                          <span className="text-[10px] font-sans text-white/80 uppercase tracking-wide block font-semibold">Sovereign Physics Weight Configuration</span>
                          <span className="text-[8px] font-sans text-white/40 block uppercase mt-0.5">Real-Time Decentralized Co-founder Coordination</span>
                        </div>
                        <span className="text-[10px] font-sans text-white/60 font-semibold uppercase">
                          Total Allocation: {(Object.values(orgWeights) as number[]).reduce((a: number, b: number) => a + b, 0)}%
                        </span>
                      </div>

                      <div className="space-y-3">
                        {(Object.entries(orgWeights) as [string, number][]).map(([dept, val]) => (
                          <div key={dept} className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] font-sans">
                              <span className="text-zinc-300 font-semibold">{dept}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    const next = Math.max(0, val - 5);
                                    setOrgWeights(prev => ({ ...prev, [dept]: next }));
                                  }}
                                  className="w-4 h-4 bg-white/5 border border-white/10 text-zinc-400 hover:text-white rounded flex items-center justify-center text-[10px] font-bold"
                                >
                                  -
                                </button>
                                <span className="text-white w-8 text-center font-semibold">{val}%</span>
                                <button
                                  onClick={() => {
                                    const next = Math.min(100, val + 5);
                                    setOrgWeights(prev => ({ ...prev, [dept]: next }));
                                  }}
                                  className="w-4 h-4 bg-white/5 border border-white/10 text-zinc-400 hover:text-white rounded flex items-center justify-center text-[10px] font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/[0.05]">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  dept === 'Engineering' ? 'bg-white/40' :
                                  dept === 'Finance' ? 'bg-white/50' :
                                  dept === 'Legal' ? 'bg-white/30' :
                                  dept === 'Operations' ? 'bg-white/70' : 'bg-white/60'
                                }`}
                                style={{ width: `${val}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Reasoning Box based on highest weight */}
                    <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <Cpu size={12} className="text-white/60 animate-spin" style={{ animationDuration: '6s' }} />
                        <span className="text-[10px] font-sans text-white/80 font-semibold uppercase tracking-wider">Physics Model Inference</span>
                      </div>
                      <p className="text-[11px] font-sans text-white/85 leading-relaxed">
                        {(() => {
                          const maxEntry = Object.entries(orgWeights).reduce((max, entry) => entry[1] > max[1] ? entry : max);
                          if (maxEntry[0] === 'Engineering') {
                            return "Engineering Affinity Active: Scaling computational resources has been prioritised. Global code compilation speeds accelerated by +18%, but hourly fee structures scaled to $12.40/hr.";
                          } else if (maxEntry[0] === 'Finance') {
                            return "Finance Affinity Active: High-frequency gas optimization and yield-bearing compounders prioritized. Fee overheads reduced by 32% while locking strategic reserves.";
                          } else if (maxEntry[0] === 'Legal') {
                            return "Legal / Compliance Affinity Active: System SLA compliance checks run on every microservice call. Security levels maximum, though micro-latencies are expanded by 8ms.";
                          } else if (maxEntry[0] === 'Operations') {
                            return "Operations Affinity Active: Task dependencies and mission timelines prioritized. Inter-departmental coordination has shifted to real-time sync nodes.";
                          } else {
                            return "Research Affinity Active: Deep semantic clustering and context vector updates prioritized. AI model coherence scores increased by 8.4% globally.";
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                )}

                {/* hqViewSubTab === 'sandbox' (EIOS API & Service Sandbox Explorer) */}
                {hqViewSubTab === 'sandbox' && (
                  <div className="space-y-3 animate-fadeIn">
                    <p className="text-[10px] font-sans text-zinc-400 leading-normal">
                      The SOVR console is styled as a visual portal onto EIOS microservices. Gustaf and co-founders can query the real-time kernel gateways over raw JSON REST endpoints.
                    </p>

                    <div className="grid grid-cols-4 gap-1.5 font-sans">
                      {['/kernel', '/agents', '/missions', '/memory'].map(route => (
                        <button
                          key={route}
                          onClick={() => {
                            setSelectedApiRoute(route);
                            setApiResponseText('');
                          }}
                          className={`p-1.5 border rounded text-[9.5px] text-center transition-all font-sans uppercase tracking-wider ${
                            selectedApiRoute === route
                              ? 'bg-white/10 border-white/20 text-white/90 font-semibold'
                              : 'bg-black/25 border-white/5 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {route}
                        </button>
                      ))}
                    </div>

                    {/* Code Snippet box */}
                    <div className="p-2.5 bg-zinc-950 border border-white/10 rounded-lg space-y-1">
                      <div className="flex justify-between items-center text-[8px] font-sans text-white/40 uppercase tracking-wide pb-1 border-b border-white/[0.05]">
                        <span>Query Snippet (TypeScript)</span>
                        <span>ES Module</span>
                      </div>
                      <pre className="text-[9px] font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                        {selectedApiRoute === '/kernel' && `import { EIOS } from '@sovr/kernel';\nconst sdk = new EIOS({ token: process.env.EIOS_JWT });\nconst status = await sdk.getKernelStatus();`}
                        {selectedApiRoute === '/agents' && `import { EIOS } from '@sovr/kernel';\nconst sdk = new EIOS({ token: process.env.EIOS_JWT });\nconst agents = await sdk.agents.getRegistry();`}
                        {selectedApiRoute === '/missions' && `import { EIOS } from '@sovr/kernel';\nconst sdk = new EIOS({ token: process.env.EIOS_JWT });\nconst tree = await sdk.missions.getTacticalTree();`}
                        {selectedApiRoute === '/memory' && `import { EIOS } from '@sovr/kernel';\nconst sdk = new EIOS({ token: process.env.EIOS_JWT });\nconst ledger = await sdk.memory.getStrategicLedger();`}
                      </pre>
                    </div>

                    {/* Test button & output */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center font-sans">
                        <span className="text-[8.5px] text-white/40 uppercase tracking-wider font-medium">Interactive REST Gateway Sandbox</span>
                        <button
                          onClick={() => handleTestApi(selectedApiRoute)}
                          disabled={isTestingApi}
                          className="px-2 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-[9.5px] text-white/90 font-semibold hover:text-white transition-all flex items-center gap-1 uppercase tracking-wider"
                        >
                          {isTestingApi ? <RefreshCw size={8} className="animate-spin" /> : <Play size={8} />}
                          <span>{isTestingApi ? 'Transmitting...' : 'Execute Request'}</span>
                        </button>
                      </div>

                      <div className="p-2.5 bg-black/60 border border-white/5 rounded-lg font-mono text-[9px] min-h-[80px] max-h-[140px] overflow-y-auto relative">
                        {apiResponseText ? (
                          <pre className="text-white/70 leading-tight whitespace-pre">{apiResponseText}</pre>
                        ) : (
                          <div className="text-zinc-500 flex flex-col items-center justify-center h-full py-4 text-center font-sans">
                            <span>Ready to dispatch secure TLS query</span>
                            <span className="text-[8px] text-zinc-600 mt-0.5 uppercase tracking-wider">Click "Execute Request" to test endpoint routing</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Strategic Plan Priority */}
              <div className="p-3.5 bg-white/[0.01] border border-white/10 rounded-xl space-y-2">
                <div className="flex justify-between items-center font-sans">
                  <span className="text-[9px] text-white/40 uppercase tracking-wide">Active Objective Priority</span>
                  <span className="px-1.5 py-0.5 bg-white/10 text-white/90 border border-white/20 text-[8px] rounded font-semibold uppercase">
                    Consensus Agreement: {sovrState.executivePlan.consensusAgreement}%
                  </span>
                </div>
                <h4 className="text-white text-xs font-semibold font-sans uppercase tracking-wide">
                  {sovrState.executivePlan.strategicPriority}
                </h4>
                <p className="text-xs font-sans text-white/60 leading-relaxed">
                  Current Execution Vector: {sovrState.executivePlan.currentObjective}
                </p>
              </div>

              {/* Quick Core Directory Sparklines */}
              <div className="grid grid-cols-2 gap-2.5 font-sans">
                <div className="p-2.5 bg-white/[0.01] border border-white/10 rounded-xl flex flex-col justify-between">
                  <span className="text-[9px] text-white/40 uppercase tracking-wide">Core 03 Load Status</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-sm font-semibold text-white">{sovrState.currentCpu}% CPU</span>
                    <span className="text-[8px] text-zinc-400 uppercase tracking-wide">
                      Latency {Math.round(sovrState.agents.reduce((acc, a) => acc + a.latencyMs, 0) / sovrState.agents.length)}ms
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-white/[0.01] border border-white/10 rounded-xl flex flex-col justify-between">
                  <span className="text-[9px] text-white/40 uppercase tracking-wide">Oracle Event Queue</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-sm font-semibold text-white">{sovrState.events.length} logs/hr</span>
                    <span className="text-[8px] text-zinc-400 uppercase tracking-wide font-medium">
                      Liquidity Score: {sovrState.complianceScore}%
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* CORE 02: MISSION ENGINE */}
          {activeRoom === 'operations' && (
            <div className="flex-1 flex flex-col gap-4" id="mission-engine-container">
              
              {/* HEADER WITH VIEW MODE TOGGLER */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/[0.08] pb-4">
                <div>
                  <span className="text-[11px] font-sans font-medium tracking-[0.15em] text-white/90 uppercase block">Tactical Mission Core</span>
                  <span className="text-[10px] font-sans text-white/40 uppercase tracking-widest mt-1">Automated Task Dependency Lifecycle Optimizer</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 bg-transparent p-0.5 border border-white/[0.08] rounded-lg">
                    <button
                      onClick={() => setOperationsView('dependencies')}
                      className={`px-3 py-1.5 text-[10px] font-sans tracking-widest uppercase rounded-md transition-all ${
                        operationsView === 'dependencies' ? 'bg-white/[0.06] text-white border border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.2)]' : 'text-zinc-500 hover:text-white/80 border-transparent border'
                      }`}
                    >
                      Visual Dependency Grid
                    </button>
                    <button
                      onClick={() => setOperationsView('list')}
                      className={`px-3 py-1.5 text-[10px] font-sans tracking-widest uppercase rounded-md transition-all ${
                        operationsView === 'list' ? 'bg-white/[0.06] text-white border border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.2)]' : 'text-zinc-500 hover:text-white/80 border-transparent border'
                      }`}
                    >
                      Tactical List
                    </button>
                  </div>

                  <button 
                    onClick={() => setShowAddMission(!showAddMission)}
                    className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] text-white font-sans font-medium text-[10px] tracking-widest uppercase rounded-md hover:bg-white/[0.08] transition-all flex items-center gap-1.5"
                  >
                    <Plus size={10} className="opacity-60" />
                    <span>Deploy</span>
                  </button>
                </div>
              </div>

              {/* Spawn Custom Mission Panel */}
              {showAddMission && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white/[0.03] backdrop-blur-[32px] border border-white/[0.08] rounded-[16px] space-y-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.5)]"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-sans text-white/50 tracking-widest font-medium uppercase">Mission Title</span>
                      <input 
                        type="text" 
                        placeholder="Define system objective..." 
                        value={newMissionName}
                        onChange={(e) => setNewMissionName(e.target.value)}
                        className="bg-black/20 border border-white/[0.06] rounded-lg px-3 py-2 text-[11px] text-white uppercase focus:outline-none focus:border-white/[0.15]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-sans text-white/50 tracking-widest font-medium uppercase">Responsible Core</span>
                      <select 
                        value={newMissionDept}
                        onChange={(e) => setNewMissionDept(e.target.value)}
                        className="bg-black/20 border border-white/[0.06] rounded-lg px-3 py-2 text-[11px] text-white focus:outline-none focus:border-white/[0.15] uppercase appearance-none"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operations">Operations</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.04]">
                    <button 
                      onClick={() => setShowAddMission(false)}
                      className="px-3 py-1.5 text-white/50 hover:text-white/80 text-[10px] font-sans uppercase tracking-widest font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleCreateMission}
                      className="px-4 py-1.5 bg-white/[0.06] border border-white/[0.08] text-white rounded-lg hover:bg-white/[0.1] text-[10px] font-sans font-medium uppercase tracking-widest transition-all"
                    >
                      Authorize Activation
                    </button>
                  </div>
                </motion.div>
              )}

              {operationsView === 'dependencies' ? (
                <div className="flex-1 flex flex-col gap-4" id="visual-dependency-mode">
                  
                  {/* Mission Selector Dropdown */}
                  <div className="flex justify-between items-center bg-white/[0.02] backdrop-blur-[32px] p-3 border border-white/[0.08] rounded-xl">
                    <div>
                      <span className="text-[10px] font-sans text-white/50 uppercase tracking-widest block font-medium">Active Mission Flow Composer</span>
                      <span className="text-[9px] font-sans text-white/30 block mt-0.5 uppercase">Select and orchestrate automated system pipelines</span>
                    </div>
                    <select
                      value={selectedMissionIdForDependency}
                      onChange={(e) => setSelectedMissionIdForDependency(e.target.value)}
                      className="bg-black/20 border border-white/[0.06] rounded-md px-3 py-1.5 text-[10px] text-white focus:outline-none focus:border-white/[0.15] font-sans uppercase tracking-widest appearance-none"
                    >
                      {sovrState.missions.map(m => (
                        <option key={m.id} value={m.id}>{m.id.toUpperCase()}: {m.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* SVG FLOW DIAGRAM */}
                  {(() => {
                    const currentMission = sovrState.missions.find(m => m.id === selectedMissionIdForDependency) || sovrState.missions[0];
                    if (!currentMission) {
                      return (
                        <div className="h-[200px] flex items-center justify-center border border-dashed border-white/[0.08] rounded-[16px] text-white/40 text-[11px] font-sans uppercase tracking-[0.15em] font-medium">
                          No active missions found.
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        <div className="relative bg-white/[0.01] border border-white/[0.08] rounded-[16px] overflow-hidden p-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.5)]" id="active-flow-graph-container">
                          
                          {/* Title Metadata */}
                          <div className="absolute top-3 left-4 text-[10px] font-sans text-white/40 flex items-center gap-2 font-medium uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                            <span>Visualized Dependency Chain | State: {currentMission.schedulerState}</span>
                          </div>

                          <svg viewBox="0 0 600 160" className="w-full h-full min-h-[140px] mt-2">
                            {/* DEF FOR DROPSHADOWS */}
                            <defs>
                              <filter id="node-glow-completed" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                              </filter>
                              <filter id="node-glow-blocked" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                              </filter>
                              <filter id="node-glow-ready" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                              </filter>
                            </defs>

                            {/* CONNECTION LINES WITH BEZIER & ACTIVE PULSES */}
                            {currentMission.tasks.map((t, idx) => {
                              if (idx === 0) return null;
                              const cx1 = 90 + (idx - 1) * 210 + 70; // edge output x
                              const cy1 = 80;
                              const cx2 = 90 + idx * 210 - 70; // edge input x
                              const cy2 = 80;
                              
                              const prevTask = currentMission.tasks[idx - 1];
                              const isPrevCompleted = prevTask.done;
                              
                              // Check if downstream node is blocked
                              const isDownstreamBlocked = t.dependencies.some(depId => {
                                const matchedTask = currentMission.tasks.find(tk => tk.id === depId);
                                return matchedTask ? !matchedTask.done : false;
                              });

                              const lineColor = isPrevCompleted 
                                ? "stroke-white/40" 
                                : isDownstreamBlocked 
                                  ? "stroke-white/10" 
                                  : "stroke-white/[0.04]";
                              const dashArray = isPrevCompleted ? "none" : "3 3";

                              return (
                                <g key={`line-${idx}`}>
                                  <path 
                                    d={`M ${cx1} ${cy1} L ${cx2} ${cy2}`}
                                    className={`${lineColor} transition-all duration-300`} 
                                    strokeWidth="1.5" 
                                    strokeDasharray={dashArray}
                                    fill="none" 
                                  />
                                  {isPrevCompleted && (
                                    <circle r="2.5" fill="#ffffff" filter="url(#node-glow-completed)">
                                      <animateMotion dur="3s" repeatCount="indefinite" path={`M ${cx1} ${cy1} L ${cx2} ${cy2}`} />
                                    </circle>
                                  )}
                                </g>
                              );
                            })}

                            {/* INTERACTIVE SHARD NODES */}
                            {currentMission.tasks.map((t, idx) => {
                              const cx = 90 + idx * 210;
                              const cy = 80;
                              const w = 140;
                              const h = 56;
                              
                              const isDone = t.done;
                              const isBlocked = t.dependencies.some(depId => {
                                const matched = currentMission.tasks.find(tk => tk.id === depId);
                                return matched ? !matched.done : false;
                              });

                              let borderColor = "stroke-white/[0.04]";
                              let fillColor = "fill-black/40";
                              let glowFilter = "";
                              let statusText = "READY";
                              let statusStyle = "fill-white/40";

                              if (isDone) {
                                borderColor = "stroke-white/30";
                                fillColor = "fill-white/[0.04]";
                                glowFilter = "url(#node-glow-completed)";
                                statusText = "COMPLETED";
                                statusStyle = "fill-white/80 font-medium";
                              } else if (isBlocked) {
                                borderColor = "stroke-white/10";
                                fillColor = "fill-black/60";
                                glowFilter = "url(#node-glow-blocked)";
                                statusText = "BLOCKED";
                                statusStyle = "fill-white/30 font-medium opacity-50";
                              } else {
                                borderColor = "stroke-white/[0.08]";
                                fillColor = "fill-white/[0.02]";
                                statusText = "READY";
                                statusStyle = "fill-white/50";
                              }

                              // Text splitting
                              const words = t.name.split(' ');
                              const line1 = words.slice(0, 3).join(' ');
                              const line2 = words.slice(3, 6).join(' ');
                              const line3 = words.slice(6).join(' ');

                              return (
                                <g 
                                  key={t.id} 
                                  className="cursor-pointer group"
                                  onClick={() => toggleTaskDone(currentMission.id, t.id)}
                                >
                                  {/* Container Box */}
                                  <rect 
                                    x={cx - w/2} 
                                    y={cy - h/2} 
                                    width={w} 
                                    height={h} 
                                    rx={8} 
                                    className={`transition-all duration-300 ${fillColor} ${borderColor}`}
                                    strokeWidth="1.5"
                                    filter={glowFilter}
                                  />
                                  
                                  {/* Task Label */}
                                  <text x={cx} y={cy - 12} textAnchor="middle" className="fill-white font-sans text-[9px] font-medium tracking-wide uppercase">
                                    {line1}
                                  </text>
                                  {line2 && (
                                    <text x={cx} y={cy - 2} textAnchor="middle" className="fill-white/60 font-sans text-[8px] uppercase tracking-wide">
                                      {line2}
                                    </text>
                                  )}
                                  {line3 && (
                                    <text x={cx} y={cy + 7} textAnchor="middle" className="fill-white/40 font-sans text-[7.5px] italic">
                                      {line3}
                                    </text>
                                  )}

                                  {/* Dependency ID required overlay */}
                                  {t.dependencies.length > 0 && !isDone && (
                                    <text x={cx - w/2 + 8} y={cy + h/2 - 6} textAnchor="start" className="fill-white/30 font-sans text-[7px] font-medium uppercase tracking-widest">
                                      Req: {t.dependencies.join(',').toUpperCase()}
                                    </text>
                                  )}

                                  {/* Status indicators */}
                                  <text x={cx + w/2 - 8} y={cy + h/2 - 6} textAnchor="end" className={`font-sans text-[8px] uppercase tracking-widest ${statusStyle}`}>
                                    {statusText}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>

                          {/* Legend Indicator Overlay */}
                          <div className="flex justify-between items-center text-[9px] font-sans border-t border-white/[0.04] pt-3 mt-2">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                                <span className="text-white/40 font-medium tracking-widest uppercase">Completed</span>
                              </span>
                              <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                <span className="text-white/40 font-medium tracking-widest uppercase">Available</span>
                              </span>
                              <span className="flex items-center gap-1.5 opacity-50">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                <span className="text-white/30 font-medium tracking-widest uppercase">Blocked</span>
                              </span>
                            </div>
                            <span className="text-white/30 font-medium tracking-widest text-[8px] uppercase">Click node to toggle state</span>
                          </div>

                        </div>

                        {/* Informative description matching executive prompt */}
                        <div className="p-4 border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl rounded-[16px] flex gap-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.4)] relative overflow-hidden">
                          <div className="absolute inset-x-0 h-[1px] bg-white/[0.08] top-0" />
                          <Compass className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                          <div className="space-y-1.5">
                            <h5 className="text-[11px] font-sans text-white/70 uppercase tracking-[0.15em] font-medium">Downstream Propagation Model</h5>
                            <p className="text-[11px] font-sans font-light text-white/40 leading-relaxed">
                              Sovereign OS handles workflows as synchronous dependency trees. If you complete an upstream block, the next child node is automatically unlocked and promoted to <span className="text-white/80 font-medium">Ready</span>. Toggling any upstream parent back to incomplete instantly triggers a cascade, turning everything downstream into <span className="text-white/30 font-medium">Blocked</span> state.
                            </p>
                          </div>
                        </div>

                      </div>
                    );
                  })()}

                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-full" id="tactical-list-mode">
                  {sovrState.missions.map((m) => {
                    const schedulerStages = ['READY', 'WAITING_DEPENDENCIES', 'ALLOCATED', 'EXECUTING', 'REVIEW', 'COMPLETED'];
                    const currentStageIdx = schedulerStages.indexOf(m.schedulerState || 'READY');

                    return (
                      <div key={m.id} className="p-4 bg-white/[0.02] border border-white/[0.08] backdrop-blur-[32px] rounded-[16px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.4)] flex flex-col gap-3 relative overflow-hidden">
                        <div className="absolute inset-x-0 h-[1px] bg-white/[0.08] top-0" />
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-medium text-white/90 uppercase block leading-tight tracking-wide">{m.name}</span>
                              <span className="px-2 py-0.5 bg-white/[0.04] text-white/70 border border-white/[0.08] text-[9px] font-sans rounded-md uppercase font-medium tracking-widest">
                                {m.schedulerState || 'READY'}
                              </span>
                            </div>
                            <span className="text-[9px] font-sans text-white/40 mt-1 block uppercase tracking-widest font-medium">
                              ID: {m.id} | Core Owner: {m.owner} | Priority: {m.priority}
                            </span>
                          </div>
                          
                          <span className={`px-2 py-1 text-[9px] font-sans uppercase rounded-md border font-medium tracking-widest ${
                            m.status === 'completed' 
                              ? 'bg-white/[0.04] text-white border-white/[0.1]' 
                              : 'bg-white/[0.08] text-white border-white/[0.15] shadow-[0_2px_8px_rgba(0,0,0,0.2)]'
                          }`}>
                            {m.status}
                          </span>
                        </div>

                        {/* MISSION SCHEDULER LIFECYCLE PROGRESS */}
                        <div className="bg-black/20 p-3 border border-white/[0.08] rounded-xl mt-1">
                          <div className="flex justify-between text-[9px] font-sans text-white/50 uppercase tracking-widest mb-2 font-medium">
                            <span>Scheduler Lifecycle State Thread</span>
                            <span className="text-white/80 font-medium">ACTIVE</span>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            {schedulerStages.map((stage, sIdx) => {
                              const isPast = sIdx < currentStageIdx;
                              const isActive = sIdx === currentStageIdx;
                              const shortStageMap: Record<string, string> = {
                                'READY': 'RDY',
                                'WAITING_DEPENDENCIES': 'WAIT',
                                'ALLOCATED': 'ALOC',
                                'EXECUTING': 'EXEC',
                                'REVIEW': 'REV',
                                'COMPLETED': 'DONE'
                              };
                              return (
                                <React.Fragment key={stage}>
                                  <div className="flex flex-col items-center flex-1">
                                    <div className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center transition-all ${
                                      isActive ? 'bg-white border-white shadow-[0_0_8px_rgba(255,255,255,0.6)]' :
                                      isPast ? 'bg-white/20 border-white/30' :
                                      'bg-black/40 border-white/[0.08]'
                                    }`} />
                                    <span className={`text-[8px] font-sans uppercase mt-1.5 tracking-widest font-medium ${isActive ? 'text-white/90' : isPast ? 'text-white/50' : 'text-white/20'}`}>
                                      {shortStageMap[stage] || stage}
                                    </span>
                                  </div>
                                  {sIdx < schedulerStages.length - 1 && (
                                    <div className={`h-[1px] flex-1 ${isPast ? 'bg-white/20' : 'bg-white/[0.04]'}`} />
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>

                        {/* Failure Recovery Strategy */}
                        <div className="flex justify-between items-center bg-white/[0.02] px-3 py-2 border border-white/[0.08] rounded-xl text-[10px] font-sans">
                          <div className="flex items-center gap-1.5 text-white/50 uppercase tracking-widest font-medium">
                            <AlertTriangle size={11} className="opacity-50" />
                            <span>Recovery Vector:</span>
                            <span className="text-white/80 font-medium">{m.failureRecoveryStrategy || 'RETRY_WITH_BACKOFF'}</span>
                          </div>
                          <div className="text-white/40 uppercase tracking-widest font-medium">
                            Faults Logged: <span className={m.failureCount && m.failureCount > 0 ? 'text-white font-medium' : 'text-white/30'}>{m.failureCount || 0}</span>
                          </div>
                        </div>

                        {/* Progress slider bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-sans text-white/50 uppercase tracking-widest font-medium">
                            <span>Execution Completion Range</span>
                            <span className="text-white/90 font-medium tabular-data">{m.progress}%</span>
                          </div>
                          <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/[0.08]">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                m.status === 'completed' ? 'bg-white/40' : 'bg-white/80'
                              }`} 
                              style={{ width: `${m.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Subtask micro-pipelines */}
                        <div className="border-t border-white/[0.04] pt-3 mt-1 space-y-2.5">
                          <span className="text-[10px] font-sans text-white/50 uppercase tracking-widest block font-medium">Procedural Task List Dependency Check</span>
                          {m.tasks.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => toggleTaskDone(m.id, t.id)}
                              className="w-full text-left flex items-start gap-3 group text-[11px] font-sans text-white/60 hover:text-white/90 transition-all"
                            >
                              <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                t.done ? 'bg-white/10 border-white/20 text-white' : 'border-white/[0.08] bg-black/40 group-hover:border-white/30'
                              }`}>
                                {t.done && <CheckCircle size={10} />}
                              </div>
                              <div className="flex-1">
                                <span className={t.done ? 'line-through text-white/30' : ''}>
                                  {t.name}
                                </span>
                                {t.dependencies.length > 0 && (
                                  <span className="block text-[9px] text-white/40 uppercase tracking-widest font-medium mt-1">
                                    Requires Completed ID: {t.dependencies.join(', ')}
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* CORE 03: AGENT FABRIC */}
          {activeRoom === 'engineering' && (
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-sans font-medium tracking-[0.15em] text-white/50 uppercase">Autonomous Process Execution Shards</span>
                <span className="text-[10px] text-white/70 font-sans tracking-widest font-medium uppercase">Active Deployments: 4 Cores</span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-full">
                {sovrState.agents.map((agent, i) => {
                  const isHealthy = (agent.health || 100) > 90;
                  const isHealing = agent.recoveryStatus === 'SELF_HEALING';

                  return (
                    <div key={i} className="p-4 bg-white/[0.02] border border-white/[0.08] backdrop-blur-[32px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.4)] rounded-[16px] flex flex-col gap-3 group hover:bg-white/[0.03] transition-all relative overflow-hidden">
                      <div className="absolute inset-x-0 h-[1px] bg-white/[0.08] top-0" />
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/80 text-sm font-medium font-sans">
                            {agent.avatar}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[12px] font-medium text-white/90">{agent.name}</span>
                            <span className="text-[10px] font-sans text-white/40 tracking-widest font-medium uppercase mt-0.5">{agent.role}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <span className={`w-1.5 h-1.5 rounded-full ${isHealing ? 'bg-white/20 animate-ping' : isHealthy ? 'bg-white/60 animate-pulse' : 'bg-white/30 animate-pulse'}`} />
                            <span className={`px-2 py-0.5 text-[9px] font-sans rounded-md uppercase font-medium tracking-widest border ${
                              agent.state === 'SUSPENDED' ? 'bg-white/[0.02] text-white/40 border-white/[0.04]' :
                              agent.state === 'PLANNING' ? 'bg-white/[0.08] text-white/90 border-white/[0.15] shadow-[0_2px_8px_rgba(0,0,0,0.2)]' :
                              'bg-white/[0.04] text-white/70 border-white/[0.08]'
                            }`}>
                              {agent.state}
                            </span>
                          </div>
                          <span className="block text-[9px] font-sans text-white/40 mt-1.5 uppercase tracking-widest font-medium tabular-data">
                            Heartbeat: {agent.heartbeatSec || 1.0}s ago
                          </span>
                        </div>
                      </div>

                      {/* Phase III Telemetry Panel for Managed Runtime Entity */}
                      <div className="grid grid-cols-4 gap-2 bg-black/20 p-2 border border-white/[0.08] rounded-xl text-center font-sans mt-1">
                        <div className="p-1.5 bg-white/[0.02] rounded-lg">
                          <span className="block text-[8px] text-white/40 tracking-widest font-medium uppercase mb-0.5">HEALTH</span>
                          <span className={`text-[11px] font-medium tabular-data ${isHealthy ? 'text-white/90' : 'text-white/50'}`}>{agent.health || 100}%</span>
                        </div>
                        <div className="p-1.5 bg-white/[0.02] rounded-lg">
                          <span className="block text-[8px] text-white/40 tracking-widest font-medium uppercase mb-0.5">RECOVERY</span>
                          <span className={`text-[9px] font-medium truncate block tracking-wider ${isHealing ? 'text-white/90 animate-pulse' : 'text-white/50'}`}>{agent.recoveryStatus || 'HEALTHY'}</span>
                        </div>
                        <div className="p-1.5 bg-white/[0.02] rounded-lg">
                          <span className="block text-[8px] text-white/40 tracking-widest font-medium uppercase mb-0.5">CPU</span>
                          <span className="text-[11px] font-medium text-white/90 tabular-data">{agent.cpuUsage || 5}%</span>
                        </div>
                        <div className="p-1.5 bg-white/[0.02] rounded-lg">
                          <span className="block text-[8px] text-white/40 tracking-widest font-medium uppercase mb-0.5">RAM</span>
                          <span className="text-[11px] font-medium text-white/90 tabular-data">{agent.memoryUsageGb || 1.2}G</span>
                        </div>
                      </div>

                      {/* Capabilities array */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {agent.capabilities.map((c, idx) => (
                          <span key={idx} className="px-2 py-1 bg-black/30 border border-white/[0.06] text-[9px] font-sans text-white/50 rounded-md font-medium tracking-widest uppercase">
                            {c}
                          </span>
                        ))}
                      </div>

                      {/* Worker Threads and Sub-agents stats */}
                      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 flex justify-between items-center text-[10px] font-sans text-white/50 tracking-widest mt-1">
                        <div>
                          <span className="text-white/40 uppercase font-medium">Workers:</span>{' '}
                          <span className="text-white/80 font-medium tabular-data">{agent.workersCount || 4} threads</span>
                        </div>
                        <div>
                          <span className="text-white/40 uppercase font-medium">Sub Agents:</span>{' '}
                          <span className="text-white/80 font-medium tabular-data">{agent.subAgentsCount || 12} nodes</span>
                        </div>
                        <div>
                          <span className="text-white/40 uppercase font-medium">Queue:</span>{' '}
                          <span className="text-white font-medium tabular-data">{agent.missionQueueCount || 0} active</span>
                        </div>
                      </div>

                      <div className="text-[10px] font-sans text-white/50 border-t border-white/[0.04] pt-2 mt-2 flex justify-between tracking-widest font-medium uppercase">
                        <span>Current Instance Job:</span>
                        <span className="text-white/80 font-medium truncate max-w-[180px]">
                          {agent.currentMissionName || 'SLA Routing Compliance'}
                        </span>
                      </div>

                      {/* Live resource stats and cumulative cost matrix */}
                      <div className="border-t border-white/[0.04] pt-3 mt-1 grid grid-cols-3 gap-3 text-[10px] font-sans text-white/50 tracking-widest font-medium uppercase">
                        <div>
                          <span className="block text-white/40 mb-0.5">Latency:</span>
                          <span className="text-white/90 tabular-data">{agent.latencyMs}ms</span>
                        </div>
                        <div>
                          <span className="block text-white/40 mb-0.5">I/O Tokens:</span>
                          <span className="text-white/90 tabular-data">{(agent.tokensConsumedInput + agent.tokensConsumedOutput).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="block text-white/40 mb-0.5">Cumulative:</span>
                          <span className="text-white tabular-data">${agent.totalCostUsd.toFixed(2)}</span>
                        </div>
                      </div>

                    </div>
                  );
                })}

                {/* SUPERVISOR HIERARCHY TREE */}
                <div className="p-4 bg-white/[0.02] backdrop-blur-[32px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.4)] border border-white/[0.08] rounded-[16px] space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2">
                    <Users size={12} className="opacity-60" />
                    <span className="text-[10px] font-sans text-white/50 uppercase tracking-[0.15em] font-medium">
                      Sovereign Organizational Supervisor Hierarchy
                    </span>
                  </div>
                  
                  <div className="space-y-4 pl-2 text-[11px] font-sans text-white/70">
                    {/* CTO Branch */}
                    <div className="space-y-1.5">
                      <div className="text-white/90 font-medium flex items-center gap-2">
                        <span className="opacity-70">⚡</span>
                        <span>CTO Spark (Core Technical Lead)</span>
                      </div>
                      <div className="pl-5 border-l border-white/[0.08] space-y-1.5 text-[10px] text-white/50 font-medium uppercase tracking-widest mt-1">
                        <div>• Sub-Agent: Backend Cluster Node (Workers: 8)</div>
                        <div>• Sub-Agent: Frontend Client Renderer (Workers: 4)</div>
                        <div>• Sub-Agent: DevOps mTLS Container Router (Workers: 6)</div>
                      </div>
                    </div>

                    {/* COO Branch */}
                    <div className="space-y-1.5">
                      <div className="text-white/90 font-medium flex items-center gap-2">
                        <span className="opacity-70">⚙️</span>
                        <span>COO Flow (Operations Supervisor)</span>
                      </div>
                      <div className="pl-5 border-l border-white/[0.08] space-y-1.5 text-[10px] text-white/50 font-medium uppercase tracking-widest mt-1">
                        <div>• Sub-Agent: Workflow Scheduler Service (Workers: 5)</div>
                        <div>• Sub-Agent: HR Node Coordinator (Workers: 3)</div>
                        <div>• Sub-Agent: Logistics Compliance Watchdog (Workers: 4)</div>
                      </div>
                    </div>

                    {/* CFO Branch */}
                    <div className="space-y-1.5">
                      <div className="text-white/90 font-medium flex items-center gap-2">
                        <span className="opacity-70">🪙</span>
                        <span>CFO Ledger (Financial Director)</span>
                      </div>
                      <div className="pl-5 border-l border-white/[0.08] space-y-1.5 text-[10px] text-white/50 font-medium uppercase tracking-widest mt-1">
                        <div>• Sub-Agent: Treasury Reserve Manager (Workers: 4)</div>
                        <div>• Sub-Agent: Double-Entry Cryptographic Ledger (Workers: 6)</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* CORE 04: WORKFLOW ENGINE */}
          {activeRoom === 'finance' && (
            <div className="flex-1 flex flex-col gap-4">
              
              {/* LIVE QUEUE LOAD DASHBOARD */}
              <div className="p-4 bg-white/[0.02] backdrop-blur-[32px] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.4)] rounded-[16px] space-y-4">
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                  <div className="flex items-center gap-2">
                    <Database size={11} className="opacity-60" />
                    <span className="text-[10px] font-sans text-white/50 uppercase tracking-[0.15em] font-medium">
                      Real-Time System Queue Loads
                    </span>
                  </div>
                  <span className="text-[9px] bg-white/[0.04] text-white/60 border border-white/[0.08] px-2 py-0.5 rounded-md font-sans font-medium uppercase tracking-widest">
                    Compiling Feed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {Object.entries(sovrState.queues || { 'Mission': 3, 'Research': 6, 'Memory': 2, 'Settlement': 7, 'Notification': 1 }).map(([qName, qVal]) => {
                    const pct = Math.min(100, Math.round((qVal / 15) * 100));
                    return (
                      <div key={qName} className="p-3 bg-white/[0.02] border border-white/[0.08] rounded-xl space-y-1.5">
                        <span className="text-[9px] font-sans text-white/50 uppercase tracking-widest block truncate font-medium">{qName} Queue</span>
                        <div className="flex justify-between items-baseline">
                          <span className="text-lg font-light text-white font-sans tabular-data">{qVal}</span>
                          <span className="text-[8px] text-white/40 font-sans font-medium uppercase tracking-widest">/15 max</span>
                        </div>
                        <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/[0.08]">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              pct > 75 ? 'bg-white/80' : pct > 45 ? 'bg-white/50' : 'bg-white/30'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <span className="text-[11px] font-sans font-medium tracking-[0.15em] text-white/50 uppercase">Declarative JSON DSL Workflows</span>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-full">
                {sovrState.workflows.map((flow) => (
                  <div key={flow.id} className="p-4 bg-white/[0.02] backdrop-blur-[32px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.4)] border border-white/[0.08] rounded-[16px] space-y-4 relative overflow-hidden">
                    <div className="absolute inset-x-0 h-[1px] bg-white/[0.08] top-0" />
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[12px] font-medium text-white/90 uppercase block leading-tight tracking-wide">{flow.name}</span>
                        <span className="text-[10px] font-sans text-white/50 mt-1 block font-medium tracking-wide">{flow.description}</span>
                      </div>
                      <span className="px-2 py-1 bg-black/30 text-white/40 border border-white/[0.08] text-[9px] font-sans font-medium rounded-md uppercase tracking-widest tabular-data">
                        DSL_ID: {flow.id}
                      </span>
                    </div>

                    {/* Step by step pipeline nodes */}
                    <div className="space-y-3 relative pl-3 border-l border-white/[0.08] mt-2">
                      {flow.steps.map((step) => (
                        <div key={step.id} className="flex justify-between items-center text-[11px] font-sans">
                          <div className="flex items-center gap-2.5 font-medium">
                            <div className={`w-2 h-2 rounded-full ${
                              step.status === 'COMPLETED' ? 'bg-white/80' :
                              step.status === 'RUNNING' ? 'bg-white/50 animate-pulse' :
                              step.status === 'FAILED' ? 'bg-white/20' : 'bg-white/10'
                            }`} />
                            <span className="text-white/90">{step.action}</span>
                            <span className="text-white/40 text-[9px] font-medium tracking-widest uppercase">({step.assignedAgent})</span>
                          </div>
                          <span className={`text-[9px] font-medium tracking-widest uppercase ${
                            step.status === 'COMPLETED' ? 'text-white' :
                            step.status === 'RUNNING' ? 'text-white/70 animate-pulse' :
                            'text-white/30'
                          }`}>
                            {step.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Scheduled Pipeline Chronos */}
                <div className="p-4 bg-white/[0.02] backdrop-blur-[32px] border border-white/[0.08] rounded-[16px] space-y-3">
                  <span className="text-[10px] font-sans text-white/50 uppercase tracking-[0.15em] block border-b border-white/[0.04] pb-2 font-medium">
                    Scheduled Background Micro-Jobs
                  </span>
                  <div className="space-y-2 mt-1">
                    {sovrState.scheduledJobs.map((job) => (
                      <div key={job.id} className="flex justify-between items-center text-[11px] font-sans p-2 hover:bg-white/[0.02] rounded-lg transition-colors border border-transparent hover:border-white/[0.04]">
                        <div className="flex flex-col">
                          <span className="text-white/90 font-medium">{job.name}</span>
                          <span className="text-white/40 text-[9px] font-medium uppercase tracking-widest mt-1 tabular-data">
                            Cron: {job.cronExpression} | Next: {job.nextRun}
                          </span>
                        </div>
                        <span className="px-2 py-1 bg-white/[0.04] text-white/80 border border-white/[0.08] text-[9px] rounded-md font-medium uppercase tracking-widest">
                          {job.lastResult}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CORE 05: ORACLE LEDGER */}
          {activeRoom === 'marketing' && (
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-sans font-semibold tracking-wider text-white/70 uppercase">Double-Entry Financial Auditing</span>
                <span className="text-[10px] font-sans text-white/80 tracking-wide font-semibold uppercase">Compliance Ledger Score: {sovrState.complianceScore}%</span>
              </div>

              {/* Secure consensus list */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-full">
                
                {/* Visual Debit/Credit balance ledger */}
                <div className="p-3 bg-white/[0.01] border border-white/10 rounded-xl space-y-2">
                  <span className="text-[9px] font-sans text-white/40 uppercase tracking-wider block font-semibold">Active Crypto/Compute Credit Accounts</span>
                  <div className="space-y-1.5 divide-y divide-white/[0.05]">
                    {sovrState.ledger.slice(0, 3).map((entry) => (
                      <div key={entry.id} className="pt-1.5 first:pt-0 flex justify-between items-center text-xs font-sans">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{entry.description}</span>
                          <span className="text-[8px] text-white/40 font-semibold uppercase tracking-wide mt-0.5">{entry.account} | {entry.timestamp}</span>
                        </div>
                        <span className={`font-semibold ${entry.type === 'CREDIT' ? 'text-white/80' : 'text-white/60'}`}>
                          {entry.type === 'CREDIT' ? '+' : '-'}${entry.amountUsd.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Compliance Risks Sign-off List */}
                <div className="space-y-2">
                  <span className="text-[10px] font-sans text-white/60 uppercase tracking-wider block font-bold">Compliance Risks Pending Sign-off</span>
                  <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-1.5 text-white/90 text-xs font-bold font-sans">
                        <ShieldAlert size={12} className="animate-pulse" />
                        <span>UNAUTHORIZED ASSET SWAP DETECTED</span>
                      </div>
                      <span className="px-1.5 py-0.2 bg-white/10 text-white/90 border border-white/20 text-[8px] font-sans font-semibold rounded uppercase tracking-wide">
                        High Severity
                      </span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed font-sans font-light">
                      Titan Corp routing nodes smart contract demands unilateral gas allocations above threshold limits. This could compromise our 2026-q4 growth matrix.
                    </p>
                    <div className="flex gap-2 justify-end pt-1">
                      <button 
                        onClick={() => showToast("Decision Declined and Logged.")}
                        className="px-2.5 py-1 border border-white/10 text-white/50 text-[10px] uppercase font-sans font-semibold rounded"
                      >
                        Decline
                      </button>
                      <button 
                        onClick={() => {
                          showToast("Compliance Cleared and recorded to Sovereign Chain.");
                          sovrState.complianceScore = 98;
                        }}
                        className="px-3 py-1 bg-white/10 border border-white/20 text-white/90 text-[10px] uppercase font-sans font-semibold rounded"
                      >
                        Authorize Swap
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CORE 06: MEMORY ENGINE */}
          {activeRoom === 'research' && (
            <div className="flex-1 flex flex-col gap-4">
              <span className="text-xs font-sans font-semibold tracking-wider text-white/70 uppercase">Long-Term Semantic Base</span>
              
              {/* Add Custom Fact block */}
              <div className="p-3 bg-white/[0.01] border border-white/10 rounded-xl flex gap-2">
                <input 
                  type="text" 
                  placeholder="Insert core memory fact or preference..." 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      addMemoryFact(e.currentTarget.value.trim(), 'OPERATIONAL');
                      e.currentTarget.value = '';
                      showToast("Memory Fact permanently committed!");
                    }
                  }}
                  className="flex-1 bg-zinc-950/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 font-sans font-semibold tracking-wide"
                />
                <span className="px-2.5 py-1.5 bg-zinc-900 border border-white/10 text-[9px] text-zinc-400 font-sans rounded flex items-center shrink-0 uppercase font-semibold tracking-wide">
                  Press Enter to Commit
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-full">
                {sovrState.memoryNodes.map((node) => (
                  <div key={node.id} className="p-3 bg-white/[0.02] border border-white/10 rounded-xl flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.2 text-[8px] font-sans rounded font-semibold tracking-wider ${
                          node.category === 'STRATEGIC' ? 'bg-white/5 text-white/70 border border-white/10' :
                          'bg-zinc-950 text-zinc-400 border border-white/10'
                        }`}>
                          {node.category}
                        </span>
                        <span className="text-[8px] font-sans text-white/40 uppercase tracking-wider font-semibold">
                          Last Updated: {node.lastAccessed}
                        </span>
                      </div>
                      <p className="text-xs font-sans font-light tracking-wide text-white leading-normal mt-1.5">
                        {node.fact}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        deleteMemoryFact(node.id);
                        showToast("Memory index purge logged.");
                      }}
                      className="text-white/35 hover:text-white/60 p-1 rounded hover:bg-white/5 transition-all mt-0.5 shrink-0"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CORE 07: OBSERVABILITY DASHBOARD */}
          {activeRoom === 'legal' && (
            <div className="flex-1 flex flex-col gap-4">
              <span className="text-xs font-sans font-semibold tracking-wider text-white/70 uppercase">System Telemetry & Controls</span>
              
              {/* GLOBAL COMPUTE RESOURCE ALLOCATOR */}
              <div className="p-4 bg-white/[0.01] border border-white/10 rounded-xl space-y-3.5">
                <div className="flex justify-between items-center border-b border-white/[0.08] pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Cpu size={12} className="text-white/90" />
                    <span className="text-[10px] font-sans text-white/60 uppercase tracking-wider font-bold">
                      Global Compute Resource Allocator (64 Cores Pool)
                    </span>
                  </div>
                  <span className="text-[8px] bg-white/5 text-white/70 border border-white/10 px-1.5 py-0.2 rounded font-sans font-semibold uppercase tracking-wide">
                    Provisioned Ok
                  </span>
                </div>

                <div className="space-y-2.5">
                  {Object.entries(sovrState.computeAllocation || { 'Executive': 16, 'Engineering': 24, 'Research': 12, 'Legal': 4, 'Finance': 4, 'Reserve': 4 }).map(([dept, cores]) => {
                    const pct = Math.round((cores / 64) * 100);
                    return (
                      <div key={dept} className="flex flex-col md:flex-row md:items-center justify-between gap-2 bg-white/[0.01] border border-white/[0.08] p-2 rounded-lg text-xs font-sans">
                        <div className="flex items-center gap-2 md:w-32">
                          <span className="text-white font-semibold">{dept}</span>
                          <span className="text-[8px] text-white/40 uppercase tracking-wider font-semibold">({pct}%)</span>
                        </div>
                        
                        <div className="flex-1 flex items-center gap-2">
                          <div className="w-full bg-black/50 h-2 rounded overflow-hidden border border-white/[0.03]">
                            <div 
                              className="h-full bg-gradient-to-r from-white/40 to-white/10 transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-white font-semibold w-12 text-right">{cores} Cores</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                if (cores > 1) {
                                  if (sovrState.computeAllocation) {
                                    sovrState.computeAllocation[dept] = cores - 1;
                                    // Give to reserve
                                    sovrState.computeAllocation['Reserve'] = (sovrState.computeAllocation['Reserve'] || 4) + 1;
                                  }
                                  showToast(`De-allocated 1 Core from ${dept} department. Moved to Reserve Pool.`);
                                }
                              }}
                              className="px-1.5 py-0.5 bg-black/40 border border-white/10 rounded text-[9px] text-white/40 hover:text-white font-semibold"
                            >
                              -
                            </button>
                            <button
                              onClick={() => {
                                const reserve = sovrState.computeAllocation?.['Reserve'] || 0;
                                if (reserve > 0) {
                                  if (sovrState.computeAllocation) {
                                    sovrState.computeAllocation[dept] = cores + 1;
                                    sovrState.computeAllocation['Reserve'] = reserve - 1;
                                  }
                                  showToast(`Allocated 1 Core to ${dept} department from Reserve Pool.`);
                                } else {
                                  showToast(`Compute Pool limit reached (64 Cores). De-allocate from other departments first.`);
                                }
                              }}
                              className="px-1.5 py-0.5 bg-black/40 border border-white/10 rounded text-[9px] text-white/80 hover:bg-white/10 font-semibold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Emergency Damping Control panel */}
              <div className={`p-4 border rounded-xl flex flex-col gap-3 transition-all ${
                sovrState.emergencyDampingActive 
                  ? 'bg-white/5 border-white/20 text-white/80' 
                  : 'bg-white/[0.01] border border-white/10 text-zinc-400'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white font-bold">
                    <ShieldAlert size={15} className={sovrState.emergencyDampingActive ? 'animate-bounce text-white' : 'text-zinc-400'} />
                    <span className="text-xs uppercase font-sans tracking-wider font-bold">Emergency Core Override Damping</span>
                  </div>
                  <button 
                    onClick={() => {
                      toggleDamping();
                      showToast(sovrState.emergencyDampingActive ? "Sovereign OS Damping DEACTIVATED." : "EMERGENCY DAMPING PROTOCOL ACTIVATED!");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs uppercase font-sans font-semibold border transition-all ${
                      sovrState.emergencyDampingActive 
                        ? 'bg-white/20 text-white border-white/30 hover:bg-white/30 animate-pulse' 
                        : 'bg-white/5 text-white/80 border-white/15 hover:bg-white/10'
                    }`}
                  >
                    {sovrState.emergencyDampingActive ? 'CANCEL DAMPING' : 'ENGAGE DAMPING'}
                  </button>
                </div>
                <p className="text-xs leading-normal font-sans font-light">
                  {sovrState.emergencyDampingActive 
                    ? 'AGENT REASONING DAMPED TO 1Hz. Sub-second Kubernetes auto-realignment is frozen to maintain full developer control. Consensus requires 100% manual validation.'
                    : 'System processes are running at full speed. Auto-realignment executes at millisecond range based on strategic rules. Secure TLS limits are verified.'}
                </p>
              </div>

              {/* Real Performance metrics */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3 bg-white/[0.01] border border-white/10 rounded-xl space-y-1">
                  <span className="text-[9px] font-sans text-white/40 uppercase block tracking-wider font-semibold">Average System CPU Load</span>
                  <span className="text-xl font-semibold text-white font-sans">{sovrState.currentCpu}%</span>
                  <div className="w-full bg-black/30 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-white/40" style={{ width: `${sovrState.currentCpu}%` }} />
                  </div>
                </div>

                <div className="p-3 bg-white/[0.01] border border-white/10 rounded-xl space-y-1">
                  <span className="text-[9px] font-sans text-white/40 uppercase block tracking-wider font-semibold">RAM Memory Reserves</span>
                  <span className="text-xl font-semibold text-white font-sans">{sovrState.currentRam.toFixed(2)} GB</span>
                  <div className="w-full bg-black/30 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-white/30" style={{ width: `${(sovrState.currentRam / 16) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Live telemetry SNAPSHOT feed */}
              <div className="p-3 bg-white/[0.01] border border-white/10 rounded-xl space-y-1.5">
                <span className="text-[9px] font-sans text-white/40 uppercase block tracking-wider font-semibold">Live Telemetry Snapshots (Observability Core)</span>
                <div className="space-y-1 font-sans text-[10px] text-white/60 max-h-[140px] overflow-y-auto">
                  {sovrState.telemetryHistory.slice(0, 4).map((snap, i) => (
                    <div key={i} className="flex justify-between border-b border-white/[0.03] pb-1">
                      <span>{snap.timestamp} | Load: {snap.cpuLoad}%</span>
                      <span>Latency: {snap.avgLatencyMs}ms | Escrow: ${snap.cumulativeCostUsd.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CORE 08: SOVEREIGN STRATEGIC BOARD ALIGNMENTS */}
          {activeRoom === 'situation' && (
            <div className="flex-1 flex flex-col gap-4">
              <div className="space-y-1.5">
                <span className="text-[11px] font-sans font-medium tracking-[0.15em] text-white/50 uppercase block">
                  Sovereign Strategic Board Alignments
                </span>
                <p className="text-[11px] font-sans font-light tracking-wide text-white/40 leading-relaxed">
                  Draft a corporate action or expansion initiative. Sovereign AI will formulate precise technical, operational, financial, and compliance alignments to coordinate executive action.
                </p>
              </div>

              <div className="relative shrink-0">
                <input 
                  type="text" 
                  placeholder="Enter strategic expansion or corporate initiative plan..." 
                  value={debateScenario}
                  onChange={(e) => setDebateScenario(e.target.value)}
                  disabled={isDebating}
                  className="w-full bg-white/[0.03] border border-white/[0.08] pl-4 pr-32 py-3 text-[11px] font-sans text-white placeholder-white/30 focus:outline-none focus:border-white/[0.08] rounded-xl backdrop-blur-[32px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.4)]" 
                />
                <button 
                  disabled={isDebating || !debateScenario.trim()}
                  onClick={runSimulationDebate}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-white/[0.06] text-white/90 border border-white/[0.08] hover:bg-white/[0.1] disabled:opacity-20 rounded-lg font-sans text-[10px] uppercase tracking-widest transition-all font-medium"
                >
                  {isDebating ? 'Formulating...' : 'Execute Formulation'}
                </button>
              </div>

              {/* Debate Conversation Feed */}
              <div className="flex-1 border rounded-[16px] bg-white/[0.03] backdrop-blur-[32px] border-white/[0.04] shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col min-h-[160px] max-h-full">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {debateLogs.length === 0 && !isDebating && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                      <Terminal className="w-6 h-6 text-white/60" />
                      <span className="text-[10px] font-sans uppercase tracking-[0.15em] text-white/60 mt-3 font-medium">
                        Council Alignment Standby
                      </span>
                    </div>
                  )}

                  {isDebating && debateLogs.length === 0 && (
                    <div className="h-full flex items-center justify-center text-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-ping" />
                      <span className="text-[10px] font-sans text-white/60 uppercase tracking-widest animate-pulse font-medium">
                        Assembling executive council board...
                      </span>
                    </div>
                  )}

                  {debateLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-3 items-start p-3 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/60 text-xs shrink-0 font-sans font-medium">
                        {log.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[11px] font-medium text-white/90 uppercase tracking-wide">{log.sender}</span>
                          <span className="text-[10px] text-white/40 tabular-data">{log.time}</span>
                        </div>
                        <p className="text-[11px] font-sans text-white/60 leading-relaxed mt-1 break-words">
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
                  className="p-4 bg-white/[0.03] backdrop-blur-[32px] border border-white/[0.08] shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.5)] rounded-[16px] flex flex-col gap-3 font-sans shrink-0"
                >
                  <span className="text-[10px] text-white/50 uppercase font-medium tracking-[0.15em] border-b border-white/[0.04] pb-2 block">
                    Board Alignment Coordination Ledger
                  </span>

                  <div className="grid grid-cols-3 gap-3 text-center pt-2">
                    <div>
                      <span className="text-xl font-light text-white block tabular-data">{debateResult.risk}%</span>
                      <span className="text-[9px] text-white/40 uppercase tracking-widest block mt-0.5">Net Risk</span>
                    </div>
                    <div>
                      <span className="text-xl font-light text-white block tabular-data">{debateResult.readiness}%</span>
                      <span className="text-[9px] text-white/40 uppercase tracking-widest block mt-0.5">Ops Readiness</span>
                    </div>
                    <div>
                      <span className="text-xl font-light text-white block tabular-data">+{debateResult.impact}%</span>
                      <span className="text-[9px] text-white/40 uppercase tracking-widest block mt-0.5">Strategic Gain</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-white/60 leading-relaxed border-t border-white/[0.04] pt-3 italic">
                    " {debateResult.summary} "
                  </p>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      onClick={() => {
                        setDebateResult(null);
                        setDebateScenario('');
                      }}
                      className="px-3 py-1.5 border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.04] text-[10px] uppercase rounded-lg font-medium tracking-widest transition-all"
                    >
                      Dismiss Formulation
                    </button>
                    <button
                      onClick={() => {
                        setDebateResult(null);
                        setDebateScenario('');
                        showToast("Strategic Decision Committed!");
                      }}
                      className="px-4 py-1.5 bg-white/[0.06] border border-white/[0.08] text-white hover:bg-white/[0.1] text-[10px] uppercase font-medium tracking-widest rounded-lg transition-all"
                    >
                      Commit Strategic Decision
                    </button>
                  </div>

                </motion.div>
              )}

            </div>
          )}

          </div> {/* End central-panel-scrollable-content */}
        </div>

        {/* ORGANIZATIONAL TIME MACHINE SLIDER - Cinematic Parallax Bottom Control */}
        <div className="bg-white/[0.03] backdrop-blur-[40px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.5)] border border-white/[0.08] border-t-white/[0.25] border-l-white/[0.15] rounded-[16px] p-4 flex flex-col gap-3 shrink-0 relative overflow-hidden">
          <div className="absolute inset-x-0 h-[1px] bg-white/[0.08] top-0" />
          <div className="flex justify-between items-center font-sans font-light tracking-wide">
            <span className="text-[11px] text-white/50 uppercase tracking-[0.15em] font-medium flex items-center gap-1.5">
              <History size={11} className="opacity-60" />
              Sovereign Time Machine
            </span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">VIEWPORT TEMPORAL FILTER</span>
          </div>

          <div className="flex items-center gap-2 pt-1 font-sans text-[11px] tracking-widest text-white/50">
            {['2025-q4', '2026-q1', '2026-q2', '2026-q3', '2026-q4'].map((qVal) => (
              <button
                key={qVal}
                onClick={() => handleTimeShift(qVal as any)}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all border text-center font-medium ${
                  timeQuarter === qVal 
                    ? 'bg-white/[0.08] border-white/[0.1] text-white shadow-[0_2px_8px_rgba(0,0,0,0.2)]' 
                    : 'bg-transparent border-transparent hover:bg-white/[0.03] hover:text-white/80'
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
    </>
  );
}
