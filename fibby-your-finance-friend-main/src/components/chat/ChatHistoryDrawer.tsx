import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Calendar, MessageSquare, Trash2, Plus } from 'lucide-react';
import { ChatSession, ChatCategory, categoryLabels, categoryEmojis } from '@/types/chat';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';

interface ChatHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  onSelectSession: (session: ChatSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewChat: () => void;
}

type DateGroup = 'today' | 'thisWeek' | 'thisMonth' | 'older';

const dateGroupLabels: Record<DateGroup, string> = {
  today: 'Today',
  thisWeek: 'This Week',
  thisMonth: 'This Month',
  older: 'Older',
};

export function ChatHistoryDrawer({ 
  isOpen, 
  onClose, 
  sessions, 
  onSelectSession,
  onDeleteSession,
  onNewChat
}: ChatHistoryDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ChatCategory | 'all'>('all');
  
  const categories: (ChatCategory | 'all')[] = ['all', 'budget', 'spending', 'goals', 'investments', 'subscriptions', 'general'];
  
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const matchesSearch = searchQuery === '' || 
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.preview.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || session.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [sessions, searchQuery, selectedCategory]);
  
  const groupedSessions = useMemo(() => {
    const groups: Record<DateGroup, ChatSession[]> = {
      today: [],
      thisWeek: [],
      thisMonth: [],
      older: [],
    };
    
    filteredSessions.forEach(session => {
      const date = new Date(session.timestamp);
      if (isToday(date)) {
        groups.today.push(session);
      } else if (isThisWeek(date)) {
        groups.thisWeek.push(session);
      } else if (isThisMonth(date)) {
        groups.thisMonth.push(session);
      } else {
        groups.older.push(session);
      }
    });
    
    return groups;
  }, [filteredSessions]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-[85%] max-w-[360px] bg-background z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Chat History</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-button hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              
              {/* New Chat Button */}
              <button
                onClick={() => {
                  onNewChat();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 px-4 rounded-button font-semibold text-sm shadow-soft hover:shadow-medium transition-all mb-4"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </button>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-button text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="px-4 py-3 border-b border-border overflow-x-auto scrollbar-hide">
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {cat === 'all' ? 'All' : `${categoryEmojis[cat]} ${categoryLabels[cat]}`}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Session List */}
            <div className="flex-1 overflow-y-auto">
              {filteredSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">No conversations found</p>
                </div>
              ) : (
                <div className="p-4 space-y-6">
                  {(Object.keys(groupedSessions) as DateGroup[]).map((group) => {
                    if (groupedSessions[group].length === 0) return null;
                    
                    return (
                      <div key={group}>
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            {dateGroupLabels[group]}
                          </h3>
                        </div>
                        
                        <div className="space-y-2">
                          {groupedSessions[group].map((session) => (
                            <motion.div
                              key={session.id}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="group glass rounded-card p-3 cursor-pointer hover:shadow-soft transition-all"
                              onClick={() => {
                                onSelectSession(session);
                                onClose();
                              }}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm">{categoryEmojis[session.category]}</span>
                                    <h4 className="text-sm font-semibold text-foreground truncate">
                                      {session.title}
                                    </h4>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {session.preview}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground/70 mt-1.5 font-data">
                                    {format(new Date(session.timestamp), 'MMM d, h:mm a')}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteSession(session.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}