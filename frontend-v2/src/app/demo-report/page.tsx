"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { StudentResultReport, StudentResult } from "@/components/pdf/StudentResultReport";
import Navbar from "@/components/Navbar";

// We must dynamically import PDFViewer to avoid SSR issues with react-pdf
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <div className="animate-pulse w-full h-[800px] bg-muted rounded-xl flex items-center justify-center">Loading PDF engine...</div> }
);

const MOCK_RESULT: StudentResult = {
  studentName: "Alex Developer",
  studentEmail: "alex@example.com",
  examName: "Advanced Algorithms & Data Structures",
  dateTaken: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
  score: 85,
  maxScore: 100,
  duration: "1h 45m",
  questions: [
    { id: "1", title: "Two Sum", difficulty: "Easy", status: "Passed", points: 15 },
    { id: "2", title: "Merge K Sorted Lists", difficulty: "Hard", status: "Passed", points: 35 },
    { id: "3", title: "LRU Cache", difficulty: "Medium", status: "Passed", points: 25 },
    { id: "4", title: "N-Queens", difficulty: "Hard", status: "Partial", points: 10 },
    { id: "5", title: "Trapping Rain Water", difficulty: "Hard", status: "Failed", points: 0 },
  ],
};

export default function DemoReportPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8 flex flex-col mt-20">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Student Exam Report Demo</h1>
            <p className="text-muted-foreground mt-2">Preview of the PDF generation using @react-pdf/renderer</p>
          </div>
        </div>

        <div className="flex-1 bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[800px]">
          {isMounted && (
            <PDFViewer className="w-full h-full flex-1 border-none">
              <StudentResultReport result={MOCK_RESULT} />
            </PDFViewer>
          )}
        </div>
      </main>
    </div>
  );
}
