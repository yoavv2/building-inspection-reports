import { mapAssembledReportToDomain } from './domainMapping';
import { mapDomainToExportViewModel } from './viewModelMapping';
import { ExportDataFetcher, ExportDocBuilder, ExportResult, LocalFileSaveAdapter } from './types';

export class ExportPipeline {
  constructor(
    private readonly fetcher: ExportDataFetcher,
    private readonly docBuilder: ExportDocBuilder,
    private readonly fileSaver: LocalFileSaveAdapter,
  ) {}

  async run(projectId: string): Promise<ExportResult> {
    const assembled = await this.fetcher.fetch(projectId);
    if (!assembled) {
      throw new Error(`Project ${projectId} not found`);
    }

    const domain = mapAssembledReportToDomain(assembled);
    const { viewModel, warnings } = mapDomainToExportViewModel(domain);

    const docBytes = await this.docBuilder.build(viewModel);
    const { filePath, shareUri } = await this.fileSaver.save(viewModel.name, docBytes);

    return { filePath, shareUri, warnings, viewModel };
  }
}

export * from './types';
