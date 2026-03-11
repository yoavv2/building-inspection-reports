/**
 * ReportAssemblerService
 * Loads the full project graph from SQLite and assembles it
 * into an AssembledReport ready for preview or export.
 */
import {
  projectsRepository,
  areasRepository,
  findingsRepository,
  findingImagesRepository,
  standardsRepository,
  settingsRepository,
} from '../../db/repositories';
import {
  AssembledReport,
  AreaWithFindings,
  FindingWithImages,
} from '../../types/domain';

export async function assembleReport(projectId: string): Promise<AssembledReport> {
  const project = await projectsRepository.getById(projectId);
  if (!project) throw new Error(`Project not found: ${projectId}`);

  const areas = await areasRepository.listByProject(projectId);
  const allFindings = await findingsRepository.listByProject(projectId);
  const settings = await settingsRepository.get();

  const areasWithFindings: AreaWithFindings[] = await Promise.all(
    areas.map(async (area) => {
      const areaFindings = allFindings.filter((f) => f.areaId === area.id);
      const findingsWithImages: FindingWithImages[] = await Promise.all(
        areaFindings.map(async (finding) => {
          const images = await findingImagesRepository.listByFinding(finding.id);
          const standard = finding.standardReferenceId
            ? await standardsRepository.getById(finding.standardReferenceId)
            : null;
          return { ...finding, images, standard };
        })
      );
      return { ...area, findings: findingsWithImages };
    })
  );

  return { project, areas: areasWithFindings, settings };
}

// Legacy compatibility exports
export { ReportAssemblerService } from './legacyService';
export type { AssembledProjectReport } from './legacyService';
