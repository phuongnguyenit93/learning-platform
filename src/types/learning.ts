export type Language = 'vi' | 'en';

export type LocalizedText = Record<Language, string>;

export interface ModuleStats {
  knowledge: number;
  quiz: number;
  interview: number;
  casestudy?: number;
  apiDocs: number;
}

export interface RoadmapRelatedModule {
  routeId: string;
  label?: string;
  note?: string;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  purpose: string;
  dependsOn: string[];
  objectives: string[];
  relatedKnowledge: string[];
  relatedModules: RoadmapRelatedModule[];
}

export interface RoadmapDocument {
  roadmap: RoadmapMilestone[];
}

export interface CapabilityState {
  knowledge: boolean;
  quiz: boolean;
  interview: boolean;
  apiDocs: boolean;
  execution: boolean;
  download: boolean;
}

export interface LearningModule {
  id: string;
  sourceFingerprint: string;
  name: LocalizedText;
  shortName: string;
  description: LocalizedText;
  path: string[];
  questionCount: number;
  overview: Partial<Record<Language, string>>;
  knowledge: Partial<Record<Language, string>>;
  summary: Partial<Record<Language, string>>;
  video: Partial<Record<Language, string>>;
  reference?: string;
  quiz: Partial<Record<Language, string>>;
  interview: Partial<Record<Language, string>>;
  casestudy: Partial<Record<Language, string>>;
  api: Partial<Record<Language, string>>;
  capabilities: CapabilityState;
}

export interface ModuleCatalog {
  version: number;
  root: ModuleCatalogNode;
}

export interface ModuleCatalogNode {
  id: string;
  name: string;
  path?: string;
  kind: 'GROUP' | 'MODULE';
  routeId?: string;
  sourceFingerprint?: string;
  serviceName?: string;
  moduleType?: 'SERVLET' | 'REACTIVE' | 'LIBRARY' | 'PLATFORM' | string;
  currentStep?: string;
  /** Navigation-only hint, derived at build time from published metadata. */
  hasContent?: boolean;
  javaBasePackage?: string;
  description?: string;
  moduleDepend?: boolean;
  overview?: Partial<Record<Language, string>>;
  knowledge?: Partial<Record<Language, string>>;
  summary?: Partial<Record<Language, string>>;
  video?: Partial<Record<Language, string>>;
  reference?: string;
  roadmap?: Partial<Record<Language, string>>;
  quiz?: Partial<Record<Language, string>>;
  interview?: Partial<Record<Language, string>>;
  casestudy?: Partial<Record<Language, string>>;
  api?: Partial<Record<Language, string>>;
  codeExplorer?: string;
  children: ModuleCatalogNode[];
}

export interface KnowledgeSection {
  id: string;
  title: string;
  content: string;
  difficulty: KnowledgeDifficulty;
}

export type KnowledgeDifficulty = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';

export interface KnowledgeCategoryNode {
  kind: 'CATEGORY';
  id: string;
  title: string;
  sourcePath: string;
  intro?: string;
  sections: KnowledgeSection[];
}

export interface KnowledgeFolderNode {
  kind: 'FOLDER';
  id: string;
  title: string;
  children: KnowledgeTreeNode[];
}

export type KnowledgeTreeNode = KnowledgeFolderNode | KnowledgeCategoryNode;

export interface KnowledgeIndex {
  version: number;
  moduleId: string;
  language: Language;
  categoryCount: number;
  sectionCount: number;
  tree: KnowledgeTreeNode[];
}

export interface KnowledgeSectionRef extends KnowledgeSection {
  categoryId: string;
  categoryTitle: string;
  sourcePath: string;
}

export interface KnowledgeSummaryLesson {
  id: string;
  title: string;
  summary: string;
}

export interface KnowledgeSummaryChapter {
  version: number;
  moduleId: string;
  language: Language;
  categoryId: string;
  section: KnowledgeChapterRoadmap | string;
  summaries: KnowledgeSummaryLesson[];
}

export interface KnowledgeChapterRoadmap {
  version: 1;
  type: 'LEARNING_ROADMAP';
  title: string;
  roadmapHeading: string;
  roadmap: Array<{
    id: string;
    order: number;
    title: string;
    description: string;
    transition: { to: string; description: string } | null;
  }>;
  comparisonMarkdown: string;
}

export interface KnowledgeSummaryIndex {
  version: number;
  moduleId: string;
  language: Language;
  sectionCount: number;
  items: Array<{
    categoryId: string;
    title: string;
    content: string;
    lessonCount: number;
  }>;
}

export interface VideoIndexItem {
  categoryId: string;
  title: string;
  sourcePath: string;
  content: string;
  url: string;
  sectionCount: number;
  sceneCount: number;
  transitionCount: number;
}

export interface VideoIndex {
  version: number;
  moduleId: string;
  language: Language;
  videoCount: number;
  items: VideoIndexItem[];
}

export type VideoScriptItemType = 'SCENE' | 'TRANSITION';

export interface VideoScriptItem {
  type: VideoScriptItemType;
  title?: string;
  time: string;
  visual: string;
  script: string;
  purpose: string;
}

export interface VideoScriptSection {
  order: number;
  title: string;
  items: VideoScriptItem[];
}

export interface VideoScriptDocument {
  version: number;
  moduleId: string;
  language: Language;
  categoryId: string;
  title: string;
  sourcePath: string;
  video: {
    url: string;
  };
  sections: VideoScriptSection[];
}

export interface ReferenceItem {
  title: string;
  url: string;
  description: string;
}

export interface ReferenceDocument {
  references: ReferenceItem[];
}

export type KnowledgeSearchDocumentType = 'CATEGORY' | 'SECTION';

export interface KnowledgeSearchDocument {
  documentId: string;
  type: KnowledgeSearchDocumentType;
  moduleId: string;
  categoryId: string;
  categoryTitle: string;
  sectionId?: string;
  title: string;
  sourcePath: string;
  difficulty?: KnowledgeDifficulty;
  preview: string;
  searchText: string;
}

export interface KnowledgeSearchIndex {
  version: number;
  language: Language;
  documentCount: number;
  documents: KnowledgeSearchDocument[];
}

export interface KnowledgeSearchResult {
  document: KnowledgeSearchDocument;
  score: number;
}

export type QuizAnswerId = 'A' | 'B' | 'C' | 'D';

export interface QuizAnswer {
  id: QuizAnswerId;
  answer: string;
  explanation: string;
}

export interface QuizReadmeRelated {
  file: string;
  anchor: string;
}

export interface QuizApiRelated {
  controller: string;
  methodSignature: string;
}

export interface QuizQuestion {
  id: string;
  question: string;


  readmeRelated: QuizReadmeRelated;
  apiRelated: QuizApiRelated;
  answers: QuizAnswer[];
  correctAnswerId: QuizAnswerId;
}

export interface QuizDocument {
  questions: QuizQuestion[];
}

export interface InterviewQuestion {
  question: string;
  answer: string;


  readmeRelated: QuizReadmeRelated;
  apiRelated: QuizApiRelated;
}

export interface InterviewDocument {
  questions: InterviewQuestion[];
}

export interface ApiReadmeRelated {
  file?: string;
  anchor?: string;
}

export interface ApiParamDefinition {
  name: string;
  summary: string;
  description: string;
}

export interface ApiDocOperation {
  id: string;
  controllerName: string;
  methodSignature: string;
  methodName: string;
  httpMethod: string;
  path: string;
  summary: string;
  description: string;
  executionHtml: string;
  consumes: string[];
  produces: string[];
  params: ApiParamDefinition[];
  readmeRelated: ApiReadmeRelated;


}

export interface ApiDocController {
  name: string;
  title: string;
  description: string;
  descriptionHtml: string;
  readmeRelated: ApiReadmeRelated;
  chapterOrder: number | null;
  operations: ApiDocOperation[];
}

export interface ApiDocsDocument {
  operationCount: number;
  controllers: ApiDocController[];
}

export interface ApiKnowledgeRelation {
  controller: ApiDocController;
  operation: ApiDocOperation;
  sourcePath: string;
  anchor: string;
}
