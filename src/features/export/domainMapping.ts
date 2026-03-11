import type { AssembledProjectReport } from '../../services/reportAssembler';
import { DomainExportProject } from './types';

export const mapAssembledReportToDomain = (
  report: AssembledProjectReport,
): DomainExportProject => ({
  id: report.project.id,
  name: report.project.name,
  clientName: report.project.clientName,
  inspectionDate: report.project.inspectionDate,
  areas: report.areas.map((area) => ({
    id: area.id,
    title: area.title,
    summary: area.summary,
    findings: area.findings.map((finding) => ({
      id: finding.id,
      title: finding.title,
      description: finding.description,
      conclusion: finding.conclusion,
      estimatedCost: finding.estimatedCost,
      images: finding.images.map((image) => ({
        id: image.id,
        path: image.path,
        caption: image.caption,
      })),
    })),
  })),
});
