import { motion } from 'framer-motion';
import { ChatMessage, QuickReply } from '@/types/chat';
import { FibbyAvatar } from './FibbyAvatar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BudgetMeterWidget } from './widgets/BudgetMeterWidget';
import { SpendBreakdownWidget } from './widgets/SpendBreakdownWidget';
import { ActionCardWidget } from './widgets/ActionCardWidget';
import { ExternalLinkWidget } from './widgets/ExternalLinkWidget';
import { MerchantLeaderboardWidget } from './widgets/MerchantLeaderboardWidget';
import { QuickReplies } from './QuickReplies';

interface MessageBubbleProps {
  message: ChatMessage;
  onWidgetAction?: () => void;
  onQuickReply?: (reply: QuickReply) => void;
}

export function MessageBubble({ message, onWidgetAction, onQuickReply }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  const renderWidget = () => {
    if (!message.widget) return null;

    switch (message.widget.type) {
      case 'budget_meter':
        return <BudgetMeterWidget data={message.widget.data} />;
      case 'spend_breakdown':
        return <SpendBreakdownWidget data={message.widget.data} />;
      case 'action_card':
        return <ActionCardWidget data={message.widget.data} onAction={onWidgetAction || (() => {})} />;
      case 'external_link':
        return <ExternalLinkWidget data={message.widget.data} />;
      case 'merchant_leaderboard':
        return <MerchantLeaderboardWidget data={message.widget.data} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3 flex-row"
    >
      {!isUser && <FibbyAvatar size="sm" />}
      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" alt="User" />
          <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">U</AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex-1 flex flex-col gap-2 items-start">
        {message.content && (
          <div
            className={`px-4 py-3 text-[15px] leading-relaxed max-w-[85%] ${
              isUser
                ? 'bg-user-bubble text-user-bubble-foreground rounded-[16px] rounded-tl-[4px]'
                : 'bg-fibby-bubble text-fibby-bubble-foreground rounded-[16px] rounded-tl-[4px] shadow-soft'
            }`}
          >
            {message.content}
          </div>
        )}
        
        {message.widget && renderWidget()}
        
        {message.quickReplies && message.quickReplies.length > 0 && onQuickReply && (
          <QuickReplies replies={message.quickReplies} onSelect={onQuickReply} />
        )}
      </div>
    </motion.div>
  );
}
