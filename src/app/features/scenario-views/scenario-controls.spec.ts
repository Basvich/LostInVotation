import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { SankeyComponent } from '@swimlane/ngx-charts';
import { IVotationResult, NotVotingParty } from '../../core/models/party';
import { VoteFlowAnalysisStore } from '../../core/state/vote-flow-analysis.store';
import { ScenarioMatrixPage } from './scenario-matrix/scenario-matrix.page';
import { ScenarioStatsPage } from './scenario-stats/scenario-stats.page';

describe('scenario controls', () => {
  const party = { id: 'party', name: 'Partido' };
  const votation: IVotationResult = {
    votation: { date: new Date('2020-01-01'), name: 'Elección', zone: 'Zona' },
    votesToParties: [{ party, numberOfVotes: 100 }],
    totalVotes: 100,
    totalVotesToParties: 100,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScenarioMatrixPage, ScenarioStatsPage],
      providers: [provideRouter([])],
    }).compileComponents();
    const store = TestBed.inject(VoteFlowAnalysisStore);
    store.setSourceData(votation, votation);
    store.setScenarios([
      { flows: [{ from: party, to: party, votes: 100 }] },
      { flows: [{ from: party, to: party, votes: 40 }] },
    ]);
  });

  it('updates the matrix as the scenario slider moves', async () => {
    const fixture = TestBed.createComponent(ScenarioMatrixPage);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const slider = element.querySelector<HTMLInputElement>('input[matSliderThumb]');

    expect(slider?.getAttribute('aria-labelledby')).toBe('scenario-slider-label');
    expect(slider?.disabled).toBe(false);
    expect(element.querySelector('.scenario-label')?.textContent).toContain('Escenario 1 de 2');
    expect(element.querySelector('tbody td')?.textContent).toContain('100');

    if (!slider) throw new Error('Scenario slider not found');
    slider.value = '1';
    slider.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();

    expect(element.querySelector('.scenario-label')?.textContent).toContain('Escenario 2 de 2');
    expect(element.querySelector('tbody td')?.textContent).toContain('40');
  });

  it('disables the scenario slider when there is only one scenario', async () => {
    TestBed.inject(VoteFlowAnalysisStore).setScenarios([
      { flows: [{ from: party, to: party, votes: 100 }] },
    ]);
    const fixture = TestBed.createComponent(ScenarioMatrixPage);
    await fixture.whenStable();
    const slider = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input[matSliderThumb]');

    expect(slider?.disabled).toBe(true);
    expect(slider?.value).toBe('0');
  });

  it('changes the statistic and preserves the single selected option', async () => {
    const fixture = TestBed.createComponent(ScenarioStatsPage);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const group = element.querySelector('mat-button-toggle-group[aria-labelledby="metric-picker-label"]');
    const buttons = group?.querySelectorAll<HTMLButtonElement>('button');

    expect(element.querySelector('tbody td')?.textContent).toContain('70');
    expect(buttons?.length).toBe(4);
    buttons?.[1].click();
    await fixture.whenStable();

    expect(element.querySelector('tbody td')?.textContent).toContain('100');
    expect(buttons?.[1].getAttribute('aria-checked')).toBe('true');
    buttons?.[1].click();
    await fixture.whenStable();
    expect(buttons?.[1].getAttribute('aria-checked')).toBe('true');
  });

  it.each([
    [ScenarioMatrixPage, 'Visualización de los flujos'],
    [ScenarioStatsPage, 'Visualización de los estadísticos'],
  ] as const)('switches between table and Sankey views', async (page, label) => {
    const fixture = TestBed.createComponent<ScenarioMatrixPage | ScenarioStatsPage>(page);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const group = element.querySelector(`mat-button-toggle-group[aria-label="${label}"]`);
    const buttons = group?.querySelectorAll<HTMLButtonElement>('button');

    expect(buttons?.length).toBe(2);
    buttons?.[1].click();
    await fixture.whenStable();
    expect(element.querySelector('.matrix-table')).toBeNull();
    expect(element.querySelector('ngx-charts-sankey')).toBeTruthy();

    buttons?.[0].click();
    await fixture.whenStable();
    expect(element.querySelector('.matrix-table')).toBeTruthy();
    expect(element.querySelector('ngx-charts-sankey')).toBeNull();
  });

  it.each([
    [ScenarioMatrixPage, 'Visualización de los flujos'],
    [ScenarioStatsPage, 'Visualización de los estadísticos'],
  ] as const)('uses matching node colors in the rendered Sankey and preserves them on updates', async (page, label) => {
    const otherParty = { id: 'other', name: 'Otro' };
    const notVoting = new NotVotingParty();
    const store = TestBed.inject(VoteFlowAnalysisStore);
    store.setSourceData(
      { ...votation, votesToParties: [
        { party, numberOfVotes: 70 },
        { party: otherParty, numberOfVotes: 30 },
      ] },
      { ...votation, votesToParties: [
        { party, numberOfVotes: 60 },
        { party: otherParty, numberOfVotes: 30 },
      ] },
    );
    store.setScenarios([
      { flows: [
        { from: party, to: party, votes: 50 },
        { from: party, to: otherParty, votes: 10 },
        { from: otherParty, to: otherParty, votes: 20 },
        { from: otherParty, to: notVoting, votes: 10 },
      ] },
      { flows: [
        { from: party, to: party, votes: 60 },
        { from: otherParty, to: otherParty, votes: 20 },
        { from: otherParty, to: notVoting, votes: 10 },
      ] },
    ]);
    const fixture = TestBed.createComponent<ScenarioMatrixPage | ScenarioStatsPage>(page);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelectorAll<HTMLButtonElement>(`mat-button-toggle-group[aria-label="${label}"] button`)[1].click();
    await fixture.whenStable();
    const chart = fixture.debugElement.query(By.directive(SankeyComponent)).componentInstance as SankeyComponent;
    const fillFor = (name: string) => chart.nodeRects.find((rect) => rect.originalLabel === name)?.fill;
    const originalPartyColor = fillFor('Origen: Partido');
    const originalOtherColor = fillFor('Origen: Otro');
    const originalNonVotingColor = fillFor('Destino: No Votando');

    expect(originalPartyColor).toBeTruthy();
    expect(originalPartyColor).toBe(fillFor('Destino: Partido'));
    expect(originalOtherColor).toBe(fillFor('Destino: Otro'));
    expect(new Set([originalPartyColor, originalOtherColor, originalNonVotingColor]).size).toBe(3);

    if (page === ScenarioMatrixPage) {
      const slider = element.querySelector<HTMLInputElement>('input[matSliderThumb]');
      if (!slider) throw new Error('Scenario slider not found');
      slider.value = '1';
      slider.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      element.querySelectorAll<HTMLButtonElement>('mat-button-toggle-group[aria-labelledby="metric-picker-label"] button')[2].click();
    }
    await fixture.whenStable();
    expect(fillFor('Origen: Partido')).toBe(originalPartyColor);
    expect(fillFor('Destino: Partido')).toBe(originalPartyColor);
    expect(fillFor('Origen: Otro')).toBe(originalOtherColor);
    expect(fillFor('Destino: Otro')).toBe(originalOtherColor);
    expect(fillFor('Destino: No Votando')).toBe(originalNonVotingColor);
  });

  it.each([ScenarioMatrixPage, ScenarioStatsPage])(
    'shows non-voting destinations independently in both result views',
    async (page) => {
      const notVoting = new NotVotingParty();
      TestBed.inject(VoteFlowAnalysisStore).setScenarios([
        { flows: [{ from: party, to: notVoting, votes: 10 }] },
      ]);
      const fixture = TestBed.createComponent<ScenarioMatrixPage | ScenarioStatsPage>(page);
      await fixture.whenStable();
      const element = fixture.nativeElement as HTMLElement;
      expect(element.querySelector('thead')?.textContent).toContain('No Votando');
      expect(element.querySelector('tbody')?.textContent).toContain('10');
    },
  );

  it.each([ScenarioMatrixPage, ScenarioStatsPage])(
    'explains when reciprocal flows were simplified',
    async (page) => {
      const store = TestBed.inject(VoteFlowAnalysisStore);
      const fixture = TestBed.createComponent<ScenarioMatrixPage | ScenarioStatsPage>(page);
      await fixture.whenStable();
      const element = fixture.nativeElement as HTMLElement;
      expect(element.textContent).toContain('los votos compensados permanecen en sus respectivos partidos');
      store.setInput({ simplifyReciprocalFlows: false });
      await fixture.whenStable();
      expect(element.textContent).not.toContain('los votos compensados permanecen en sus respectivos partidos');
    },
  );
});
