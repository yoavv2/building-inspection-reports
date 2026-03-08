export interface ExportImageVM {
  id: string;
  path: string;
  caption?: string;
}

export interface ExportFindingVM {
  id: string;
  title: string;
  description: string;
  conclusion: string;
  estimatedCost: string;
  images: ExportImageVM[];
}

export interface ExportAreaVM {
  id: string;
  title: string;
  summary: string;
  findings: ExportFindingVM[];
}

export interface ExportProjectVM {
  id: string;
  name: string;
  clientName: string;
  inspectionDate: string;
  areas: ExportAreaVM[];
}

export interface ExportWarning {
  code:
    | 'MISSING_CONCLUSION'
    | 'MISSING_COST'
    | 'MISSING_IMAGE'
    | 'MISSING_IMAGE_FILE';
  messageHe: string;
  contextId: string;
}
