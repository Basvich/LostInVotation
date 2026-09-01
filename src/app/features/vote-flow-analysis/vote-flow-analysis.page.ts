import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressBarModule } from 'primeng/progressbar';
import { forkJoin } from 'rxjs';
import { VoteFlowAnalyzer } from '../../core/analysis/vote-flow-analyzer';
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
    ButtonModule,
    CardModule,
    DialogModule,
    SelectModule,
    InputNumberModule,
    ProgressBarModule,
  ],
  templateUrl: './vote-flow-analysis.page.html',
  styleUrls: ['./vote-flow-analysis.page.scss'],
})
export class VoteFlowAnalysisPage {
  private readonly votationsService = inject(VotationsResultsService);
  protected readonly store = inject(VoteFlowAnalysisStore);
  private readonly analyzer = new VoteFlowAnalyzer();

  protected readonly dialogVisible = signal(false);
  protected readonly availableVotations = signal<IVotationsInZone[]>([]);
  protected readonly fidelity = signal(environment.voteFlowAnalysis.defaultFidelityPercentage);
  protected readonly scenarioCount = signal(environment.voteFlowAnalysis.defaultScenarioCount);

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
    this.loadVotations();
  }

  protected openDialog(): void {
    this.dialogVisible.set(true);
  }

  protected reset(): void {
    this.store.reset();
    this.fidelity.set(environment.voteFlowAnalysis.defaultFidelityPercentage);
    this.scenarioCount.set(environment.voteFlowAnalysis.defaultScenarioCount);
    this.dialogVisible.set(false);
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
    return Boolean(selection.zone && selection.oldLink && selection.newLink && selection.oldLink !== selection.newLink);
  }

  protected runAnalysis(): void {
    const selection = this.selection();
    if (!selection.oldLink || !selection.newLink || selection.oldLink === selection.newLink) {
      this.store.setStatus('error');
      this.store.setError('Selecciona dos votaciones distintas para lanzar el análisis.');
      return;
    }

    this.store.setError(null);
    this.store.setScenarios([]);
    this.store.setProgress({ completed: 0, total: 3 });
    this.store.setStatus('running');
    this.dialogVisible.set(false);

    const fidelityPercentage = this.fidelity();
    const { blockSize } = this.store.input();
    const scenarioCount = this.scenarioCount();

    forkJoin({
      oldVotation: this.votationsService.getVotationResult(selection.oldLink),
      newVotation: this.votationsService.getVotationResult(selection.newLink),
    }).subscribe({
      next: ({ oldVotation, newVotation }) => {
        this.store.setProgress({ completed: 2, total: 3 });
        this.store.setSourceData(oldVotation, newVotation);
        this.store.setInput({
          fidelityPercentage,
          blockSize,
          scenarioCount,
        });

        let scenarios;
        try {
          scenarios = this.analyzer.generateScenarios(
            {
              oldVotation,
              newVotation,
              fidelityPercentage,
              blockSize,
            },
            scenarioCount,
          );
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