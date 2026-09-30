import { IParty } from '../models/party';

export type ScenarioDisplayMode = 'grid' | 'sankey';

export interface IScenarioSankeyLink {
  source: string;
  target: string;
  value: number;
}

export function buildScenarioSankeyLinks(
  sourceParties: IParty[],
  targetParties: IParty[],
  values: number[][],
): IScenarioSankeyLink[] {
  return sourceParties.flatMap((source, rowIndex) =>
    targetParties.flatMap((target, columnIndex) => {
      const value = values[rowIndex][columnIndex];
      if (!(value > 0)) return [];
      return [
        {
          source: `Origen: ${source.name}`,
          target: `Destino: ${target.name}`,
          value,
        },
      ];
    }),
  );
}
