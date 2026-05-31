import { IParty, IVotationResult } from './party';

export interface IVoteFlowInput {
  oldVotation: IVotationResult;
  newVotation: IVotationResult;
  /** Porcentaje de fidelidad global (0–1). Fracción de votantes que se mantienen con su partido. */
  fidelityPercentage: number;
  /** Tamaño de bloque para la distribución aleatoria. Por defecto 1000. */
  blockSize?: number;
}

export interface IPartyFlow {
  from: IParty;
  to: IParty;
  votes: number;
}

export interface IVoteFlowScenario {
  /** Lista plana de flujos entre partidos. Suma de from === votos origen; suma de to === votos destino. */
  flows: IPartyFlow[];
}
