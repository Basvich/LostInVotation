import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { SliderModule } from 'primeng/slider';
import {
  buildPartyOrder,
  buildScenarioMatrix,
  sortScenariosByPartyChanges,
} from '../../../core/analysis/scenario-matrix';
import { VoteFlowAnalysisStore } from '../../../core/state/vote-flow-analysis.store';

/** Fila de la tabla: partido origen + celdas (una por partido destino) + total de fila. */
interface IMatrixRowView {
  partyId: string;
  partyName: string;
  cells: number[];
  total: number;
}

@Component({
  selector: 'app-scenario-matrix-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DecimalPipe, RouterLink, CardModule, SliderModule],
  templateUrl: './scenario-matrix.page.html',
  styleUrls: ['./scenario-matrix.page.scss'],
})
export class ScenarioMatrixPage {
  protected readonly store = inject(VoteFlowAnalysisStore);

  /** Índice del escenario seleccionado dentro de la lista ya ordenada (no el índice original). */
  protected readonly selectedOrderedIndex = signal(0);

  private readonly input = this.store.input;
  private readonly scenarios = this.store.scenarios;

  protected readonly hasScenarios = computed(() => this.scenarios().length > 0);

  /** Orden común de partidos (filas y columnas) derivado de las votaciones de origen y de los escenarios. */
  protected readonly partyOrder = computed(() =>
    buildPartyOrder(this.input().oldVotation, this.input().newVotation, this.scenarios()),
  );

  /** Escenarios ordenados de mayor a menor cambio en el partido más votado, y así sucesivamente. */
  protected readonly orderedScenarios = computed(() =>
    sortScenariosByPartyChanges(this.scenarios(), this.partyOrder()),
  );

  protected readonly sliderMax = computed(() => Math.max(this.orderedScenarios().length - 1, 0));

  /** Escenario actualmente seleccionado (recalculado de forma reactiva al mover el slider). */
  protected readonly currentScenario = computed(() => {
    const ordered = this.orderedScenarios();
    if (ordered.length === 0) return null;
    const index = Math.min(this.selectedOrderedIndex(), ordered.length - 1);
    return ordered[index];
  });

  protected readonly currentMatrix = computed(() => {
    const current = this.currentScenario();
    if (!current) return null;
    return buildScenarioMatrix(current.scenario, this.partyOrder());
  });

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

  protected readonly matrixRows = computed<IMatrixRowView[]>(() => {
    const matrix = this.currentMatrix();
    if (!matrix) return [];
    const visible = this.visibleColumnIndices();
    return matrix.parties.map((party, rowIndex) => ({
      partyId: party.id,
      partyName: party.name,
      cells: visible.map((colIndex) => matrix.cells[rowIndex][colIndex]),
      total: matrix.rowTotals[rowIndex],
    }));
  });

  protected readonly columnParties = computed(() => {
    const parties = this.currentMatrix()?.parties ?? [];
    return this.visibleColumnIndices().map((index) => parties[index]);
  });

  protected readonly columnTotals = computed(() => {
    const totals = this.currentMatrix()?.colTotals ?? [];
    return this.visibleColumnIndices().map((index) => totals[index]);
  });

  protected readonly scenarioPosition = computed(() => this.selectedOrderedIndex() + 1);
  protected readonly scenarioCount = computed(() => this.orderedScenarios().length);

  protected onSliderChange(value: number): void {
    this.selectedOrderedIndex.set(value);
  }
}
