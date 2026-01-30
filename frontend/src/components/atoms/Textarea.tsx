'use client';

import { cn } from '@/lib/utils';
import { Label } from './Label';
import { forwardRef, TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, helperText, id, ...props }, ref) => {
    return (
      <div className="grid w-full gap-1.5">
        {label && (
          <div className="flex items-center">
            <Label htmlFor={id}>{label}</Label>
          </div>
        )}
        <textarea
          data-slot="textarea"
          className={cn(
            // Styles de base (copiés de ton Input)
            'placeholder:text-input selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            // Styles au focus
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]',
            // Styles d'erreur / invalidité
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            error && 'border-error focus-visible:ring-error',
            className,
          )}
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          {...props}
        />

        {/* Affichage de l'erreur ou du texte d'aide */}
        {error ? (
          <p id={`${id}-error`} className="text-xs text-error" role="alert">
            {error}
          </p>
        ) : (
          helperText && (
            <p id={`${id}-helper`} className="text-xs text-muted-foreground">
              {helperText}
            </p>
          )
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
