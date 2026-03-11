/**
 * docxBuilder.ts — Builds a DOCX file buffer from an AssembledReport.
 *
 * Uses the `docx` library (https://docx.js.org) to generate a Word-compatible document.
 * Supports Hebrew (RTL) text, headings, paragraphs, and embedded images.
 *
 * RTL handling notes:
 *  - Each paragraph must have bidirectional text support enabled
 *  - Run text uses RTL rendering when bidi is set
 *  - Images are embedded as base64-decoded buffers via expo-file-system
 */
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  ImageRun,
  AlignmentType,
  BorderStyle,
  ShadingType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  PageOrientation,
} from 'docx';
import * as FileSystem from 'expo-file-system';
import { AssembledReport, FindingWithImages } from '../../types/domain';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function rtlParagraph(text: string, opts: {
  bold?: boolean;
  size?: number;
  color?: string;
  heading?: typeof HeadingLevel[keyof typeof HeadingLevel];
  spacing?: { before?: number; after?: number };
} = {}): Paragraph {
  return new Paragraph({
    heading: opts.heading,
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: opts.spacing,
    children: [
      new TextRun({
        text,
        bold: opts.bold,
        size: opts.size,
        color: opts.color,
        rightToLeft: true,
      }),
    ],
  });
}

function dividerParagraph(): Paragraph {
  return new Paragraph({
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, space: 1, color: '1e3a5f' },
    },
    spacing: { before: 80, after: 80 },
    children: [],
  });
}

function labelValueParagraph(label: string, value: string): Paragraph {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { after: 60 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, rightToLeft: true, color: '6b7280' }),
      new TextRun({ text: value, rightToLeft: true }),
    ],
  });
}

async function loadImageBuffer(localUri: string): Promise<Uint8Array | null> {
  try {
    const info = await FileSystem.getInfoAsync(localUri);
    if (!info.exists) return null;
    const base64 = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

function formatCurrency(amount: number, currency = 'ILS'): string {
  return `₪${amount.toLocaleString('he-IL')}`;
}

// ─────────────────────────────────────────────
// Finding section builder
// ─────────────────────────────────────────────

async function buildFindingSection(finding: FindingWithImages, index: number): Promise<Paragraph[]> {
  const paragraphs: Paragraph[] = [];

  // Finding title
  paragraphs.push(
    new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.RIGHT,
      spacing: { before: 200, after: 80 },
      children: [
        new TextRun({
          text: `${index}. ${finding.title}`,
          bold: true,
          size: 26,
          color: '1e3a5f',
          rightToLeft: true,
        }),
      ],
    })
  );

  // Severity badge (text)
  const severityLabel = { high: 'חומרה גבוהה', medium: 'חומרה בינונית', low: 'חומרה נמוכה' }[finding.severity];
  const severityColor = { high: 'dc2626', medium: 'd97706', low: '059669' }[finding.severity];
  paragraphs.push(
    new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.RIGHT,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `● ${severityLabel}`,
          bold: true,
          color: severityColor,
          rightToLeft: true,
          size: 20,
        }),
      ],
    })
  );

  // Description
  if (finding.description) {
    paragraphs.push(
      rtlParagraph('תיאור הממצא:', { bold: true, color: '374151' })
    );
    paragraphs.push(
      new Paragraph({
        bidirectional: true,
        alignment: AlignmentType.RIGHT,
        spacing: { after: 120 },
        children: [new TextRun({ text: finding.description, rightToLeft: true })],
      })
    );
  }

  // Images
  for (const img of finding.images) {
    const imgBuffer = await loadImageBuffer(img.localUri);
    if (imgBuffer) {
      paragraphs.push(
        new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, after: 60 },
          children: [
            new ImageRun({
              data: imgBuffer,
              transformation: { width: 400, height: 280 },
              type: 'jpg',
            }),
          ],
        })
      );
      if (img.caption) {
        paragraphs.push(
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({ text: img.caption, italics: true, color: '6b7280', size: 18, rightToLeft: true }),
            ],
          })
        );
      }
    }
  }

  // Standard quote
  if (finding.standardQuoteText) {
    paragraphs.push(rtlParagraph('התייחסות לתקן:', { bold: true, color: '374151' }));
    paragraphs.push(
      new Paragraph({
        bidirectional: true,
        alignment: AlignmentType.RIGHT,
        spacing: { after: 120 },
        shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'f0f4ff' },
        children: [
          new TextRun({ text: finding.standardQuoteText, italics: true, color: '374151', rightToLeft: true }),
        ],
      })
    );
  }

  // Conclusion
  if (finding.conclusion) {
    paragraphs.push(rtlParagraph('מסקנה והמלצה:', { bold: true, color: '374151' }));
    paragraphs.push(
      new Paragraph({
        bidirectional: true,
        alignment: AlignmentType.RIGHT,
        spacing: { after: 120 },
        children: [new TextRun({ text: finding.conclusion, rightToLeft: true })],
      })
    );
  }

  // Repair cost
  if (finding.repairCostEstimate) {
    paragraphs.push(
      new Paragraph({
        bidirectional: true,
        alignment: AlignmentType.RIGHT,
        spacing: { after: 160 },
        children: [
          new TextRun({ text: 'עלות תיקון משוערת: ', bold: true, color: '059669', rightToLeft: true }),
          new TextRun({ text: formatCurrency(finding.repairCostEstimate, finding.repairCostCurrency), bold: true, color: '059669', rightToLeft: true }),
        ],
      })
    );
  }

  return paragraphs;
}

// ─────────────────────────────────────────────
// Main builder
// ─────────────────────────────────────────────

export async function buildDocxBuffer(report: AssembledReport): Promise<Uint8Array> {
  const { project, areas, settings } = report;
  const sections: Paragraph[] = [];

  // Cover / Header
  if (settings?.companyName) {
    sections.push(rtlParagraph(settings.companyName, { bold: true, size: 28, color: '1e3a5f', spacing: { after: 80 } }));
  }

  sections.push(
    rtlParagraph(settings?.reportTitle ?? 'דוח בדיקת בניין', {
      bold: true,
      size: 40,
      color: '1e3a5f',
      spacing: { before: 200, after: 200 },
    })
  );

  sections.push(dividerParagraph());

  // Project metadata
  sections.push(labelValueParagraph('לקוח', project.clientName));
  sections.push(labelValueParagraph('כתובת הנכס', project.propertyAddress));
  sections.push(
    labelValueParagraph(
      'תאריך בדיקה',
      new Date(project.inspectionDate).toLocaleDateString('he-IL')
    )
  );
  sections.push(labelValueParagraph('בודק', project.inspectorName));
  if (project.notes) {
    sections.push(labelValueParagraph('הערות', project.notes));
  }

  sections.push(dividerParagraph());

  // Intro
  sections.push(
    new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.RIGHT,
      spacing: { before: 160, after: 240 },
      children: [
        new TextRun({
          text: 'להלן סיכום ממצאי הבדיקה שנערכה בנכס הנ"ל. הממצאים מסודרים לפי אזורים ומדורגים לפי חומרה.',
          color: '374151',
          rightToLeft: true,
        }),
      ],
    })
  );

  // Areas and Findings
  for (const area of areas) {
    if (area.findings.length === 0) continue;

    // Area heading
    sections.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        bidirectional: true,
        alignment: AlignmentType.RIGHT,
        spacing: { before: 400, after: 200 },
        children: [
          new TextRun({
            text: area.name,
            bold: true,
            color: 'ffffff',
            rightToLeft: true,
            size: 32,
          }),
        ],
        shading: { type: ShadingType.CLEAR, color: 'auto', fill: '1e3a5f' },
      })
    );

    let findingIndex = 1;
    for (const finding of area.findings) {
      const findingParagraphs = await buildFindingSection(finding, findingIndex++);
      sections.push(...findingParagraphs);
    }
  }

  // Footer / Summary
  sections.push(dividerParagraph());
  const totalFindings = areas.reduce((sum, a) => sum + a.findings.length, 0);
  const totalCost = areas
    .flatMap((a) => a.findings)
    .reduce((sum, f) => sum + (f.repairCostEstimate ?? 0), 0);

  sections.push(
    rtlParagraph(`סיכום: נמצאו ${totalFindings} ממצאים בסה"כ.`, {
      bold: true,
      size: 24,
      color: '1e3a5f',
      spacing: { before: 200, after: 80 },
    })
  );
  if (totalCost > 0) {
    sections.push(
      rtlParagraph(`עלות תיקון כוללת משוערת: ${formatCurrency(totalCost)}`, {
        bold: true,
        size: 24,
        color: '059669',
        spacing: { after: 200 },
      })
    );
  }

  sections.push(
    new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.RIGHT,
      spacing: { before: 400 },
      children: [
        new TextRun({
          text: `תאריך הפקת הדוח: ${new Date().toLocaleDateString('he-IL')}`,
          color: '9ca3af',
          size: 18,
          rightToLeft: true,
        }),
      ],
    })
  );

  // Build document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sections,
      },
    ],
  });

  return Packer.toBuffer(doc);
}
