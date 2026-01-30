'use client';

import { useState } from 'react';

export type FilterStatus = 'Open' | 'Close';

export function useConversationState() {
  const [filter, setFilter] = useState<FilterStatus>('Open');

  return {
    filter,
    setFilter,
  };
}
