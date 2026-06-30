import React from 'react';
import { ChatMessage, ModelConfig } from '../types';
import { SOVRState, OperationalIntelligenceAnswer, SOVRAgent, SOVRMission, MemoryNode, OracleEvent } from '../kernel/types';

export interface BaseCommandCenterProps {
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
  
  // OS Navigation & Core State
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

  modelConfig: ModelConfig;
  setModelConfig: React.Dispatch<React.SetStateAction<ModelConfig>>;

  // OS Systems Kernel bindings
  sovrState: SOVRState;
  operationalAnswers: OperationalIntelligenceAnswer[];
  createMission: (name: string, department: string) => void;
  toggleTaskDone: (missionId: string, taskId: string) => void;
  addMemoryFact: (fact: string, category?: any) => void;
  deleteMemoryFact: (id: string) => void;
  toggleDamping: () => void;
  resolveApproval: (id: string, action: 'approved' | 'declined') => void;
  reallocateCompute?: (fromDept: string, toDept: string, amount: number) => boolean;
  
  yaw: number;
  pitch: number;
  currentTime: Date;
  setShowSettings: (v: boolean) => void;
  token: string | null;
}

export interface PanelProps extends BaseCommandCenterProps {
  rightTab: 'comms' | 'calendar' | 'email' | 'contacts' | 'timeline' | 'memory' | 'approvals' | 'config';
  setRightTab: (v: 'comms' | 'calendar' | 'email' | 'contacts' | 'timeline' | 'memory' | 'approvals' | 'config') => void;
  showAddMission: boolean;
  setShowAddMission: (v: boolean) => void;
  newMissionName: string;
  setNewMissionName: (v: string) => void;
  newMissionDept: string;
  setNewMissionDept: (v: string) => void;
  newMissionMilestone: string;
  setNewMissionMilestone: (v: string) => void;
  notification: string | null;
  setNotification: (v: string | null) => void;
  debateScenario: string;
  setDebateScenario: (v: string) => void;
  isDebating: boolean;
  setIsDebating: (v: boolean) => void;
  debateStep: number;
  setDebateStep: (v: number) => void;
  debateLogs: { sender: string; role: string; text: string; time: string; avatar: string }[];
  setDebateLogs: (v: any) => void;
  debateResult: { risk: number; readiness: number; impact: number; summary: string } | null;
  setDebateResult: (v: any) => void;
  showToast: (msg: string) => void;
  runSimulationDebate: () => void;
}

export type CommandCenterProps = BaseCommandCenterProps;
