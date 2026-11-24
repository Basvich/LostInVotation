import { IPartyFlow } from '../models/vote-flow';

export function simplifyReciprocalFlows(flows: IPartyFlow[]): IPartyFlow[] {
  const byOrigin = new Map<string, Map<string, IPartyFlow>>();
  for (const flow of flows) {
    let destinations = byOrigin.get(flow.from.id);
    if (!destinations) {
      destinations = new Map();
      byOrigin.set(flow.from.id, destinations);
    }
    const existing = destinations.get(flow.to.id);
    if (existing) {
      existing.votes += flow.votes;
    } else {
      destinations.set(flow.to.id, { ...flow });
    }
  }

  const simplified: IPartyFlow[] = [];
  const diagonal = new Map<string, IPartyFlow>();
  const addDiagonal = (flow: IPartyFlow) => {
    const existing = diagonal.get(flow.from.id);
    if (existing) {
      existing.votes += flow.votes;
    } else {
      diagonal.set(flow.from.id, { ...flow });
    }
  };

  for (const [fromId, destinations] of byOrigin) {
    for (const [toId, flow] of destinations) {
      if (fromId === toId) {
        addDiagonal(flow);
        continue;
      }
      const reverse = byOrigin.get(toId)?.get(fromId);
      if (reverse) {
        byOrigin.get(toId)?.delete(fromId);
        const cancelledVotes = Math.min(flow.votes, reverse.votes);
        if (cancelledVotes > 0) {
          addDiagonal({ from: flow.from, to: reverse.to, votes: cancelledVotes });
          addDiagonal({ from: reverse.from, to: flow.to, votes: cancelledVotes });
        }
      }
      const difference = flow.votes - (reverse?.votes ?? 0);
      if (difference > 0) {
        simplified.push({ ...flow, votes: difference });
      } else if (difference < 0 && reverse) {
        simplified.push({ ...reverse, votes: -difference });
      }
    }
  }
  return [...simplified, ...diagonal.values()];
}
