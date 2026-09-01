import { describe, expect, it } from 'vitest';
import { IParty, IVotationResult } from '../models/party';
import { IVoteFlowScenario } from '../models/vote-flow';
import { buildPartyOrder, buildScenarioMatrix, sortScenariosByPartyChanges } from './scenario-matrix';

function makeParty(id: string, name: string): IParty {
  return { id, name };
}

function makeVotation(parties: { party: IParty; votes: number }[]): IVotationResult {
  const total = parties.reduce((sum, p) => sum + p.votes, 0);
  return {
    votation: { date: new Date('2020-01-01'), name: 'Test', zone: 'test' },
    votesToParties: parties.map((p) => ({ party: p.party, numberOfVotes: p.votes })),
    totalVotes: total,
    totalVotesToParties: total,
  };
}

const pp = makeParty('pp', 'PP');
const psoe = makeParty('psoe', 'PSOE');
const vox = makeParty('vox', 'VOX');

describe('buildPartyOrder', () => {
  it('orders parties by votes in the old votation, then new-only parties, then scenario-only parties', () => {
    const oldVotation = makeVotation([
      { party: psoe, votes: 100 },
      { party: pp, votes: 200 },
    ]);
    const newVotation = makeVotation([
      { party: psoe, votes: 90 },
      { party: pp, votes: 150 },
      { party: vox, votes: 60 },
    ]);

    const order = buildPartyOrder(oldVotation, newVotation, []);

    expect(order.map((p) => p.id)).toEqual(['pp', 'psoe', 'vox']);
  });
});

describe('buildScenarioMatrix', () => {
  it('places flows in the correct row/column and computes totals', () => {
    const scenario: IVoteFlowScenario = {
      flows: [
        { from: pp, to: pp, votes: 100 },
        { from: pp, to: psoe, votes: 50 },
        { from: psoe, to: pp, votes: 20 },
      ],
    };
    const parties = [pp, psoe];

    const matrix = buildScenarioMatrix(scenario, parties);

    expect(matrix.cells).toEqual([
      [100, 50],
      [20, 0],
    ]);
    expect(matrix.rowTotals).toEqual([150, 20]);
    expect(matrix.colTotals).toEqual([120, 50]);
  });
});

describe('sortScenariosByPartyChanges', () => {
  it('orders scenarios with more changes in the top party first, keeping their original index', () => {
    const scenarioLowChange: IVoteFlowScenario = {
      flows: [
        { from: pp, to: pp, votes: 190 },
        { from: pp, to: psoe, votes: 10 },
      ],
    };
    const scenarioHighChange: IVoteFlowScenario = {
      flows: [
        { from: pp, to: pp, votes: 100 },
        { from: pp, to: psoe, votes: 100 },
      ],
    };

    const ordered = sortScenariosByPartyChanges([scenarioLowChange, scenarioHighChange], [pp, psoe]);

    expect(ordered.map((o) => o.originalIndex)).toEqual([1, 0]);
  });

  it('breaks ties using the next party in the order', () => {
    const scenarioA: IVoteFlowScenario = {
      flows: [
        { from: pp, to: pp, votes: 100 },
        { from: pp, to: psoe, votes: 100 },
        { from: psoe, to: psoe, votes: 190 },
        { from: psoe, to: pp, votes: 10 },
      ],
    };
    const scenarioB: IVoteFlowScenario = {
      flows: [
        { from: pp, to: pp, votes: 100 },
        { from: pp, to: psoe, votes: 100 },
        { from: psoe, to: psoe, votes: 150 },
        { from: psoe, to: pp, votes: 50 },
      ],
    };

    const ordered = sortScenariosByPartyChanges([scenarioA, scenarioB], [pp, psoe]);

    // Same change count for `pp` (100 in both); tie broken by `psoe` changes: scenarioB has 50 > 10.
    expect(ordered.map((o) => o.originalIndex)).toEqual([1, 0]);
  });
});
