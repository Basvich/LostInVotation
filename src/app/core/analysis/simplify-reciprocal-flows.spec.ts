import { IPartyFlow } from '../models/vote-flow';
import { simplifyReciprocalFlows } from './simplify-reciprocal-flows';

describe('simplifyReciprocalFlows', () => {
  const a = { id: 'a', name: 'A' };
  const b = { id: 'b', name: 'B' };
  const c = { id: 'c', name: 'C' };
  const notVoting = { id: 'not-voting', name: 'No Votando' };

  it('nets all pairs by party id and aggregates duplicate flows without modifying the input', () => {
    const flows: IPartyFlow[] = [
      { from: a, to: b, votes: 8 },
      { from: b, to: a, votes: 5 },
      { from: a, to: b, votes: 2 },
      { from: b, to: c, votes: 4 },
      { from: c, to: b, votes: 9 },
      { from: c, to: a, votes: 6 },
      { from: a, to: c, votes: 6 },
      { from: a, to: a, votes: 20 },
      { from: b, to: b, votes: 3 },
      { from: a, to: notVoting, votes: 7 },
      { from: notVoting, to: a, votes: 2 },
    ];
    const original = flows.map((flow) => ({ ...flow }));
    const result = simplifyReciprocalFlows(flows);
    expect(result).toHaveLength(5);
    expect(result).toContainEqual({ from: a, to: b, votes: 5 });
    expect(result).toContainEqual({ from: c, to: b, votes: 5 });
    expect(result).toContainEqual({ from: a, to: a, votes: 20 });
    expect(result).toContainEqual({ from: b, to: b, votes: 3 });
    expect(result).toContainEqual({ from: a, to: notVoting, votes: 5 });
    expect(flows).toEqual(original);
  });

  it('preserves one-way flows and handles empty or fully cancelling flows', () => {
    expect(simplifyReciprocalFlows([])).toEqual([]);
    expect(simplifyReciprocalFlows([{ from: a, to: b, votes: 5 }])).toEqual([
      { from: a, to: b, votes: 5 },
    ]);
    expect(simplifyReciprocalFlows([
      { from: a, to: b, votes: 5 },
      { from: b, to: a, votes: 5 },
    ])).toEqual([]);
  });

  it('preserves each party’s net change and distinguishes IDs containing separators', () => {
    const first = { id: 'a:b', name: 'Primero' };
    const second = { id: 'a', name: 'Segundo' };
    const third = { id: 'b:c', name: 'Tercero' };
    const flows: IPartyFlow[] = [
      { from: first, to: second, votes: 12 },
      { from: second, to: first, votes: 4 },
      { from: second, to: third, votes: 8 },
      { from: third, to: second, votes: 10 },
      { from: third, to: first, votes: 3 },
    ];
    const simplified = simplifyReciprocalFlows(flows);
    const netChange = (entries: IPartyFlow[], id: string) => entries.reduce(
      (sum, flow) => sum + (flow.to.id === id ? flow.votes : 0) - (flow.from.id === id ? flow.votes : 0),
      0,
    );
    for (const party of [first, second, third]) {
      expect(netChange(simplified, party.id)).toBe(netChange(flows, party.id));
    }
    expect(simplified).toHaveLength(3);
  });
});
