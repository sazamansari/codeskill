"use client";

import { useState, useEffect } from "react";
import { Search, X, Check, Filter } from "lucide-react";
import { adminQuestionsAPI } from "@/config/api";
import { Spinner } from "@/components/ui/spinner";
import { useAssessmentStore, AssessmentQuestionConfig } from "../_store/useAssessmentStore";

interface QuestionPickerProps {
  sectionId: string;
  onClose: () => void;
}

export default function QuestionPicker({ sectionId, onClose }: QuestionPickerProps) {
  const store = useAssessmentStore();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  
  // To avoid duplicate adds, get existing ones
  const section = store.sections.find(s => s.id === sectionId);
  const existingIds = new Set(section?.questions.map(q => q.questionId) || []);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchQ = async () => {
      setLoading(true);
      try {
        const res = await adminQuestionsAPI.getAll({
          limit: 100,
          status: "approved",
          search: search || undefined,
          questionType: typeFilter || undefined
        });
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQ();
  }, [search, typeFilter]);

  const toggleSelect = (q: any) => {
    if (existingIds.has(q._id)) return; // Already in section
    
    const newSet = new Set(selectedIds);
    if (newSet.has(q._id)) {
      newSet.delete(q._id);
    } else {
      newSet.add(q._id);
    }
    setSelectedIds(newSet);
  };

  const handleAdd = () => {
    selectedIds.forEach(id => {
      const q = questions.find(x => x._id === id);
      if (q) {
        store.addQuestionToSection(sectionId, {
          questionId: q._id,
          marks: q.marks || 1,
          negativeMarks: q.negativeMarks || 0,
          order: section?.questions.length || 0,
          topic: q.topic,
          difficulty: q.difficulty,
          questionText: q.question,
          questionType: q.questionType
        });
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
          <div>
            <h2 className="text-lg font-bold text-foreground">Add Questions</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Select questions to add to {section?.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 border-b border-border bg-card flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select 
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Types</option>
            <option value="MCQ">MCQ</option>
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="CODE_OUTPUT">Code Output</option>
            <option value="DSA">DSA</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-2 bg-muted/10">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Spinner className="w-6 h-6 text-primary" />
            </div>
          ) : questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
              <Filter className="w-8 h-8 mb-2 opacity-50" />
              No questions found
            </div>
          ) : (
            <div className="space-y-1.5 p-3">
              {questions.map(q => {
                const isExisting = existingIds.has(q._id);
                const isSelected = selectedIds.has(q._id);
                return (
                  <div 
                    key={q._id}
                    onClick={() => toggleSelect(q)}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                      isExisting 
                        ? 'opacity-50 cursor-not-allowed bg-muted/50 border-border'
                        : isSelected
                        ? 'bg-primary/5 border-primary/30 cursor-pointer'
                        : 'bg-card border-border hover:border-primary/30 cursor-pointer'
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                      isExisting || isSelected 
                        ? 'bg-primary border-primary text-primary-foreground' 
                        : 'border-border bg-muted'
                    }`}>
                      {(isExisting || isSelected) && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 bg-muted border border-border rounded text-[10px] font-bold text-foreground uppercase">
                          {q.questionType || 'MCQ'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          q.difficulty === 'easy' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                          q.difficulty === 'medium' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' :
                          'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                        }`}>
                          {q.difficulty}
                        </span>
                        <span className="ml-auto text-xs font-mono font-medium text-muted-foreground">
                          {q.marks || 1} pts
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground line-clamp-2 leading-relaxed">
                        {q.question}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-border bg-card flex justify-between items-center">
          <span className="text-sm font-semibold text-muted-foreground">
            {selectedIds.size} selected
          </span>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted text-sm font-semibold transition-colors">
              Cancel
            </button>
            <button 
              onClick={handleAdd}
              disabled={selectedIds.size === 0}
              className="px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              Add to Section
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
