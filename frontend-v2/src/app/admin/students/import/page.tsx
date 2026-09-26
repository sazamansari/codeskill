"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  ArrowRight,
  Loader2,
  RefreshCw,
  Mail,
  ShieldCheck,
  Building,
  Check,
  X,
} from "lucide-react";
import { adminStudentsAPI } from "@/config/api";

interface PreviewData {
  total: number;
  valid: number;
  invalid: number;
  duplicates: number;
  previewRows: any[];
  validRows: any[];
  errors: { row: number; uid?: string; email?: string; error: string }[];
}

export default function ImportStudentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [importResult, setImportResult] = useState<{
    importedCount: number;
    emailJobsCreated: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = async (selectedFile: File) => {
    setFile(selectedFile);
    setErrorMessage(null);
    setPreviewData(null);
    setImportResult(null);

    setIsValidating(true);
    try {
      const res = await adminStudentsAPI.importPreview(selectedFile);
      setPreviewData(res.data);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message ||
          "Failed to parse and validate spreadsheet. Please verify file format.",
      );
    } finally {
      setIsValidating(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!previewData || previewData.validRows.length === 0) return;

    setIsCommitting(true);
    setErrorMessage(null);
    try {
      const res = await adminStudentsAPI.confirmImport(previewData.validRows);
      setImportResult({
        importedCount: res.data.importedCount,
        emailJobsCreated: res.data.emailJobsCreated,
      });
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message ||
          "Failed to commit student import into database.",
      );
    } finally {
      setIsCommitting(false);
    }
  };

  const handleDownloadErrorReport = () => {
    if (!previewData || previewData.errors.length === 0) return;

    const headers = ["Row", "UID", "Email", "Errors"];
    const rows = previewData.errors.map((err) => [
      err.row,
      `"${err.uid || ""}"`,
      `"${err.email || ""}"`,
      `"${err.error.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `import-errors-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSampleTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      encodeURIComponent(
        `uid,name,email,university,department,course,semester,section,group,year,batch,password
CU202600101,Aarav Patel,aarav.patel@university.edu,Chandigarh University,Computer Science,B.Tech CSE,6,A1,Group-1,2026,2022-2026,Student@123
CU202600102,Diya Sharma,diya.sharma@university.edu,Chandigarh University,Computer Science,B.Tech CSE,6,A1,Group-1,2026,2022-2026,Student@123
CU202600103,Rohan Verma,rohan.verma@university.edu,Chandigarh University,Information Technology,B.Tech IT,6,B2,Group-2,2026,2022-2026,Student@123
CU202600104,Ananya Iyer,ananya.iyer@university.edu,Chandigarh University,Computer Science,B.Tech CSE,6,A2,Group-1,2026,2022-2026,Student@123
CU202600105,Kabir Mehta,kabir.mehta@university.edu,Chandigarh University,Electronics,B.Tech ECE,6,C1,Group-2,2026,2022-2026,Student@123`
      );
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "sample_students_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Bulk Import Students
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
              3,200+ Rows Supported
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Upload institutional spreadsheets (XLSX, CSV) to batch-enroll candidates and queue credential delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadSampleTemplate}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-semibold transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Download Sample Template (.CSV)
          </button>
          <Link
            href="/admin/students"
            className="px-3.5 py-2 rounded-xl border border-border hover:bg-muted text-sm font-medium transition-colors"
          >
            ← Back to Directory
          </Link>
        </div>
      </div>

      {/* Success View */}
      {importResult ? (
        <div className="p-8 rounded-2xl bg-card border border-emerald-500/30 text-center space-y-4 shadow-sm animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Import Completed Successfully!
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              <strong>{importResult.importedCount.toLocaleString()}</strong> student accounts have been created with secure temporary credentials.
            </p>
          </div>

          <div className="p-4 bg-muted/40 rounded-xl max-w-md mx-auto text-xs text-muted-foreground space-y-1 text-left border border-border">
            <div className="flex justify-between">
              <span>Total Imported Candidates:</span>
              <span className="font-bold text-foreground">{importResult.importedCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Credential Email Jobs Queued:</span>
              <span className="font-bold text-foreground">{importResult.emailJobsCreated}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/admin/students/credentials"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-xl text-sm font-semibold shadow-sm flex items-center gap-2 transition-all"
            >
              <Mail className="w-4 h-4" /> Go to Credentials Dispatch →
            </Link>
            <button
              onClick={() => {
                setFile(null);
                setPreviewData(null);
                setImportResult(null);
              }}
              className="px-4 py-2.5 rounded-xl border border-border hover:bg-muted text-sm font-medium"
            >
              Upload Another Spreadsheet
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-start gap-3 text-red-700 dark:text-red-400 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? "border-amber-500 bg-amber-500/10"
                : "border-border hover:border-amber-500/50 hover:bg-muted/30 bg-card"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
              {isValidating ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <UploadCloud className="w-8 h-8" />
              )}
            </div>

            <div>
              <div className="text-base font-bold text-foreground">
                {file ? file.name : "Click to upload or drag and drop spreadsheet"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Supports XLSX, XLS, and CSV files (up to 10MB, tested up to 3,200 rows in &lt;10s)
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono bg-muted/60 px-4 py-1.5 rounded-lg border border-border">
              <span>Required Columns: UID, Name, Email</span>
              <span>•</span>
              <span>Optional: Department, Course, Semester, Section, Batch</span>
            </div>
          </div>

          {/* Validation Preview Section */}
          {previewData && (
            <div className="space-y-4 animate-in fade-in">
              {/* Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-card border border-border">
                  <div className="text-xs text-muted-foreground">Total Rows</div>
                  <div className="text-xl font-bold text-foreground">
                    {previewData.total.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                    Valid for Import
                  </div>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-300">
                    {previewData.valid.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
                  <div className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                    Duplicates (File / DB)
                  </div>
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-300">
                    {previewData.duplicates.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40">
                  <div className="text-xs text-red-700 dark:text-red-400 font-medium">
                    Invalid Rows
                  </div>
                  <div className="text-xl font-bold text-red-600 dark:text-red-300">
                    {previewData.invalid.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-card border border-border rounded-xl shadow-sm">
                <div>
                  <div className="text-sm font-bold text-foreground">
                    Validation Ready
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Review candidate entries below before committing into database.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {previewData.errors.length > 0 && (
                    <button
                      onClick={handleDownloadErrorReport}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Error Report ({previewData.errors.length})
                    </button>
                  )}

                  <button
                    onClick={handleConfirmImport}
                    disabled={isCommitting || previewData.valid === 0}
                    className="flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                  >
                    {isCommitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Batch Importing...
                      </>
                    ) : (
                      <>
                        Confirm Import ({previewData.valid} Students) <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Preview Table */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="p-3 bg-muted/40 border-b border-border text-xs font-semibold text-muted-foreground flex justify-between items-center">
                  <span>First 50 Rows Preview</span>
                  <span>{previewData.previewRows.length} shown</span>
                </div>

                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/20 text-muted-foreground uppercase font-semibold">
                        <th className="py-2.5 px-3">Row</th>
                        <th className="py-2.5 px-3">UID</th>
                        <th className="py-2.5 px-3">Name</th>
                        <th className="py-2.5 px-3">Email</th>
                        <th className="py-2.5 px-3">Department</th>
                        <th className="py-2.5 px-3">Batch</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {previewData.previewRows.map((row) => {
                        const rowError = previewData.errors.find(
                          (e) => e.row === row.rowNumber,
                        );

                        return (
                          <tr
                            key={row.rowNumber}
                            className={
                              rowError
                                ? "bg-red-500/5 hover:bg-red-500/10"
                                : "hover:bg-muted/30"
                            }
                          >
                            <td className="py-2.5 px-3 text-muted-foreground font-mono">
                              {row.rowNumber}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-foreground">
                              {row.uid || "—"}
                            </td>
                            <td className="py-2.5 px-3 font-medium text-foreground">
                              {row.name || "—"}
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground">
                              {row.email || "—"}
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground">
                              {row.department || "—"}
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground">
                              {row.batch || "—"}
                            </td>
                            <td className="py-2.5 px-3">
                              {rowError ? (
                                <span
                                  className="inline-flex items-center gap-1 text-red-600 font-medium"
                                  title={rowError.error}
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span className="truncate max-w-[180px]">
                                    {rowError.error}
                                  </span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                                  <Check className="w-3.5 h-3.5" /> Valid
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
