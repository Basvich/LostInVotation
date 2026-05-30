import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { findImporterForFile } from '../../src/app/core/importers/votation-importer-registry';

interface CliOptions {
  inputDir: string;
  outputDir: string;
  file?: string;
  pretty: boolean;
}

const DEFAULT_INPUT_DIR = path.resolve('src/assets/data/votations');
const DEFAULT_OUTPUT_DIR = path.resolve('src/assets/data/votations/json');

async function main(): Promise<void> {
  const options = parseCliOptions(process.argv.slice(2));
  const filesToProcess = options.file
    ? [path.resolve(options.file)]
    : await listFilesRecursively(options.inputDir);

  const convertedFiles: string[] = [];

  for (const sourceFilePath of filesToProcess) {
    const importer = findImporterForFile(sourceFilePath);
    if (!importer) {
      continue;
    }

    const sourceContents = await readFile(sourceFilePath, 'utf8');
    const result = importer.toVotationResult(sourceContents, {
      sourceFileName: path.basename(sourceFilePath),
      sourcePath: sourceFilePath,
    });

    const outputFileName = `${path.basename(sourceFilePath, path.extname(sourceFilePath))}.json`;
    const outputFilePath = path.join(options.outputDir, outputFileName);

    await mkdir(path.dirname(outputFilePath), { recursive: true });
    const spacing = options.pretty ? 2 : 0;
    await writeFile(outputFilePath, `${JSON.stringify(result, null, spacing)}\n`, 'utf8');

    convertedFiles.push(outputFilePath);
    console.info(`Converted ${path.basename(sourceFilePath)} -> ${outputFilePath}`);
  }

  if (convertedFiles.length === 0) {
    throw new Error(
      `No supported files were found in ${options.inputDir}. Add supported files (currently .xml) or pass --file.`,
    );
  }
}

function parseCliOptions(args: string[]): CliOptions {
  const options: CliOptions = {
    inputDir: DEFAULT_INPUT_DIR,
    outputDir: DEFAULT_OUTPUT_DIR,
    pretty: true,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const value = args[index + 1];

    if (arg === '--input' && value) {
      options.inputDir = path.resolve(value);
      index += 1;
      continue;
    }

    if (arg === '--output' && value) {
      options.outputDir = path.resolve(value);
      index += 1;
      continue;
    }

    if (arg === '--file' && value) {
      options.file = path.resolve(value);
      index += 1;
      continue;
    }

    if (arg === '--compact') {
      options.pretty = false;
      continue;
    }

    if (arg === '--help') {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

async function listFilesRecursively(dirPath: string): Promise<string[]> {
  const dirEntries = await readdir(dirPath, { withFileTypes: true });
  const filesByDirectory = await Promise.all(
    dirEntries.map(async (entry) => {
      const resolvedPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        return listFilesRecursively(resolvedPath);
      }

      return [resolvedPath];
    }),
  );

  return filesByDirectory.flat();
}

function printHelp(): void {
  console.info('Votation importer CLI');
  console.info('');
  console.info('Usage: npm run import:votations -- [options]');
  console.info('');
  console.info('Options:');
  console.info(`  --input <dir>    Input directory (default: ${DEFAULT_INPUT_DIR})`);
  console.info(`  --output <dir>   Output directory (default: ${DEFAULT_OUTPUT_DIR})`);
  console.info('  --file <path>    Convert only one file (ignores --input)');
  console.info('  --compact        Write minified JSON');
  console.info('  --help           Show this message');
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Import failed: ${message}`);
  process.exitCode = 1;
});
