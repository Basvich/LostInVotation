

export interface IParty {
  id: string;
  name: string;
}

export class NotVotingParty implements IParty {
  id = 'not-voting';
  name = 'No Votando';
}

export interface IVotesToParty{
  numberOfVotes: number;
  party: IParty;
}

export interface IVotation {
  date: Date;
  name: string;
  //España, andalucia, asturias..... Only compare same zones
  zone: string;  
}

export interface IVotationResult {
  votation: IVotation;
  votesToParties: IVotesToParty[];
  totalVotes: number;
  totalVotesToParties: number;
}