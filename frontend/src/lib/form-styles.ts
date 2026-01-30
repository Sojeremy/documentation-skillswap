/**
 * Shared form input styles for Input and Textarea components
 *
 * These styles ensure visual consistency across all form inputs.
 * Import and use with cn() to compose with component-specific styles.
 */

// Base styles shared by Input and Textarea
export const FORM_INPUT_BASE = [
  // Typography & colors
  'placeholder:text-input',
  'selection:bg-primary selection:text-primary-foreground',
  // Background & border
  'dark:bg-input/30 border-input',
  'w-full rounded-md border bg-transparent',
  'shadow-xs transition-[color,box-shadow] outline-none',
  // Disabled state
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  // Text size
  'text-base md:text-sm',
].join(' ');

// Focus styles
export const FORM_INPUT_FOCUS = [
  'focus-visible:border-ring',
  'focus-visible:ring-ring/50',
  'focus-visible:ring-[3px]',
].join(' ');

// Error/invalid styles
export const FORM_INPUT_ERROR = [
  'aria-invalid:ring-destructive/20',
  'dark:aria-invalid:ring-destructive/40',
  'aria-invalid:border-destructive',
].join(' ');

// Combined styles for convenience
export const FORM_INPUT_STYLES = [
  FORM_INPUT_BASE,
  FORM_INPUT_FOCUS,
  FORM_INPUT_ERROR,
].join(' ');

// Error text style
export const FORM_ERROR_TEXT = 'text-xs text-error';

// Helper text style
export const FORM_HELPER_TEXT = 'text-xs text-muted-foreground';
