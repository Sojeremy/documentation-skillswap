'use client';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Send } from 'lucide-react';
import { FilterStatus } from '../useConversationState';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  conversationStatus: FilterStatus;
}

/**
 * Zone de saisie et envoi de message
 */
export function MessageInput({
  value,
  onChange,
  onSend,
  isLoading,
  conversationStatus,
}: MessageInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="flex gap-3">
        <Input
          placeholder="Écrivez un message…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Saisir un message"
          disabled={conversationStatus === 'Close'}
        />
        <Button
          onClick={onSend}
          disabled={!value.trim() || conversationStatus === 'Close'}
          className="flex items-center gap-2"
          isLoading={isLoading}
        >
          <Send className="h-4 w-4" />
          <span>Envoyer</span>
        </Button>
      </div>
    </div>
  );
}
