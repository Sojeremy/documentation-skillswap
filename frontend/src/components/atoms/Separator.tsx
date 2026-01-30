'use client';

import { cn } from '@/lib/utils';

type SeparatorOrientation = 'horizontal' | 'vertical';

interface SeparatorProps {
  /**
   * @default 'horizontal'
   */
  orientation?: SeparatorOrientation;
  className?: string;
}

export function Separator({
  orientation = 'horizontal',
  className = '',
}: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'bg-gray-300 dark:bg-border shrink-0',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
    />
  );
}
