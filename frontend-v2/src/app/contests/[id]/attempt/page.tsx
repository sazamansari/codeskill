"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAntiCheatMaster } from "@/hooks/anti-cheat/useAntiCheatMaster";
import { ContestStartGate } from "./_components/ContestStartGate";
import { AntiCheatWarningDialog } from "./_components/AntiCheatWarningDialog";
import { WatermarkOverlay } from "./_components/WatermarkOverlay";
import { SubmissionConfirmationDialog } from "./_components/SubmissionConfirmationDialog";
import api from "@/config/api";
import { Button } from "@/components/ui/button";
import { UserCircle2, ChevronDown, User, FileText, AlertCircle, LogOut, Keyboard } from "lucide-react";

export default function ContestAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const contestId = params.id as string;
  
  // Dummy data. In a real app, fetch from auth/contest context.
  const userId = "dummy_user_id"; 
  const candidateId = "CSK-10245";
  const fullName = "Shadab Ansari";
  const username = "shadab_ansari";
  const contestName = "Software Engineering Assessment 2026";
  const sessionId = "session_token_123"; 

  const [hasStarted, setHasStarted] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Fetch contest configuration
  useEffect(() => {
    setTimeout(() => {
      setConfig({
        enableFullscreen: true,
        enableCopyProtect: true,
        enablePasteProtect: true,
        enableDevToolsDetect: true,
        enableTabSwitchDetect: true,
        warningLimit: 3,
        enableWatermark: true,
      });
      setLoading(false);
    }, 500);
  }, [contestId]);

  const handleAutoSubmit = () => {
    // If it's an auto-submit from exceeding limits, just submit immediately
    alert("Contest Auto-Submitted due to violations or time up!");
    router.push(`/contests/${contestId}/result`);
  };

  const handleManualSubmit = () => {
    setIsSubmitDialogOpen(true);
  };

  const confirmSubmit = () => {
    setIsSubmitDialogOpen(false);
    router.push(`/contests/${contestId}/result`);
  };

  const {
    warnings,
    warningLimit,
    lastViolation,
    isWarningDialogOpen,
    setIsWarningDialogOpen,
    isFullscreen,
    requestFullscreen,
    hasRequestedFullscreen
  } = useAntiCheatMaster(
    contestId,
    userId,
    sessionId,
    config || {
      enableFullscreen: false,
      enableCopyProtect: false,
      enablePasteProtect: false,
      enableDevToolsDetect: false,
      enableTabSwitchDetect: false,
      warningLimit: 3
    },
    handleAutoSubmit
  );

  const handleStartContest = async () => {
    try {
      setHasStarted(true);
    } catch (err) {
      console.error("Could not start attempt:", err);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading...</div>;
  }

  if (!hasStarted) {
    return (
      <ContestStartGate 
        onAccept={handleStartContest}
        requestFullscreen={requestFullscreen}
        isFullscreen={isFullscreen}
        hasRequestedFullscreen={hasRequestedFullscreen}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative">
      
      {config?.enableWatermark && (
        <WatermarkOverlay 
          fullName={fullName}
          username={username}
          candidateId={candidateId} 
          contestName={contestName}
          sessionId={sessionId}
          enabled={true} 
        />
      )}
      
      <AntiCheatWarningDialog 
        isOpen={isWarningDialogOpen}
        onClose={() => setIsWarningDialogOpen(false)}
        warnings={warnings}
        warningLimit={warningLimit}
        lastViolation={lastViolation}
        requestFullscreen={requestFullscreen}
        isFullscreen={isFullscreen}
      />

      <SubmissionConfirmationDialog 
        isOpen={isSubmitDialogOpen}
        onClose={() => setIsSubmitDialogOpen(false)}
        onConfirm={confirmSubmit}
        fullName={fullName}
        username={username}
        contestName={contestName}
        warnings={warnings}
      />

      <header className="h-16 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6 z-[90] relative">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              className="flex items-center space-x-3 hover:bg-zinc-800 p-2 rounded-lg transition-colors cursor-pointer"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              <UserCircle2 size={32} className="text-zinc-400" />
              <div className="flex flex-col text-left">
                <span className="font-semibold text-sm leading-tight text-white">👤 {fullName}</span>
                <span className="text-xs text-zinc-400">@{username} | ID: {candidateId}</span>
              </div>
              <ChevronDown size={16} className="text-zinc-500" />
            </button>
            
            {/* Candidate Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden py-1">
                <button className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-sm flex items-center space-x-2">
                  <User size={16} /> <span>Profile</span>
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-sm flex items-center space-x-2">
                  <FileText size={16} /> <span>Contest Rules</span>
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-sm flex items-center space-x-2">
                  <Keyboard size={16} /> <span>Keyboard Shortcuts</span>
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-sm flex items-center space-x-2 text-amber-500">
                  <AlertCircle size={16} /> <span>Report an Issue</span>
                </button>
                <div className="border-t border-zinc-800 my-1"></div>
                <button 
                  className="w-full text-left px-4 py-2 text-sm flex items-center space-x-2 text-zinc-500 cursor-not-allowed" 
                  disabled
                  title="Logout is disabled while contest is active"
                >
                  <LogOut size={16} /> <span>Logout (Disabled)</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="h-8 w-px bg-zinc-800 mx-2"></div>
          <div className="font-medium text-zinc-300 hidden md:block">{contestName}</div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <div className="text-zinc-400">
            Remaining: <span className="text-white font-mono font-bold text-base bg-zinc-800 px-3 py-1 rounded">01:59:59</span>
          </div>
          <div className={`${warnings > 0 ? 'text-amber-500' : 'text-zinc-400'}`}>
            Warnings: <span className="font-bold">{warnings} / {warningLimit}</span>
          </div>
          <Button variant="destructive" size="sm" onClick={handleManualSubmit}>Submit</Button>
        </div>
      </header>

      <main className="flex h-[calc(100vh-64px)] relative z-10" onClick={() => setIsProfileDropdownOpen(false)}>
        <div className="w-1/2 border-r border-zinc-800 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Problem 1: Two Sum</h1>
          <p className="text-zinc-300 mb-4 select-none">
            Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
            <br/><br/>
            You may assume that each input would have exactly one solution, and you may not use the same element twice.
            <br/><br/>
            You can return the answer in any order.
          </p>
          <div className="bg-zinc-900 p-4 rounded-md font-mono text-sm select-none">
            Input: nums = [2,7,11,15], target = 9 <br/>
            Output: [0,1]
          </div>
          <p className="mt-8 text-zinc-500 text-sm">
            Notice: Text selection, copying, and right-clicking are disabled on this pane.
          </p>
        </div>
        
        <div className="w-1/2 bg-zinc-950 p-6">
          <div className="h-full border border-zinc-800 rounded-lg overflow-hidden bg-[#1e1e1e] flex items-center justify-center text-zinc-500">
            [Monaco Editor Placeholder]
            <br/>
            (You can type freely here, but pasting is blocked!)
          </div>
        </div>
      </main>
    </div>
  );
}
