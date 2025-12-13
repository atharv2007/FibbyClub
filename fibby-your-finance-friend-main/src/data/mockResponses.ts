import { ChatMessage, SuggestionChip } from '@/types/chat';

export const initialMessage: ChatMessage = {
  id: '1',
  role: 'fibby',
  content: "Hey! I'm Fibby, your money buddy. How can I help you today?",
  timestamp: new Date(),
};

export const suggestionChips: SuggestionChip[] = [
  { id: '1', label: 'Analyze my weekend spend', emoji: '📊' },
  { id: '2', label: 'Can I afford a Goa trip?', emoji: '✈️' },
  { id: '3', label: 'Show my SIPs', emoji: '📈' },
  { id: '4', label: 'How is my budget?', emoji: '💰' },
  { id: '5', label: 'Where did my money go?', emoji: '🔍' },
  { id: '6', label: 'Set a spending limit', emoji: '🛑' },
  { id: '7', label: 'Check my subscriptions', emoji: '🔄' },
  { id: '8', label: 'Track my savings goal', emoji: '🎯' },
  { id: '9', label: 'Review my investments', emoji: '💎' },
];

export const intentResponses: Record<string, ChatMessage[]> = {
  'budget': [
    {
      id: '',
      role: 'fibby',
      content: "Let me check your budget status...",
      timestamp: new Date(),
    },
    {
      id: '',
      role: 'fibby',
      widget: {
        type: 'budget_meter',
        data: {
          label: 'Monthly Budget',
          used: 18000,
          total: 25000,
          currency: '₹',
        },
      },
      timestamp: new Date(),
    },
    {
      id: '',
      role: 'fibby',
      content: "You've used 72% of your monthly budget. You're on track, but keep an eye on discretionary spending.",
      quickReplies: [
        { id: 'qr1', label: 'Set a limit', emoji: '🛑' },
        { id: 'qr2', label: 'Show breakdown', emoji: '📊' },
        { id: 'qr3', label: 'Tips to save', emoji: '💡' },
      ],
      timestamp: new Date(),
    },
  ],
  'spend': [
    {
      id: '',
      role: 'fibby',
      content: "Here's your spending breakdown:",
      timestamp: new Date(),
    },
    {
      id: '',
      role: 'fibby',
      widget: {
        type: 'spend_breakdown',
        data: {
          period: 'This Month',
          items: [
            { category: 'Food & Dining', amount: 4200, percentage: 30, emoji: '🍔' },
            { category: 'Travel', amount: 2100, percentage: 15, emoji: '🚗' },
            { category: 'Shopping', amount: 3500, percentage: 25, emoji: '🛍️' },
            { category: 'Entertainment', amount: 2800, percentage: 20, emoji: '🎮' },
            { category: 'Bills', amount: 1400, percentage: 10, emoji: '📱' },
          ],
        },
      },
      timestamp: new Date(),
    },
    {
      id: '',
      role: 'fibby',
      content: "Food & Dining is your biggest expense. Would you like me to set a spending limit for this category?",
      quickReplies: [
        { id: 'qr1', label: 'Yes, set limit', emoji: '✅' },
        { id: 'qr2', label: 'No, thanks', emoji: '❌' },
        { id: 'qr3', label: 'Show details', emoji: '📋' },
      ],
      timestamp: new Date(),
    },
  ],
  'weekend': [
    {
      id: '',
      role: 'fibby',
      content: "Here's a look at your weekend spending:",
      timestamp: new Date(),
    },
    {
      id: '',
      role: 'fibby',
      widget: {
        type: 'merchant_leaderboard',
        data: {
          period: 'Weekend (Sat-Sun)',
          items: [
            { name: 'Social & Clubs', amount: 4500, emoji: '🍻' },
            { name: 'Zomato', amount: 1200, emoji: '🍕' },
            { name: 'Uber', amount: 800, emoji: '🚕' },
          ],
        },
      },
      timestamp: new Date(),
    },
    {
      id: '',
      role: 'fibby',
      content: "That's 20% of your monthly income in 2 days. Would you like to set a weekend spending cap?",
      quickReplies: [
        { id: 'qr1', label: 'Yes, set cap', emoji: '✅' },
        { id: 'qr2', label: 'Maybe later', emoji: '⏰' },
        { id: 'qr3', label: 'Compare weeks', emoji: '📈' },
      ],
      timestamp: new Date(),
    },
  ],
  'limit': [
    {
      id: '',
      role: 'fibby',
      content: "Great choice! Please confirm:",
      timestamp: new Date(),
    },
    {
      id: '',
      role: 'fibby',
      widget: {
        type: 'action_card',
        data: {
          title: 'Set Weekend Limit',
          description: 'Limit your weekend spending',
          actionLabel: 'Confirm',
          actionType: 'set_limit',
          value: '₹2,000',
          payload: { category: 'weekend', amount: 2000 },
        },
      },
      timestamp: new Date(),
    },
  ],
  'goa': [
    {
      id: '',
      role: 'fibby',
      content: "Let me check your savings and upcoming expenses...",
      timestamp: new Date(),
    },
    {
      id: '',
      role: 'fibby',
      widget: {
        type: 'budget_meter',
        data: {
          label: 'Goa Trip Fund',
          used: 8500,
          total: 15000,
          currency: '₹',
        },
      },
      timestamp: new Date(),
    },
    {
      id: '',
      role: 'fibby',
      content: "You're 57% of the way there! With 3 weeks of moderate saving, you'll hit your goal. Want me to create a savings plan?",
      quickReplies: [
        { id: 'qr1', label: 'Create plan', emoji: '📝' },
        { id: 'qr2', label: 'Show tips', emoji: '💡' },
        { id: 'qr3', label: 'Adjust goal', emoji: '🎯' },
      ],
      timestamp: new Date(),
    },
  ],
  'sip': [
    {
      id: '',
      role: 'fibby',
      content: "Here's your SIP portfolio:",
      timestamp: new Date(),
    },
    {
      id: '',
      role: 'fibby',
      widget: {
        type: 'spend_breakdown',
        data: {
          period: 'Monthly SIPs',
          items: [
            { category: 'Nifty 50 Index', amount: 5000, percentage: 50, emoji: '📊' },
            { category: 'Midcap Fund', amount: 3000, percentage: 30, emoji: '🚀' },
            { category: 'Gold ETF', amount: 2000, percentage: 20, emoji: '🥇' },
          ],
        },
      },
      timestamp: new Date(),
    },
    {
      id: '',
      role: 'fibby',
      content: "Good diversification! You're investing ₹10k/month with +12.4% returns YTD.",
      quickReplies: [
        { id: 'qr1', label: 'Increase SIP', emoji: '📈' },
        { id: 'qr2', label: 'Add new fund', emoji: '➕' },
        { id: 'qr3', label: 'View returns', emoji: '💰' },
      ],
      timestamp: new Date(),
    },
  ],
  'invest': [
    {
      id: '',
      role: 'fibby',
      content: "To complete your investment, open your trading app:",
      timestamp: new Date(),
    },
    {
      id: '',
      role: 'fibby',
      widget: {
        type: 'external_link',
        data: {
          platform: 'Zerodha',
          description: 'Open Zerodha to execute your trade',
          url: 'https://zerodha.com',
        },
      },
      quickReplies: [
        { id: 'qr1', label: 'Show alternatives', emoji: '🔄' },
        { id: 'qr2', label: 'Cancel', emoji: '❌' },
      ],
      timestamp: new Date(),
    },
  ],
  'confirm_action': [
    {
      id: '',
      role: 'fibby',
      content: "Done! I've set that up for you. I'll send you a reminder next Friday.",
      quickReplies: [
        { id: 'qr1', label: 'View all limits', emoji: '📋' },
        { id: 'qr2', label: 'Set another', emoji: '➕' },
        { id: 'qr3', label: 'Thanks!', emoji: '👍' },
      ],
      timestamp: new Date(),
    },
  ],
  'default': [
    {
      id: '',
      role: 'fibby',
      content: "I didn't quite catch that. Try asking about your budget, spending, or savings goals.",
      quickReplies: [
        { id: 'qr1', label: 'Check budget', emoji: '💰' },
        { id: 'qr2', label: 'Show spending', emoji: '📊' },
        { id: 'qr3', label: 'My goals', emoji: '🎯' },
      ],
      timestamp: new Date(),
    },
  ],
};

export function getIntentFromMessage(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('budget') || lowerMessage.includes('how is my')) {
    return 'budget';
  }
  if (lowerMessage.includes('spend') || lowerMessage.includes('where') || lowerMessage.includes('money go')) {
    return 'spend';
  }
  if (lowerMessage.includes('weekend') || lowerMessage.includes('party') || lowerMessage.includes('balance low')) {
    return 'weekend';
  }
  if (lowerMessage.includes('limit') || lowerMessage.includes('set') || lowerMessage.includes('cap') || lowerMessage.includes('yes')) {
    return 'limit';
  }
  if (lowerMessage.includes('goa') || lowerMessage.includes('trip') || lowerMessage.includes('afford')) {
    return 'goa';
  }
  if (lowerMessage.includes('sip') || lowerMessage.includes('mutual') || lowerMessage.includes('investment')) {
    return 'sip';
  }
  if (lowerMessage.includes('stock') || lowerMessage.includes('buy') || lowerMessage.includes('reliance')) {
    return 'invest';
  }
  if (lowerMessage.includes('confirm')) {
    return 'confirm_action';
  }
  
  return 'default';
}
