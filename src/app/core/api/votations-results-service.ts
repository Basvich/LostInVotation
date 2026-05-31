import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IAvailableVotation, IVotationsInZone } from '../models/availableData';
import { IVotation, IVotationResult } from '../models/party';

type Override<T, R> = Omit<T, keyof R> & R;
type IAvailableVotationDto = Override<IAvailableVotation, { date: string }>;
type IVotationsInZoneDto = Override<IVotationsInZone, {
  votations: IAvailableVotationDto;
}>;
type IVotationDto = Override<IVotation, { date: string }>;
type IVotationResultDto = Override<IVotationResult, { votation: IVotationDto }>;

@Injectable({
  providedIn: 'root',
})
export class VotationsResultsService {
  private readonly baseUrl = `${environment.baseUrl}`;

  constructor(private readonly httpClient: HttpClient) { }

  /** Devuelve las votaciones disponibles */
  public getAvailableVotations(): Observable<IVotationsInZone[]> {
    return this.httpClient
      .get<IVotationsInZoneDto[]>(`${this.baseUrl}/votations`)
      .pipe(
        map((votationsInZone) =>
          votationsInZone.map((zoneVotations) => ({
            ...zoneVotations,
            votations: {
              ...zoneVotations.votations,
              date: new Date(zoneVotations.votations.date),
            },
          })),
        ),
      );
  }

  /** A partir del link obtenido en el catalogo de votaciones distponibles, para una votacion concreta,
   *  devuelve el resultado de la votacion.
   */
  public getVotationResult(link: string): Observable<IVotationResult> {
    return this.httpClient
      .get<IVotationResultDto>(`${this.baseUrl}/${link}`)
      .pipe(
        map((votationResult) => ({
          ...votationResult,
          votation: {
            ...votationResult.votation,
            date: new Date(votationResult.votation.date),
          },
        })),
      );
  }
}
