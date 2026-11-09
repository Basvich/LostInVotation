import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { forkJoin } from 'rxjs';
import { VoteFlowAnalyzer } from '../../core/analysis/vote-flow-analyzer';
import { groupMinorParties } from '../../core/analysis/group-minor-parties';
import { VoteFlowAnalysisStore } from '../../core/state/vote-flow-analysis.store';
import { VotationsResultsService } from '../../core/api/votations-results-service';
import { IVotationsInZone } from '../../core/models/availableData';
import { environment } from '../../../environments/environment';

type ZoneOption = { label: string; value: string };
type VotationOption = { label: string; value: string };

@Component({
  selector: 'app-vote-flow-analysis-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './vote-flow-analysis.page.html',
  styleUrls: ['./vote-flow-analysis.page.scss'],
})
export class VoteFlowAnalysisPage {
  private readonly votationsService = inject(VotationsResultsService);
  private readonly dialog = inject(MatDialog);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly dialogTemplate = viewChild.required<TemplateRef<unknown>>('selectionDialog');
  private dialogRef: MatDialogRef<unknown> | null = null;
  protected readonly store = inject(VoteFlowAnalysisStore);
  private readonly analyzer = new VoteFlowAnalyzer();

  protected readonly availableVotations = signal<IVotationsInZone[]>([]);
  protected readonly fidelity = signal<number | null>(environment.voteFlowAnalysis.defaultFidelityPercentage);
  protected readonly scenarioCount = signal<number | null>(environment.voteFlowAnalysis.defaultScenarioCount);
  protected readonly minimumPartyPercentage = signal<number | null>(environment.voteFlowAnalysis.defaultMinimumPartyPercentage);
  protected readonly validFidelity = computed(() => {
    const value = this.fidelity();
    return (
      value !== null && Number.isFinite(value) && value >= 0 && value <= 1 &&
      Math.abs(value * 100 - Math.round(value * 100)) < 1e-8
    );
  });
  protected readonly validScenarioCount = computed(() => {
    const value = this.scenarioCount();
    return value !== null && Number.isInteger(value) && value >= 1 && value <= 200;
  });
  protected readonly validMinimumPartyPercentage = computed(() => {
    const value = this.minimumPartyPercentage();
    return value !== null && Number.isFinite(value) && value >= 0 && value <= 100 &&
      Math.abs(value * 100 - Math.round(value * 100)) < 1e-8;
  });
  protected readonly fidelityErrorState = { isErrorState: () => !this.validFidelity() };
  protected readonly scenarioCountErrorState = { isErrorState: () => !this.validScenarioCount() };
  protected readonly minimumPartyPercentageErrorState = { isErrorState: () => !this.validMinimumPartyPercentage() };

  protected readonly status = this.store.status;
  protected readonly selection = this.store.selection;
  protected readonly progress = this.store.progress;
  protected readonly scenarios = this.store.scenarios;

  protected readonly zoneOptions = computed<ZoneOption[]>(() =>
    this.availableVotations().map((zone) => ({ label: zone.zone, value: zone.zone })),
  );

  protected readonly selectedZone = computed(() => this.selection().zone);

  protected readonly zoneVotations = computed(() => {
    const zone = this.selectedZone();
    if (!zone) return [];
    return this.availableVotations().find((entry) => entry.zone === zone)?.votations ?? [];
  });

  protected readonly oldVotationOptions = computed<VotationOption[]>(() =>
    this.zoneVotations().map((votation) => ({
      label: `${votation.name} (${votation.date.getFullYear()})`,
      value: votation.link,
    })),
  );

  protected readonly newVotationOptions = computed<VotationOption[]>(() =>
    this.zoneVotations().map((votation) => ({
      label: `${votation.name} (${votation.date.getFullYear()})`,
      value: votation.link,
    })),
  );

  protected readonly isRunning = computed(() => this.status() === 'running');
  protected readonly progressPercent = computed(() => {
    const progress = this.progress();
    if (!progress.total) return 0;
    return Math.round((progress.completed / progress.total) * 100);
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.closeDialog());
    this.loadVotations();
  }

  protected openDialog(): void {
    if (this.dialogRef) return;
    const ref = this.dialog.open(this.dialogTemplate(), {
      viewContainerRef: this.viewContainerRef,
      width: '42rem',
      maxWidth: '95vw',
      disableClose: true,
      ariaLabelledBy: 'selection-dialog-title',
    });
    this.dialogRef = ref;
    ref.keydownEvents().subscribe((event) => {
      if (
        event.key === 'Escape' && !event.defaultPrevented &&
        !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey
      ) {
        event.preventDefault();
        ref.close();
      }
    });
    ref.afterClosed().subscribe(() => {
      if (this.dialogRef === ref) this.dialogRef = null;
    });
  }

  protected closeDialog(): void {
    this.dialogRef?.close();
  }

  protected reset(): void {
    this.store.reset();
    this.fidelity.set(environment.voteFlowAnalysis.defaultFidelityPercentage);
    this.scenarioCount.set(environment.voteFlowAnalysis.defaultScenarioCount);
    this.minimumPartyPercentage.set(environment.voteFlowAnalysis.defaultMinimumPartyPercentage);
    this.closeDialog();
  }

  protected onZoneChange(zone: string | null): void {
    this.store.setSelection({ zone, oldLink: null, newLink: null });
  }

  protected onOldChange(oldLink: string | null): void {
    this.store.setSelection({ oldLink });
  }

  protected onNewChange(newLink: string | null): void {
    this.store.setSelection({ newLink });
  }

  protected canAnalyze(): boolean {
    const selection = this.selection();
    return Boolean(
      selection.zone && selection.oldLink && selection.newLink && selection.oldLink !== selection.newLink &&
      this.validFidelity() && this.validScenarioCount() && this.validMinimumPartyPercentage(),
    );
  }

  protected runAnalysis(): void {
    const selection = this.selection();
    const fidelityPercentage = this.fidelity();
    const scenarioCount = this.scenarioCount();
    const minimumPartyPercentage = this.minimumPartyPercentage();
    if (
      !this.canAnalyze() || !selection.oldLink || !selection.newLink ||
      fidelityPercentage === null || scenarioCount === null || minimumPartyPercentage === null
    ) {
      this.store.setStatus('error');
      this.store.setError('Selecciona dos votaciones distintas y parámetros válidos para lanzar el análisis.');
      return;
    }

    this.store.setError(null);
    this.store.setScenarios([]);
    this.store.setProgress({ completed: 0, total: 3 });
    this.store.setStatus('running');
    this.closeDialog();

    const { blockSize } = this.store.input();

    forkJoin({
      oldVotation: this.votationsService.getVotationResult(selection.oldLink),
      newVotation: this.votationsService.getVotationResult(selection.newLink),
    }).subscribe({
      next: ({ oldVotation, newVotation }) => {
        this.store.setProgress({ completed: 2, total: 3 });
        let scenarios;
        try {
          const groupedOldVotation = groupMinorParties(oldVotation, minimumPartyPercentage);
          const groupedNewVotation = groupMinorParties(newVotation, minimumPartyPercentage);
          scenarios = this.analyzer.generateScenarios(
            {
              oldVotation: groupedOldVotation,
              newVotation: groupedNewVotation,
              fidelityPercentage,
              blockSize,
            },
            scenarioCount,
          );
          this.store.setSourceData(groupedOldVotation, groupedNewVotation);
          this.store.setInput({
            fidelityPercentage,
            minimumPartyPercentage,
            blockSize,
            scenarioCount,
          });
        } catch {
          this.store.setStatus('error');
          this.store.setProgress({ completed: 0, total: 0 });
          this.store.setError('No se ha podido generar un escenario válido con los parámetros seleccionados.');
          return;
        }

        this.store.setScenarios(scenarios);
        this.store.setSelectedScenario(0);
        this.store.setProgress({ completed: 3, total: 3 });
        this.store.setStatus('done');
      },
      error: () => {
        this.store.setStatus('error');
        this.store.setProgress({ completed: 0, total: 0 });
        this.store.setError('No se ha podido cargar o analizar las votaciones seleccionadas.');
      },
    });
  }

  protected selectedOldLabel(): string {
    return this.resolveLabel(this.selection().oldLink);
  }

  protected selectedNewLabel(): string {
    return this.resolveLabel(this.selection().newLink);
  }

  private resolveLabel(link: string | null): string {
    if (!link) return 'Sin seleccionar';
    for (const zone of this.availableVotations()) {
      const votation = zone.votations.find((entry) => entry.link === link);
      if (votation) return `${zone.zone} · ${votation.name}`;
    }
    return link;
  }

  private loadVotations(): void {
    this.votationsService.getAvailableVotations().subscribe({
      next: (votations) => this.availableVotations.set(votations),
      error: () => this.store.setError('No se han podido cargar las votaciones disponibles.'),
    });
  }
}