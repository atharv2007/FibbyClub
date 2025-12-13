import { motion } from 'framer-motion';
import { MerchantLeaderboardData } from '@/types/chat';
import { TrendingUp } from 'lucide-react';

interface MerchantLeaderboardWidgetProps {
  data: MerchantLeaderboardData;
}

export function MerchantLeaderboardWidget({ data }: MerchantLeaderboardWidgetProps) {
  const maxAmount = Math.max(...data.items.map(i => i.amount));
  const total = data.items.reduce((sum, item) => sum + item.amount, 0);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-card p-5 shadow-widget w-full max-w-[320px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-progress-danger/10">
            <TrendingUp className="w-4 h-4 text-progress-danger" />
          </div>
          <p className="text-sm font-semibold text-foreground">Top Spending</p>
        </div>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">{data.period}</span>
      </div>
      
      {/* Merchant List */}
      <div className="space-y-3">
        {data.items.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="group"
          >
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-lg">
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-medium text-foreground truncate">{item.name}</span>
                  <span className="text-sm font-data font-bold text-foreground">₹{item.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="ml-11 h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.amount / maxAmount) * 100}%` }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full bg-gradient-to-r from-progress-danger/80 to-progress-danger rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Total */}
      <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Total spent</span>
        <span className="text-base font-data font-bold text-foreground">₹{total.toLocaleString()}</span>
      </div>
    </motion.div>
  );
}