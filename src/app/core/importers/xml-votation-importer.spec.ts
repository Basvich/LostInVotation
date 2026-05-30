import { describe, expect, it } from 'vitest';
import { XmlVotationImporter } from './xml-votation-importer';

describe('XmlVotationImporter', () => {
  it('should map xml to IVotationResult shape', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<escrutinio_sitio>
  <nombre_lugar>Parlamento</nombre_lugar>
  <nombre_sitio>Andalucía</nombre_sitio>
  <convocatoria>2018</convocatoria>
  <votos>
    <contabilizados>
      <cantidad>100</cantidad>
    </contabilizados>
  </votos>
  <resultados>
    <partido>
      <id_partido>22</id_partido>
      <nombre>PSOE-A</nombre>
      <votos_numero>60</votos_numero>
    </partido>
    <partido>
      <id_partido>20</id_partido>
      <nombre>PP</nombre>
      <votos_numero>40</votos_numero>
    </partido>
  </resultados>
</escrutinio_sitio>`;

    const importer = new XmlVotationImporter();

    const result = importer.toVotationResult(xml, { sourceFileName: 'sample.xml' });

    expect(result.votation.name).toBe('Parlamento 2018');
    expect(result.votation.zone).toBe('andalucia');
    expect(result.votation.date.toISOString()).toBe('2018-01-01T00:00:00.000Z');
    expect(result.totalVotes).toBe(100);
    expect(result.totalVotesToParties).toBe(100);
    expect(result.votesToParties).toHaveLength(2);
    expect(result.votesToParties[0]).toMatchObject({
      numberOfVotes: 60,
      party: { id: '22', name: 'PSOE-A' },
    });
  });

  it('should throw when there are no parties', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<escrutinio_sitio>
  <nombre_lugar>Parlamento</nombre_lugar>
  <nombre_sitio>Andalucía</nombre_sitio>
  <convocatoria>2018</convocatoria>
  <votos>
    <contabilizados>
      <cantidad>100</cantidad>
    </contabilizados>
  </votos>
  <resultados />
</escrutinio_sitio>`;

    const importer = new XmlVotationImporter();

    expect(() => importer.toVotationResult(xml, { sourceFileName: 'broken.xml' })).toThrow(
      'No parties found under resultados.partido in broken.xml',
    );
  });
});
