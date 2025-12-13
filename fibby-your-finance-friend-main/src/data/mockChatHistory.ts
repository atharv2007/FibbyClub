import { ChatSession } from '@/types/chat';

export const mockChatHistory: ChatSession[] = [
  {
    id: 'session-1',
    title: 'Budget Analysis',
    preview: 'Looking at your monthly budget, you\'ve used 72% so far...',
    timestamp: new Date(),
    category: 'budget',
    messages: [
      {
        id: 'msg-1-1',
        role: 'user',
        content: 'How is my budget looking?',
        timestamp: new Date(),
      },
      {
        id: 'msg-1-2',
        role: 'assistant',
        content: 'Looking at your monthly budget, you\'ve used 72% so far. That\'s ₹18,000 of your ₹25,000 limit.',
        timestamp: new Date(),
        widget: {
          type: 'budget_meter',
          data: {
            label: 'Monthly Budget',
            used: 18000,
            total: 25000,
            currency: '₹',
          },
        },
      },
    ],
  },
  {
    id: 'session-2',
    title: 'Weekend Spending Review',
    preview: 'Looks like you had quite a weekend! Your spending was higher than usual.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    category: 'spending',
    messages: [
      {
        id: 'msg-2-1',
        role: 'user',
        content: 'Why is my balance so low?',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'msg-2-2',
        role: 'assistant',
        content: 'Looks like you had quite a weekend! Your spending was higher than usual.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: 'session-3',
    title: 'New Laptop Goal',
    preview: 'I\'ve created a savings goal for your new laptop. Let\'s aim for ₹80,000.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    category: 'goals',
    messages: [
      {
        id: 'msg-3-1',
        role: 'user',
        content: 'I want to save for a new laptop',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'msg-3-2',
        role: 'assistant',
        content: 'I\'ve created a savings goal for your new laptop. Let\'s aim for ₹80,000.',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: 'session-4',
    title: 'Investment Options',
    preview: 'Based on your profile, I\'d recommend a balanced portfolio with mutual funds.',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    category: 'investments',
    messages: [
      {
        id: 'msg-4-1',
        role: 'user',
        content: 'Where should I invest my savings?',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'msg-4-2',
        role: 'assistant',
        content: 'Based on your profile, I\'d recommend a balanced portfolio with mutual funds.',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: 'session-5',
    title: 'Subscription Audit',
    preview: 'I found 6 active subscriptions totaling ₹2,800 per month.',
    timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    category: 'subscriptions',
    messages: [
      {
        id: 'msg-5-1',
        role: 'user',
        content: 'What subscriptions am I paying for?',
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'msg-5-2',
        role: 'assistant',
        content: 'I found 6 active subscriptions totaling ₹2,800 per month.',
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: 'session-6',
    title: 'Food Spending Limit',
    preview: 'Done! I\'ve set a ₹3,000 limit for food delivery apps.',
    timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    category: 'spending',
    messages: [
      {
        id: 'msg-6-1',
        role: 'user',
        content: 'Set a limit for food spending',
        timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'msg-6-2',
        role: 'assistant',
        content: 'Done! I\'ve set a ₹3,000 limit for food delivery apps.',
        timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: 'session-7',
    title: 'Vacation Savings',
    preview: 'Great idea! I\'ve set up a vacation fund with a goal of ₹50,000.',
    timestamp: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    category: 'goals',
    messages: [
      {
        id: 'msg-7-1',
        role: 'user',
        content: 'Help me save for a Goa trip',
        timestamp: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'msg-7-2',
        role: 'assistant',
        content: 'Great idea! I\'ve set up a vacation fund with a goal of ₹50,000.',
        timestamp: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      },
    ],
  },
];