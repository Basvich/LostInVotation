import { describe, expect, it } from 'vitest';
import { IParty } from '../models/party';
import { buildScenarioSankeyLinks } from './scenario-sankey';

const pp: IParty = { id: 'pp', name: 'PP' };
const psoe: IParty = { id: 'psoe', name: 'PSOE' };

describe('buildScenarioSankeyLinks', () => {
  it('creates labeled source and destination links and excludes zero flows', () => {
    const links = buildScenarioSankeyLinks(
      [pp, psoe],
      [pp, psoe],
      [
        [100, 25],
        [0, 50],
      ],
    );

    expect(links).toEqual([
      { source: 'Origen: PP', target: 'Destino: PP', value: 100 },
      { source: 'Origen: PP', target: 'Destino: PSOE', value: 25 },
      { source: 'Origen: PSOE', target: 'Destino: PSOE', value: 50 },
    ]);
  });
});
