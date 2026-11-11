import { parse } from 'csv-parse/sync';
import { IVotationResult } from '../models/party';
import { slugify } from './slugify';

export interface CsvVotationMetadata {
  date: string;
  zone: string;
  name: string;
  totalVotes: number;
}

export function importCsvVotation(rawContent: string, metadata: CsvVotationMetadata): IVotationResult {
  const dateMatch = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(metadata.date);
  if (!dateMatch || Number(dateMatch[1]) < 1000) {
    throw new Error('Date must be in YYYY-MM format with a year from 1000 to 9999');
  }
  const zone = slugify(metadata.zone.trim());
  const name = metadata.name.trim();
  if (!zone || !name) {
    throw new Error('A valid zone and a non-empty name are required');
  }
  if (!Number.isSafeInteger(metadata.totalVotes) || metadata.totalVotes < 0) {
    throw new Error('Total votes must be a non-negative safe integer');
  }

  const rows = parse(rawContent, { delimiter: ';', bom: true, trim: true, skip_empty_lines: true });
  const header = rows[0];
  if (!header) {
    throw new Error('CSV is empty');
  }
  const requiredColumns = [
    'Tipo convocatoria', 'Id convocatoria', 'ccaa', 'prv', 'circunscripcion',
    'municipio', 'distrito', 'candidatura', 'votos', 'tipo de representante',
  ];
  const indices = requiredColumns.map((column) => {
    const index = header.indexOf(column);
    if (index < 0 || header.lastIndexOf(column) !== index) {
      throw new Error(`Missing or duplicate CSV column: ${column}`);
    }
    return index;
  });
  if (rows.length === 1) {
    throw new Error('CSV contains no candidatures');
  }

  const scopeIndices = [...indices.slice(0, 7), indices[9]];
  const scope = scopeIndices.map((index) => rows[1][index]);
  const ids = new Set<string>();
  const votesToParties = rows.slice(1).map((row, index) => {
    const rowNumber = index + 2;
    if (scopeIndices.some((column, i) => row[column] !== scope[i])) {
      throw new Error(`Different election or geographical scope in CSV row ${rowNumber}`);
    }
    const partyName = row[indices[7]].trim();
    const id = slugify(partyName);
    if (!id || ids.has(id)) {
      throw new Error(`Empty or duplicate candidature identifier in CSV row ${rowNumber}`);
    }
    ids.add(id);
    const rawVotes = row[indices[8]].trim();
    if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)$/.test(rawVotes)) {
      throw new Error(`Invalid vote count in CSV row ${rowNumber}`);
    }
    const numberOfVotes = Number(rawVotes.replace(/\./g, ''));
    if (!Number.isSafeInteger(numberOfVotes)) {
      throw new Error(`Vote count exceeds the safe integer range in CSV row ${rowNumber}`);
    }
    return { numberOfVotes, party: { id, name: partyName } };
  });

  const totalVotesToParties = votesToParties.reduce((sum, entry) => sum + entry.numberOfVotes, 0);
  if (!Number.isSafeInteger(totalVotesToParties) || totalVotesToParties > metadata.totalVotes) {
    throw new Error('Total votes must be at least the sum of votes to candidatures');
  }

  return {
    votation: {
      date: new Date(Date.UTC(Number(dateMatch[1]), Number(dateMatch[2]) - 1, 1)),
      name,
      zone,
    },
    votesToParties,
    totalVotes: metadata.totalVotes,
    totalVotesToParties,
  };
}
