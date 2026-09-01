import { IParty, IVotationResult } from '../models/party';
import { IPartyFlow, IVoteFlowScenario } from '../models/vote-flow';

/** Matriz de flujos de un escenario: partidos en filas (origen) y columnas (destino). */
export interface IScenarioMatrix {
  /** Orden común de partidos usado tanto en filas como en columnas. */
  parties: IParty[];
  /** cells[i][j] = votos que van del partido i (fila, votación antigua) al partido j (columna, votación nueva). */
  cells: number[][];
  /** Total de votos que salen de cada partido origen (fila). */
  rowTotals: number[];
  /** Total de votos que llegan a cada partido destino (columna). */
  colTotals: number[];
}

/** Un escenario junto con su posición original en la lista generada por el analizador. */
export interface IOrderedScenario {
  scenario: IVoteFlowScenario;
  originalIndex: number;
}

/**
 * Calcula el orden común de partidos a usar en filas/columnas de la matriz para todos los escenarios:
 * primero los partidos de la votación antigua (de más a menos votados), después los partidos nuevos
 * que no estuvieran en la antigua, y por último cualquier otro partido (p.ej. "No Votando") que solo
 * aparezca en los flujos de los escenarios.
 */
export function buildPartyOrder(
  oldVotation: IVotationResult | null,
  newVotation: IVotationResult | null,
  scenarios: IVoteFlowScenario[] = [],
): IParty[] {
  const order: IParty[] = [];
  const seen = new Set<string>();

  const addParty = (party: IParty) => {
    if (seen.has(party.id)) return;
    seen.add(party.id);
    order.push(party);
  };

  const oldSorted = [...(oldVotation?.votesToParties ?? [])].sort(
    (a, b) => b.numberOfVotes - a.numberOfVotes,
  );
  for (const vtp of oldSorted) addParty(vtp.party);

  const newSorted = [...(newVotation?.votesToParties ?? [])].sort(
    (a, b) => b.numberOfVotes - a.numberOfVotes,
  );
  for (const vtp of newSorted) addParty(vtp.party);

  for (const scenario of scenarios) {
    for (const flow of scenario.flows) {
      addParty(flow.from);
      addParty(flow.to);
    }
  }

  return order;
}

/** Construye la matriz de flujos de un escenario según el orden de partidos dado. */
export function buildScenarioMatrix(scenario: IVoteFlowScenario, parties: IParty[]): IScenarioMatrix {
  const indexById = new Map<string, number>(parties.map((party, index) => [party.id, index]));
  const size = parties.length;
  const cells: number[][] = Array.from({ length: size }, () => new Array(size).fill(0));

  for (const flow of scenario.flows) {
    const rowIndex = indexById.get(flow.from.id);
    const colIndex = indexById.get(flow.to.id);
    if (rowIndex === undefined || colIndex === undefined) continue;
    cells[rowIndex][colIndex] += flow.votes;
  }

  const rowTotals = cells.map((row) => row.reduce((sum, votes) => sum + votes, 0));
  const colTotals = parties.map((_, colIndex) =>
    cells.reduce((sum, row) => sum + row[colIndex], 0),
  );

  return { parties, cells, rowTotals, colTotals };
}

/** Votos que un partido origen entrega a partidos distintos de sí mismo (i.e. "cambios") en un escenario. */
function changedVotesByParty(flows: IPartyFlow[], party: IParty): number {
  return flows.reduce(
    (sum, flow) => (flow.from.id === party.id && flow.to.id !== party.id ? sum + flow.votes : sum),
    0,
  );
}

/**
 * Ordena los escenarios de mayor a menor número de cambios de voto en el partido más votado; en caso
 * de empate, se compara el siguiente partido en el orden dado, y así sucesivamente. Devuelve una nueva
 * lista que conserva, para cada escenario, su índice original dentro del array generado por el analizador.
 */
export function sortScenariosByPartyChanges(
  scenarios: IVoteFlowScenario[],
  partyOrder: IParty[],
): IOrderedScenario[] {
  const withVectors = scenarios.map((scenario, originalIndex) => ({
    scenario,
    originalIndex,
    changeVector: partyOrder.map((party) => changedVotesByParty(scenario.flows, party)),
  }));

  withVectors.sort((a, b) => {
    for (let i = 0; i < partyOrder.length; i++) {
      const diff = b.changeVector[i] - a.changeVector[i];
      if (diff !== 0) return diff;
    }
    return a.originalIndex - b.originalIndex;
  });

  return withVectors.map(({ scenario, originalIndex }) => ({ scenario, originalIndex }));
}
