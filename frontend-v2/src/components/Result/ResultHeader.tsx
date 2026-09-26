"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusType } from './StatusBadge';
import { CheckCircle2, XCircle, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
// A simple confetti effect can be achieved using a library or raw DOM, but for this component, 
// we will simulate the premium feel using framer-motion particles if success.
// For now, let's keep it highly animated text.

interface ResultHeaderProps {
  status: StatusType;
  passedCount?: number;
  totalCount?: number;
}

const headerConfig = {
  success: {
    title: '🎉 Congratulations!',
    subtitle: (passed: number, total: number) => `You have passed all ${total} sample test cases. Click Submit to run your solution against hidden test cases.`,
    color: 'text-green-500',
    icon: CheckCircle2,
    animation: { scale: [0.9, 1.1, 1], transition: { duration: 0.5, type: 'spring' } }
  },
  wrong_answer: {
    title: '❌ Wrong Answer',
    subtitle: (passed: number, total: number) => `${passed} of ${total} test cases passed.`,
    color: 'text-red-500',
    icon: XCircle,
    animation: { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } }
  },
  runtime_error: {
    title: '⚠ Runtime Error',
    subtitle: () => 'Your code encountered an error during execution.',
    color: 'text-orange-500',
    icon: AlertTriangle,
    animation: { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } }
  },
  compilation_error: {
    title: '⚠ Compilation Error',
    subtitle: () => 'Your code failed to compile. Check the compiler message below.',
    color: 'text-red-500',
    icon: AlertCircle,
    animation: { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } }
  },
  time_limit: {
    title: '⏱ Time Limit Exceeded',
    subtitle: () => 'Your code took too long to execute.',
    color: 'text-amber-500',
    icon: Clock,
    animation: { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } }
  },
  pending: {
    title: 'Running...',
    subtitle: () => 'Evaluating your code against test cases.',
    color: 'text-gray-400',
    icon: Clock,
    animation: { opacity: [0.5, 1, 0.5], transition: { duration: 1.5, repeat: Infinity } }
  }
};

export default function ResultHeader({ status, passedCount = 0, totalCount = 0 }: ResultHeaderProps) {
  const config = headerConfig[status];
  
  // Confetti trigger
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    if (status === 'success') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="flex flex-col items-start gap-2 py-4 relative overflow-hidden rounded-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-1 w-full"
        >
          <motion.h2 
            animate={config.animation as any}
            className={`text-2xl md:text-3xl font-bold tracking-tight ${config.color}`}
          >
            {config.title}
          </motion.h2>
          
          <p className="text-sm md:text-base text-zinc-400">
            {config.subtitle(passedCount, totalCount)}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
