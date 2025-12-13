import { useLocation } from 'react-router-dom';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Home, TrendingUp, Trophy, User } from 'lucide-react';

const pageConfig: Record<string, { icon: React.ElementType; title: string; subtitle: string }> = {
  '/home': { icon: Home, title: 'Home', subtitle: 'Your financial overview' },
  '/track': { icon: TrendingUp, title: 'Track', subtitle: 'Monitor your spending' },
  '/goals': { icon: Trophy, title: 'Goals', subtitle: 'Achieve your targets' },
  '/profile': { icon: User, title: 'Profile', subtitle: 'Manage your account' },
};

export function PlaceholderPage() {
  const location = useLocation();
  const config = pageConfig[location.pathname] || pageConfig['/home'];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
          <Icon size={32} className="text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{config.title}</h1>
        <p className="text-muted-foreground text-center">{config.subtitle}</p>
        <p className="text-sm text-muted-foreground/60 mt-4">Coming soon...</p>
      </div>
      <BottomNav />
    </div>
  );
}
