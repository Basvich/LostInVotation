import { IVotationResult } from '../models/party';

export interface ImportSourceMetadata {
  sourceFileName?: string;
  sourcePath?: string;
}

export interface VotationImporter {
  readonly format: string;
  supportsFile(fileName: string): boolean;
  toVotationResult(rawContent: string, metadata?: ImportSourceMetadata): IVotationResult;
}
