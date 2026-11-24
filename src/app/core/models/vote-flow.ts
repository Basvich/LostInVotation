import { IParty, IVotationResult } from './party';

export interface IVoteFlowInput {
  oldVotation: IVotationResult;
  newVotation: IVotationResult;
  /** Porcentaje de fidelidad global (0–1). Fracción de votantes que se mantienen con su partido. */
  fidelityPercentage: number;
  /** Tamaño de bloque para la distribución aleatoria. Por defecto 1000. */
  blockSize?: number;
  /** Compensar flujos recíprocos y asignar los votos compensados a cada partido. Por defecto true. */
  simplifyReciprocalFlows?: boolean;
}

export interface IPartyFlow {
  from: IParty;
  to: IParty;
  votes: number;
}

export interface IVoteFlowScenario {
  /** Flujos entre partidos; sus totales de origen y destino se conservan al simplificar. */
  flows: IPartyFlow[];
}
