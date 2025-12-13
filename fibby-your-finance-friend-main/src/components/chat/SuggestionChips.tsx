import { motion } from 'framer-motion';
import { SuggestionChip } from '@/types/chat';

interface SuggestionChipsProps {
  chips: SuggestionChip[];
  onSelect: (chip: SuggestionChip) => void;
}

export function SuggestionChips({ chips, onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1">
      {chips.map((chip, index) => (
        <motion.button
          key={chip.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(chip)}
          className="flex-shrink-0 px-4 py-2 bg-chip-bg border border-chip-border rounded-full text-sm font-medium text-chip-text shadow-soft hover:shadow-medium transition-shadow"
        >
          {chip.emoji && <span className="mr-1.5">{chip.emoji}</span>}
          {chip.label}
        </motion.button>
      ))}
    </div>
  );
}
