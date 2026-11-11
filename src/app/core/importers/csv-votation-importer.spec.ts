import { describe, expect, it } from 'vitest';
import { importCsvVotation } from './csv-votation-importer';

const header = 'Tipo convocatoria;Id convocatoria;ccaa;prv;circunscripcion;municipio;distrito;candidatura;votos;votos validos;votos censo;votos candidaturas;tipo de representante;representantes';
const first = '2;202307;;;;;;PARTIDO POPULAR;8.160.837;33,06;21,78;33,33;Diputados;137';
const second = '2;202307;;;;;;"PARTIDO; ""ESPAÑOL""";1.234;0,01;0;0,01;Diputados;0';
const metadata = { date: '2023-07', zone: 'España', name: 'Congreso 2023', totalVotes: 8163000 };

describe('importCsvVotation', () => {
  it('converts quoted CSV and Spanish vote counts to the result shape', () => {
    const result = importCsvVotation(`\uFEFF${header}\r\n${first}\r\n${second}\r\n`, metadata);

    expect(result).toEqual({
      votation: { date: new Date('2023-07-01T00:00:00.000Z'), name: 'Congreso 2023', zone: 'espana' },
      votesToParties: [
        { numberOfVotes: 8160837, party: { id: 'partido-popular', name: 'PARTIDO POPULAR' } },
        { numberOfVotes: 1234, party: { id: 'partido-espanol', name: 'PARTIDO; "ESPAÑOL"' } },
      ],
      totalVotes: 8163000,
      totalVotesToParties: 8162071,
    });
  });

  it('rejects invalid metadata and totals below the sum of party votes', () => {
    const csv = `${header}\n${first}`;
    expect(() => importCsvVotation(csv, { ...metadata, date: '2023-13' })).toThrow('Date must');
    expect(() => importCsvVotation(csv, { ...metadata, zone: ' ' })).toThrow('zone');
    expect(() => importCsvVotation(csv, { ...metadata, totalVotes: 1 })).toThrow('at least');
  });

  it('rejects malformed or ambiguous input instead of losing votes', () => {
    expect(() => importCsvVotation('candidatura;votos\nA;10', metadata)).toThrow('CSV column');
    expect(() => importCsvVotation(`${header}\n${first.replace('8.160.837', '8.16')}`, metadata)).toThrow('vote count');
    expect(() => importCsvVotation(`${header}\n${first}\n${first}`, metadata)).toThrow('duplicate');
    expect(() => importCsvVotation(`${header}\n${first}\n${second.replace('202307', '201911')}`, metadata)).toThrow('scope');
    expect(() => importCsvVotation(`${header}\n${first.replace('8.160.837', '')}`, metadata)).toThrow('vote count');
  });
});
