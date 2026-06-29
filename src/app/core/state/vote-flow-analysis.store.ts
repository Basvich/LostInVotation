import { computed, inject, Injectable, signal } from '@angular/core';
import { IVotationsInZone } from '../models/availableData';
import {
  IVoteFlowAnalysisInput,
  IVoteFlowAnalysisSelection,
  IVoteFlowAnalysisState,
} from '../models/vote-flow-analysis';
import { IVotationResult } from '../models/party';

const DEFAULT_STATE: IVoteFlowAnalysisState = {
  status: 'idle',
  selection: {
    zone: null,
    oldLink: null,
    newLink: null,
  },
  input: {
    oldVotation: null,
    newVotation: null,
    fidelityPercentage: 0.5,
    blockSize: 1000,
    scenarioCount: 1,
  },
  progress: {
    completed: 0,
    total: 0,
  },
  scenarios: [],
  selectedScenario: 0,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class VoteFlowAnalysisStore {
  private readonly state = signal<IVoteFlowAnalysisState>(DEFAULT_STATE);

  readonly snapshot = computed(() => this.state());
  readonly status = computed(() => this.state().status);
  readonly selection = computed(() => this.state().selection);
  readonly input = computed(() => this.state().input);
  readonly progress = computed(() => this.state().progress);
  readonly scenarios = computed(() => this.state().scenarios);
  readonly selectedScenario = computed(() => this.state().selectedScenario);
  readonly error = computed(() => this.state().error);

  setAvailableVotations(votations: IVotationsInZone[]): void {
    // The store keeps only user selections and analysis state; available votations are derived in the page.
    void votations;
  }

  setStatus(status: IVoteFlowAnalysisState['status']): void {
    this.state.update((current) => ({ ...current, status }));
  }

  setSelection(selection: Partial<IVoteFlowAnalysisSelection>): void {
    this.state.update((current) => ({
      ...current,
      selection: {
        ...current.selection,
        ...selection,
      },
    }));
  }

  setInput(input: Partial<IVoteFlowAnalysisInput>): void {
    this.state.update((current) => ({
      ...current,
      input: {
        ...current.input,
        ...input,
      },
    }));
  }

  setSourceData(oldVotation: IVotationResult | null, newVotation: IVotationResult | null): void {
    this.state.update((current) => ({
      ...current,
      input: {
        ...current.input,
        oldVotation,
        newVotation,
      },
    }));
  }

  setProgress(progress: Partial<IVoteFlowAnalysisState['progress']>): void {
    this.state.update((current) => ({
      ...current,
      progress: {
        ...current.progress,
        ...progress,
      },
    }));
  }

  setScenarios(scenarios: IVoteFlowAnalysisState['scenarios']): void {
    this.state.update((current) => ({ ...current, scenarios }));
  }

  setSelectedScenario(selectedScenario: number): void {
    this.state.update((current) => ({ ...current, selectedScenario }));
  }

  setError(error: string | null): void {
    this.state.update((current) => ({ ...current, error }));
  }

  reset(): void {
    this.state.set(DEFAULT_STATE);
  }
}