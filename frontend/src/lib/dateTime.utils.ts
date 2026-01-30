/**
 * @module DateTimeUtilities
 * Date and time formatting utilities for SkillSwap.
 *
 * All functions use French locale (date-fns/locale/fr) for localization.
 *
 * @packageDocumentation
 */

import {
  format,
  formatDistanceToNowStrict,
  isToday,
  isYesterday,
  parseISO,
} from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format a timestamp for message display with smart date labels.
 *
 * Returns human-readable date formats:
 * - Today: "Aujourd'hui 11:47"
 * - Yesterday: "Hier 11:47"
 * - Other: "10/01/2026 11:47"
 *
 * @param timestamp - ISO 8601 timestamp string
 * @returns Formatted date string in French, or empty string if no timestamp
 *
 * @example
 * ```tsx
 * formatMessageDate('2026-01-23T11:47:00Z'); // "Aujourd'hui 11:47" (if today)
 * formatMessageDate('2026-01-22T14:30:00Z'); // "Hier 14:30" (if yesterday)
 * formatMessageDate('2026-01-10T11:10:00Z'); // "10/01/2026 11:10"
 * formatMessageDate(); // ""
 * ```
 *
 * @category Utilities
 */
export function formatMessageDate(timestamp?: string): string {
  if (!timestamp) return '';

  const date = new Date(timestamp);

  if (isToday(date)) {
    return `Aujourd'hui ${format(date, 'HH:mm')}`;
  }

  if (isYesterday(date)) {
    return `Hier ${format(date, 'HH:mm')}`;
  }

  return format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
}

/**
 * Format a timestamp as relative time for conversation lists.
 *
 * Returns relative time in French:
 * - "il y a 5 minutes"
 * - "il y a 2 heures"
 * - "il y a 3 jours"
 *
 * @param timestamp - ISO 8601 timestamp string
 * @returns Relative time string in French, or empty string if no timestamp
 *
 * @example
 * ```tsx
 * formatConversationDate('2026-01-23T11:00:00Z'); // "il y a 47 minutes"
 * formatConversationDate('2026-01-20T10:00:00Z'); // "il y a 3 jours"
 * formatConversationDate(); // ""
 * ```
 *
 * @category Utilities
 */
export function formatConversationDate(timestamp?: string): string {
  if (!timestamp) return '';
  const date = parseISO(timestamp);

  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: fr,
  });
}
