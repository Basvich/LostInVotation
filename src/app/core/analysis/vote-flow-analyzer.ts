import { IParty, IVotationResult, NotVotingParty } from '../models/party';
import { IPartyFlow, IVoteFlowInput, IVoteFlowScenario } from '../models/vote-flow';

interface PartyVotes {
  party: IParty;
  votes: number;
}

type VoteMap = Map<string, PartyVotes>;

const MAX_RETRIES = 100;

export class VoteFlowAnalyzer {

  generateScenarios(input: IVoteFlowInput, count: number): IVoteFlowScenario[] {
    const scenarios: IVoteFlowScenario[] = [];
    for (let i = 0; i < count; i++) {
      scenarios.push(this.generateOneScenario(input));
    }
    return scenarios;
  }

  private generateOneScenario(input: IVoteFlowInput): IVoteFlowScenario {
    const blockSize = input.blockSize ?? 1000;
    const { oldMap, newMap } = this.buildNormalizedMaps(input);
    const { fixedFlows, moveableOld, remainingNew } = this.applyFidelity(
      oldMap,
      newMap,
      input.fidelityPercentage,
    );

    let blockFlows: IPartyFlow[] | null = null;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      blockFlows = this.distributeBlocks(moveableOld, remainingNew, blockSize);
      if (blockFlows !== null) break;
    }

    if (blockFlows === null) {
      throw new Error(
        `VoteFlowAnalyzer: no se pudo generar un escenario válido tras ${MAX_RETRIES} intentos. ` +
        'Revisa los parámetros de fidelidad y blockSize.',
      );
    }

    const allFlows = [...fixedFlows, ...blockFlows].filter((f) => f.votes > 0);
    return { flows: allFlows };
  }

  // ---------------------------------------------------------------------------
  // Step 1 — Build normalized vote maps
  // ---------------------------------------------------------------------------

  private buildVoteMap(votation: IVotationResult): VoteMap {
    const map: VoteMap = new Map();
    for (const vtp of votation.votesToParties) {
      map.set(vtp.party.id, { party: vtp.party, votes: vtp.numberOfVotes });
    }
    return map;
  }

  private buildNormalizedMaps(input: IVoteFlowInput): { oldMap: VoteMap; newMap: VoteMap } {
    const oldMap = this.buildVoteMap(input.oldVotation);
    const newMap = this.buildVoteMap(input.newVotation);

    // Inject NotVotingParty based on totalVotesToParties delta
    const notVoting = new NotVotingParty();
    const delta = input.newVotation.totalVotesToParties - input.oldVotation.totalVotesToParties;
    if (delta > 0) {
      oldMap.set(notVoting.id, { party: notVoting, votes: 0 });
      newMap.set(notVoting.id, { party: notVoting, votes: delta });
    } else if (delta < 0) {
      oldMap.set(notVoting.id, { party: notVoting, votes: -delta });
      newMap.set(notVoting.id, { party: notVoting, votes: 0 });
    }

    // Ensure every party in one map is also present in the other (with 0 votes)
    for (const [id, entry] of oldMap) {
      if (!newMap.has(id)) newMap.set(id, { party: entry.party, votes: 0 });
    }
    for (const [id, entry] of newMap) {
      if (!oldMap.has(id)) oldMap.set(id, { party: entry.party, votes: 0 });
    }

    return { oldMap, newMap };
  }

  // ---------------------------------------------------------------------------
  // Step 2 — Apply fidelity (fixed diagonal flows)
  // ---------------------------------------------------------------------------

  private applyFidelity(
    oldMap: VoteMap,
    newMap: VoteMap,
    fidelityPercentage: number,
  ): { fixedFlows: IPartyFlow[]; moveableOld: VoteMap; remainingNew: VoteMap } {
    const fixedFlows: IPartyFlow[] = [];
    const moveableOld: VoteMap = new Map();
    const remainingNew: VoteMap = new Map(
      [...newMap.entries()].map(([id, e]) => [id, { ...e }]),
    );

    for (const [id, oldEntry] of oldMap) {
      const newEntry = newMap.get(id);
      if (newEntry && oldEntry.votes > 0 && newEntry.votes > 0) {
        const loyalVotes = Math.floor(
          Math.min(oldEntry.votes, newEntry.votes) * fidelityPercentage,
        );
        if (loyalVotes > 0) {
          fixedFlows.push({ from: oldEntry.party, to: newEntry.party, votes: loyalVotes });
        }
        moveableOld.set(id, { party: oldEntry.party, votes: oldEntry.votes - loyalVotes });
        remainingNew.get(id)!.votes -= loyalVotes;
      } else {
        moveableOld.set(id, { party: oldEntry.party, votes: oldEntry.votes });
      }
    }

    return { fixedFlows, moveableOld, remainingNew };
  }

  // ---------------------------------------------------------------------------
  // Step 3 — Distribute blocks with backtracking + pruning
  // ---------------------------------------------------------------------------

  private distributeBlocks(
    moveableOld: VoteMap,
    remainingNew: VoteMap,
    blockSize: number,
  ): IPartyFlow[] | null {
    const sources = [...moveableOld.values()]
      .map((e) => ({
        party: e.party,
        blocks: Math.floor(e.votes / blockSize),
        remainder: e.votes % blockSize,
      }))
      .filter((s) => s.blocks > 0 || s.remainder > 0)
      .sort((a, b) => b.blocks - a.blocks);

    const dests = [...remainingNew.values()]
      .map((e) => ({ party: e.party, needed: e.votes }))
      .sort((a, b) => b.needed - a.needed);

    const srcBlocks = sources.map((s) => s.blocks);
    const dstBlocks = dests.map((d) => Math.floor(d.needed / blockSize));

    // Align block totals: absorb any floor-induced difference into the largest destination.
    const srcTotal = srcBlocks.reduce((a, b) => a + b, 0);
    const dstTotal = dstBlocks.reduce((a, b) => a + b, 0);
    if (srcTotal !== dstTotal) {
      if (dstBlocks.length === 0) return null;
      dstBlocks[0] += srcTotal - dstTotal;
      if (dstBlocks[0] < 0) return null;
    }

    const flows: IPartyFlow[] = [];

    if (srcTotal > 0) {
      // Block phase: backtracking fill
      const matrix: number[][] = sources.map(() => new Array(dests.length).fill(0));
      const dstRemaining = [...dstBlocks];

      if (!this.fillMatrix(matrix, srcBlocks, dstRemaining, 0)) {
        return null;
      }

      for (let i = 0; i < sources.length; i++) {
        for (let j = 0; j < dests.length; j++) {
          if (matrix[i][j] > 0) {
            flows.push({
              from: sources[i].party,
              to: dests[j].party,
              votes: matrix[i][j] * blockSize,
            });
          }
        }
      }

      // Remainder deficits = what each dest still needs after block allocation
      const remainderDeficits = dests.map((d, j) => ({
        party: d.party,
        deficit: d.needed - sources.reduce((sum, _, i) => sum + matrix[i][j], 0) * blockSize,
      }));

      const remainderFlows = this.distributeRemainders(sources, remainderDeficits);
      if (remainderFlows === null) return null;
      flows.push(...remainderFlows);
    } else {
      // No full blocks — distribute only remainders
      const deficits = dests.map((d) => ({ party: d.party, deficit: d.needed }));
      const remainderFlows = this.distributeRemainders(sources, deficits);
      if (remainderFlows === null) return null;
      flows.push(...remainderFlows);
    }

    return flows;
  }

  /**
   * Backtracking fill: assigns blocks for source `srcIdx` across destinations,
   * then recurses into `fillMatrix` for `srcIdx + 1`.
   * `srcBlocks` is read-only; `dstRemaining` is mutated and restored on backtrack.
   */
  private fillMatrix(
    matrix: number[][],
    srcBlocks: number[],
    dstRemaining: number[],
    srcIdx: number,
  ): boolean {
    if (srcIdx === matrix.length) {
      return dstRemaining.every((d) => d === 0);
    }

    // Prune: remaining source blocks must equal remaining destination capacity
    const totalSrcLeft = srcBlocks.slice(srcIdx).reduce((a, b) => a + b, 0);
    const totalDstLeft = dstRemaining.reduce((a, b) => a + b, 0);
    if (totalSrcLeft !== totalDstLeft) return false;

    // Shuffle destination order to introduce randomness across scenarios
    const dstOrder = this.shuffledIndices(dstRemaining.length);
    return this.fillRow(matrix, srcBlocks, dstRemaining, srcIdx, dstOrder, 0, srcBlocks[srcIdx]);
  }

  /**
   * Recursively assigns blocks from source `srcIdx` to destinations in `dstOrder`.
   * When the row is complete (all dests processed with 0 blocksLeft), calls
   * `fillMatrix` for the next source — enabling proper cross-row backtracking.
   */
  private fillRow(
    matrix: number[][],
    srcBlocks: number[],
    dstRemaining: number[],
    srcIdx: number,
    dstOrder: number[],
    dstOrderIdx: number,
    blocksLeft: number,
  ): boolean {
    if (dstOrderIdx === dstOrder.length) {
      if (blocksLeft !== 0) return false;
      // Row fully assigned — solve remaining sources (backtracking entry point)
      return this.fillMatrix(matrix, srcBlocks, dstRemaining, srcIdx + 1);
    }

    const j = dstOrder[dstOrderIdx];
    const remainingDstCapacity = dstOrder
      .slice(dstOrderIdx + 1)
      .reduce((sum, k) => sum + dstRemaining[k], 0);

    const hi = Math.min(blocksLeft, dstRemaining[j]);
    const lo = Math.max(0, blocksLeft - remainingDstCapacity);

    if (lo > hi) return false; // prune

    // Start from a random offset within [lo, hi] to vary scenario outputs
    const range = hi - lo;
    const startOffset = range > 0 ? Math.floor(Math.random() * (range + 1)) : 0;

    for (let delta = 0; delta <= range; delta++) {
      const assign = lo + ((startOffset + delta) % (range + 1));
      matrix[srcIdx][j] = assign;
      dstRemaining[j] -= assign;

      if (this.fillRow(matrix, srcBlocks, dstRemaining, srcIdx, dstOrder, dstOrderIdx + 1, blocksLeft - assign)) {
        return true;
      }

      // Backtrack
      dstRemaining[j] += assign;
      matrix[srcIdx][j] = 0;
    }

    return false;
  }

  // ---------------------------------------------------------------------------
  // Step 4 — Distribute remainders greedily
  // ---------------------------------------------------------------------------

  private distributeRemainders(
    sources: { party: IParty; remainder: number }[],
    deficits: { party: IParty; deficit: number }[],
  ): IPartyFlow[] | null {
    const remaining = deficits.map((d) => ({ ...d })).sort((a, b) => b.deficit - a.deficit);
    const flows: IPartyFlow[] = [];

    for (const src of sources) {
      let rem = src.remainder;
      for (const dst of remaining) {
        if (rem === 0) break;
        const assign = Math.min(rem, dst.deficit);
        if (assign > 0) {
          flows.push({ from: src.party, to: dst.party, votes: assign });
          dst.deficit -= assign;
          rem -= assign;
        }
      }
      if (rem !== 0) return null;
    }

    return flows;
  }

  // ---------------------------------------------------------------------------
  // Utility
  // ---------------------------------------------------------------------------

  private shuffledIndices(count: number): number[] {
    const arr = Array.from({ length: count }, (_, i) => i);
    for (let i = count - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
