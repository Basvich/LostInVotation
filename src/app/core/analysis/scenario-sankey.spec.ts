import { describe, expect, it } from 'vitest';
import { IParty } from '../models/party';
import { buildScenarioSankeyColors, buildScenarioSankeyLinks } from './scenario-sankey';

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

  describe('buildScenarioSankeyColors', () => {
    it('assigns the same color to both sides, including synthetic and one-sided parties', () => {
      const parties = [pp, psoe, { id: 'not-voting', name: 'No Votando' }, { id: 'others', name: 'Otros partidos' }];
      const colors = buildScenarioSankeyColors(parties);
      for (const [index, party] of parties.entries()) {
        expect(colors[index * 2].name).toBe(`Origen: ${party.name}`);
        expect(colors[index * 2 + 1].name).toBe(`Destino: ${party.name}`);
        expect(colors[index * 2].value).toBe(colors[index * 2 + 1].value);
      }
      expect(new Set(colors.map(({ value }) => value)).size).toBe(parties.length);
      expect(buildScenarioSankeyColors(parties)).toEqual(colors);
    });

    it('does not repeat colors when the party count exceeds a typical categorical palette', () => {
      const parties = Array.from({ length: 30 }, (_, index) => ({ id: `${index}`, name: `Partido ${index}` }));
      const colors = buildScenarioSankeyColors(parties);
      expect(new Set(colors.map(({ value }) => value)).size).toBe(parties.length);
    });
  });
});
