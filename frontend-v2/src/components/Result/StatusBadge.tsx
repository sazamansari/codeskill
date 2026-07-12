import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertTriangle, AlertCircle, Clock } from 'lucide-react';

export type StatusType = 'success' | 'wrong_answer' | 'runtime_error' | 'compilation_error' | 'time_limit' | 'pending';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<StatusType, { label: string; icon: React.ElementType; classes: string }> = {
  success: {
    label: 'Accepted',
    icon: CheckCircle2,
    classes: 'bg-green-500/10 text-green-500 border-green-500/20',
  },
  wrong_answer: {
    label: 'Wrong Answer',
    icon: XCircle,
    classes: 'bg-red-500/10 text-red-500 border-red-500/20',
  },
  runtime_error: {
    label: 'Runtime Error',
    icon: AlertTriangle,
    classes: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  },
  compilation_error: {
    label: 'Compilation Error',
    icon: AlertCircle,
    classes: 'bg-red-500/10 text-red-500 border-red-500/20',
  },
  time_limit: {
    label: 'Time Limit Exceeded',
    icon: Clock,
    classes: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  pending: {
    label: 'Pending...',
    icon: Clock,
    classes: 'bg-gray-500/10 text-gray-400 border-gray-500/20 animate-pulse',
  }
};

export default function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border', config.classes, className)}>
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </div>
  );
}
