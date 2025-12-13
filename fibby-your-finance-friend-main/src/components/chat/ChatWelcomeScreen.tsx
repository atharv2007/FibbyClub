import { motion } from 'framer-motion';
import { SuggestionChip } from '@/types/chat';
import fibbyLogo from '@/assets/fibby-logo.png';

interface ChatWelcomeScreenProps {
  chips: SuggestionChip[];
  onSelectChip: (chip: SuggestionChip) => void;
}

export function ChatWelcomeScreen({ chips, onSelectChip }: ChatWelcomeScreenProps) {
  // Split chips into rows for the marquee effect
  const row1 = chips.slice(0, 3);
  const row2 = chips.slice(3, 6);
  const row3 = chips.slice(6, 9);
  
  // Duplicate for seamless scroll
  const allRows = [
    [...row1, ...row1],
    [...row2, ...row2],
    [...row3, ...row3],
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
      {/* Gradient Ring Avatar with Fibby Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative mb-8"
      >
        {/* Outer gradient ring */}
        <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-primary via-accent-foreground to-primary/60">
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
            {/* Inner gradient ring */}
            <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-br from-primary via-accent-foreground to-primary/60">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img 
                  src={fibbyLogo} 
                  alt="Fibby" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl -z-10" />
      </motion.div>
      
      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-2xl font-bold text-foreground text-center mb-2"
      >
        Ask Fibby anything
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-sm text-muted-foreground text-center mb-10"
      >
        Your AI-powered money buddy
      </motion.p>
      
      {/* Horizontally scrolling suggestion chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="w-full max-w-lg space-y-3 overflow-hidden"
      >
        {allRows.map((rowChips, rowIndex) => (
          <div
            key={rowIndex}
            className="relative overflow-hidden"
          >
            <motion.div
              className="flex gap-2.5 w-max"
              animate={{
                x: rowIndex % 2 === 0 ? ['0%', '-50%'] : ['-50%', '0%'],
              }}
              transition={{
                duration: 25 + rowIndex * 5,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {rowChips.map((chip, index) => (
                <button
                  key={`${chip.id}-${index}`}
                  onClick={() => onSelectChip(chip)}
                  className="flex-shrink-0 px-4 py-2.5 glass rounded-full text-sm font-medium text-foreground shadow-soft hover:shadow-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {chip.emoji && <span className="mr-2">{chip.emoji}</span>}
                  {chip.label}
                </button>
              ))}
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
