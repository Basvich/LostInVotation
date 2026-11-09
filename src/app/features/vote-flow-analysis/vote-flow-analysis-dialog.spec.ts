import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';
import { firstValueFrom, NEVER, of } from 'rxjs';
import { VotationsResultsService } from '../../core/api/votations-results-service';
import { VoteFlowAnalysisStore } from '../../core/state/vote-flow-analysis.store';
import { VoteFlowAnalysisPage } from './vote-flow-analysis.page';
import { IVotationResult } from '../../core/models/party';
import { OTHER_PARTIES } from '../../core/analysis/group-minor-parties';

describe('selection dialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteFlowAnalysisPage],
      providers: [
        provideRouter([]),
        {
          provide: VotationsResultsService,
          useValue: {
            getAvailableVotations: () => of([
              { zone: 'Zona A', votations: [
                { name: 'Antigua', date: new Date('2018-01-01'), link: 'old' },
                { name: 'Nueva', date: new Date('2022-01-01'), link: 'new' },
              ] },
              { zone: 'Zona B', votations: [] },
            ]),
            getVotationResult: () => NEVER,
          },
        },
      ],
    }).compileComponents();
  });

  it('selects votations and clears them when the zone changes', async () => {
    const fixture = TestBed.createComponent(VoteFlowAnalysisPage);
    await fixture.whenStable();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.toolbar button')?.click();
    await fixture.whenStable();
    const selects = document.querySelectorAll<HTMLElement>('mat-dialog-container mat-select');
    expect(selects.length).toBe(3);
    expect(selects[1].getAttribute('aria-disabled')).toBe('true');
    expect(selects[2].getAttribute('aria-disabled')).toBe('true');

    selects[0].click();
    await fixture.whenStable();
    const options = document.getElementById(selects[0].getAttribute('aria-controls') ?? '')?.querySelectorAll<HTMLElement>('mat-option');
    expect(options).toBeTruthy();
    expect(options?.length).toBe(2);
    options?.[0].click();
    await fixture.whenStable();
    expect(selects[1].getAttribute('aria-disabled')).toBe('false');
    selects[1].click();
    await fixture.whenStable();
    document.getElementById(selects[1].getAttribute('aria-controls') ?? '')?.querySelectorAll<HTMLElement>('mat-option')[0].click();
    await fixture.whenStable();
    selects[2].click();
    await fixture.whenStable();
    document.getElementById(selects[2].getAttribute('aria-controls') ?? '')?.querySelectorAll<HTMLElement>('mat-option')[1].click();
    await fixture.whenStable();
    const store = TestBed.inject(VoteFlowAnalysisStore);
    expect(store.selection()).toEqual({ zone: 'Zona A', oldLink: 'old', newLink: 'new' });
    expect(document.querySelector<HTMLButtonElement>('.dialog-actions button:last-child')?.disabled).toBe(false);

    selects[0].click();
    await fixture.whenStable();
    document.getElementById(selects[0].getAttribute('aria-controls') ?? '')?.querySelectorAll<HTMLElement>('mat-option')[1].click();
    await fixture.whenStable();
    expect(store.selection()).toEqual({ zone: 'Zona B', oldLink: null, newLink: null });
    expect(document.querySelector<HTMLButtonElement>('.dialog-actions button:last-child')?.disabled).toBe(true);
  });

  it('rejects invalid parameters and accepts valid boundary values', async () => {
    const store = TestBed.inject(VoteFlowAnalysisStore);
    store.setSelection({ zone: 'Zona A', oldLink: 'old', newLink: 'new' });
    const fixture = TestBed.createComponent(VoteFlowAnalysisPage);
    await fixture.whenStable();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.toolbar button')?.click();
    await fixture.whenStable();
    const inputs = document.querySelectorAll<HTMLInputElement>('mat-dialog-container input[type=number]');
    const analyze = document.querySelector<HTMLButtonElement>('.dialog-actions button:last-child');
    expect(inputs.length).toBe(3);
    expect(inputs[2].value).toBe('5');
    expect(analyze?.disabled).toBe(false);

    for (const value of ['', '-0.1', '1.01', '0.123']) {
      inputs[0].value = value;
      inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      await fixture.whenStable();
      expect(analyze?.disabled).toBe(true);
      if (value) expect(inputs[0].getAttribute('aria-invalid')).toBe('true');
      else expect(inputs[0].getAttribute('aria-required')).toBe('true');
      expect(document.querySelector('mat-error')?.textContent).toContain('entre 0 y 1');
      expect(inputs[0].getAttribute('aria-describedby')).toBe(document.querySelector('mat-error')?.id);
    }
    inputs[0].value = '0';
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    expect(analyze?.disabled).toBe(false);

    for (const value of ['', '0', '201', '1.5']) {
      inputs[1].value = value;
      inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      await fixture.whenStable();
      expect(analyze?.disabled).toBe(true);
      if (value) expect(inputs[1].getAttribute('aria-invalid')).toBe('true');
      else expect(inputs[1].getAttribute('aria-required')).toBe('true');
      expect(document.querySelector('mat-error')?.textContent).toContain('entre 1 y 200');
      expect(inputs[1].getAttribute('aria-describedby')).toBe(document.querySelector('mat-error')?.id);
    }
    inputs[0].value = '1';
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[1].value = '200';
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    expect(analyze?.disabled).toBe(false);

    for (const value of ['', '-1', '100.01', '0.123']) {
      inputs[2].value = value;
      inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
      await fixture.whenStable();
      expect(analyze?.disabled).toBe(true);
      expect(document.querySelector('mat-error')?.textContent).toContain('entre 0 y 100');
      expect(inputs[2].getAttribute('aria-describedby')).toContain(document.querySelector('mat-error')?.id);
    }
    for (const value of ['0', '100']) {
      inputs[2].value = value;
      inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
      await fixture.whenStable();
      expect(analyze?.disabled).toBe(false);
    }
  });

  it('groups each election independently before storing and analyzing it', async () => {
    const oldVotation: IVotationResult = {
      votation: { date: new Date('2018-01-01'), name: 'Antigua', zone: 'Zona A' },
      totalVotes: 100,
      totalVotesToParties: 100,
      votesToParties: [
        { party: { id: 'a', name: 'A' }, numberOfVotes: 96 },
        { party: { id: 'b', name: 'B' }, numberOfVotes: 4 },
      ],
    };
    const newVotation: IVotationResult = {
      ...oldVotation,
      votation: { ...oldVotation.votation, name: 'Nueva' },
      votesToParties: [
        { party: { id: 'a', name: 'A' }, numberOfVotes: 94 },
        { party: { id: 'b', name: 'B' }, numberOfVotes: 6 },
      ],
    };
    const service = TestBed.inject(VotationsResultsService);
    vi.spyOn(service, 'getVotationResult').mockImplementation((link) =>
      of(link === 'old' ? oldVotation : newVotation),
    );
    const store = TestBed.inject(VoteFlowAnalysisStore);
    store.setSelection({ zone: 'Zona A', oldLink: 'old', newLink: 'new' });
    store.setInput({ blockSize: 1 });
    const fixture = TestBed.createComponent(VoteFlowAnalysisPage);
    await fixture.whenStable();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.toolbar button')?.click();
    await fixture.whenStable();
    document.querySelector<HTMLButtonElement>('.dialog-actions button:last-child')?.click();
    await fixture.whenStable();

    expect(store.status()).toBe('done');
    expect(store.input().minimumPartyPercentage).toBe(5);
    expect(store.input().oldVotation?.votesToParties).toEqual([
      oldVotation.votesToParties[0],
      { party: OTHER_PARTIES, numberOfVotes: 4 },
    ]);
    expect(store.input().newVotation?.votesToParties).toEqual(newVotation.votesToParties);
    expect(store.scenarios()[0].flows.some((flow) => flow.from.id === OTHER_PARTIES.id)).toBe(true);
    expect(store.scenarios()[0].flows.some((flow) => flow.to.id === 'b')).toBe(true);

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.toolbar button')?.click();
    await fixture.whenStable();
    const threshold = document.querySelectorAll<HTMLInputElement>('mat-dialog-container input[type=number]')[2];
    threshold.value = '3';
    threshold.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    document.querySelector<HTMLButtonElement>('.dialog-actions button:last-child')?.click();
    await fixture.whenStable();
    expect(store.status()).toBe('done');
    expect(store.input().minimumPartyPercentage).toBe(3);
    expect(store.input().oldVotation?.votesToParties).toEqual(oldVotation.votesToParties);

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.toolbar button:last-child')?.click();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.toolbar button')?.click();
    await fixture.whenStable();
    expect(document.querySelectorAll<HTMLInputElement>('mat-dialog-container input[type=number]')[2].value).toBe('5');
  });

  it('ignores backdrop clicks, closes on Escape and restores focus', async () => {
    const fixture = TestBed.createComponent(VoteFlowAnalysisPage);
    await fixture.whenStable();
    const open = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.toolbar button');
    open?.focus();
    open?.click();
    await fixture.whenStable();
    document.querySelector<HTMLElement>('.cdk-overlay-backdrop')?.click();
    await fixture.whenStable();
    const ref = TestBed.inject(MatDialog).openDialogs[0];
    expect(ref).toBeTruthy();
    const closed = firstValueFrom(ref.afterClosed());
    document.querySelector('mat-dialog-container')?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await closed;
    await fixture.whenStable();
    expect(document.querySelector('mat-dialog-container')).toBeNull();
    expect(document.activeElement).toBe(open);
  });
});
