import { motion } from 'framer-motion';
import { SpendBreakdownData } from '@/types/chat';

interface SpendBreakdownWidgetProps {
  data: SpendBreakdownData;
}

const categoryColors = [
  'bg-primary',
  'bg-accent-foreground',
  'bg-progress-safe',
  'bg-progress-warning',
  'bg-progress-danger',
];

export function SpendBreakdownWidget({ data }: SpendBreakdownWidgetProps) {
  const total = data.items.reduce((sum, item) => sum + item.amount, 0);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-card p-5 shadow-widget w-full max-w-[340px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Spending Breakdown</p>
          <p className="text-xl font-bold font-data text-foreground mt-0.5">
            ₹{total.toLocaleString()}
          </p>
        </div>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">{data.period}</span>
      </div>
      
      {/* Stacked Progress Bar */}
      <div className="h-3 bg-secondary rounded-full overflow-hidden mb-5 flex">
        {data.items.map((item, index) => (
          <motion.div
            key={item.category}
            initial={{ width: 0 }}
            animate={{ width: `${item.percentage}%` }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`h-full ${categoryColors[index % categoryColors.length]}`}
          />
        ))}
      </div>
      
      {/* Category List */}
      <div className="space-y-3">
        {data.items.map((item, index) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="flex items-center gap-3"
          >
            <div className={`w-3 h-3 rounded-full ${categoryColors[index % categoryColors.length]}`} />
            <span className="text-lg">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground">{item.category}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-data font-semibold text-foreground">₹{item.amount.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground ml-1.5">{item.percentage}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}