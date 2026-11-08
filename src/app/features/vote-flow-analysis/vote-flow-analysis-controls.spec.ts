import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { NEVER, of } from 'rxjs';
import { VotationsResultsService } from '../../core/api/votations-results-service';
import { VoteFlowAnalysisStore } from '../../core/state/vote-flow-analysis.store';
import { VoteFlowAnalysisPage } from './vote-flow-analysis.page';

describe('analysis buttons and progress', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteFlowAnalysisPage],
      providers: [
        provideRouter([]),
        {
          provide: VotationsResultsService,
          useValue: { getAvailableVotations: () => of([]), getVotationResult: () => NEVER },
        },
      ],
    }).compileComponents();
  });

  it('opens and cancels the dialog without resetting the selection', async () => {
    const store = TestBed.inject(VoteFlowAnalysisStore);
    store.setSelection({ zone: 'Zona' });
    const fixture = TestBed.createComponent(VoteFlowAnalysisPage);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    const open = element.querySelector<HTMLButtonElement>('.toolbar button');
    expect(open?.textContent).toContain('Elegir votaciones');
    open?.click();
    await fixture.whenStable();
    const cancel = document.querySelector<HTMLButtonElement>('.dialog-actions button');
    expect(cancel?.textContent).toContain('Cancelar');
    const closed = firstValueFrom(TestBed.inject(MatDialog).openDialogs[0].afterClosed());
    cancel?.click();
    await closed;
    await fixture.whenStable();
    expect(document.querySelector('.dialog-actions')).toBeNull();
    expect(store.selection().zone).toBe('Zona');
  });

  it('enables analysis only for distinct votations and resets the state', async () => {
    const store = TestBed.inject(VoteFlowAnalysisStore);
    const fixture = TestBed.createComponent(VoteFlowAnalysisPage);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('.toolbar button')?.click();
    await fixture.whenStable();
    const analyze = document.querySelector<HTMLButtonElement>('.dialog-actions button:last-child');

    expect(analyze?.textContent).toContain('Analizar');
    expect(analyze?.disabled).toBe(true);
    store.setSelection({ zone: 'Zona', oldLink: 'a', newLink: 'a' });
    await fixture.whenStable();
    expect(analyze?.disabled).toBe(true);
    store.setSelection({ newLink: 'b' });
    await fixture.whenStable();
    expect(analyze?.disabled).toBe(false);
    const closed = firstValueFrom(TestBed.inject(MatDialog).openDialogs[0].afterClosed());
    analyze?.click();
    await closed;
    await fixture.whenStable();

    expect(store.status()).toBe('running');
    expect(document.querySelector('.dialog-actions')).toBeNull();
    expect(element.querySelector('mat-progress-bar')?.getAttribute('aria-valuenow')).toBe('0');
    element.querySelector<HTMLButtonElement>('.toolbar button:last-child')?.click();
    await fixture.whenStable();
    expect(store.status()).toBe('idle');
    expect(store.selection().zone).toBeNull();
    expect(element.querySelector('mat-progress-bar')).toBeNull();
  });

  it('shows a labelled progress bar with the current percentage', async () => {
    const store = TestBed.inject(VoteFlowAnalysisStore);
    const fixture = TestBed.createComponent(VoteFlowAnalysisPage);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('mat-progress-bar')).toBeNull();

    store.setStatus('running');
    store.setProgress({ completed: 2, total: 3 });
    await fixture.whenStable();
    const bar = element.querySelector('mat-progress-bar');
    expect(bar?.getAttribute('role')).toBe('progressbar');
    expect(bar?.getAttribute('aria-label')).toBe('Progreso del análisis');
    expect(bar?.getAttribute('aria-valuenow')).toBe('67');
    expect(element.querySelector('.analysis-progress > span')?.textContent).toContain('67%');

    store.setStatus('done');
    store.setProgress({ completed: 3, total: 3 });
    await fixture.whenStable();
    expect(bar?.getAttribute('aria-valuenow')).toBe('100');
    expect(element.querySelector('.analysis-progress > span')?.textContent).toContain('100%');
  });
});
