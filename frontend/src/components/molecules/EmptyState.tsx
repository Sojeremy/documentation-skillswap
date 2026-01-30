'use client';

import { Button } from '@/components/atoms/Button';
import { MessageSquare } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className="flex min-h-80 flex-col items-center justify-center px-6 text-center"
    >
      <div className="mb-4 text-muted-foreground">
        {icon ?? <MessageSquare className="h-12 w-12 opacity-20" />}
      </div>

      <h3 className="mb-2 text-lg font-semibold">{title}</h3>

      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
