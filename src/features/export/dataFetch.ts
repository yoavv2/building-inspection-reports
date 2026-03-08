import { ReportAssemblerService } from '../../services/reportAssembler';
import { ExportDataFetcher } from './types';

export class AssemblerBackedExportDataFetcher implements ExportDataFetcher {
  constructor(private readonly assembler: ReportAssemblerService) {}

  fetch(projectId: string) {
    return this.assembler.loadProjectReport(projectId);
  }
}
