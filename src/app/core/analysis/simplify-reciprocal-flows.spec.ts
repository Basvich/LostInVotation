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
    expect(result).toHaveLength(7);
    expect(result).toContainEqual({ from: a, to: b, votes: 5 });
    expect(result).toContainEqual({ from: c, to: b, votes: 5 });
    expect(result).toContainEqual({ from: a, to: a, votes: 33 });
    expect(result).toContainEqual({ from: b, to: b, votes: 12 });
    expect(result).toContainEqual({ from: c, to: c, votes: 10 });
    expect(result).toContainEqual({ from: notVoting, to: notVoting, votes: 2 });
    expect(result).toContainEqual({ from: a, to: notVoting, votes: 5 });
    for (const party of [a, b, c, notVoting]) {
      for (const side of ['from', 'to'] as const) {
        const total = (entries: IPartyFlow[]) => entries
          .filter((flow) => flow[side].id === party.id)
          .reduce((sum, flow) => sum + flow.votes, 0);
        expect(total(result)).toBe(total(flows));
      }
    }
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
    ])).toEqual([
      { from: a, to: a, votes: 5 },
      { from: b, to: b, votes: 5 },
    ]);
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
    expect(simplified).toHaveLength(6);
  });

  it('uses the origin and destination identities for newly created diagonal flows', () => {
    const oldA = { id: 'a', name: 'A antigua' };
    const newA = { id: 'a', name: 'A nueva' };
    const oldB = { id: 'b', name: 'B antigua' };
    const newB = { id: 'b', name: 'B nueva' };
    expect(simplifyReciprocalFlows([
      { from: oldA, to: newB, votes: 3 },
      { from: oldB, to: newA, votes: 2 },
    ])).toEqual([
      { from: oldA, to: newB, votes: 1 },
      { from: oldA, to: newA, votes: 2 },
      { from: oldB, to: newB, votes: 2 },
    ]);
  });
});
