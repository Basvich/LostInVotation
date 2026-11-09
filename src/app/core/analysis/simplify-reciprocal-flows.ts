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
  for (const [fromId, destinations] of byOrigin) {
    for (const [toId, flow] of destinations) {
      if (fromId === toId) {
        simplified.push(flow);
        continue;
      }
      const reverse = byOrigin.get(toId)?.get(fromId);
      if (reverse) {
        byOrigin.get(toId)?.delete(fromId);
      }
      const difference = flow.votes - (reverse?.votes ?? 0);
      if (difference > 0) {
        simplified.push({ ...flow, votes: difference });
      } else if (difference < 0 && reverse) {
        simplified.push({ ...reverse, votes: -difference });
      }
    }
  }
  return simplified;
}
