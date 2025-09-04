import { useEffect, useState } from 'react';

// Hook to generate stable IDs on the client side
export function useStableId(prefix: string = 'id'): string {
  const [id, setId] = useState('');

  useEffect(() => {
    // Only generate ID on client side to avoid hydration mismatch
    setId(`${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
  }, [prefix]);

  return id;
}

// Utility function to generate stable IDs for arrays
export function generateStableId(
  item: { id?: string | number } | null | undefined,
  prefix: string = 'item',
): string {
  // If item has an ID, use it; otherwise use a fallback
  if (item?.id) {
    return String(item.id);
  }

  // For server-side rendering, return a predictable temporary ID
  // This will be replaced on the client side if needed
  return `${prefix}-temp`;
}
