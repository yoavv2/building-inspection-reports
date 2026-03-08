import { create } from 'zustand';
import { Project, Area, Finding, FindingImage } from '../types/domain';
import {
  projectsRepository,
  areasRepository,
  findingsRepository,
  findingImagesRepository,
} from '../db/repositories';
import type { CreateProjectInput, UpdateProjectInput } from '../db/repositories/projectsRepository';
import type { CreateAreaInput, UpdateAreaInput } from '../db/repositories/areasRepository';
import type { CreateFindingInput, UpdateFindingInput } from '../db/repositories/findingsRepository';
import type { CreateImageInput } from '../db/repositories/findingImagesRepository';

interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
  areas: Area[];
  findings: Finding[];
  images: FindingImage[];
  loading: boolean;
  error: string | null;

  // Projects
  loadProjects: () => Promise<void>;
  selectProject: (project: Project) => void;
  createProject: (input: CreateProjectInput) => Promise<Project>;
  updateProject: (id: string, input: UpdateProjectInput) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Areas
  loadAreas: (projectId: string) => Promise<void>;
  createArea: (input: CreateAreaInput) => Promise<Area>;
  updateArea: (id: string, input: UpdateAreaInput) => Promise<void>;
  deleteArea: (id: string) => Promise<void>;

  // Findings
  loadFindings: (projectId: string) => Promise<void>;
  loadFindingsByArea: (areaId: string) => Promise<Finding[]>;
  createFinding: (input: CreateFindingInput) => Promise<Finding>;
  updateFinding: (id: string, input: UpdateFindingInput) => Promise<void>;
  deleteFinding: (id: string) => Promise<void>;

  // Images
  loadImages: (findingId: string) => Promise<FindingImage[]>;
  addImage: (input: CreateImageInput) => Promise<FindingImage>;
  updateImageCaption: (id: string, caption: string) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;

  clearError: () => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  selectedProject: null,
  areas: [],
  findings: [],
  images: [],
  loading: false,
  error: null,

  loadProjects: async () => {
    set({ loading: true, error: null });
    try {
      const projects = await projectsRepository.list();
      set({ projects, loading: false });
    } catch (e) {
      set({ error: String(e), loading: false });
    }
  },

  selectProject: (project) => set({ selectedProject: project }),

  createProject: async (input) => {
    set({ loading: true, error: null });
    try {
      const project = await projectsRepository.create(input);
      set((s) => ({ projects: [project, ...s.projects], selectedProject: project, loading: false }));
      return project;
    } catch (e) {
      set({ error: String(e), loading: false });
      throw e;
    }
  },

  updateProject: async (id, input) => {
    try {
      const updated = await projectsRepository.update(id, input);
      set((s) => ({
        projects: s.projects.map((p) => (p.id === id ? updated : p)),
        selectedProject: s.selectedProject?.id === id ? updated : s.selectedProject,
      }));
    } catch (e) {
      set({ error: String(e) });
      throw e;
    }
  },

  deleteProject: async (id) => {
    try {
      await projectsRepository.delete(id);
      set((s) => ({
        projects: s.projects.filter((p) => p.id !== id),
        selectedProject: s.selectedProject?.id === id ? null : s.selectedProject,
      }));
    } catch (e) {
      set({ error: String(e) });
      throw e;
    }
  },

  loadAreas: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const areas = await areasRepository.listByProject(projectId);
      set({ areas, loading: false });
    } catch (e) {
      set({ error: String(e), loading: false });
    }
  },

  createArea: async (input) => {
    try {
      const area = await areasRepository.create(input);
      set((s) => ({ areas: [...s.areas, area] }));
      return area;
    } catch (e) {
      set({ error: String(e) });
      throw e;
    }
  },

  updateArea: async (id, input) => {
    try {
      const updated = await areasRepository.update(id, input);
      set((s) => ({ areas: s.areas.map((a) => (a.id === id ? updated : a)) }));
    } catch (e) {
      set({ error: String(e) });
      throw e;
    }
  },

  deleteArea: async (id) => {
    try {
      await areasRepository.delete(id);
      set((s) => ({ areas: s.areas.filter((a) => a.id !== id) }));
    } catch (e) {
      set({ error: String(e) });
      throw e;
    }
  },

  loadFindings: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const findings = await findingsRepository.listByProject(projectId);
      set({ findings, loading: false });
    } catch (e) {
      set({ error: String(e), loading: false });
    }
  },

  loadFindingsByArea: async (areaId) => {
    try {
      return await findingsRepository.listByArea(areaId);
    } catch (e) {
      set({ error: String(e) });
      throw e;
    }
  },

  createFinding: async (input) => {
    try {
      const finding = await findingsRepository.create(input);
      set((s) => ({ findings: [...s.findings, finding] }));
      return finding;
    } catch (e) {
      set({ error: String(e) });
      throw e;
    }
  },

  updateFinding: async (id, input) => {
    try {
      const updated = await findingsRepository.update(id, input);
      set((s) => ({ findings: s.findings.map((f) => (f.id === id ? updated : f)) }));
    } catch (e) {
      set({ error: String(e) });
      throw e;
    }
  },

  deleteFinding: async (id) => {
    try {
      await findingsRepository.delete(id);
      set((s) => ({ findings: s.findings.filter((f) => f.id !== id) }));
    } catch (e) {
      set({ error: String(e) });
      throw e;
    }
  },

  loadImages: async (findingId) => {
    try {
      return await findingImagesRepository.listByFinding(findingId);
    } catch (e) {
      set({ error: String(e) });
      throw e;
    }
  },

  addImage: async (input) => {
    try {
      const image = await findingImagesRepository.create(input);
      set((s) => ({ images: [...s.images, image] }));
      return image;
    } catch (e) {
      set({ error: String(e) });
      throw e;
    }
  },

  updateImageCaption: async (id, caption) => {
    try {
      const updated = await findingImagesRepository.updateCaption(id, caption);
      set((s) => ({ images: s.images.map((img) => (img.id === id ? updated : img)) }));
    } catch (e) {
      set({ error: String(e) });
      throw e;
    }
  },

  deleteImage: async (id) => {
    try {
      await findingImagesRepository.delete(id);
      set((s) => ({ images: s.images.filter((img) => img.id !== id) }));
    } catch (e) {
      set({ error: String(e) });
      throw e;
    }
  },

  clearError: () => set({ error: null }),
}));
