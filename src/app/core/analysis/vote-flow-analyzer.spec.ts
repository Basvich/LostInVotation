import { describe, expect, it } from 'vitest';
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

const analyzer = new VoteFlowAnalyzer();
const pp = makeParty('pp', 'PP');
const psoe = makeParty('psoe', 'PSOE');

describe('VoteFlowAnalyzer', () => {
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
    it('positive delta: NotVotingParty appears as destination with correct votes', () => {
      // 5000 new voters joined (totalVotesToParties grew by 5000)
      const input: IVoteFlowInput = {
        oldVotation: makeVotation([{ party: pp, votes: 5000 }], 5000),
        newVotation: makeVotation([{ party: pp, votes: 5000 }], 10000),
        fidelityPercentage: 0,
        blockSize: 1000,
      };
      // newVotation.totalVotesToParties - oldVotation.totalVotesToParties = 5000
      // But votesToParties for newVotation only has pp with 5000 — the remaining 5000
      // are NotVotingParty in new. We need to reflect this in makeVotation properly.
      // Re-build with explicit totalVotesToParties:
      const oldV: IVotationResult = {
        votation: { date: new Date(), name: 'T', zone: 'z' },
        votesToParties: [{ party: pp, numberOfVotes: 5000 }],
        totalVotes: 5000,
        totalVotesToParties: 5000,
      };
      const newV: IVotationResult = {
        votation: { date: new Date(), name: 'T', zone: 'z' },
        votesToParties: [{ party: pp, numberOfVotes: 5000 }],
        totalVotes: 10000,
        totalVotesToParties: 10000,
      };
      const [scenario] = analyzer.generateScenarios(
        { oldVotation: oldV, newVotation: newV, fidelityPercentage: 0, blockSize: 1000 },
        1,
      );
      expect(sumTo(scenario.flows, 'not-voting')).toBe(5000);
    });

    it('negative delta: NotVotingParty appears as source with correct votes', () => {
      const oldV: IVotationResult = {
        votation: { date: new Date(), name: 'T', zone: 'z' },
        votesToParties: [{ party: pp, numberOfVotes: 5000 }],
        totalVotes: 10000,
        totalVotesToParties: 10000,
      };
      const newV: IVotationResult = {
        votation: { date: new Date(), name: 'T', zone: 'z' },
        votesToParties: [{ party: pp, numberOfVotes: 5000 }],
        totalVotes: 5000,
        totalVotesToParties: 5000,
      };
      const [scenario] = analyzer.generateScenarios(
        { oldVotation: oldV, newVotation: newV, fidelityPercentage: 0, blockSize: 1000 },
        1,
      );
      expect(sumFrom(scenario.flows, 'not-voting')).toBe(5000);
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
