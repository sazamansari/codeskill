"use client";

import React, { useState, useEffect } from "react";

interface WatermarkOverlayProps {
  fullName: string;
  username: string;
  candidateId: string;
  contestName: string;
  sessionId: string;
  enabled: boolean;
}

export function WatermarkOverlay({ 
  fullName, 
  username, 
  candidateId, 
  contestName,
  sessionId,
  enabled 
}: WatermarkOverlayProps) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    if (!enabled) return;
    
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-US', { 
        day: '2-digit', month: 'short', year: 'numeric', 
        hour: '2-digit', minute: '2-digit', hour12: true 
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  const watermarks = Array.from({ length: 24 }).map((_, i) => (
    <div 
      key={i} 
      className="text-zinc-500/10 select-none transform -rotate-45 font-mono text-sm flex flex-col items-center justify-center p-8"
    >
      <span className="font-bold">{fullName} | @{username}</span>
      <span>Candidate ID: {candidateId}</span>
      <span>{contestName}</span>
      <span>{currentTime}</span>
      <span className="text-xs opacity-50 mt-1">Confidential - CodeSkill Assessment</span>
      <span className="text-[10px] opacity-30">Session: {sessionId}</span>
    </div>
  ));

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden flex flex-wrap justify-around items-center opacity-70 mix-blend-difference">
      {watermarks}
    </div>
  );
}
