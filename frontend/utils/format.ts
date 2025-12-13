// Indian currency formatting
export const formatINR = (amount: number): string => {
  // Convert to Indian numbering system (Lakhs/Crores)
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  
  if (absAmount >= 10000000) {
    // Crores
    return `${sign}₹${(absAmount / 10000000).toFixed(2)}Cr`;
  } else if (absAmount >= 100000) {
    // Lakhs
    return `${sign}₹${(absAmount / 100000).toFixed(2)}L`;
  } else if (absAmount >= 1000) {
    // Thousands
    return `${sign}₹${(absAmount / 1000).toFixed(1)}k`;
  } else {
    return `${sign}₹${absAmount.toFixed(0)}`;
  }
};

export const formatINRFull = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const getMoneyMood = (spendPercentage: number): { text: string; color: string; emoji: string } => {
  if (spendPercentage < 60) {
    return { text: 'Stable', color: '#10B981', emoji: '🟢' };
  } else if (spendPercentage < 80) {
    return { text: 'Moderate', color: '#F59E0B', emoji: '🟡' };
  } else {
    return { text: 'High Alert', color: '#F43F5E', emoji: '🔴' };
  }
};