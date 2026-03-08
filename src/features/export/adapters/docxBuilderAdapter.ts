import { ExportDocBuilder } from '../types';
import { ExportProjectVM } from '../../../types/exportViewModel';

/**
 * Stub adapter for DOCX generation.
 * Replace with a real DOCX library integration in production.
 */
export class JsonBackedDocxBuilderAdapter implements ExportDocBuilder {
  async build(viewModel: ExportProjectVM): Promise<Uint8Array> {
    const payload = {
      format: 'docx-stub',
      generatedAt: new Date().toISOString(),
      project: viewModel,
    };

    return new TextEncoder().encode(JSON.stringify(payload, null, 2));
  }
}
