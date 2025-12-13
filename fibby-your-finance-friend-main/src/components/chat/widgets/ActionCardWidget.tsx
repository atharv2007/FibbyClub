import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActionCardData } from '@/types/chat';
import { Check, X, AlertTriangle, Target, PiggyBank, Pencil, Plus, Minus } from 'lucide-react';

interface ActionCardWidgetProps {
  data: ActionCardData;
  onAction: () => void;
}

const iconMap = {
  limit: AlertTriangle,
  set_limit: AlertTriangle,
  goal: Target,
  create_goal: Target,
  save: PiggyBank,
  confirm: Check,
};

// Helper to parse currency value
const parseValue = (value: string): number => {
  const num = value.replace(/[^0-9.-]/g, '');
  return parseInt(num) || 0;
};

// Helper to format currency value
const formatValue = (num: number, currency: string = '₹'): string => {
  return `${currency}${num.toLocaleString('en-IN')}`;
};

export function ActionCardWidget({ data, onAction }: ActionCardWidgetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [numericValue, setNumericValue] = useState(() => parseValue(data.value || '0'));
  const [displayValue, setDisplayValue] = useState(data.value || '');
  
  const Icon = iconMap[data.actionType as keyof typeof iconMap] || AlertTriangle;
  const buttonLabel = data.actionLabel || data.buttonText || 'Confirm';
  
  const handleIncrement = () => {
    const step = numericValue >= 10000 ? 1000 : 500;
    setNumericValue(prev => prev + step);
  };
  
  const handleDecrement = () => {
    const step = numericValue >= 10000 ? 1000 : 500;
    setNumericValue(prev => Math.max(0, prev - step));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setNumericValue(parseInt(raw) || 0);
  };
  
  const handleConfirmEdit = () => {
    setDisplayValue(formatValue(numericValue));
    setIsEditing(false);
    onAction();
  };
  
  const handleCancelEdit = () => {
    setNumericValue(parseValue(displayValue || data.value || '0'));
    setIsEditing(false);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-card p-5 shadow-widget w-full max-w-[320px]"
    >
      {/* Header with Icon */}
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2.5 rounded-button bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground leading-snug">{data.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
        </div>
      </div>
      
      {/* Value Display / Edit Section */}
      {(data.value || isEditing) && (
        <div className="bg-secondary/50 rounded-button px-4 py-3 mb-4">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center justify-center gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDecrement}
                  className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold font-data text-foreground">₹</span>
                  <input
                    type="text"
                    value={numericValue.toLocaleString('en-IN')}
                    onChange={handleInputChange}
                    className="w-24 text-center text-xl font-bold font-data text-foreground bg-transparent border-b-2 border-primary focus:outline-none"
                    autoFocus
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleIncrement}
                  className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="display"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center justify-between"
              >
                <span className="text-2xl font-bold font-data text-foreground">
                  {displayValue || data.value}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-button bg-primary/15 text-primary hover:bg-primary/25 transition-colors font-medium text-sm"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={isEditing ? handleConfirmEdit : onAction}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 px-4 rounded-button font-semibold text-sm shadow-soft transition-all hover:shadow-medium"
        >
          <Check className="w-4 h-4" />
          {isEditing ? 'Confirm' : buttonLabel}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={isEditing ? handleCancelEdit : undefined}
          className="flex items-center justify-center p-2.5 bg-secondary text-muted-foreground rounded-button transition-colors hover:bg-secondary/80"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
