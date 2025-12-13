import { ChatScreen } from '@/components/chat/ChatScreen';
import { BottomNav } from '@/components/navigation/BottomNav';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ChatScreen />
      <BottomNav />
    </div>
  );
};

export default Index;
