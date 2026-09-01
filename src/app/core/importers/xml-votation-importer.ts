import { XMLParser } from 'fast-xml-parser';
import { IVotesToParty, IVotationResult } from '../models/party';
import { ImportSourceMetadata, VotationImporter } from './votation-importer';

type NumericValue = string | number | undefined;

interface PartidoXml {
  id_partido?: NumericValue;
  nombre?: string;
  votos_numero?: NumericValue;
}

interface EscrutinioSitioXml {
  escrutinio_sitio?: {
    convocatoria?: NumericValue;
    nombre_lugar?: string;
    nombre_sitio?: string;
    votos?: {
      contabilizados?: {
        cantidad?: NumericValue;
      };
    };
    resultados?: {
      partido?: PartidoXml | PartidoXml[];
    };
  };
}

const parser = new XMLParser({
  trimValues: true,
  parseTagValue: false,
  ignoreAttributes: true,
});

export class XmlVotationImporter implements VotationImporter {
  readonly format = 'xml';

  supportsFile(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.xml');
  }

  toVotationResult(rawContent: string, metadata?: ImportSourceMetadata): IVotationResult {
    const parsed = parser.parse(rawContent) as EscrutinioSitioXml;
    const root = parsed.escrutinio_sitio;

    if (!root) {
      throw new Error(this.buildError('Missing escrutinio_sitio root node', metadata));
    }

    const year = this.readInteger(root.convocatoria, 'convocatoria', metadata);
    const locationName = this.readText(root.nombre_lugar, 'nombre_lugar', metadata);
    const zoneLabel = this.readText(root.nombre_sitio, 'nombre_sitio', metadata);
    const totalVotes = this.readInteger(
      root.votos?.contabilizados?.cantidad,
      'votos.contabilizados.cantidad',
      metadata,
    );

    const partyNodes = root.resultados?.partido;
    const parties = Array.isArray(partyNodes)
      ? partyNodes
      : partyNodes
        ? [partyNodes]
        : [];

    if (parties.length === 0) {
      throw new Error(this.buildError('No parties found under resultados.partido', metadata));
    }

    const votesToParties: IVotesToParty[] = parties.map((partyNode) => {
      const name = this.readText(partyNode.nombre, 'partido.nombre', metadata);
      return {
        numberOfVotes: this.readInteger(partyNode.votos_numero, 'partido.votos_numero', metadata),
        // `id_partido` is only a per-convocatoria correlative number reused across different parties
        // in different elections, so it cannot identify the same party across votations. The
        // slugified party name is used instead as a stable identifier to match parties over time.
        party: {
          id: this.slugify(name),
          name,
        },
      };
    });

    const totalVotesToParties = votesToParties.reduce(
      (accumulator, partyVotes) => accumulator + partyVotes.numberOfVotes,
      0,
    );

    return {
      votation: {
        date: new Date(Date.UTC(year, 0, 1)),
        name: `${locationName} ${year}`,
        zone: this.slugify(zoneLabel),
      },
      votesToParties,
      totalVotes,
      totalVotesToParties,
    };
  }

  private readInteger(
    value: NumericValue,
    fieldName: string,
    metadata?: ImportSourceMetadata,
  ): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      throw new Error(this.buildError(`Invalid numeric value in ${fieldName}`, metadata));
    }

    return parsed;
  }

  private readText(value: unknown, fieldName: string, metadata?: ImportSourceMetadata): string {
    const text = String(value ?? '').trim();
    if (!text) {
      throw new Error(this.buildError(`Missing text value in ${fieldName}`, metadata));
    }

    return text;
  }

  private slugify(value: string): string {
    const withoutAccents = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return withoutAccents
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private buildError(message: string, metadata?: ImportSourceMetadata): string {
    return metadata?.sourceFileName ? `${message} in ${metadata.sourceFileName}` : message;
  }
}
