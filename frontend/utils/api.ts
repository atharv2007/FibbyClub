const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

export const api = {
  // Initialize user and get all data
  initializeUser: async () => {
    const response = await fetch(`${API_URL}/api/users/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },
  
  // Get dashboard data
  getDashboard: async (userId: string) => {
    const response = await fetch(`${API_URL}/api/dashboard?user_id=${userId}`);
    return response.json();
  },
  
  // Get accounts
  getAccounts: async (userId: string) => {
    const response = await fetch(`${API_URL}/api/accounts?user_id=${userId}`);
    return response.json();
  },
  
  // Get transactions
  getTransactions: async (userId: string, limit = 100) => {
    const response = await fetch(`${API_URL}/api/transactions?user_id=${userId}&limit=${limit}`);
    return response.json();
  },
  
  // Get category breakdown
  getCategoryBreakdown: async (userId: string, months = 1) => {
    const response = await fetch(`${API_URL}/api/transactions/category-breakdown?user_id=${userId}&months=${months}`);
    return response.json();
  },
  
  // Get spend velocity
  getSpendVelocity: async (userId: string) => {
    const response = await fetch(`${API_URL}/api/analytics/spend-velocity?user_id=${userId}`);
    return response.json();
  },
  
  // Get insights
  getInsights: async (userId: string, unreadOnly = false) => {
    const response = await fetch(`${API_URL}/api/insights?user_id=${userId}&unread_only=${unreadOnly}`);
    return response.json();
  },
  
  // Get goals
  getGoals: async (userId: string) => {
    const response = await fetch(`${API_URL}/api/goals?user_id=${userId}`);
    return response.json();
  },
  
  // Create goal
  createGoal: async (userId: string, goalData: any) => {
    const response = await fetch(`${API_URL}/api/goals?user_id=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalData),
    });
    return response.json();
  },
  
  // Update goal
  updateGoal: async (userId: string, goalId: string, goalData: any) => {
    const response = await fetch(`${API_URL}/api/goals/${goalId}?user_id=${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalData),
    });
    return response.json();
  },
  
  // Delete goal
  deleteGoal: async (userId: string, goalId: string) => {
    const response = await fetch(`${API_URL}/api/goals/${goalId}?user_id=${userId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
  
  // Chat with Fibby
  chat: async (message: string, sessionId?: string) => {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_id: sessionId }),
    });
    return response.json();
  },
  
  // Chat History
  saveConversation: async (data: {
    user_id: string;
    conversation_id: string;
    user_message: string;
    assistant_message: string;
    card_type?: string;
    metrics?: any;
  }) => {
    const response = await fetch(`${API_URL}/api/chat/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  getChatHistory: async (userId: string) => {
    const response = await fetch(`${API_URL}/api/chat/conversations?user_id=${userId}`);
    return response.json();
  },
  
  getConversation: async (userId: string, conversationId: string) => {
    const response = await fetch(`${API_URL}/api/chat/conversations/${conversationId}?user_id=${userId}`);
    return response.json();
  },
  
  deleteConversation: async (userId: string, conversationId: string) => {
    const response = await fetch(`${API_URL}/api/chat/conversations/${conversationId}?user_id=${userId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
  
  // Get monthly spending
  getMonthlySpending: async (userId: string, months = 6) => {
    const response = await fetch(`${API_URL}/api/analytics/monthly-spending?user_id=${userId}&months=${months}`);
    return response.json();
  },
  
  // Get monthly income
  getMonthlyIncome: async (userId: string, months = 6) => {
    const response = await fetch(`${API_URL}/api/analytics/monthly-income?user_id=${userId}&months=${months}`);
    return response.json();
  },
  
  // Get merchant leaderboard
  getMerchantLeaderboard: async (userId: string, limit = 10) => {
    const response = await fetch(`${API_URL}/api/transactions/merchant-leaderboard?user_id=${userId}&limit=${limit}`);
    return response.json();
  },
};