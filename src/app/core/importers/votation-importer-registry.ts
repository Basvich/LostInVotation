import { VotationImporter } from './votation-importer';
import { XmlVotationImporter } from './xml-votation-importer';

export const defaultVotationImporters: readonly VotationImporter[] = [new XmlVotationImporter()];

export function findImporterForFile(
  fileName: string,
  importers: readonly VotationImporter[] = defaultVotationImporters,
): VotationImporter | undefined {
  return importers.find((importer) => importer.supportsFile(fileName));
}
