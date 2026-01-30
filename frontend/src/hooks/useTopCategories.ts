// ============================================================================
// USE TOP CATEGORIES HOOK
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import type { Category } from '@/lib/api-types';
import { toast } from 'sonner';
import { logError } from '@/lib/utils';

interface UseTopCategoriesOptions {
  limit?: number;
}

interface UseTopCategoriesReturn {
  categories: Category[];
}

export function useTopCategories(
  options: UseTopCategoriesOptions = {},
): UseTopCategoriesReturn {
  const { limit } = options;

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.getTopCategories({ limit });
        if (response.data) setCategories(response.data);
      } catch (err) {
        logError(err);
        toast.error('Une erreur est survenue');
      }
    };

    fetchCategories();
  }, [limit]);

  return {
    categories,
  };
}
