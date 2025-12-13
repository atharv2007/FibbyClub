import { motion } from 'framer-motion';
import { QuickReply } from '@/types/chat';

interface QuickRepliesProps {
  replies: QuickReply[];
  onSelect: (reply: QuickReply) => void;
}

export function QuickReplies({ replies, onSelect }: QuickRepliesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-wrap gap-2 mt-3"
    >
      {replies.map((reply) => (
        <motion.button
          key={reply.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(reply)}
          className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          {reply.emoji && <span className="mr-1.5">{reply.emoji}</span>}
          {reply.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
