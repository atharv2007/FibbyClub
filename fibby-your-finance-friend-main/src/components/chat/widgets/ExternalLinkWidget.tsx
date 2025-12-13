import { motion } from 'framer-motion';
import { ExternalLinkData } from '@/types/chat';
import { ArrowUpRight } from 'lucide-react';

interface ExternalLinkWidgetProps {
  data: ExternalLinkData;
}

export function ExternalLinkWidget({ data }: ExternalLinkWidgetProps) {
  const title = data.title || data.platform || 'Open Link';
  const logo = data.logo || title.charAt(0);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-card p-4 shadow-widget w-full max-w-[300px]"
    >
      <div className="flex items-center gap-3">
        {/* App Icon */}
        <div className="w-12 h-12 rounded-button bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">{logo}</span>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground truncate">{data.description}</p>
        </div>
        
        {/* Action Button */}
        <motion.a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full shadow-soft"
        >
          <ArrowUpRight className="w-4 h-4" />
        </motion.a>
      </div>
    </motion.div>
  );
}