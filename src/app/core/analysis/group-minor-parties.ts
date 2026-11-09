import { IVotationResult, IVotesToParty, NotVotingParty } from '../models/party';

export const OTHER_PARTIES = { id: 'synthetic:other-parties', name: 'Otros partidos' };

export function groupMinorParties(votation: IVotationResult, minimumPercentage: number): IVotationResult {
  if (!Number.isFinite(minimumPercentage) || minimumPercentage < 0 || minimumPercentage > 100) {
    throw new RangeError('El porcentaje mínimo debe estar entre 0 y 100.');
  }
  if (votation.votesToParties.some(({ party }) => party.id === OTHER_PARTIES.id)) {
    throw new Error('El identificador de Otros partidos ya existe en la votación.');
  }

  const votesToParties: IVotesToParty[] = [];
  let otherVotes = 0;
  let hasOtherParties = false;
  const notVotingId = new NotVotingParty().id;

  for (const entry of votation.votesToParties) {
    if (entry.party.id !== notVotingId &&
        entry.numberOfVotes * 100 < votation.totalVotes * minimumPercentage) {
      otherVotes += entry.numberOfVotes;
      hasOtherParties = true;
    } else {
      votesToParties.push(entry);
    }
  }

  if (hasOtherParties) {
    votesToParties.push({ party: OTHER_PARTIES, numberOfVotes: otherVotes });
  }
  return { ...votation, votesToParties };
}
