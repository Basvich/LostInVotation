import { IVotationResult } from './party';
import { IPartyFlow, IVoteFlowScenario } from './vote-flow';

export interface IVoteFlowAnalysisSelection {
  zone: string | null;
  oldLink: string | null;
  newLink: string | null;
}

export interface IVoteFlowAnalysisInput {
  oldVotation: IVotationResult | null;
  newVotation: IVotationResult | null;
  fidelityPercentage: number;
  blockSize: number;
  scenarioCount: number;
}

export type VoteFlowAnalysisStatus = 'idle' | 'selecting' | 'ready' | 'running' | 'done' | 'error';

export interface IVoteFlowAnalysisProgress {
  completed: number;
  total: number;
}

export interface IVoteFlowAnalysisState {
  status: VoteFlowAnalysisStatus;
  selection: IVoteFlowAnalysisSelection;
  input: IVoteFlowAnalysisInput;
  progress: IVoteFlowAnalysisProgress;
  scenarios: IVoteFlowScenario[];
  selectedScenario: number;
  error: string | null;
}

export interface IVoteFlowAnalysisResultView {
  flows: IPartyFlow[];
}