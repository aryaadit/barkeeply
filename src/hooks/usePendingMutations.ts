import { useState, useEffect } from 'react';
import { queryClient } from '@/lib/queryClient';

export function usePendingMutations() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const updatePendingCount = () => {
      const mutations = queryClient.getMutationCache().getAll();
      const pending = mutations.filter(
        (mutation) => mutation.state.status === 'pending'
      );
      setPendingCount(pending.length);
    };

    // Initial count
    updatePendingCount();

    // Subscribe to mutation cache changes
    const unsubscribe = queryClient.getMutationCache().subscribe(() => {
      updatePendingCount();
    });

    return () => unsubscribe();
  }, []);

  return { pendingCount, hasPending: pendingCount > 0 };
}
