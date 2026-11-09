import { IParty } from '../models/party';

export type ScenarioDisplayMode = 'grid' | 'sankey';

export interface IScenarioSankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface IScenarioSankeyColor {
  name: string;
  value: string;
}

function nodeName(side: 'Origen' | 'Destino', party: IParty): string {
  return `${side}: ${party.name}`;
}

export function buildScenarioSankeyColors(parties: IParty[]): IScenarioSankeyColor[] {
  return parties.flatMap((party, index) => {
    const hue = (index * 137.508) % 360;
    const value = `hsl(${hue.toFixed(3)}, 65%, 40%)`;
    return [
      { name: nodeName('Origen', party), value },
      { name: nodeName('Destino', party), value },
    ];
  });
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
          source: nodeName('Origen', source),
          target: nodeName('Destino', target),
          value,
        },
      ];
    }),
  );
}
