import { IParty } from '../models/party';
import { IVoteFlowScenario } from '../models/vote-flow';
import { buildScenarioMatrix } from './scenario-matrix';

/** Estadísticos calculados a partir del conjunto de escenarios generados para una celda origen-destino. */
export interface ICellStats {
  min: number;
  max: number;
  mean: number;
  /** Valor más frecuente entre los escenarios; en caso de empate se toma el menor de los más frecuentes. */
  mode: number;
}

/** Nombre de cada estadístico disponible, usado para seleccionar qué mostrar y para etiquetas. */
export type StatMetric = 'min' | 'max' | 'mean' | 'mode';

export const STAT_METRICS: readonly StatMetric[] = ['min', 'max', 'mean', 'mode'];

export const STAT_METRIC_LABELS: Record<StatMetric, string> = {
  min: 'Mínimo',
  max: 'Máximo',
  mean: 'Media',
  mode: 'Moda',
};

/** Matriz de estadísticos por celda (origen-destino) calculada sobre todos los escenarios dados. */
export interface IScenarioStatsMatrix {
  parties: IParty[];
  cells: ICellStats[][];
  /** Total por fila para cada estadístico, sumando el valor de ese estadístico en cada celda de la fila. */
  rowTotals: Record<StatMetric, number[]>;
  /** Total por columna para cada estadístico, sumando el valor de ese estadístico en cada celda de la columna. */
  colTotals: Record<StatMetric, number[]>;
}

/** Calcula min, max, media y moda de una lista de valores numéricos. Devuelve todo a 0 si la lista está vacía. */
export function computeCellStats(values: number[]): ICellStats {
  if (values.length === 0) {
    return { min: 0, max: 0, mean: 0, mode: 0 };
  }

  let min = values[0];
  let max = values[0];
  let sum = 0;
  const counts = new Map<number, number>();

  for (const value of values) {
    if (value < min) min = value;
    if (value > max) max = value;
    sum += value;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  let mode = values[0];
  let modeCount = 0;
  for (const [value, count] of counts) {
    if (count > modeCount || (count === modeCount && value < mode)) {
      mode = value;
      modeCount = count;
    }
  }

  return { min, max, mean: sum / values.length, mode };
}

/**
 * Construye la matriz de estadísticos (min/max/media/moda) por celda origen-destino, agregando los
 * valores de todos los escenarios dados según el orden de partidos indicado.
 */
export function buildScenarioStatsMatrix(
  scenarios: IVoteFlowScenario[],
  parties: IParty[],
): IScenarioStatsMatrix {
  const size = parties.length;
  const valuesByCell: number[][][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => []),
  );

  for (const scenario of scenarios) {
    const matrix = buildScenarioMatrix(scenario, parties);
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        valuesByCell[row][col].push(matrix.cells[row][col]);
      }
    }
  }

  const cells: ICellStats[][] = valuesByCell.map((row) => row.map((values) => computeCellStats(values)));

  const emptyTotals = (): Record<StatMetric, number[]> => ({
    min: new Array(size).fill(0),
    max: new Array(size).fill(0),
    mean: new Array(size).fill(0),
    mode: new Array(size).fill(0),
  });

  const rowTotals = emptyTotals();
  const colTotals = emptyTotals();

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      for (const metric of STAT_METRICS) {
        const value = cells[row][col][metric];
        rowTotals[metric][row] += value;
        colTotals[metric][col] += value;
      }
    }
  }

  return { parties, cells, rowTotals, colTotals };
}
