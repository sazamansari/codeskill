import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';

// IndexedDB Storage adapter for Zustand persist
const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

// --- 9-Collection Types ---
export type Problem = {
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  companyTags: Array<{ companyId: string; frequency: number }>;
  universityTags: Array<{ universityId: string; frequency: number }>;
};

export type ProblemVersion = {
  versionNumber: number;
  status: 'Draft' | 'In Review' | 'Approved' | 'Published' | 'Archived';
  visibility: 'Public' | 'Private';
};

export type ProblemStatement = {
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleExamples: Array<{ input: string; output: string; explanation: string }>;
};

export type ProblemEnvironment = {
  problemType: 'Algorithmic' | 'Database' | 'Frontend' | 'DevOps' | 'Interactive';
  supportedLanguages: string[];
  compilerVersions: Record<string, string>;
  customDockerImage: string;
  timeLimit: number;
  memoryLimit: number;
  cpuLimit: number;
  stackSize: number;
  outputLimit: number;
  maxSourceCodeSize: number;
  executionProfiles: Record<string, { timeLimitMultiplier: number; memoryLimitMultiplier: number }>;
};

export type ProblemTemplate = {
  starterCode: Record<string, string>;
  isMultiFile: boolean;
  projectFiles: Array<{ filename: string; content: string; isHidden: boolean }>;
};

export type ProblemSolution = {
  referenceSolutions: Record<string, string>;
  hasCustomChecker: boolean;
  customCheckerCode: Record<string, string>;
};

export type ProblemTestCase = {
  smallTestCases: Array<{ input: string; output: string; isHidden: boolean; explanation: string; weight: number }>;
  s3BucketUrl: string;
  generatorScript: { language: string; code: string };
  validatorScript: { language: string; code: string };
};

export type ProblemEditorial = {
  content: string;
  videoUrl: string;
  timeComplexity: string;
  spaceComplexity: string;
};

// --- Store State ---
interface CreateProblemState {
  currentStep: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // The 8 data slices (AuditLog is backend only)
  problem: Problem;
  version: ProblemVersion;
  statement: ProblemStatement;
  environment: ProblemEnvironment;
  template: ProblemTemplate;
  solution: ProblemSolution;
  testCase: ProblemTestCase;
  editorial: ProblemEditorial;
  
  // Updaters
  updateProblem: (data: Partial<Problem>) => void;
  updateVersion: (data: Partial<ProblemVersion>) => void;
  updateStatement: (data: Partial<ProblemStatement>) => void;
  updateEnvironment: (data: Partial<ProblemEnvironment>) => void;
  updateTemplate: (data: Partial<ProblemTemplate>) => void;
  updateSolution: (data: Partial<ProblemSolution>) => void;
  updateTestCase: (data: Partial<ProblemTestCase>) => void;
  updateEditorial: (data: Partial<ProblemEditorial>) => void;
  
  resetStore: () => void;
}

// --- Initial States ---
const initialProblem: Problem = {
  title: '', slug: '', difficulty: 'Easy', tags: [], companyTags: [], universityTags: [],
};
const initialVersion: ProblemVersion = {
  versionNumber: 1, status: 'Draft', visibility: 'Private',
};
const initialStatement: ProblemStatement = {
  description: '', inputFormat: '', outputFormat: '', constraints: '', sampleExamples: [],
};
const initialEnvironment: ProblemEnvironment = {
  problemType: 'Algorithmic', supportedLanguages: ['javascript', 'python', 'cpp', 'java'],
  compilerVersions: {}, customDockerImage: '', timeLimit: 2000, memoryLimit: 256,
  cpuLimit: 1, stackSize: 8, outputLimit: 10, maxSourceCodeSize: 1024 * 1024, executionProfiles: {},
};
const initialTemplate: ProblemTemplate = {
  starterCode: {}, isMultiFile: false, projectFiles: [],
};
const initialSolution: ProblemSolution = {
  referenceSolutions: {}, hasCustomChecker: false, customCheckerCode: {},
};
const initialTestCase: ProblemTestCase = {
  smallTestCases: [], s3BucketUrl: '', generatorScript: { language: 'python', code: '' }, validatorScript: { language: 'python', code: '' },
};
const initialEditorial: ProblemEditorial = {
  content: '', videoUrl: '', timeComplexity: '', spaceComplexity: '',
};

// --- Store Implementation ---
export const useCreateProblemStore = create<CreateProblemState>()(
  persist(
    (set) => ({
      currentStep: 0,
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

      problem: initialProblem,
      version: initialVersion,
      statement: initialStatement,
      environment: initialEnvironment,
      template: initialTemplate,
      solution: initialSolution,
      testCase: initialTestCase,
      editorial: initialEditorial,

      updateProblem: (data) => set((state) => ({ problem: { ...state.problem, ...data } })),
      updateVersion: (data) => set((state) => ({ version: { ...state.version, ...data } })),
      updateStatement: (data) => set((state) => ({ statement: { ...state.statement, ...data } })),
      updateEnvironment: (data) => set((state) => ({ environment: { ...state.environment, ...data } })),
      updateTemplate: (data) => set((state) => ({ template: { ...state.template, ...data } })),
      updateSolution: (data) => set((state) => ({ solution: { ...state.solution, ...data } })),
      updateTestCase: (data) => set((state) => ({ testCase: { ...state.testCase, ...data } })),
      updateEditorial: (data) => set((state) => ({ editorial: { ...state.editorial, ...data } })),

      resetStore: () => set({
        currentStep: 0,
        problem: initialProblem,
        version: initialVersion,
        statement: initialStatement,
        environment: initialEnvironment,
        template: initialTemplate,
        solution: initialSolution,
        testCase: initialTestCase,
        editorial: initialEditorial,
      }),
    }),
    {
      name: 'draft-problem-storage', // unique name
      storage: createJSONStorage(() => idbStorage), // Use IndexedDB wrapper
      partialize: (state) => ({
        problem: state.problem,
        version: state.version,
        statement: state.statement,
        environment: state.environment,
        template: state.template,
        solution: state.solution,
        testCase: state.testCase,
        editorial: state.editorial,
      }), // Don't persist currentStep
    }
  )
);
