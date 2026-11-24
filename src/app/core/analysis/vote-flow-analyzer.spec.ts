import { describe, expect, it, vi } from 'vitest';
import { VoteFlowAnalyzer } from './vote-flow-analyzer';
import { IParty, IVotationResult } from '../models/party';
import { IVoteFlowInput } from '../models/vote-flow';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeParty(id: string, name: string): IParty {
  return { id, name };
}

function makeVotation(parties: { party: IParty; votes: number }[], totalVotesToParties?: number): IVotationResult {
  const computed = parties.reduce((sum, p) => sum + p.votes, 0);
  return {
    votation: { date: new Date('2020-01-01'), name: 'Test', zone: 'test' },
    votesToParties: parties.map((p) => ({ party: p.party, numberOfVotes: p.votes })),
    totalVotes: totalVotesToParties ?? computed,
    totalVotesToParties: totalVotesToParties ?? computed,
  };
}

function sumFrom(flows: { from: IParty; to: IParty; votes: number }[], partyId: string): number {
  return flows.filter((f) => f.from.id === partyId).reduce((s, f) => s + f.votes, 0);
}

function sumTo(flows: { from: IParty; to: IParty; votes: number }[], partyId: string): number {
  return flows.filter((f) => f.to.id === partyId).reduce((s, f) => s + f.votes, 0);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

const engine = new VoteFlowAnalyzer();
const analyzer = {
  generateScenarios: (input: IVoteFlowInput, count: number) =>
    engine.generateScenarios({ ...input, simplifyReciprocalFlows: false }, count),
};
const pp = makeParty('pp', 'PP');
const psoe = makeParty('psoe', 'PSOE');

describe('VoteFlowAnalyzer', () => {
  it('simplifies every generated scenario by default and preserves the original when disabled', () => {
    const input: IVoteFlowInput = {
      oldVotation: makeVotation([{ party: pp, votes: 100 }, { party: psoe, votes: 100 }]),
      newVotation: makeVotation([{ party: pp, votes: 100 }, { party: psoe, votes: 100 }]),
      fidelityPercentage: 0,
      blockSize: 1,
    };
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    try {
      const original = engine.generateScenarios({ ...input, simplifyReciprocalFlows: false }, 3);
      const simplified = engine.generateScenarios(input, 3);
      const explicit = engine.generateScenarios({ ...input, simplifyReciprocalFlows: true }, 3);
      expect(original.every(({ flows }) =>
        flows.some((flow) => flow.from.id === 'pp' && flow.to.id === 'psoe') &&
        flows.some((flow) => flow.from.id === 'psoe' && flow.to.id === 'pp'),
      )).toBe(true);
      expect(simplified).toEqual(explicit);
      for (const scenario of simplified) {
        expect(scenario.flows).toEqual([
          { from: pp, to: pp, votes: 100 },
          { from: psoe, to: psoe, votes: 100 },
        ]);
      }
    } finally {
      random.mockRestore();
    }
  });

  it('preserves per-party origin and destination totals in every simplified scenario', () => {
    const input: IVoteFlowInput = {
      oldVotation: makeVotation([{ party: pp, votes: 100 }, { party: psoe, votes: 100 }]),
      newVotation: makeVotation([{ party: pp, votes: 80 }, { party: psoe, votes: 150 }]),
      fidelityPercentage: 0.3,
      blockSize: 1,
    };
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    try {
      const original = engine.generateScenarios({ ...input, simplifyReciprocalFlows: false }, 5);
      const simplified = engine.generateScenarios({ ...input, simplifyReciprocalFlows: true }, 5);
      for (let index = 0; index < simplified.length; index++) {
        for (const id of ['pp', 'psoe', 'not-voting']) {
          expect(sumFrom(simplified[index].flows, id)).toBe(sumFrom(original[index].flows, id));
          expect(sumTo(simplified[index].flows, id)).toBe(sumTo(original[index].flows, id));
        }
        for (const flow of simplified[index].flows) {
          if (flow.from.id !== flow.to.id) {
            expect(simplified[index].flows.some((reverse) =>
              reverse.from.id === flow.to.id && reverse.to.id === flow.from.id,
            )).toBe(false);
          }
        }
      }
    } finally {
      random.mockRestore();
    }
  });

  describe('generateScenarios — invariants', () => {
    it('should return exactly the requested number of scenarios', () => {
      const input: IVoteFlowInput = {
        oldVotation: makeVotation([{ party: pp, votes: 2000 }, { party: psoe, votes: 3000 }]),
        newVotation: makeVotation([{ party: pp, votes: 3000 }, { party: psoe, votes: 2000 }]),
        fidelityPercentage: 0,
        blockSize: 1000,
      };
      const scenarios = analyzer.generateScenarios(input, 5);
      expect(scenarios).toHaveLength(5);
    });

    it('row sums equal old votes and column sums equal new votes (fidelity=0)', () => {
      const input: IVoteFlowInput = {
        oldVotation: makeVotation([{ party: pp, votes: 2000 }, { party: psoe, votes: 3000 }]),
        newVotation: makeVotation([{ party: pp, votes: 3000 }, { party: psoe, votes: 2000 }]),
        fidelityPercentage: 0,
        blockSize: 1000,
      };
      const [scenario] = analyzer.generateScenarios(input, 1);
      expect(sumFrom(scenario.flows, 'pp')).toBe(2000);
      expect(sumFrom(scenario.flows, 'psoe')).toBe(3000);
      expect(sumTo(scenario.flows, 'pp')).toBe(3000);
      expect(sumTo(scenario.flows, 'psoe')).toBe(2000);
    });

    it('row sums and column sums are correct with fidelity=0.5', () => {
      const input: IVoteFlowInput = {
        oldVotation: makeVotation([{ party: pp, votes: 4000 }, { party: psoe, votes: 6000 }]),
        newVotation: makeVotation([{ party: pp, votes: 5000 }, { party: psoe, votes: 5000 }]),
        fidelityPercentage: 0.5,
        blockSize: 1000,
      };
      const [scenario] = analyzer.generateScenarios(input, 1);
      expect(sumFrom(scenario.flows, 'pp')).toBe(4000);
      expect(sumFrom(scenario.flows, 'psoe')).toBe(6000);
      expect(sumTo(scenario.flows, 'pp')).toBe(5000);
      expect(sumTo(scenario.flows, 'psoe')).toBe(5000);
    });

    it('should have no flows with votes === 0', () => {
      const input: IVoteFlowInput = {
        oldVotation: makeVotation([{ party: pp, votes: 2000 }, { party: psoe, votes: 3000 }]),
        newVotation: makeVotation([{ party: pp, votes: 3000 }, { party: psoe, votes: 2000 }]),
        fidelityPercentage: 0,
        blockSize: 1000,
      };
      const [scenario] = analyzer.generateScenarios(input, 1);
      expect(scenario.flows.every((f) => f.votes > 0)).toBe(true);
    });
  });

  describe('fidelity=100%', () => {
    it('all flows should be diagonal when votes are identical in both elections', () => {
      // With equal votes and 100% fidelity every voter stays with their party:
      // loyalVotes = floor(min(N, N) * 1) = N → moveableOld = 0 → no cross-party flows.
      const input: IVoteFlowInput = {
        oldVotation: makeVotation([{ party: pp, votes: 2000 }, { party: psoe, votes: 3000 }]),
        newVotation: makeVotation([{ party: pp, votes: 2000 }, { party: psoe, votes: 3000 }]),
        fidelityPercentage: 1,
        blockSize: 1000,
      };
      const [scenario] = analyzer.generateScenarios(input, 1);
      const nonDiagonal = scenario.flows.filter((f) => f.from.id !== f.to.id);
      expect(nonDiagonal).toHaveLength(0);
    });

    it('sum invariants still hold when votes change with fidelity=100%', () => {
      // PP loses 2000 votes to PSOE even at 100% fidelity: loyal portion is
      // floor(min(old,new)*1), surplus must still flow somewhere.
      const input: IVoteFlowInput = {
        oldVotation: makeVotation([{ party: pp, votes: 2000 }, { party: psoe, votes: 3000 }]),
        newVotation: makeVotation([{ party: pp, votes: 4000 }, { party: psoe, votes: 1000 }]),
        fidelityPercentage: 1,
        blockSize: 1000,
      };
      const [scenario] = analyzer.generateScenarios(input, 1);
      expect(sumFrom(scenario.flows, 'pp')).toBe(2000);
      expect(sumFrom(scenario.flows, 'psoe')).toBe(3000);
      expect(sumTo(scenario.flows, 'pp')).toBe(4000);
      expect(sumTo(scenario.flows, 'psoe')).toBe(1000);
    });
  });

  describe('NotVotingParty — delta handling', () => {
    it('positive delta: NotVotingParty appears as source with correct votes', () => {
      const oldV = makeVotation([{ party: pp, votes: 5000 }]);
      const newV = makeVotation([{ party: pp, votes: 10000 }]);
      const [scenario] = analyzer.generateScenarios(
        { oldVotation: oldV, newVotation: newV, fidelityPercentage: 0, blockSize: 1000 },
        1,
      );
      expect(sumFrom(scenario.flows, 'not-voting')).toBe(5000);
      expect(sumFrom(scenario.flows, 'pp')).toBe(5000);
      expect(sumTo(scenario.flows, 'pp')).toBe(10000);
    });

    it('negative delta: NotVotingParty appears as destination with correct votes', () => {
      const oldV = makeVotation([{ party: pp, votes: 10000 }]);
      const newV = makeVotation([{ party: pp, votes: 5000 }]);
      const [scenario] = analyzer.generateScenarios(
        { oldVotation: oldV, newVotation: newV, fidelityPercentage: 0, blockSize: 1000 },
        1,
      );
      expect(sumTo(scenario.flows, 'not-voting')).toBe(5000);
      expect(sumFrom(scenario.flows, 'pp')).toBe(10000);
      expect(sumTo(scenario.flows, 'pp')).toBe(5000);
    });
  });

  describe('small blockSize — remainder handling', () => {
    it('works correctly with blockSize=1 (unit blocks)', () => {
      const input: IVoteFlowInput = {
        oldVotation: makeVotation([{ party: pp, votes: 3 }, { party: psoe, votes: 5 }]),
        newVotation: makeVotation([{ party: pp, votes: 4 }, { party: psoe, votes: 4 }]),
        fidelityPercentage: 0,
        blockSize: 1,
      };
      const [scenario] = analyzer.generateScenarios(input, 1);
      expect(sumFrom(scenario.flows, 'pp')).toBe(3);
      expect(sumFrom(scenario.flows, 'psoe')).toBe(5);
      expect(sumTo(scenario.flows, 'pp')).toBe(4);
      expect(sumTo(scenario.flows, 'psoe')).toBe(4);
    });
  });
});
