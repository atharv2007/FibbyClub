import { motion } from 'framer-motion';
import fibbyLogo from '@/assets/fibby-logo.png';

interface FibbyAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function FibbyAvatar({ size = 'md', animated = false }: FibbyAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 shadow-soft`}
      animate={animated ? { scale: [1, 1.05, 1] } : undefined}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <img 
        src={fibbyLogo} 
        alt="Fibby" 
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
}
