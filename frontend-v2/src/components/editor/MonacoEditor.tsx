'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';

// Dynamically import the Editor component, completely disabling SSR to reduce bundle size
const Editor = dynamic(() => import('@monaco-editor/react'), { 
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-[#1e1e2e] text-muted-foreground animate-pulse">Loading Editor Core...</div>
});

interface MonacoEditorProps {
  language?: string;
  value: string;
  onChange: (value: string | undefined) => void;
  height?: string;
  readOnly?: boolean;
}

export function MonacoEditor({
  language = 'javascript',
  value,
  onChange,
  height = '400px',
  readOnly = false,
}: MonacoEditorProps) {
  // Aggressively unmount the heavy Monaco instance when scrolled out of view to save memory.
  const { ref, inView } = useInView({
    triggerOnce: false, 
    rootMargin: '200px 0px', // Pre-load slightly before scrolling into viewport
  });

  return (
    <div ref={ref} className="rounded-md overflow-hidden border border-border" style={{ height }}>
      {inView ? (
        <Editor
          height={height}
          language={language}
          value={value}
          onChange={onChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            readOnly: readOnly,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            padding: { top: 16, bottom: 16 },
          }}
        />
      ) : (
        // Lightweight visual placeholder that consumes nearly 0 memory
        <div className="h-full w-full bg-[#1e1e2e] flex flex-col p-4 text-muted-foreground font-mono text-sm opacity-50 select-none overflow-hidden">
           <div className="text-blue-400 mb-2">// Editor paused (out of viewport) to save memory</div>
           <div className="truncate">{value.split('\n')[0] || ''}</div>
           <div className="truncate">{value.split('\n')[1] || ''}</div>
           <div className="truncate">{value.split('\n')[2] || ''}</div>
           <div className="truncate">{value.split('\n')[3] || ''}</div>
        </div>
      )}
    </div>
  );
}
