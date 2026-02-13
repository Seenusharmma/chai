'use client';

import { useQuery } from '@tanstack/react-query';
import { getMenu } from '../api';
import { Category, MenuItem } from '../types';

// Fetch function for menu items
const fetchMenuItems = async (): Promise<MenuItem[]> => {
  return await getMenu();
};

export function useMenu(category?: Category, searchQuery?: string) {
  const { data: items = [], isLoading, error, refetch } = useQuery({
    queryKey: ['menu', category, searchQuery],
    queryFn: fetchMenuItems,
    // Menu items don't change often, cache for 10 minutes
    staleTime: 10 * 60 * 1000,
    select: (data) => {
      let filtered = data;

      if (category) {
        filtered = filtered.filter((item) => item.category === category);
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );
      }

      return filtered;
    },
  });

  const popularItems = items.filter((item) => item.isPopular);
  const featuredItems = items.filter((item) => item.isFeatured);

  return {
    items,
    popularItems,
    featuredItems,
    isLoading,
    error,
    refetch,
  };
}
