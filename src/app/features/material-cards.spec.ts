import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { VotationsResultsService } from '../core/api/votations-results-service';
import { IVotationResult } from '../core/models/party';
import { VoteFlowAnalysisStore } from '../core/state/vote-flow-analysis.store';
import { ScenarioMatrixPage } from './scenario-views/scenario-matrix/scenario-matrix.page';
import { ScenarioStatsPage } from './scenario-views/scenario-stats/scenario-stats.page';
import { VoteFlowAnalysisPage } from './vote-flow-analysis/vote-flow-analysis.page';

describe('Material cards in analysis views', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteFlowAnalysisPage, ScenarioMatrixPage, ScenarioStatsPage],
      providers: [
        provideRouter([]),
        { provide: VotationsResultsService, useValue: { getAvailableVotations: () => of([]) } },
      ],
    }).compileComponents();
  });

  it('renders the analysis controls inside the card and opens the selection dialog', async () => {
    const fixture = TestBed.createComponent(VoteFlowAnalysisPage);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('mat-card h2')?.textContent).toContain('Análisis de flujo de votaciones');
    expect(element.querySelector('mat-card-content .empty-state')?.textContent).toContain('Selecciona una zona');
    const openButton = element.querySelector<HTMLButtonElement>('.toolbar button');
    expect(openButton).toBeTruthy();
    openButton?.click();
    await fixture.whenStable();
    expect(document.querySelector('mat-dialog-container')?.textContent).toContain('Seleccionar votaciones');
  });

  it.each([
    [ScenarioMatrixPage, 'Matriz de transferencia de votos por escenario'],
    [ScenarioStatsPage, 'Estadísticas de transferencia de votos entre escenarios'],
  ] as const)('renders the empty state and scenario data in the card', async (page, title) => {
    const fixture = TestBed.createComponent<ScenarioMatrixPage | ScenarioStatsPage>(page);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('mat-card h2')?.textContent).toContain(title);
    expect(element.querySelector('mat-card-content .empty-state')?.textContent).toContain(
      'No hay escenarios disponibles',
    );

    const party = { id: 'party', name: 'Partido' };
    const votation: IVotationResult = {
      votation: { date: new Date('2020-01-01'), name: 'Elección', zone: 'Zona' },
      votesToParties: [{ party, numberOfVotes: 100 }],
      totalVotes: 100,
      totalVotesToParties: 100,
    };
    const store = TestBed.inject(VoteFlowAnalysisStore);
    store.setSourceData(votation, votation);
    store.setScenarios([{ flows: [{ from: party, to: party, votes: 100 }] }]);
    await fixture.whenStable();

    expect(element.querySelector('mat-card-content .matrix-table')?.textContent).toContain('Partido');
    expect(element.querySelector('mat-card-content .matrix-table')?.textContent).toContain('100');
    expect(element.querySelector('mat-card-content mat-button-toggle-group')).toBeTruthy();
  });
});
