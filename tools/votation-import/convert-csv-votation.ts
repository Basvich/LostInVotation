import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { importCsvVotation } from '../../src/app/core/importers/csv-votation-importer';

const DEFAULT_OUTPUT_DIR = path.resolve('src/assets/data/votations/json');

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      file: { type: 'string' },
      date: { type: 'string' },
      zone: { type: 'string' },
      name: { type: 'string' },
      'total-votes': { type: 'string' },
      output: { type: 'string' },
      compact: { type: 'boolean' },
      help: { type: 'boolean' },
    },
    strict: true,
  });

  if (values.help) {
    console.info('Usage: npm run import:votations:csv -- --file <csv> --date <YYYY-MM> --zone <zone> --name <name> --total-votes <count> [--output <dir>] [--compact]');
    console.info(`Default output directory: ${DEFAULT_OUTPUT_DIR}`);
    return;
  }
  if (!values.file || !values.date || !values.zone || !values.name || !values['total-votes']) {
    throw new Error('Required options: --file, --date, --zone, --name and --total-votes (see --help)');
  }
  if (path.extname(values.file).toLowerCase() !== '.csv') {
    throw new Error('--file must be a CSV file');
  }
  if (!/^\d+$/.test(values['total-votes'])) {
    throw new Error('--total-votes must be a non-negative integer without separators');
  }

  const sourceFile = path.resolve(values.file);
  const rawContent = await readFile(sourceFile, 'utf8');
  const result = importCsvVotation(rawContent, {
    date: values.date,
    zone: values.zone,
    name: values.name,
    totalVotes: Number(values['total-votes']),
  });
  const outputDir = path.resolve(values.output ?? DEFAULT_OUTPUT_DIR);
  const outputFile = path.join(outputDir, `${path.basename(sourceFile, path.extname(sourceFile))}.json`);
  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(result, null, values.compact ? 0 : 2)}\n`, 'utf8');
  console.info(`Converted ${path.basename(sourceFile)} -> ${outputFile}`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Import failed: ${message}`);
  process.exitCode = 1;
});
