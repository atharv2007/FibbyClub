export type MessageRole = 'user' | 'fibby' | 'assistant';

export type WidgetType = 
  | 'budget_meter' 
  | 'spend_breakdown' 
  | 'action_card' 
  | 'external_link'
  | 'merchant_leaderboard';

export interface BudgetMeterData {
  label: string;
  used: number;
  total: number;
  currency: string;
}

export interface SpendBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
  emoji: string;
}

export interface SpendBreakdownData {
  items: SpendBreakdownItem[];
  period: string;
}

export interface ActionCardData {
  title: string;
  description: string;
  actionLabel?: string;
  buttonText?: string;
  value?: string;
  actionType: 'set_limit' | 'create_goal' | 'confirm' | 'limit' | 'goal' | 'save';
  payload?: Record<string, unknown>;
}

export interface ExternalLinkData {
  platform?: string;
  title?: string;
  logo?: string;
  description: string;
  url: string;
}

export interface MerchantLeaderboardData {
  items: {
    name: string;
    amount: number;
    emoji: string;
  }[];
  period: string;
}

export type WidgetData = 
  | { type: 'budget_meter'; data: BudgetMeterData }
  | { type: 'spend_breakdown'; data: SpendBreakdownData }
  | { type: 'action_card'; data: ActionCardData }
  | { type: 'external_link'; data: ExternalLinkData }
  | { type: 'merchant_leaderboard'; data: MerchantLeaderboardData };

export interface QuickReply {
  id: string;
  label: string;
  emoji?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content?: string;
  widget?: WidgetData;
  quickReplies?: QuickReply[];
  timestamp: Date;
}

export interface SuggestionChip {
  id: string;
  label: string;
  emoji?: string;
  intent?: string;
}

// Chat History Types
export interface ChatSession {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  category: ChatCategory;
  messages: ChatMessage[];
}

export type ChatCategory = 
  | 'budget' 
  | 'spending' 
  | 'goals' 
  | 'investments' 
  | 'subscriptions' 
  | 'general';

export const categoryLabels: Record<ChatCategory, string> = {
  budget: 'Budget',
  spending: 'Spending',
  goals: 'Goals',
  investments: 'Investments',
  subscriptions: 'Subscriptions',
  general: 'General',
};

export const categoryEmojis: Record<ChatCategory, string> = {
  budget: '📊',
  spending: '💸',
  goals: '🎯',
  investments: '📈',
  subscriptions: '🔄',
  general: '💬',
};