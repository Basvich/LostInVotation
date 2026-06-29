import { IVotationResult } from "./party";

export interface IavailableVotations{
  votations: IVotationsInZone[];
}

export interface IVotationsInZone{
  zone: string;
  votations: IAvailableVotation[];
}

export interface IAvailableVotation{
  date: Date;
  name: string;
  /** Referencia a a un json con los datos en formato IVotationResult */
  link: string;
}
