export type ProblemStatus =
  | "Solved"
  | "Partially Solved"
  | "Wrong Answer"
  | "Time Limit Exceeded"
  | "Runtime Error"
  | "Not Attempted";

export type ProblemDifficulty = "Easy" | "Medium" | "Hard";

export interface StudentData {
  name: string;
  uid: string;
  registrationId?: string;
  program: string;
  batch: string;
  section: string;
  group?: string;
  semester?: string;
  email: string;
  institution?: string;
}

export interface ContestData {
  id: string;
  name: string;
  code?: string;
  date: string;
  duration: string;
  generatedOn: string;
  totalProblems: number;
  maximumScore: number;
  totalParticipants?: number;
}

export interface PerformanceSummary {
  problemsAttempted: number;
  problemsSolved: number;
  totalScore: number;
  maxScore: number;
  accuracy: number;
  rank: number;
  totalParticipants: number;
  percentile: number;
}

export interface ContestPerformanceDetails {
  contestName: string;
  totalProblems: number;
  solved: number;
  partiallySolved: number;
  attempted: number;
  unattempted: number;
  totalScore: number;
  maximumScore: number;
  timeTakenMinutes: number;
  rank: number;
}

export interface ProblemPerformance {
  index: number;
  title: string;
  difficulty: ProblemDifficulty;
  status: ProblemStatus;
  score: number;
  maxScore: number;
  timeTakenSeconds?: number;
  attempts: number;
  language?: string;
}

export interface PerformanceAnalysis {
  totalAttempts: number;
  acceptedSubmissions: number;
  rejectedSubmissions: number;
  acceptanceRate: number;
  avgAttemptsPerProblem: number;
  avgTimePerSolvedProblemSeconds: number;
  fastestSolutionProblem?: string;
  fastestSolutionSeconds?: number;
  longestSolutionProblem?: string;
  longestSolutionSeconds?: number;
}

export interface TopicPerformance {
  topic: string;
  solved: number;
  total: number;
  percentage: number;
}

export interface DifficultyBreakdown {
  solved: number;
  total: number;
}

export interface DifficultyAnalysis {
  easy: DifficultyBreakdown;
  medium: DifficultyBreakdown;
  hard: DifficultyBreakdown;
}

export interface SubmissionTimelineItem {
  time: string;
  problem: string;
  verdict: "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error" | "Partial";
  scoreChange?: string;
}

export interface RankingData {
  rank: number;
  totalParticipants: number;
  percentile: number;
  score: number;
}

export interface EvaluatorData {
  facultyName: string;
  designation?: string;
  department: string;
  remarks?: string;
  evaluationDate?: string;
  signatureStatus?: string;
}

export interface FeedbackData {
  strengths: string[];
  areasForImprovement: string[];
  recommendedTopics: string[];
}

export interface OverallPerformance {
  summaryText: string;
  recommendationText?: string;
}

export interface ContestReportData {
  student: StudentData;
  contest: ContestData;
  summary: PerformanceSummary;
  contestPerformance?: ContestPerformanceDetails;
  problems: ProblemPerformance[];
  analysis?: PerformanceAnalysis;
  topics?: TopicPerformance[];
  difficulty?: DifficultyAnalysis;
  submissions?: SubmissionTimelineItem[];
  ranking?: RankingData;
  evaluator?: EvaluatorData;
  feedback?: FeedbackData;
  overall?: OverallPerformance;
}
