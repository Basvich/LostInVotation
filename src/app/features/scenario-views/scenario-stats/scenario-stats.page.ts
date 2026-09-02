import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { buildPartyOrder } from '../../../core/analysis/scenario-matrix';
import {
  buildScenarioStatsMatrix,
  STAT_METRIC_LABELS,
  STAT_METRICS,
  StatMetric,
} from '../../../core/analysis/scenario-stats';
import { VoteFlowAnalysisStore } from '../../../core/state/vote-flow-analysis.store';

/** Fila de la tabla: partido origen + valor del estadístico elegido (una celda por partido destino) + total de fila. */
interface IStatsRowView {
  partyId: string;
  partyName: string;
  cells: number[];
  total: number;
}

@Component({
  selector: 'app-scenario-stats-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DecimalPipe, RouterLink, CardModule, SelectButtonModule],
  templateUrl: './scenario-stats.page.html',
  styleUrls: ['./scenario-stats.page.scss'],
})
export class ScenarioStatsPage {
  protected readonly store = inject(VoteFlowAnalysisStore);

  protected readonly metricOptions = STAT_METRICS.map((metric) => ({
    label: STAT_METRIC_LABELS[metric],
    value: metric,
  }));

  /** Estadístico actualmente seleccionado para mostrar en la tabla. */
  protected readonly selectedMetric = signal<StatMetric>('mean');

  private readonly input = this.store.input;
  private readonly scenarios = this.store.scenarios;

  protected readonly hasScenarios = computed(() => this.scenarios().length > 0);

  /** Orden común de partidos (filas y columnas) derivado de las votaciones de origen y de los escenarios. */
  protected readonly partyOrder = computed(() =>
    buildPartyOrder(this.input().oldVotation, this.input().newVotation, this.scenarios()),
  );

  /**
   * Índices de columnas a mostrar: se excluyen los partidos que no existen en la votación nueva,
   * ya que nunca pueden recibir votos y sus columnas quedarían siempre a cero.
   */
  protected readonly visibleColumnIndices = computed(() => {
    const newPartyIds = new Set(
      (this.input().newVotation?.votesToParties ?? []).map((vtp) => vtp.party.id),
    );
    return this.partyOrder().reduce<number[]>((indices, party, index) => {
      if (newPartyIds.has(party.id)) indices.push(index);
      return indices;
    }, []);
  });

  /** Matriz de estadísticos (min/max/media/moda) agregada sobre todos los escenarios disponibles. */
  protected readonly statsMatrix = computed(() =>
    buildScenarioStatsMatrix(this.scenarios(), this.partyOrder()),
  );

  protected readonly statsRows = computed<IStatsRowView[]>(() => {
    const matrix = this.statsMatrix();
    const metric = this.selectedMetric();
    const visible = this.visibleColumnIndices();
    return matrix.parties.map((party, rowIndex) => ({
      partyId: party.id,
      partyName: party.name,
      cells: visible.map((colIndex) => matrix.cells[rowIndex][colIndex][metric]),
      total: matrix.rowTotals[metric][rowIndex],
    }));
  });

  protected readonly columnParties = computed(() => {
    const parties = this.statsMatrix().parties;
    return this.visibleColumnIndices().map((index) => parties[index]);
  });

  protected readonly columnTotals = computed(() => {
    const totals = this.statsMatrix().colTotals[this.selectedMetric()];
    return this.visibleColumnIndices().map((index) => totals[index]);
  });

  protected readonly scenarioCount = computed(() => this.scenarios().length);
}
