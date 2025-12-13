import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChatMessage, SuggestionChip, ChatSession, QuickReply } from '@/types/chat';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { SuggestionChips } from './SuggestionChips';
import { ChatInput } from './ChatInput';
import { ChatHistoryDrawer } from './ChatHistoryDrawer';
import { ChatWelcomeScreen } from './ChatWelcomeScreen';
import { 
  suggestionChips, 
  intentResponses, 
  getIntentFromMessage 
} from '@/data/mockResponses';
import { mockChatHistory } from '@/data/mockChatHistory';

export function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(mockChatHistory);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isFreshChat = messages.length === 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const simulateFibbyResponse = async (userMessage: string) => {
    setIsTyping(true);
    setShowSuggestions(false);

    const intent = getIntentFromMessage(userMessage);
    const responses = intentResponses[intent] || intentResponses['default'];

    for (let i = 0; i < responses.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      
      setMessages(prev => [...prev, {
        ...responses[i],
        id: generateId(),
        timestamp: new Date(),
      }]);

      if (i < responses.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    setIsTyping(false);
    setTimeout(() => setShowSuggestions(true), 500);
  };

  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    simulateFibbyResponse(content);
  };

  const handleSuggestionSelect = (chip: SuggestionChip) => {
    const fullMessage = chip.emoji ? `${chip.label} ${chip.emoji}` : chip.label;
    handleSendMessage(fullMessage);
  };

  const handleWidgetAction = () => {
    handleSendMessage('Confirm');
  };

  const handleQuickReply = (reply: QuickReply) => {
    const message = reply.emoji ? `${reply.label} ${reply.emoji}` : reply.label;
    handleSendMessage(message);
  };

  const handleClearChat = () => {
    setMessages([]);
    setShowSuggestions(true);
  };

  const handleNewChat = () => {
    setMessages([]);
    setShowSuggestions(true);
  };

  const handleSelectSession = (session: ChatSession) => {
    setMessages(session.messages);
    setShowSuggestions(true);
  };

  const handleDeleteSession = (sessionId: string) => {
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  return (
    <div className="flex flex-col h-screen bg-background max-w-lg mx-auto">
      <ChatHeader onClearChat={handleClearChat} onOpenHistory={() => setIsHistoryOpen(true)} />
      
      {/* Welcome Screen or Messages */}
      {isFreshChat ? (
        <ChatWelcomeScreen 
          chips={suggestionChips} 
          onSelectChip={handleSuggestionSelect} 
        />
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-48">
          {messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              onWidgetAction={handleWidgetAction}
              onQuickReply={handleQuickReply}
            />
          ))}
          
          <AnimatePresence>
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
      )}
      
      {/* Input Area */}
      <div className="fixed bottom-16 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-4 px-4 pb-4 max-w-lg mx-auto">
        <AnimatePresence>
          {showSuggestions && !isTyping && !isFreshChat && (
            <SuggestionChips 
              chips={suggestionChips.slice(0, 5)} 
              onSelect={handleSuggestionSelect} 
            />
          )}
        </AnimatePresence>
        
        <ChatInput onSend={handleSendMessage} disabled={isTyping} />
      </div>
      
      {/* History Drawer */}
      <ChatHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={chatSessions}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onNewChat={handleNewChat}
      />
    </div>
  );
}