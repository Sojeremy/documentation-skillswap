import { memo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const badgeVariants = cva(
  'flex sm:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors relative',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
        secondary:
          'bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200',
        outline:
          'border border-zinc-300 bg-transparent text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800',
        category:
          'border border-zinc-200 bg-white text-zinc-700 hover:border-primary-300 hover:bg-primary-50cursor-pointer',
        availability:
          'border bg-success/5 border-success rounded-3xl text-success hover:bg-success/10',
        primary:
          'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
        selected: 'bg-primary-700 text-white border-primary-700 cursor-pointer',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-1 text-sm',
        lg: 'px-4 py-2 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  onRemove?: () => void;
}

export const Badge = memo(function Badge({
  className,
  variant,
  size,
  children,
  onRemove,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        badgeVariants({ variant, size }),
        onRemove && 'pr-7',
        className,
      )}
      {...props}
    >
      {children}

      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={cn(
            'absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full transition-all duration-300 ease-out hover:text-destructive hover:-translate-y-px active:translate-y-0',
          )}
          aria-label="Supprimer"
        >
          <X size={10} strokeWidth={3} />
        </button>
      )}
    </span>
  );
});
