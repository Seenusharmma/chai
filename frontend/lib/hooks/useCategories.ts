'use client';

import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api';
import { CategoryInfo } from '../types';

export function useCategories() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 30 * 60 * 1000,
  });

  const categories: CategoryInfo[] = Array.isArray(data) ? data : [];

  return {
    categories,
    isLoading,
    error,
    refetch,
  };
}
