import { describe, expect, it } from 'vitest';
import { IParty } from '../models/party';
import { IVoteFlowScenario } from '../models/vote-flow';
import { buildScenarioStatsMatrix, computeCellStats } from './scenario-stats';

function makeParty(id: string, name: string): IParty {
  return { id, name };
}

const pp = makeParty('pp', 'PP');
const psoe = makeParty('psoe', 'PSOE');

describe('computeCellStats', () => {
  it('computes min, max, mean and mode for a list of values', () => {
    const stats = computeCellStats([10, 20, 20, 30]);

    expect(stats.min).toBe(10);
    expect(stats.max).toBe(30);
    expect(stats.mean).toBe(20);
    expect(stats.mode).toBe(20);
  });

  it('breaks a tie in mode by taking the smallest value', () => {
    const stats = computeCellStats([5, 5, 15, 15]);

    expect(stats.mode).toBe(5);
  });

  it('returns all zeros for an empty list', () => {
    const stats = computeCellStats([]);

    expect(stats).toEqual({ min: 0, max: 0, mean: 0, mode: 0 });
  });
});

describe('buildScenarioStatsMatrix', () => {
  it('aggregates per-cell stats across all scenarios and computes row/col totals', () => {
    const scenarioA: IVoteFlowScenario = {
      flows: [
        { from: pp, to: pp, votes: 100 },
        { from: pp, to: psoe, votes: 50 },
        { from: psoe, to: pp, votes: 20 },
        { from: psoe, to: psoe, votes: 80 },
      ],
    };
    const scenarioB: IVoteFlowScenario = {
      flows: [
        { from: pp, to: pp, votes: 120 },
        { from: pp, to: psoe, votes: 30 },
        { from: psoe, to: pp, votes: 40 },
        { from: psoe, to: psoe, votes: 60 },
      ],
    };

    const parties = [pp, psoe];
    const result = buildScenarioStatsMatrix([scenarioA, scenarioB], parties);

    expect(result.cells[0][0]).toEqual({ min: 100, max: 120, mean: 110, mode: 100 });
    expect(result.cells[0][1]).toEqual({ min: 30, max: 50, mean: 40, mode: 30 });
    expect(result.cells[1][0]).toEqual({ min: 20, max: 40, mean: 30, mode: 20 });
    expect(result.cells[1][1]).toEqual({ min: 60, max: 80, mean: 70, mode: 60 });

    expect(result.rowTotals.mean).toEqual([150, 100]);
    expect(result.colTotals.mean).toEqual([140, 110]);
  });
});
