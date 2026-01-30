/**
 * @module Utilities
 * Utility functions for SkillSwap frontend application.
 *
 * Includes:
 * - **Styling**: Tailwind CSS class merging
 * - **User helpers**: Initials generation, rating calculation
 * - **Validation**: Zod schema validation with state management
 * - **Error handling**: Toast notifications for errors
 *
 * @packageDocumentation
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { UserInfo } from './api-types';
import { ZodError, ZodSchema } from 'zod';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge.
 *
 * Combines multiple class values and resolves Tailwind conflicts.
 * Useful for component styling with conditional classes.
 *
 * @param inputs - Class values to merge (strings, arrays, objects)
 * @returns Merged class string
 *
 * @example
 * ```tsx
 * <div className={cn('p-4 bg-blue-500', isActive && 'bg-green-500', className)} />
 * ```
 *
 * @category Utilities
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get user initials from UserInfo object.
 *
 * @param user - User object with firstname and lastname
 * @returns Two-letter initials (e.g., "JD") or "?" if no name
 *
 * @example
 * ```tsx
 * const initials = getInitialsFromUser({ firstname: 'John', lastname: 'Doe' }); // "JD"
 * ```
 *
 * @category Utilities
 */
export function getInitialsFromUser(user: UserInfo): string {
  const first = user.firstname?.charAt(0)?.toUpperCase() || '';
  const last = user.lastname?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}` || '?';
}

/**
 * Get initials from a full name string.
 *
 * @param name - Full name (e.g., "John Doe")
 * @returns Two-letter initials from first two words
 *
 * @example
 * ```tsx
 * getInitialsFromName('John Doe Smith'); // "JD"
 * getInitialsFromName('Alice'); // "A"
 * ```
 *
 * @category Utilities
 */
export function getInitialsFromName(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Calculate average rating from evaluations array.
 *
 * @param evaluations - Array of objects with score property
 * @returns Average score rounded to 1 decimal, or 0 if no evaluations
 *
 * @example
 * ```tsx
 * calculateRating([{ score: 4 }, { score: 5 }]); // 4.5
 * calculateRating([]); // 0
 * calculateRating(null); // 0
 * ```
 *
 * @category Utilities
 */
export function calculateRating(
  evaluations: { score: number }[] | undefined | null,
): number {
  if (!evaluations || evaluations.length === 0) return 0;
  const sum = evaluations.reduce((acc, e) => acc + e.score, 0);
  return Math.round((sum / evaluations.length) * 10) / 10;
}

/**
 * Validate form data against a Zod schema and update error state.
 *
 * Parses data with Zod schema and sets field-level errors in React state.
 * Only keeps the first error per field for better UX.
 *
 * @typeParam T - Form data type
 * @param schema - Zod validation schema
 * @param formData - Data to validate
 * @param setErrors - React state setter for errors
 * @returns `true` if valid, `false` if validation failed
 *
 * @example
 * ```tsx
 * const [errors, setErrors] = useState({});
 *
 * const handleSubmit = () => {
 *   if (validate(loginSchema, formData, setErrors)) {
 *     await api.login(formData);
 *   }
 * };
 * ```
 *
 * @category Utilities
 */
export function validate<T>(
  schema: ZodSchema<T>,
  formData: T,
  setErrors?: Dispatch<SetStateAction<Partial<Record<keyof T, string>>>>,
) {
  try {
    schema.parse(formData); // Use zod for validation

    if (setErrors) setErrors({});

    return true;
  } catch (error) {
    if (error instanceof ZodError && setErrors) {
      const fieldErrors: Partial<Record<keyof T, string>> = {};
      for (const issue of error.issues) {
        const fieldName = issue.path[0] as keyof T;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setErrors(fieldErrors);
    }
    return false;
  }
}

/**
 * Compares form data with original data and returns only the changed fields
 */
export function getChangedFields<T extends Record<string, unknown>>(
  originalData: Partial<T>,
  newData: Partial<T>,
): Partial<T> | null {
  const changes: Partial<T> = {};
  let hasChanges = false;

  for (const key in newData) {
    const originalValue = originalData[key];
    const newValue = newData[key];

    if (!isEqual(originalValue, newValue)) {
      changes[key] = newValue;
      hasChanges = true;
    }
  }

  return hasChanges ? changes : null;
}

/**
 * Deeply compares two values
 * Handles special cases: undefined, null, NaN, objects, etc.
 */
function isEqual(a: unknown, b: unknown): boolean {
  // Case 1: Identical values (includes NaN === NaN)
  if (Object.is(a, b)) return true;

  // Case 2: undefined vs null
  if (a == null && b == null) {
    return true;
  }

  // Case 3: Different types
  if (typeof a !== typeof b) return false;

  // Case 4: Objects (shallow comparison)
  if (typeof a === 'object' && a !== null && b !== null) {
    if (Array.isArray(a) !== Array.isArray(b)) return false;

    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);

    if (keysA.length !== keysB.length) return false;

    return keysA.every((key) =>
      isEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      ),
    );
  }

  // Case 5: Primitives
  return a === b;
}

export function displayError(err: unknown) {
  const errorMessage =
    err instanceof Error ? err.message : 'Une erreur inconnue est survenue';

  toast.error(errorMessage);
}

export function logError(err: unknown) {
  const errorMessage =
    err instanceof Error ? err.message : 'Une erreur inconnue est survenue';

  console.log(errorMessage);
  console.log(err);
}
