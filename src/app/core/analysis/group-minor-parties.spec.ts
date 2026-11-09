import { IVotationResult, NotVotingParty } from '../models/party';
import { groupMinorParties, OTHER_PARTIES } from './group-minor-parties';

describe('groupMinorParties', () => {
  const notVoting = new NotVotingParty();
  const result: IVotationResult = {
    votation: { date: new Date('2020-01-01'), name: 'Elección', zone: 'Zona' },
    totalVotes: 200,
    totalVotesToParties: 110,
    votesToParties: [
      { party: { id: 'large', name: 'Grande' }, numberOfVotes: 90 },
      { party: { id: 'boundary', name: 'Límite' }, numberOfVotes: 10 },
      { party: { id: 'small', name: 'Pequeño' }, numberOfVotes: 6 },
      { party: { id: 'smaller', name: 'Más pequeño' }, numberOfVotes: 3 },
      { party: notVoting, numberOfVotes: 1 },
    ],
  };

  it('uses total votes, preserves the exact boundary and keeps non-voters separate', () => {
    const grouped = groupMinorParties(result, 5);
    expect(grouped.votesToParties).toEqual([
      result.votesToParties[0],
      result.votesToParties[1],
      result.votesToParties[4],
      { party: OTHER_PARTIES, numberOfVotes: 9 },
    ]);
    expect(grouped.totalVotes).toBe(200);
    expect(grouped.totalVotesToParties).toBe(110);
    expect(result.votesToParties).toHaveLength(5);
  });

  it('handles zero and maximum thresholds and elections with no votes', () => {
    expect(groupMinorParties(result, 0).votesToParties).toEqual(result.votesToParties);
    expect(groupMinorParties(result, 100).votesToParties).toEqual([
      result.votesToParties[4],
      { party: OTHER_PARTIES, numberOfVotes: 109 },
    ]);
    const empty = { ...result, totalVotes: 0, totalVotesToParties: 0, votesToParties: [] };
    expect(groupMinorParties(empty, 5).votesToParties).toEqual([]);
  });

  it('rejects invalid thresholds and reserved identifier collisions', () => {
    for (const threshold of [-1, 101, NaN, Infinity]) {
      expect(() => groupMinorParties(result, threshold)).toThrow();
    }
    expect(() => groupMinorParties({
      ...result,
      votesToParties: [{ party: OTHER_PARTIES, numberOfVotes: 1 }],
    }, 5)).toThrow();
  });
});
