import type { AssembledProjectReport } from '../../services/reportAssembler';
import { ExportProjectVM, ExportWarning } from '../../types/exportViewModel';

export interface ExportDataFetcher {
  fetch(projectId: string): Promise<AssembledProjectReport | null>;
}

export interface DomainExportProject {
  id: string;
  name: string;
  clientName?: string;
  inspectionDate?: string;
  areas: Array<{
    id: string;
    title: string;
    summary?: string;
    findings: Array<{
      id: string;
      title: string;
      description?: string;
      conclusion?: string;
      estimatedCost?: string;
      images: Array<{
        id: string;
        path: string;
        caption?: string;
      }>;
    }>;
  }>;
}

export interface ExportDocBuilder {
  build(viewModel: ExportProjectVM): Promise<Uint8Array>;
}

export interface FileSaveResult {
  filePath: string;
  shareUri: string;
}

export interface LocalFileSaveAdapter {
  save(projectName: string, bytes: Uint8Array): Promise<FileSaveResult>;
}

export interface ExportResult {
  filePath: string;
  shareUri: string;
  viewModel: ExportProjectVM;
  warnings: ExportWarning[];
}
