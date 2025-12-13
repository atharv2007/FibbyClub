import { motion } from 'framer-motion';
import { Home, TrendingUp, Trophy, User, MessageCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: TrendingUp, label: 'Track', path: '/track' },
  { icon: MessageCircle, label: 'Fibby', path: '/', isCenter: true },
  { icon: Trophy, label: 'Goals', path: '/goals' },
  { icon: User, label: 'Me', path: '/profile' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-nav z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto relative">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="absolute -top-5 left-1/2 -translate-x-1/2"
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-fab ${
                  isActive ? 'bg-primary' : 'bg-primary'
                }`}>
                  <Icon size={24} className="text-primary-foreground" />
                </div>
                <span className={`text-[10px] font-semibold mt-1 block text-center ${
                  isActive ? 'text-nav-active' : 'text-nav-inactive'
                }`}>
                  {item.label}
                </span>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 px-4 py-2"
              whileTap={{ scale: 0.95 }}
            >
              <Icon
                size={22}
                className={isActive ? 'text-nav-active' : 'text-nav-inactive'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] font-semibold ${
                isActive ? 'text-nav-active' : 'text-nav-inactive'
              }`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
