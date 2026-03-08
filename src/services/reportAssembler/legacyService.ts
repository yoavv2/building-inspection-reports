/**
 * Legacy ReportAssemblerService — preserved for backwards compatibility with existing tests.
 */
import {
  AreaRecord,
  FindingRecord,
  ImageRecord,
  PersistedProjectGraph,
  ProjectGraphRepository,
} from '../../types/projectGraph';

export interface AssembledFinding extends FindingRecord {
  images: ImageRecord[];
}

export interface AssembledArea extends AreaRecord {
  findings: AssembledFinding[];
}

export interface AssembledProjectReport {
  project: PersistedProjectGraph['project'];
  areas: AssembledArea[];
}

const byOrderIndex = <T extends { orderIndex: number }>(a: T, b: T) =>
  a.orderIndex - b.orderIndex;

export class ReportAssemblerService {
  constructor(private readonly repository: ProjectGraphRepository) {}

  async loadProjectReport(projectId: string): Promise<AssembledProjectReport | null> {
    const graph = await this.repository.loadPersistedProjectGraph(projectId);
    if (!graph) return null;

    const areasById = new Map(
      [...graph.areas]
        .sort(byOrderIndex)
        .map((area) => [area.id, { ...area, findings: [] as AssembledFinding[] }])
    );

    const findingsById = new Map<string, AssembledFinding>();

    [...graph.findings].sort(byOrderIndex).forEach((finding) => {
      const mappedFinding: AssembledFinding = { ...finding, images: [] };
      findingsById.set(finding.id, mappedFinding);
      const area = areasById.get(finding.areaId);
      if (area) area.findings.push(mappedFinding);
    });

    [...graph.images].sort(byOrderIndex).forEach((image) => {
      const finding = findingsById.get(image.findingId);
      if (finding) finding.images.push(image);
    });

    return { project: graph.project, areas: [...areasById.values()] };
  }
}
