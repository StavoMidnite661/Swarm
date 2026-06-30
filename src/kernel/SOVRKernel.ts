import { 
  SOVRState, SOVRAgent, SOVRMission, OracleEvent, LedgerEntry, 
  MemoryNode, TelemetrySnapshot, WorkflowDSL, ScheduledJob, 
  AgentState, MissionTask, OperationalIntelligenceAnswer 
} from './types';

type EventCallback = (payload: any) => void;

class EventBus {
  private listeners: Record<string, EventCallback[]> = {};

  public subscribe(event: string, callback: EventCallback): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  public publish(event: string, payload: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(payload);
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }
    // All events are also captured on the wild-card channel for audit ledger logs
    if (event !== '*' && this.listeners['*']) {
      this.listeners['*'].forEach(callback => {
        try {
          callback({ event, payload });
        } catch (e) {
          console.error(`Error in wild-card listener:`, e);
        }
      });
    }
  }
}

export class SOVRKernel {
  private static instance: SOVRKernel | null = null;
  public eventBus: EventBus = new EventBus();
  private state: SOVRState;
  private changeListeners: (() => void)[] = [];
  private tickInterval: any = null;

  public static getInstance(): SOVRKernel {
    if (!SOVRKernel.instance) {
      SOVRKernel.instance = new SOVRKernel();
    }
    return SOVRKernel.instance;
  }

  private constructor() {
    this.state = this.getInitialState();
    this.setupListeners();
    this.startBackgroundTicks();
  }

  private getInitialState(): SOVRState {
    const timestamp = new Date().toLocaleTimeString();
    
    // Initial core agents
    const initialAgents: SOVRAgent[] = [
      {
        name: 'COO Flow',
        role: 'Chief Operations Officer',
        department: 'Operations',
        capabilities: ['Process Optimization', 'SLA Orchestration', 'Transient Agent Spawning', 'Resource Sharding'],
        workload: 42,
        trustScore: 99.8,
        costRate: 0.00015,
        status: 'MONITORING_PIPELINES',
        avatar: 'OP',
        contextWindow: '128k tokens',
        experience: 'L5 Autonomous Executive',
        state: 'IDLE',
        latencyMs: 140,
        lastHeartbeat: timestamp,
        tokensConsumedInput: 45200,
        tokensConsumedOutput: 12100,
        totalCostUsd: 8.52,
        health: 99,
        heartbeatSec: 1.2,
        missionQueueCount: 4,
        workersCount: 8,
        subAgentsCount: 14,
        currentMissionName: 'SLA Routing Compliance',
        cpuUsage: 25,
        memoryUsageGb: 3.1,
        recoveryStatus: 'HEALTHY',
        confidence: 99.8
      },
      {
        name: 'CTO Spark',
        role: 'Chief Technology Officer',
        department: 'Engineering',
        capabilities: ['GPU Vector Pipelines', 'Spanner Sharding', 'QA Continuous Synthesizing', 'Smart-Contract Verification'],
        workload: 68,
        trustScore: 98.4,
        costRate: 0.00025,
        status: 'OPTIMIZING_SHADERS',
        avatar: 'EN',
        contextWindow: '1M tokens',
        experience: 'L6 Core Compiler',
        state: 'IDLE',
        latencyMs: 245,
        lastHeartbeat: timestamp,
        tokensConsumedInput: 98500,
        tokensConsumedOutput: 48000,
        totalCostUsd: 36.62,
        health: 97,
        heartbeatSec: 4.8,
        missionQueueCount: 18,
        workersCount: 12,
        subAgentsCount: 37,
        currentMissionName: 'Deploy Swiss-K8s Node',
        cpuUsage: 41,
        memoryUsageGb: 8.3,
        recoveryStatus: 'HEALTHY',
        confidence: 98.4
      },
      {
        name: 'CFO Ledger',
        role: 'Chief Financial Officer',
        department: 'Finance',
        capabilities: ['Liquidity Balancing', 'Gas Price Hedging', 'Treasury Forecasting', 'Automated Micro-Auditing'],
        workload: 15,
        trustScore: 99.9,
        costRate: 0.00020,
        status: 'HEDGING_RESERVES',
        avatar: 'FI',
        contextWindow: '256k tokens',
        experience: 'L5 Risk Accountant',
        state: 'IDLE',
        latencyMs: 180,
        lastHeartbeat: timestamp,
        tokensConsumedInput: 18400,
        tokensConsumedOutput: 6200,
        totalCostUsd: 4.92,
        health: 99,
        heartbeatSec: 2.1,
        missionQueueCount: 2,
        workersCount: 4,
        subAgentsCount: 8,
        currentMissionName: 'Hedging Yield Reserves',
        cpuUsage: 12,
        memoryUsageGb: 1.8,
        recoveryStatus: 'HEALTHY',
        confidence: 99.9
      },
      {
        name: 'CMO Campaign',
        role: 'Chief Marketing Officer',
        department: 'Marketing',
        capabilities: ['Social Reach Optimization', 'Semantic Brand Generation', 'CTR Attribution Models'],
        workload: 55,
        trustScore: 94.2,
        costRate: 0.00010,
        status: 'AGGREGATING_STATS',
        avatar: 'MK',
        contextWindow: '64k tokens',
        experience: 'L4 Growth Optimizer',
        state: 'IDLE',
        latencyMs: 310,
        lastHeartbeat: timestamp,
        tokensConsumedInput: 34100,
        tokensConsumedOutput: 15900,
        totalCostUsd: 5.00,
        health: 94,
        heartbeatSec: 5.6,
        missionQueueCount: 6,
        workersCount: 6,
        subAgentsCount: 19,
        currentMissionName: 'Semantic Reach Optimization',
        cpuUsage: 18,
        memoryUsageGb: 2.4,
        recoveryStatus: 'HEALTHY',
        confidence: 94.2
      },
      {
        name: 'Legal Guard',
        role: 'General Counsel & Compliance',
        department: 'Legal',
        capabilities: ['SEC Rules Compliance', 'Smart Contract Hazard Scanning', 'Entity Structuring'],
        workload: 40,
        trustScore: 100.0,
        costRate: 0.00030,
        status: 'GUARDING_COMPLIANCE',
        avatar: 'LE',
        contextWindow: '512k tokens',
        experience: 'L6 Compliance Kernel',
        state: 'IDLE',
        latencyMs: 410,
        lastHeartbeat: timestamp,
        tokensConsumedInput: 15400,
        tokensConsumedOutput: 8900,
        totalCostUsd: 7.29,
        health: 100,
        heartbeatSec: 10.2,
        missionQueueCount: 1,
        workersCount: 3,
        subAgentsCount: 6,
        currentMissionName: 'SEC Smart-Contract Verify',
        cpuUsage: 8,
        memoryUsageGb: 1.2,
        recoveryStatus: 'HEALTHY',
        confidence: 100.0
      }
    ];

    // Initial tactical missions
    const initialMissions: SOVRMission[] = [
      {
        id: 'm1',
        name: 'Launch Sovereign Cloud Cluster Node',
        status: 'active',
        progress: 68,
        department: 'Engineering',
        owner: 'CTO Spark',
        priority: 'HIGH',
        milestones: ['Setup Kubernetes Clusters', 'Install Redis Caching', 'Secure TLS Handshakes'],
        createdAt: '12:00:00',
        tasks: [
          { id: 't1_1', name: 'Deploy 8 bare-metal containers on Swiss cloud network', done: true, assignedAgent: 'CTO Spark', priority: 'HIGH', dependencies: [] },
          { id: 't1_2', name: 'Implement strict TLS client certificates', done: true, assignedAgent: 'CTO Spark', priority: 'HIGH', dependencies: ['t1_1'] },
          { id: 't1_3', name: 'Auto-replicate Redis cluster state across Frankfurt', done: false, assignedAgent: 'CTO Spark', priority: 'MEDIUM', dependencies: ['t1_2'] }
        ],
        schedulerState: 'EXECUTING',
        failureRecoveryStrategy: 'RETRY_WITH_BACKOFF',
        failureCount: 0
      },
      {
        id: 'm2',
        name: 'Refactor Autonomous Treasury Strategy',
        status: 'active',
        progress: 40,
        department: 'Finance',
        owner: 'CFO Ledger',
        priority: 'CRITICAL',
        milestones: ['Audit gas consumption rates', 'Deploy yield compounding scripts', 'Formulate tax mitigation reserves'],
        createdAt: '12:15:00',
        tasks: [
          { id: 't2_1', name: 'Audit gas consumption on main contracts', done: true, assignedAgent: 'CFO Ledger', priority: 'HIGH', dependencies: [] },
          { id: 't2_2', name: 'Deploy smart compounders to Uniswap pools', done: false, assignedAgent: 'CFO Ledger', priority: 'CRITICAL', dependencies: ['t2_1'] },
          { id: 't2_3', name: 'Allocate 10% to sovereign cash reserve', done: false, assignedAgent: 'CFO Ledger', priority: 'MEDIUM', dependencies: [] }
        ],
        schedulerState: 'ALLOCATED',
        failureRecoveryStrategy: 'DELEGATE_TO_SUPERVISOR',
        failureCount: 1
      },
      {
        id: 'm3',
        name: 'Deploy Decentralized Customer Experience Framework',
        status: 'completed',
        progress: 100,
        department: 'Operations',
        owner: 'COO Flow',
        priority: 'MEDIUM',
        milestones: ['Train CS LLM with company blueprints', 'Deploy chat interface widget'],
        createdAt: '10:30:00',
        completedAt: '16:00:00',
        tasks: [
          { id: 't3_1', name: 'Pre-train customer-success LLM with EIOS guidelines', done: true, assignedAgent: 'COO Flow', priority: 'MEDIUM', dependencies: [] },
          { id: 't3_2', name: 'Deploy real-time live support chat widget', done: true, assignedAgent: 'COO Flow', priority: 'MEDIUM', dependencies: ['t3_1'] }
        ],
        schedulerState: 'COMPLETED',
        failureRecoveryStrategy: 'HUMAN_REVIEW',
        failureCount: 0
      }
    ];

    // Initial workflows
    const initialWorkflows: WorkflowDSL[] = [
      {
        id: 'w1',
        name: 'Sovereign Cluster Autoscaler',
        description: 'Auto-provisions GPU container resources when workload queue surges above 80%',
        steps: [
          { id: 's1', action: 'Query core load metrics', assignedAgent: 'CTO Spark', params: {}, status: 'COMPLETED' },
          { id: 's2', action: 'Verify treasury balance', assignedAgent: 'CFO Ledger', params: { minCost: 50 }, status: 'COMPLETED' },
          { id: 's3', action: 'Deploy Swiss-K8s bare-metal node', assignedAgent: 'CTO Spark', params: { nodeCount: 2 }, status: 'RUNNING' },
          { id: 's4', action: 'Rebalance operational cluster routing', assignedAgent: 'COO Flow', params: {}, status: 'PENDING' }
        ]
      },
      {
        id: 'w2',
        name: 'SEC Compliance Micro-Audit',
        description: 'Audit automated liquid yield compounding pools for non-custodial alignment',
        steps: [
          { id: 'sa1', action: 'Scan contract ABI declarations', assignedAgent: 'Legal Guard', params: {}, status: 'PENDING' },
          { id: 'sa2', action: 'Audit asset movement logs', assignedAgent: 'CFO Ledger', params: {}, status: 'PENDING' },
          { id: 'sa3', action: 'Compile SEC mitigation report', assignedAgent: 'Legal Guard', params: {}, status: 'PENDING' }
        ]
      }
    ];

    // Scheduled recurring OS jobs
    const initialJobs: ScheduledJob[] = [
      { id: 'j1', name: 'Weekly Yield Compound Rebalance', cronExpression: '0 0 * * 0', nextRun: 'Sunday, 00:00', lastResult: 'SUCCESS', targetWorkflowId: 'w2' },
      { id: 'j2', name: 'Hourly Infrastructure Pulse Audit', cronExpression: '*/60 * * * *', nextRun: 'In 45 minutes', lastResult: 'SUCCESS', targetWorkflowId: 'w1' }
    ];

    // Long-Term Semantic Memory Engine Nodes
    const initialMemories: MemoryNode[] = [
      { id: 'f1', fact: 'Stavogm is Chief Executive Officer (CEO). Style: ultra-minimal, high-leverage decisions.', category: 'FOUNDER_PREFERENCE', connections: ['f2', 'f3'], lastAccessed: timestamp },
      { id: 'f2', fact: 'Primary Mission: Redefine full-stack architectures and eliminate organizational noise.', category: 'STRATEGIC', connections: ['f1'], lastAccessed: timestamp },
      { id: 'f3', fact: 'Preference: Prefers high-contrast, low-cognitive-load spatial user interfaces.', category: 'FOUNDER_PREFERENCE', connections: ['f1'], lastAccessed: timestamp },
      { id: 'f4', fact: 'Sovereign Core reserves must never drop below $1.5M USDC equivalent.', category: 'OPERATIONAL', connections: [], lastAccessed: timestamp }
    ];

    const initialLedger: LedgerEntry[] = [
      { id: 'l1', timestamp: '12:00:00', account: 'TREASURY', type: 'CREDIT', amountUsd: 1500000.00, description: 'Initial Sovereign Reserve allocation' },
      { id: 'l2', timestamp: '12:15:00', account: 'COMPUTE_RESERVE', type: 'DEBIT', amountUsd: 450.00, description: 'GPU Clusters pre-purchase lock' },
      { id: 'l3', timestamp: '13:00:00', account: 'OPERATIONAL_EXPENSE', type: 'DEBIT', amountUsd: 120.40, description: 'Sovereign DNS registry lease' }
    ];

    const initialEvents: OracleEvent[] = [
      { id: 'e1', timestamp: '17:24:10', type: 'INFO', sourceCore: 'CORE_01', message: 'EIOS Sovereign Orbit initialized successfully.' },
      { id: 'e2', timestamp: '17:24:11', type: 'SUCCESS', sourceCore: 'CORE_07', message: 'Primary core WebGL gravitational shader bound on GPU port 3000.' },
      { id: 'e3', timestamp: '17:24:12', type: 'AUDIT', sourceCore: 'CORE_05', message: 'Founder signature Stavogm authenticated. Access levels: EXECUTIVE_ADMIN.' }
    ];

    const initialApprovals = [
      {
        id: 'a1',
        title: 'Deploy Liquidity Compounder ABI Contract to Mainnet',
        category: 'financial' as const,
        riskScore: 78,
        status: 'pending' as const,
        description: 'Compiles and locks 420 ETH into yield routers with 3/4 multisig parameters.',
        timestamp: '15:30:11'
      },
      {
        id: 'a2',
        title: 'Open Port 22 SSH Root Access on Backup Kubernetes Cluster',
        category: 'security' as const,
        riskScore: 94,
        status: 'pending' as const,
        description: 'Exposes administrative terminal credentials to high-risk public IP channels for diagnostic checks.',
        timestamp: '16:05:42'
      },
      {
        id: 'a3',
        title: 'Sync CMO Campaign Segment Data to External Marketing API',
        category: 'operational' as const,
        riskScore: 42,
        status: 'pending' as const,
        description: 'Transmits low-risk opt-out user behavioral clusters to optimized growth pipelines.',
        timestamp: '17:11:05'
      }
    ];

    // Initial telemetry snapshot
    const initialTelemetry: TelemetrySnapshot[] = Array.from({ length: 15 }).map((_, i) => ({
      timestamp: new Date(Date.now() - (15 - i) * 60000).toLocaleTimeString(),
      cpuLoad: 25 + Math.random() * 15,
      ramUsageGb: 4.2 + Math.random() * 0.8,
      eventRatePerMin: 12 + Math.floor(Math.random() * 8),
      avgLatencyMs: 180 + Math.floor(Math.random() * 40),
      totalTokenUsage: 142000 + i * 8500,
      cumulativeCostUsd: 52.40 + i * 0.45,
      queueDepth: Math.floor(Math.random() * 2)
    }));

    return {
      executivePlan: {
        strategicPriority: 'Maintain absolute treasury resilience while autoscaling Swiss compute nodes.',
        currentObjective: 'Auditing non-custodial Uniswap smart compounders for regulatory gas efficiency.',
        consensusAgreement: 98.4,
        activeRoom: 'hq',
        timeQuarter: '2026-q3'
      },
      missions: initialMissions,
      agents: initialAgents,
      workflows: initialWorkflows,
      scheduledJobs: initialJobs,
      deadLetterQueue: [],
      events: initialEvents,
      ledger: initialLedger,
      complianceScore: 100,
      approvals: initialApprovals,
      memoryNodes: initialMemories,
      telemetryHistory: initialTelemetry,
      currentCpu: 34,
      currentRam: 4.8,
      queueDepth: 1,
      emergencyDampingActive: false,
      
      // Phase III properties
      computeAllocation: {
        'Executive': 12,
        'Engineering': 28,
        'Research': 34,
        'Legal': 6,
        'Finance': 8,
        'Reserve': 12
      },
      queues: {
        'Mission': 3,
        'Research': 6,
        'Memory': 2,
        'Settlement': 7,
        'Notification': 1
      },
      departmentCosts: {
        'Operations': 8.52,
        'Engineering': 36.62,
        'Finance': 4.92,
        'Marketing': 5.00,
        'Legal': 7.29
      },
      organizationalConfidence: 98,
      spendTodayUsd: 62.35
    };
  }

  private setupListeners() {
    // Inter-system loosely-coupled routing
    this.eventBus.subscribe('MISSION_UPDATED', (payload: any) => {
      this.logEvent('SUCCESS', 'CORE_02', `Mission updated: ${payload.mission.name}. Progress: ${payload.mission.progress}%`);
    });

    this.eventBus.subscribe('COMPLIANCE_ALARM', (payload: any) => {
      this.logEvent('SECURITY', 'CORE_05', `COMPLIANCE HAZARD DETECTION: ${payload.title}. Risk level ${payload.riskScore}%!`);
      if (payload.riskScore >= 85) {
        this.logEvent('WARNING', 'CORE_01', 'EMERGENCY MODE RECOMMENDATION: Risk score exceeds threshold. Restricting automatic treasury state transitions.');
      }
    });

    this.eventBus.subscribe('STATE_MUTATION', () => {
      this.notifyListeners();
    });
  }

  // CORE 07: Observability Engine Ticks
  private startBackgroundTicks() {
    this.tickInterval = setInterval(() => {
      if (this.state.emergencyDampingActive) {
        // Slow down operations in emergency mode
        this.simulateSystemTicks(0.2);
      } else {
        this.simulateSystemTicks(1.0);
      }
    }, 4000);
  }

  private simulateSystemTicks(speedFactor: number) {
    const timestamp = new Date().toLocaleTimeString();
    
    // A. Fluctuate global queues
    if (this.state.queues) {
      this.state.queues = {
        'Mission': Math.max(1, Math.min(15, this.state.queues['Mission'] + (Math.random() > 0.5 ? 1 : -1))),
        'Research': Math.max(2, Math.min(20, this.state.queues['Research'] + (Math.random() > 0.55 ? 1 : -1))),
        'Memory': Math.max(1, Math.min(10, this.state.queues['Memory'] + (Math.random() > 0.45 ? 1 : -1))),
        'Settlement': Math.max(2, Math.min(15, this.state.queues['Settlement'] + (Math.random() > 0.5 ? 1 : -1))),
        'Notification': Math.max(0, Math.min(8, this.state.queues['Notification'] + (Math.random() > 0.6 ? 1 : -1))),
      };
    } else {
      this.state.queues = { 'Mission': 3, 'Research': 6, 'Memory': 2, 'Settlement': 7, 'Notification': 1 };
    }

    // B. Fluctuate organizational confidence
    this.state.organizationalConfidence = this.state.emergencyDampingActive 
      ? 80 
      : Math.min(100, Math.max(88, this.state.organizationalConfidence + (Math.random() > 0.5 ? 1 : -1)));

    // 1. Simulate agent heartbeats & brief state variations (Core 03)
    this.state.agents = this.state.agents.map(agent => {
      const stateRand = Math.random();
      let nextState: AgentState = agent.state;
      let status = agent.status;
      let recoveryStatus = agent.recoveryStatus || 'HEALTHY';
      let health = agent.health || 100;

      // Simulate occasional failure & self-healing
      if (recoveryStatus === 'HEALTHY' && Math.random() < 0.015 * speedFactor) {
        recoveryStatus = 'SELF_HEALING';
        nextState = 'SUSPENDED';
        status = 'TIMEOUT_DETECTED_RESTARTING';
        health = 82;
        this.logEvent('WARNING', 'CORE_03', `RUNTIME WATCHDOG: Agent ${agent.name} timed out. Initiating automatic container restart.`);
      } else if (recoveryStatus === 'SELF_HEALING') {
        recoveryStatus = 'RECOVERING';
        status = 'RECONCILING_MEMORY_WALK';
        health = 92;
        this.logEvent('INFO', 'CORE_03', `RUNTIME WATCHDOG: Agent ${agent.name} container rebuilt. Syncing memory nodes...`);
      } else if (recoveryStatus === 'RECOVERING') {
        recoveryStatus = 'HEALTHY';
        nextState = 'IDLE';
        status = 'MONITORING_PIPELINES';
        health = 99;
        this.logEvent('SUCCESS', 'CORE_03', `RUNTIME WATCHDOG: Agent ${agent.name} fully recovered. Resilience loops completed.`);
      } else {
        if (agent.state === 'IDLE' && stateRand < 0.2 * speedFactor) {
          nextState = 'PLANNING';
          status = 'RECOMPILING_OBJECTIVES';
        } else if (agent.state === 'PLANNING' && stateRand < 0.4 * speedFactor) {
          nextState = 'EXECUTING';
          status = 'MUTATING_SPATIAL_LEDGER';
        } else if (agent.state === 'EXECUTING' && stateRand < 0.4 * speedFactor) {
          nextState = 'IDLE';
          status = 'MONITORING_PIPELINES';
        }
      }

      const drift = Math.floor((Math.random() * 40 - 20) * speedFactor);
      const newLatency = Math.max(80, agent.latencyMs + drift);
      
      const tokensIn = agent.tokensConsumedInput + Math.floor((Math.random() * 200 + 50) * speedFactor);
      const tokensOut = agent.tokensConsumedOutput + Math.floor((Math.random() * 80 + 20) * speedFactor);
      const incrementalCost = (tokensIn + tokensOut) * agent.costRate;
      
      const newTotalCostUsd = Number((agent.totalCostUsd + incrementalCost).toFixed(2));
      
      // Update departmentCosts
      const dep = agent.department;
      if (this.state.departmentCosts) {
        this.state.departmentCosts[dep] = Number(((this.state.departmentCosts[dep] || 0) + incrementalCost).toFixed(2));
      }
      this.state.spendTodayUsd = Number((this.state.spendTodayUsd + incrementalCost).toFixed(2));

      // CPU and RAM mapping
      let cpu = 5;
      let ram = 1.2;
      if (nextState === 'PLANNING') {
        cpu = Math.floor(20 + Math.random() * 15);
        ram = Number((3.0 + Math.random() * 1.5).toFixed(1));
      } else if (nextState === 'EXECUTING') {
        cpu = Math.floor(55 + Math.random() * 25);
        ram = Number((6.0 + Math.random() * 3.5).toFixed(1));
      } else if (nextState === 'SUSPENDED') {
        cpu = 1;
        ram = 0.5;
      }

      const hbeat = Math.random() < 0.2 ? Number((Math.random() * 5 + 1).toFixed(1)) : Number(((agent.heartbeatSec || 1.0) + 1 * speedFactor).toFixed(1));

      return {
        ...agent,
        state: nextState,
        status,
        latencyMs: newLatency,
        lastHeartbeat: timestamp,
        tokensConsumedInput: tokensIn,
        tokensConsumedOutput: tokensOut,
        totalCostUsd: newTotalCostUsd,
        health,
        heartbeatSec: hbeat,
        cpuUsage: cpu,
        memoryUsageGb: ram,
        recoveryStatus,
        workersCount: agent.workersCount || Math.floor(Math.random() * 5 + 3),
        subAgentsCount: agent.subAgentsCount || Math.floor(Math.random() * 20 + 10),
        missionQueueCount: Math.max(0, (agent.missionQueueCount || 0) + (Math.random() > 0.6 ? 1 : Math.random() > 0.7 ? -1 : 0)),
        confidence: agent.confidence || 98,
        currentMissionName: agent.currentMissionName || 'SLA Routing Compliance'
      };
    });

    // 2. Process Mission Scheduler lifecycles
    this.state.missions = this.state.missions.map(m => {
      if (m.status === 'completed') return m;
      
      let nextSchState = m.schedulerState || 'READY';
      let nextProgress = m.progress;
      let nextStatus: SOVRMission['status'] = m.status;
      let completedAt = m.completedAt;
      let failureCount = m.failureCount || 0;
      let recoveryStrategy = m.failureRecoveryStrategy || 'RETRY_WITH_BACKOFF';

      // Simulate occasional temporary failures in scheduler thread
      if (nextSchState === 'EXECUTING' && Math.random() < 0.02 * speedFactor) {
        nextSchState = 'PAUSED';
        failureCount += 1;
        this.logEvent('WARNING', 'CORE_02', `SCHEDULER EXCEPTION: Mission "${m.name}" thread panicked. Applying recovery: ${recoveryStrategy}.`);
      } else if (nextSchState === 'PAUSED' && Math.random() < 0.4 * speedFactor) {
        nextSchState = 'EXECUTING';
        this.logEvent('SUCCESS', 'CORE_02', `SCHEDULER RECOVERY: Auto-resumed mission "${m.name}" from pause checkpoint.`);
      } else if (nextSchState === 'READY' && Math.random() < 0.2 * speedFactor) {
        nextSchState = 'WAITING_DEPENDENCIES';
        this.logEvent('INFO', 'CORE_02', `MISSION SCHEDULER: "${m.name}" moved to WAITING_DEPENDENCIES.`);
      } else if (nextSchState === 'WAITING_DEPENDENCIES' && Math.random() < 0.3 * speedFactor) {
        nextSchState = 'ALLOCATED';
        this.logEvent('INFO', 'CORE_02', `MISSION SCHEDULER: Allocating compute cores and workers to "${m.name}".`);
      } else if (nextSchState === 'ALLOCATED' && Math.random() < 0.3 * speedFactor) {
        nextSchState = 'EXECUTING';
        this.logEvent('SUCCESS', 'CORE_02', `MISSION SCHEDULER: Thread successfully spawned. "${m.name}" is now EXECUTING.`);
      } else if (nextSchState === 'EXECUTING') {
        nextProgress = Math.min(99, m.progress + Math.floor((Math.random() * 12 + 4) * speedFactor));
        if (nextProgress >= 95 && Math.random() < 0.4) {
          nextSchState = 'REVIEW';
          this.logEvent('WARNING', 'CORE_02', `MISSION SCHEDULER: "${m.name}" is pending Human-in-the-loop compliance review.`);
        }
      } else if (nextSchState === 'REVIEW' && Math.random() < 0.3 * speedFactor) {
        nextSchState = 'COMPLETED';
        nextProgress = 100;
        nextStatus = 'completed';
        completedAt = new Date().toLocaleTimeString();
        this.logEvent('SUCCESS', 'CORE_02', `MISSION SCHEDULER: "${m.name}" marked as COMPLETED and archived.`);
      }
      
      return {
        ...m,
        schedulerState: nextSchState,
        progress: nextProgress,
        status: nextStatus,
        completedAt,
        failureCount,
        failureRecoveryStrategy: recoveryStrategy
      };
    });

    // 3. Simulate Active Workflow Steps ticking forward (Core 04)
    this.state.workflows = this.state.workflows.map(wf => {
      let stepProgress = false;
      const updatedSteps = wf.steps.map(step => {
        if (step.status === 'RUNNING' && Math.random() < 0.3 * speedFactor) {
          stepProgress = true;
          return { ...step, status: 'COMPLETED' as const };
        }
        if (step.status === 'PENDING' && stepProgress) {
          stepProgress = false; // Run next step
          this.logEvent('INFO', 'CORE_04', `Workflow ${wf.name}: Spawning step "${step.action}" delegated to ${step.assignedAgent}`);
          return { ...step, status: 'RUNNING' as const };
        }
        return step;
      });
      
      // If all steps completed, reset for visual looping demonstration
      const allDone = updatedSteps.every(s => s.status === 'COMPLETED');
      if (allDone) {
        this.logEvent('SUCCESS', 'CORE_04', `Workflow ${wf.name} executed autonomously to 100% completion.`);
        // Debit compute balance
        this.debitTreasury(2.40, `Autonomous run of workflow: ${wf.name}`);
        return {
          ...wf,
          steps: wf.steps.map((s, idx) => ({ ...s, status: idx === 0 ? 'RUNNING' as const : 'PENDING' as const }))
        };
      }

      return { ...wf, steps: updatedSteps };
    });

    // 4. Telemetry Ticking (Core 07)
    const activeExecutors = this.state.agents.filter(a => a.state !== 'IDLE').length;
    const cpuLoad = Math.min(99, Math.round(15 + activeExecutors * 12 + Math.random() * 8));
    const ramUsageGb = Math.min(16, Number((4.5 + activeExecutors * 0.4 + Math.random() * 0.2).toFixed(1)));
    const avgLatency = Math.round(this.state.agents.reduce((acc, a) => acc + a.latencyMs, 0) / this.state.agents.length);
    const cumulativeCost = this.state.agents.reduce((acc, a) => acc + a.totalCostUsd, 0);
    const eventRate = Math.floor(10 + activeExecutors * 5 + Math.random() * 5);

    this.state.currentCpu = cpuLoad;
    this.state.currentRam = ramUsageGb;

    const newSnapshot: TelemetrySnapshot = {
      timestamp,
      cpuLoad,
      ramUsageGb,
      eventRatePerMin: eventRate,
      avgLatencyMs: avgLatency,
      totalTokenUsage: this.state.agents.reduce((acc, a) => acc + a.tokensConsumedInput + a.tokensConsumedOutput, 0),
      cumulativeCostUsd: Number(cumulativeCost.toFixed(2)),
      queueDepth: this.state.queueDepth
    };

    this.state.telemetryHistory = [...this.state.telemetryHistory.slice(1), newSnapshot];

    // Emit mutation to let React listen
    this.eventBus.publish('STATE_MUTATION', this.state);
  }

  // --- MUTATORS & SYSTEMS MANIPULATION ---

  public getState(): SOVRState {
    return this.state;
  }

  public setQuarter(quarter: '2025-q4' | '2026-q1' | '2026-q2' | '2026-q3' | '2026-q4') {
    this.state.executivePlan.timeQuarter = quarter;
    this.logEvent('WARNING', 'CORE_01', `TEMPORAL REALIGNMENT: Target view shifted to ${quarter.toUpperCase()}`);
    this.eventBus.publish('STATE_MUTATION', this.state);
  }

  public setRoom(room: any) {
    this.state.executivePlan.activeRoom = room;
    this.eventBus.publish('STATE_MUTATION', this.state);
  }

  public logEvent(
    type: OracleEvent['type'], 
    source: OracleEvent['sourceCore'], 
    message: string, 
    details?: string
  ) {
    const timestamp = new Date().toLocaleTimeString();
    const newEvent: OracleEvent = {
      id: 'e-' + Math.random().toString(36).substring(2, 9),
      timestamp,
      type,
      sourceCore: source,
      message,
      details,
      gasCost: Math.floor(12 + Math.random() * 15)
    };
    this.state.events = [newEvent, ...this.state.events.slice(0, 49)]; // Limit to 50 logs in trace
    this.eventBus.publish('STATE_MUTATION', this.state);
  }

  public debitTreasury(amount: number, description: string) {
    const timestamp = new Date().toLocaleTimeString();
    const newEntry: LedgerEntry = {
      id: 'l-' + Math.random().toString(36).substring(2, 9),
      timestamp,
      account: 'OPERATIONAL_EXPENSE',
      type: 'DEBIT',
      amountUsd: amount,
      description
    };
    this.state.ledger = [newEntry, ...this.state.ledger];
    this.eventBus.publish('STATE_MUTATION', this.state);
  }

  public toggleDamping() {
    this.state.emergencyDampingActive = !this.state.emergencyDampingActive;
    const status = this.state.emergencyDampingActive ? 'ACTIVATED' : 'RELEASED';
    this.logEvent(
      this.state.emergencyDampingActive ? 'SECURITY' : 'INFO', 
      'CORE_01', 
      `EMERGENCY KERNEL DAMPING ${status}.`,
      `Manual founder override recorded. Agent execution speeds modulated by 5x.`
    );
    this.eventBus.publish('STATE_MUTATION', this.state);
  }

  // Core 02: Creating Missions with full task allocation dependencies
  public createMission(name: string, department: string) {
    const timestamp = new Date().toLocaleTimeString();
    const ownerMap: Record<string, string> = {
      'Engineering': 'CTO Spark',
      'Finance': 'CFO Ledger',
      'Marketing': 'CMO Campaign',
      'Operations': 'COO Flow'
    };
    const owner = ownerMap[department] || 'COO Flow';

    const missionId = 'm-' + Math.random().toString(36).substring(2, 9);
    
    // Procedurally spawn system task-tree (Core 02 task DSL integration)
    const proceduralTasks: MissionTask[] = [
      { 
        id: `${missionId}_t1`, 
        name: `Scrape semantic context guidelines for ${name}`, 
        done: false, 
        assignedAgent: owner, 
        priority: 'MEDIUM', 
        dependencies: [] 
      },
      { 
        id: `${missionId}_t2`, 
        name: `Draft operational constraints and security blueprint`, 
        done: false, 
        assignedAgent: owner, 
        priority: 'HIGH', 
        dependencies: [`${missionId}_t1`] 
      },
      { 
        id: `${missionId}_t3`, 
        name: `Deploy container node endpoints with mutual TLS authentication`, 
        done: false, 
        assignedAgent: 'CTO Spark', 
        priority: 'CRITICAL', 
        dependencies: [`${missionId}_t2`] 
      }
    ];

    const newMission: SOVRMission = {
      id: missionId,
      name,
      status: 'active',
      progress: 0,
      department,
      owner,
      priority: 'HIGH',
      milestones: [`Parse procedural dependencies`, `Implement multi-agent consensus`],
      createdAt: timestamp,
      tasks: proceduralTasks,
      schedulerState: 'READY',
      failureRecoveryStrategy: 'RETRY_WITH_BACKOFF',
      failureCount: 0
    };

    this.state.missions = [newMission, ...this.state.missions];
    this.logEvent('SUCCESS', 'CORE_01', `SPAWNED CORE SYSTEM TASK: "${name}"`, `Delegated orchestration sequence to ${owner}.`);
    this.eventBus.publish('MISSION_UPDATED', { mission: newMission });
    this.eventBus.publish('STATE_MUTATION', this.state);
  }

  public toggleTaskDone(missionId: string, taskId: string) {
    this.state.missions = this.state.missions.map(m => {
      if (m.id !== missionId) return m;
      
      const updatedTasks = m.tasks.map(t => {
        if (t.id !== taskId) return t;
        
        // Dependency protection gate check!
        const openDependencies = t.dependencies.filter(depId => {
          const dependencyTask = m.tasks.find(tk => tk.id === depId);
          return dependencyTask && !dependencyTask.done;
        });

        if (openDependencies.length > 0 && !t.done) {
          this.logEvent('WARNING', 'CORE_02', `SECURITY PRE-REQUISITE HAZARD: Task "${t.name}" blocked. Must complete dependency tree first.`);
          return t; // Keep blocked
        }

        return { ...t, done: !t.done };
      });

      const completedCount = updatedTasks.filter(t => t.done).length;
      const progress = Math.round((completedCount / updatedTasks.length) * 100);
      const isCompleted = progress === 100;
      
      const completedTimestamp = isCompleted ? new Date().toLocaleTimeString() : undefined;
      
      if (isCompleted) {
        this.logEvent('SUCCESS', 'CORE_02', `MISSION SECURED: "${m.name}" is completed.`, `All tasks authenticated.`);
      }

      return {
        ...m,
        tasks: updatedTasks,
        progress,
        status: isCompleted ? 'completed' as const : 'active' as const,
        completedAt: completedTimestamp
      };
    });

    this.eventBus.publish('STATE_MUTATION', this.state);
  }

  // Core 06 Memory nodes additions
  public addMemoryFact(fact: string, category: MemoryNode['category'] = 'OPERATIONAL') {
    const timestamp = new Date().toLocaleTimeString();
    const newId = 'f-' + Math.random().toString(36).substring(2, 9);
    const newNode: MemoryNode = {
      id: newId,
      fact,
      category,
      connections: this.state.memoryNodes.length > 0 ? [this.state.memoryNodes[0].id] : [],
      lastAccessed: timestamp
    };
    this.state.memoryNodes = [newNode, ...this.state.memoryNodes];
    this.logEvent('INFO', 'CORE_06', `Semantic memory committed to database: "${fact.substring(0, 50)}..."`);
    this.eventBus.publish('STATE_MUTATION', this.state);
  }

  public deleteMemoryFact(id: string) {
    this.state.memoryNodes = this.state.memoryNodes.filter(m => m.id !== id);
    this.logEvent('INFO', 'CORE_06', `Semantic index purged: ID ${id}`);
    this.eventBus.publish('STATE_MUTATION', this.state);
  }

  // Core 05 Oracle Ledger Approvals Sign-off
  public resolveApproval(id: string, action: 'approved' | 'declined') {
    const item = this.state.approvals.find(a => a.id === id);
    if (!item) return;

    item.status = action;
    
    if (action === 'approved') {
      this.logEvent('SUCCESS', 'CORE_05', `LEDGER COMPLIANCE AUTHORIZED: ${item.title}`, `Risk Score cleared at ${item.riskScore}%.`);
      
      if (item.category === 'financial') {
        const timestamp = new Date().toLocaleTimeString();
        this.state.ledger = [
          {
            id: 'l-' + Math.random().toString(36).substring(2, 9),
            timestamp,
            account: 'TREASURY',
            type: 'DEBIT',
            amountUsd: 150000,
            description: `CONTRACT ENGAGEMENT: ${item.title}`
          },
          ...this.state.ledger
        ];
      }
    } else {
      this.logEvent('WARNING', 'CORE_05', `LEDGER COMPLIANCE VETOED: ${item.title}`, `Action refused by executive order.`);
    }

    // Recompute compliance score dynamically
    const pendingCount = this.state.approvals.filter(a => a.status === 'pending').length;
    this.state.complianceScore = Math.max(60, 100 - (pendingCount * 12));

    this.eventBus.publish('STATE_MUTATION', this.state);
  }

  // --- THE 4 ESSENTIAL QUESTIONS OF OPERATIONAL INTELLIGENCE ---

  public getOperationalIntelligenceAnswers(): OperationalIntelligenceAnswer[] {
    const timestamp = new Date().toLocaleTimeString();
    
    // Question 1: What is happening?
    const runningWorkflows = this.state.workflows.filter(w => w.steps.some(s => s.status === 'RUNNING'));
    const activeMissionsCount = this.state.missions.filter(m => m.status === 'active').length;
    const whatIsHappening = `Sovereign OS is executing ${activeMissionsCount} critical strategic missions in tandem with ${runningWorkflows.length} autonomous micro-workflows. Agent compute density is hovering at ${this.state.currentCpu}% CPU with average inter-core routing latency of ${Math.round(this.state.agents.reduce((acc, a) => acc + a.latencyMs, 0) / this.state.agents.length)}ms.`;

    // Question 2: Why is it happening?
    const whyIsItHappening = `Resource scheduling and task queues are scaling dynamically to support our Q3 timeline target ("${this.state.executivePlan.strategicPriority}"). CFO Ledger is currently hedging reserves to compound liquidity nodes while CTO Spark deploys redundant bare-metal Swiss clusters to maintain zero DNS/Kubernetes routing latency.`;

    // Question 3: What needs my attention?
    // Determine active approval requirements or hazards
    const pendingMissions = this.state.missions.filter(m => m.status === 'active' && m.tasks.some(t => t.priority === 'CRITICAL' && !t.done));
    const activeBlocker = pendingMissions.length > 0 
      ? `Sovereign financial realignment ("${pendingMissions[0].name}") has a CRITICAL dependency awaiting manual approval in your compliance ledger.`
      : `No immediate blockages. All inter-agent consensus gates have cleared safety verifications.`;
    
    const urgencyLevel = pendingMissions.length > 0 ? 'CRITICAL' : 'NONE';

    // Question 4: What can the AI handle autonomously?
    const handleAutonomously = `Sentinel has delegated Kubernetes autoscaling constraints, hourly cluster health-pulses, and low-risk APAC marketing node archives entirely to autonomous agents. ${this.state.agents.length} executive processes are pulsing ready to resolve pipeline SLA deviations without founder intervention.`;

    return [
      {
        question: 'What is happening?',
        answer: whatIsHappening,
        urgency: 'NONE',
        systemSummary: `CORE CLUSTERS: RUNNING // WORKFLOWS ACTIVE: ${runningWorkflows.length}`
      },
      {
        question: 'Why is it happening?',
        answer: whyIsItHappening,
        urgency: 'LOW'
      },
      {
        question: 'What needs my attention?',
        answer: activeBlocker,
        urgency: urgencyLevel,
        actionableLink: urgencyLevel === 'CRITICAL' ? 'approvals' : undefined
      },
      {
        question: 'What can the AI handle autonomously?',
        answer: handleAutonomously,
        urgency: 'NONE',
        systemSummary: 'AUTONOMOUS REBALANCE: ACTIVE // RECOVERY_SLAS: VALID'
      }
    ];
  }

  public reallocateCompute(fromDept: string, toDept: string, amount: number): boolean {
    if (!this.state.computeAllocation) return false;
    const currentFrom = this.state.computeAllocation[fromDept] || 0;
    const currentTo = this.state.computeAllocation[toDept] || 0;
    if (currentFrom >= amount) {
      this.state.computeAllocation[fromDept] = currentFrom - amount;
      this.state.computeAllocation[toDept] = currentTo + amount;
      
      const timestamp = new Date().toLocaleTimeString();
      this.state.events.unshift({
        id: 'reallocate-' + Math.random().toString(36).substring(2, 9),
        timestamp,
        type: 'SUCCESS',
        sourceCore: 'CORE_01',
        message: `SYSTEM CORES REALLOCATED: ${amount} Cores from ${fromDept} to ${toDept}`,
        details: `Autonomous Chief of Staff optimization completed.`
      });
      
      this.eventBus.publish('STATE_MUTATION', this.state);
      return true;
    }
    return false;
  }

  // React listener registrations
  public registerChangeListener(callback: () => void) {
    this.changeListeners.push(callback);
    return () => {
      this.changeListeners = this.changeListeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners() {
    this.changeListeners.forEach(cb => {
      try {
        cb();
      } catch (e) {
        console.error('Error in change listener:', e);
      }
    });
  }

  public destroy() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
  }
}
