import { existsSync } from 'node:fs';
import { ExportProjectVM, ExportWarning } from '../../types/exportViewModel';
import { DomainExportProject } from './types';

const notProvided = 'לא סופק';

export const mapDomainToExportViewModel = (
  domain: DomainExportProject,
): { viewModel: ExportProjectVM; warnings: ExportWarning[] } => {
  const warnings: ExportWarning[] = [];

  const viewModel: ExportProjectVM = {
    id: domain.id,
    name: domain.name,
    clientName: domain.clientName ?? notProvided,
    inspectionDate: domain.inspectionDate ?? notProvided,
    areas: domain.areas.map((area) => ({
      id: area.id,
      title: area.title,
      summary: area.summary ?? '',
      findings: area.findings.map((finding) => {
        if (!finding.conclusion?.trim()) {
          warnings.push({
            code: 'MISSING_CONCLUSION',
            contextId: finding.id,
            messageHe: `לא הוזנה מסקנה עבור ליקוי "${finding.title}".`,
          });
        }

        if (!finding.estimatedCost?.trim()) {
          warnings.push({
            code: 'MISSING_COST',
            contextId: finding.id,
            messageHe: `לא הוזנה עלות משוערת עבור ליקוי "${finding.title}".`,
          });
        }

        if (!finding.images.length) {
          warnings.push({
            code: 'MISSING_IMAGE',
            contextId: finding.id,
            messageHe: `לא צורפה תמונה לליקוי "${finding.title}".`,
          });
        }

        const images = finding.images
          .filter((image) => {
            const exists = existsSync(image.path);
            if (!exists) {
              warnings.push({
                code: 'MISSING_IMAGE_FILE',
                contextId: image.id,
                messageHe: `קובץ התמונה לא נמצא בנתיב "${image.path}".`,
              });
            }
            return exists;
          })
          .map((image) => ({
            id: image.id,
            path: image.path,
            caption: image.caption,
          }));

        return {
          id: finding.id,
          title: finding.title,
          description: finding.description ?? '',
          conclusion: finding.conclusion ?? notProvided,
          estimatedCost: finding.estimatedCost ?? notProvided,
          images,
        };
      }),
    })),
  };

  return { viewModel, warnings };
};
