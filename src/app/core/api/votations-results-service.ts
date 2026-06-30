import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IAvailableVotation, IVotationsInZone } from '../models/availableData';
import { IVotation, IVotationResult } from '../models/party';

type Override<T, R> = Omit<T, keyof R> & R;
type IAvailableVotationDto = Override<IAvailableVotation, { date: string }>;
type IVotationsInZoneDto = Override<IVotationsInZone, {
  votations: IAvailableVotationDto[];
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
    const url = `${this.baseUrl}/availableVotations.json`;
    console.log('Fetching available votations from:', url);
    return this.httpClient
      .get<IVotationsInZoneDto[]>(url)
      .pipe(
        map((votationsInZone) =>
          votationsInZone.map((zoneVotations) => ({
            ...zoneVotations,
            votations: zoneVotations.votations.map((votation) => ({
              ...votation,
              date: new Date(votation.date),
            })),
          })),
        ),
        catchError(this.handleError),
      );
  }

  /** A partir del link obtenido en el catalogo de votaciones distponibles, para una votacion concreta,
   *  devuelve el resultado de la votacion.
   */
  public getVotationResult(link: string): Observable<IVotationResult> {
    const normalizedLink = link.replace(/^\.\//, '').replace(/^\//, '');
    const url = `${this.baseUrl}/${normalizedLink}`;
    console.log('Fetching votation result from:', url);
    return this.httpClient
      .get<IVotationResultDto>(url)
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


  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
