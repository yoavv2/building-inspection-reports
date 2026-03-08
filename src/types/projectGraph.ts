export interface ProjectRecord {
  id: string;
  name: string;
  clientName?: string;
  inspectionDate?: string;
  orderIndex: number;
}

export interface AreaRecord {
  id: string;
  projectId: string;
  title: string;
  summary?: string;
  orderIndex: number;
}

export interface FindingRecord {
  id: string;
  areaId: string;
  title: string;
  description?: string;
  conclusion?: string;
  estimatedCost?: string;
  orderIndex: number;
}

export interface ImageRecord {
  id: string;
  findingId: string;
  path: string;
  caption?: string;
  orderIndex: number;
}

export interface PersistedProjectGraph {
  project: ProjectRecord;
  areas: AreaRecord[];
  findings: FindingRecord[];
  images: ImageRecord[];
}

export interface ProjectGraphRepository {
  loadPersistedProjectGraph(projectId: string): Promise<PersistedProjectGraph | null>;
}
