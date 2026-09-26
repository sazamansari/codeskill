"use client";

import React, { useState } from 'react';
import { ResultCard } from '@/components/Result';
import { StatusType } from '@/components/Result/StatusBadge';

export default function ResultDemoPage() {
  const [status, setStatus] = useState<StatusType>('success');
  const [isOpen, setIsOpen] = useState(true);

  const testCases = [
    { id: '1', name: 'Sample Test Case 0', passed: status !== 'wrong_answer' },
    { id: '2', name: 'Sample Test Case 1', passed: status !== 'wrong_answer' && status !== 'runtime_error' },
    { id: '3', name: 'Hidden Test Case 1', passed: status === 'success', isHidden: true },
    { id: '4', name: 'Hidden Test Case 2', passed: status === 'success', isHidden: true },
  ];

  return (
    <div className="min-h-screen bg-black p-8 text-white font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Result Component Demo</h1>
          <p className="text-zinc-400">Testing CodeSkill Result UI Components</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => setStatus('success')} className="px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-md">Success</button>
          <button onClick={() => setStatus('wrong_answer')} className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md">Wrong Answer</button>
          <button onClick={() => setStatus('runtime_error')} className="px-4 py-2 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-md">Runtime Error</button>
          <button onClick={() => setStatus('compilation_error')} className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md">Compilation Error</button>
          <button onClick={() => setStatus('time_limit')} className="px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md">Time Limit Exceeded</button>
          <button onClick={() => setStatus('pending')} className="px-4 py-2 bg-gray-500/10 text-gray-400 border border-gray-500/20 rounded-md">Pending...</button>
        </div>

        <ResultCard
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          status={status}
          testCases={status === 'compilation_error' || status === 'pending' ? [] : testCases}
          input="1\n2\n3"
          expectedOutput={status !== 'compilation_error' ? "6" : ""}
          actualOutput={status === 'success' ? "6" : status === 'wrong_answer' ? "10" : ""}
          compilerMessage={
            status === 'compilation_error' ? "SyntaxError: Unexpected token ')'\n  at Object.compileFunction (node:vm:360:18)\n  at wrapSafe (node:internal/modules/cjs/loader:1055:15)" : 
            status === 'runtime_error' ? "TypeError: Cannot read properties of undefined (reading 'length')\n  at solve (solution.js:10:15)" : undefined
          }
          executionTime={0.03}
          memory={8.4}
          onRun={() => {
            setStatus('pending');
            setTimeout(() => setStatus('success'), 2000);
          }}
          isRunLoading={status === 'pending'}
        />

        {!isOpen && (
          <button 
            onClick={() => setIsOpen(true)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium self-start mt-4"
          >
            Reopen Result Panel
          </button>
        )}
      </div>
    </div>
  );
}
