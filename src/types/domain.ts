/**
 * Core domain types for the building inspection system.
 * These are the typed domain objects returned by repositories.
 */

export type ProjectStatus = 'draft' | 'completed' | 'exported';
export type Severity = 'high' | 'medium' | 'low';
export type FindingStatus = 'open' | 'closed';
export type PropertyType = 'apartment' | 'house' | 'office' | 'commercial' | 'industrial' | 'other';

export interface Project {
  id: string;
  clientName: string;
  propertyAddress: string;
  inspectionDate: string;
  inspectorName: string;
  propertyType: PropertyType;
  notes: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Area {
  id: string;
  projectId: string;
  name: string;
  description: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface Finding {
  id: string;
  projectId: string;
  areaId: string;
  title: string;
  description: string;
  severity: Severity;
  status: FindingStatus;
  standardReferenceId: string | null;
  standardQuoteText: string;
  conclusion: string;
  repairCostEstimate: number | null;
  repairCostCurrency: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface FindingImage {
  id: string;
  findingId: string;
  localUri: string;
  caption: string;
  orderIndex: number;
  createdAt: string;
}

export interface StandardReference {
  id: string;
  code: string;
  title: string;
  quoteText: string;
  category: string;
  source: string;
  tags: string[];
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface FindingTemplate {
  id: string;
  title: string;
  category: string;
  defaultDescription: string;
  defaultStandardQuote: string;
  defaultConclusion: string;
  defaultRepairCostRange: string;
  tags: string[];
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  id: string;
  reportTitle: string;
  defaultInspectorName: string;
  defaultCurrency: string;
  logoUri: string;
  companyName: string;
  updatedAt: string;
}

// Assembled project graph for report assembly
export interface AreaWithFindings extends Area {
  findings: FindingWithImages[];
}

export interface FindingWithImages extends Finding {
  images: FindingImage[];
  standard: StandardReference | null;
}

export interface AssembledReport {
  project: Project;
  areas: AreaWithFindings[];
  settings: AppSettings | null;
}
