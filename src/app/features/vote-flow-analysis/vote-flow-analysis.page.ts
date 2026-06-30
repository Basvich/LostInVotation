import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressBarModule } from 'primeng/progressbar';
import { VoteFlowAnalysisStore } from '../../core/state/vote-flow-analysis.store';
import { VotationsResultsService } from '../../core/api/votations-results-service';
import { IVotationsInZone } from '../../core/models/availableData';

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

  protected readonly dialogVisible = signal(false);
  protected readonly availableVotations = signal<IVotationsInZone[]>([]);
  protected readonly fidelity = signal(0.5);

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
    this.fidelity.set(0.5);
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
    console.log('VoteFlowAnalysisPage.runAnalysis() Running analysis with fidelity:', this.fidelity());
    this.store.setInput({ fidelityPercentage: this.fidelity() });
    this.store.setStatus('ready');
    this.dialogVisible.set(false);
    // Worker integration will hook into the store here in the next step.
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