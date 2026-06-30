import { useState, useEffect } from 'react';
import { SOVRKernel } from './SOVRKernel';
import { SOVRState, OperationalIntelligenceAnswer } from './types';

export function useSOVRKernel() {
  const kernel = SOVRKernel.getInstance();
  const [state, setState] = useState<SOVRState>(() => kernel.getState());

  useEffect(() => {
    const unsubscribe = kernel.registerChangeListener(() => {
      setState({ ...kernel.getState() });
    });
    return () => unsubscribe();
  }, []);

  const setQuarter = (q: '2025-q4' | '2026-q1' | '2026-q2' | '2026-q3' | '2026-q4') => {
    kernel.setQuarter(q);
  };

  const setRoom = (r: any) => {
    kernel.setRoom(r);
  };

  const createMission = (name: string, department: string) => {
    kernel.createMission(name, department);
  };

  const toggleTaskDone = (missionId: string, taskId: string) => {
    kernel.toggleTaskDone(missionId, taskId);
  };

  const addMemoryFact = (fact: string, category?: any) => {
    kernel.addMemoryFact(fact, category);
  };

  const deleteMemoryFact = (id: string) => {
    kernel.deleteMemoryFact(id);
  };

  const toggleDamping = () => {
    kernel.toggleDamping();
  };

  const resolveApproval = (id: string, action: 'approved' | 'declined') => {
    kernel.resolveApproval(id, action);
  };

  const reallocateCompute = (fromDept: string, toDept: string, amount: number) => {
    return kernel.reallocateCompute(fromDept, toDept, amount);
  };

  const operationalAnswers = kernel.getOperationalIntelligenceAnswers();

  return {
    state,
    setQuarter,
    setRoom,
    createMission,
    toggleTaskDone,
    addMemoryFact,
    deleteMemoryFact,
    toggleDamping,
    resolveApproval,
    reallocateCompute,
    operationalAnswers,
    kernel
  };
}
