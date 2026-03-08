import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { LocalFileSaveAdapter, FileSaveResult } from '../types';

const sanitizeFileName = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .slice(0, 80) || 'report';

export class LocalFileSystemSaveAdapter implements LocalFileSaveAdapter {
  constructor(private readonly outputDir: string = 'exports') {}

  async save(projectName: string, bytes: Uint8Array): Promise<FileSaveResult> {
    await mkdir(this.outputDir, { recursive: true });

    const safeName = sanitizeFileName(projectName);
    const fileName = `${safeName}-${Date.now()}.docx`;
    const filePath = join(this.outputDir, fileName);
    await writeFile(filePath, bytes);

    return {
      filePath,
      shareUri: `file://${filePath}`,
    };
  }
}
