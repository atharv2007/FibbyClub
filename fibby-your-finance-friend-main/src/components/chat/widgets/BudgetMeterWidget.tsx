import { motion } from 'framer-motion';
import { BudgetMeterData } from '@/types/chat';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface BudgetMeterWidgetProps {
  data: BudgetMeterData;
}

export function BudgetMeterWidget({ data }: BudgetMeterWidgetProps) {
  const percentage = Math.round((data.used / data.total) * 100);
  const remaining = data.total - data.used;
  
  const getStatus = () => {
    if (percentage < 50) return { color: 'safe', label: 'On Track', icon: TrendingDown };
    if (percentage < 80) return { color: 'warning', label: 'Watch Out', icon: Minus };
    return { color: 'danger', label: 'Over Budget', icon: TrendingUp };
  };
  
  const status = getStatus();
  const StatusIcon = status.icon;

  const getProgressColor = () => {
    if (percentage < 50) return 'bg-progress-safe';
    if (percentage < 80) return 'bg-progress-warning';
    return 'bg-progress-danger';
  };

  const getStatusColor = () => {
    if (percentage < 50) return 'text-progress-safe bg-progress-safe/10';
    if (percentage < 80) return 'text-progress-warning bg-progress-warning/10';
    return 'text-progress-danger bg-progress-danger/10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-card p-5 shadow-widget w-full max-w-[320px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{data.label}</p>
          <p className="text-2xl font-bold font-data text-foreground mt-0.5">
            {data.currency}{data.used.toLocaleString()}
          </p>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {status.label}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-3 bg-secondary rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${getProgressColor()}`}
        />
      </div>
      
      {/* Footer Stats */}
      <div className="flex justify-between items-center">
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-data font-semibold text-foreground">{percentage}%</span>
          <span className="text-xs text-muted-foreground">used</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted-foreground">Remaining: </span>
          <span className="text-sm font-data font-semibold text-foreground">
            {data.currency}{remaining.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}