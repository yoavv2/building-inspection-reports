/**
 * exportService.ts — DOCX export orchestration for React Native / Expo.
 *
 * Pipeline:
 *   projectId → assembleReport → buildDocx → saveToFileSystem → share
 *
 * The DOCX is built using the `docx` npm library running on-device.
 * All steps work fully offline.
 */
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { assembleReport } from '../../services/reportAssembler';
import { buildDocxBuffer } from './docxBuilder';
import { AssembledReport } from '../../types/domain';

const EXPORT_DIR = `${FileSystem.documentDirectory}exports/`;

async function ensureExportDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(EXPORT_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(EXPORT_DIR, { intermediates: true });
  }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z\u0590-\u05FF\d\s-]/g, '').trim().replace(/\s+/g, '-');
}

export interface ExportResult {
  filePath: string;
  warnings: ExportWarning[];
}

export interface ExportWarning {
  type: 'no_conclusion' | 'no_cost' | 'no_images' | 'missing_image_file';
  findingId?: string;
  findingTitle?: string;
  message: string;
}

export async function exportReport(projectId: string): Promise<ExportResult> {
  const report = await assembleReport(projectId);
  const warnings = collectWarnings(report);
  const buffer = await buildDocxBuffer(report);

  await ensureExportDir();
  const clientName = sanitizeFilename(report.project.clientName) || 'דוח';
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${clientName}-${timestamp}.docx`;
  const filePath = EXPORT_DIR + filename;

  // Write buffer to file system
  const base64 = Buffer.from(buffer).toString('base64');
  await FileSystem.writeAsStringAsync(filePath, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Share the file
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(filePath, {
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      dialogTitle: `שתף דוח — ${report.project.clientName}`,
      UTI: 'org.openxmlformats.wordprocessingml.document',
    });
  }

  return { filePath, warnings };
}

function collectWarnings(report: AssembledReport): ExportWarning[] {
  const warnings: ExportWarning[] = [];
  for (const area of report.areas) {
    for (const finding of area.findings) {
      if (!finding.conclusion) {
        warnings.push({
          type: 'no_conclusion',
          findingId: finding.id,
          findingTitle: finding.title,
          message: `ממצא "${finding.title}" — חסרה מסקנה`,
        });
      }
      if (!finding.repairCostEstimate) {
        warnings.push({
          type: 'no_cost',
          findingId: finding.id,
          findingTitle: finding.title,
          message: `ממצא "${finding.title}" — חסרה עלות תיקון`,
        });
      }
      if (finding.images.length === 0) {
        warnings.push({
          type: 'no_images',
          findingId: finding.id,
          findingTitle: finding.title,
          message: `ממצא "${finding.title}" — אין תמונות`,
        });
      }
    }
  }
  return warnings;
}
