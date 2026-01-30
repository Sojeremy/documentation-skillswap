import { ZodError } from 'zod';

/**
 * Transforme les issues Zod en une chaîne de caractères,
 * un message par ligne, uniquement les messages personnalisés si disponibles.
 */
export function prettifyZodError(errors: ZodError['issues']): string {
  // Crée un Set pour éviter les doublons sur un même champ
  const messages = new Set<string>();

  errors.forEach((issue) => {
    // On utilise directement le message fourni dans le schema
    if (issue.message) {
      messages.add(issue.message);
    }
  });

  // Retourne tous les messages séparés par un retour à la ligne
  return Array.from(messages).join('\n');
}
