export interface AssessmentReportData {
  reportId: string;
  generatedAt: string;
  assessmentName?: string;
  student: {
    name: string;
    email: string;
    institution?: string;
    role?: string;
    joinedAt?: string;
    lastActiveAt?: string;
  };
  performance: {
    totalSolved: number;
    score: number;
    acceptanceRate: number;
    streak: number;
  };
  submissions: Array<{
    _id: string;
    problemTitle: string;
    language: string;
    status: string;
    submittedAt: string;
  }>;
}
