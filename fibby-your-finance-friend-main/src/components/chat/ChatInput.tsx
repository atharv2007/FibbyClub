import { useState, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useToast } from '@/hooks/use-toast';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  
  const {
    isListening,
    isSupported,
    interimTranscript,
    error,
    toggleListening,
  } = useSpeechRecognition({
    onResult: (transcript) => {
      const finalMessage = message ? `${message} ${transcript}` : transcript;
      setMessage(finalMessage);
    },
    onInterimResult: () => {
      // Interim results are shown in the UI
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Voice Input Error',
        description: error,
      });
    }
  }, [error, toast]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicClick = () => {
    if (!isSupported) {
      toast({
        variant: 'destructive',
        title: 'Not Supported',
        description: 'Voice input is not supported in your browser. Try Chrome or Edge.',
      });
      return;
    }
    toggleListening();
  };

  const displayValue = isListening && interimTranscript 
    ? (message ? `${message} ${interimTranscript}` : interimTranscript)
    : message;

  return (
    <div className="relative">
      {/* Listening Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-12 left-0 right-0 flex items-center justify-center"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-medium text-primary">Listening...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className={`flex items-center gap-2 p-2 bg-secondary rounded-full transition-all ${isListening ? 'ring-2 ring-primary/30' : ''}`}>
        <input
          type="text"
          value={displayValue}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening...' : 'Ask Fibby anything...'}
          disabled={disabled}
          className="flex-1 bg-transparent px-3 py-2 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
        />
        
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className={`h-10 w-10 transition-colors ${
              isListening 
                ? 'text-primary bg-primary/10 hover:bg-primary/20' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            disabled={disabled}
            onClick={handleMicClick}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </Button>
        </motion.div>
        
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleSend}
            disabled={!displayValue.trim() || disabled}
            size="icon"
            className="h-10 w-10 rounded-full shadow-fab disabled:shadow-none"
          >
            <Send size={18} />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}