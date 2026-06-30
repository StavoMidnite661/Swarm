export type AgentState = 'IDLE' | 'PLANNING' | 'EXECUTING' | 'DEBATING' | 'COMPLIANCE_CHECK' | 'SUSPENDED' | 'ERROR';

export interface SOVRAgent {
  name: string;
  role: string;
  department: string;
  capabilities: string[];
  workload: number;
  trustScore: number;
  costRate: number; // cost per token/sec
  status: string;
  avatar: string;
  contextWindow: string;
  experience: string;
  
  // OS System telemetry fields (Core 03)
  state: AgentState;
  latencyMs: number;
  lastHeartbeat: string;
  tokensConsumedInput: number;
  tokensConsumedOutput: number;
  totalCostUsd: number;
  
  // OS System rich living telemetry (Phase III)
  health: number; // 0-100%
  heartbeatSec: number; // time in seconds since last tick
  missionQueueCount: number;
  workersCount: number;
  subAgentsCount: number;
  currentMissionName: string;
  cpuUsage: number;
  memoryUsageGb: number;
  recoveryStatus: 'HEALTHY' | 'SELF_HEALING' | 'RECOVERING' | 'DEGRADED';
  confidence: number; // Agent organizational confidence %
}

export interface MissionTask {
  id: string;
  name: string;
  done: boolean;
  assignedAgent: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dependencies: string[]; // Task IDs that must be done first
}

export interface SOVRMission {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'pending' | 'blocked' | 'suspended';
  progress: number;
  department: string;
  owner: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  milestones: string[];
  tasks: MissionTask[];
  createdAt: string;
  completedAt?: string;
  
  // OS Mission Scheduler Lifecycle (Phase III)
  schedulerState: 'READY' | 'WAITING_DEPENDENCIES' | 'ALLOCATED' | 'EXECUTING' | 'PAUSED' | 'REVIEW' | 'COMPLETED' | 'ARCHIVED';
  failureRecoveryStrategy?: 'RESTART' | 'RETRY_WITH_BACKOFF' | 'ESCALATE' | 'DELEGATE_TO_SUPERVISOR' | 'HUMAN_REVIEW';
  failureCount?: number;
}

export interface WorkflowDSL {
  id: string;
  name: string;
  description: string;
  steps: {
    id: string;
    action: string;
    assignedAgent: string;
    params: Record<string, any>;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  }[];
}

export interface ScheduledJob {
  id: string;
  name: string;
  cronExpression: string;
  nextRun: string;
  lastResult: 'SUCCESS' | 'FAILED' | 'PENDING';
  targetWorkflowId: string;
}

export interface OracleEvent {
  id: string;
  timestamp: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'AUDIT' | 'SECURITY' | 'FINANCIAL' | 'ERROR';
  sourceCore: 'CORE_01' | 'CORE_02' | 'CORE_03' | 'CORE_04' | 'CORE_05' | 'CORE_06' | 'CORE_07';
  message: string;
  details?: string;
  gasCost?: number; // Simulated computation unit gas
}

export interface LedgerEntry {
  id: string;
  timestamp: string;
  account: 'TREASURY' | 'COMPUTE_RESERVE' | 'OPERATIONAL_EXPENSE' | 'GAS_ESCROW';
  type: 'DEBIT' | 'CREDIT';
  amountUsd: number;
  description: string;
}

export interface MemoryNode {
  id: string;
  fact: string;
  category: 'STRATEGIC' | 'OPERATIONAL' | 'FOUNDER_PREFERENCE' | 'AUDIT';
  connections: string[]; // Connected Node IDs
  lastAccessed: string;
}

export interface TelemetrySnapshot {
  timestamp: string;
  cpuLoad: number;
  ramUsageGb: number;
  eventRatePerMin: number;
  avgLatencyMs: number;
  totalTokenUsage: number;
  cumulativeCostUsd: number;
  queueDepth: number;
}

export interface OperationalIntelligenceAnswer {
  question: string;
  answer: string;
  urgency: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actionableLink?: string;
  systemSummary?: string;
}

export interface ComplianceApproval {
  id: string;
  title: string;
  category: 'legal' | 'financial' | 'security' | 'operational';
  riskScore: number; // 0-100
  status: 'pending' | 'approved' | 'declined';
  description: string;
  timestamp: string;
}

export interface SOVRState {
  // Core 01: Executive Core
  executivePlan: {
    strategicPriority: string;
    currentObjective: string;
    consensusAgreement: number; // percentage of agreement
    activeRoom: 'hq' | 'operations' | 'engineering' | 'finance' | 'marketing' | 'research' | 'legal' | 'situation';
    timeQuarter: '2025-q4' | '2026-q1' | '2026-q2' | '2026-q3' | '2026-q4';
  };
  
  // Core 02: Mission Engine
  missions: SOVRMission[];
  
  // Core 03: Agent Fabric
  agents: SOVRAgent[];
  
  // Core 04: Workflow Engine
  workflows: WorkflowDSL[];
  scheduledJobs: ScheduledJob[];
  deadLetterQueue: string[]; // Workflow IDs that failed and are archived
  
  // Core 05: Oracle Ledger
  events: OracleEvent[];
  ledger: LedgerEntry[];
  complianceScore: number; // 0-100
  approvals: ComplianceApproval[];
  
  // Core 06: Memory Engine
  memoryNodes: MemoryNode[];
  
  // Core 07: Observability
  telemetryHistory: TelemetrySnapshot[];
  currentCpu: number;
  currentRam: number;
  queueDepth: number;
  
  // Emergency override
  emergencyDampingActive: boolean;
  
  // OS Global Orchestration state (Phase III)
  computeAllocation: Record<string, number>; // e.g. {'Executive': 12, 'Engineering': 28, 'Research': 34, ...}
  queues: Record<string, number>; // e.g. {'Mission': 4, 'Research': 7, 'Memory': 2, 'Settlement': 8, 'Notification': 1}
  departmentCosts: Record<string, number>; // e.g. {'Engineering': 13.22, 'Research': 9.44, ...}
  organizationalConfidence: number; // e.g. 94%
  spendTodayUsd: number; // e.g. 41.82
}
