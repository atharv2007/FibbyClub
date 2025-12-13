import { FibbyAvatar } from './FibbyAvatar';
import { MoreVertical, Menu, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ChatHeaderProps {
  onClearChat: () => void;
  onOpenHistory: () => void;
}

export function ChatHeader({ onClearChat, onOpenHistory }: ChatHeaderProps) {
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleClearConfirm = () => {
    onClearChat();
    setShowClearDialog(false);
  };

  return (
    <header className="sticky top-0 z-10 glass-strong px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-muted-foreground -ml-2"
            onClick={onOpenHistory}
          >
            <Menu size={20} />
          </Button>
          <FibbyAvatar size="md" animated />
          <div>
            <h1 className="font-bold text-foreground text-lg leading-tight">Fibby</h1>
            <p className="text-xs text-muted-foreground">Your money buddy</p>
          </div>
        </div>
        
        <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass">
              <AlertDialogTrigger asChild>
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Chat
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <AlertDialogContent className="glass">
            <AlertDialogHeader>
              <AlertDialogTitle>Clear this chat?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete all messages in the current conversation. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleClearConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Clear Chat
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}