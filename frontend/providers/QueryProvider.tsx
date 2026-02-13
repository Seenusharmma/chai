'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Cache data for 5 minutes before considering it stale
                        // Reduces API calls significantly for Render free tier
                        staleTime: 5 * 60 * 1000, // 5 minutes

                        // Keep data in cache for 30 minutes
                        gcTime: 30 * 60 * 1000, // 30 minutes (renamed from cacheTime in v5)

                        // Retry failed requests 3 times (important for Render cold starts)
                        retry: 3,

                        // Exponential backoff: 1s, 2s, 4s
                        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

                        // Don't refetch on window focus to reduce unnecessary calls
                        refetchOnWindowFocus: false,

                        // Refetch when reconnecting to network
                        refetchOnReconnect: true,

                        // Refetch on mount only if data is stale
                        refetchOnMount: true,
                    },
                    mutations: {
                        // Retry mutations once on failure
                        retry: 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* DevTools removed - uncomment below for debugging */}
            {/* {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />} */}
        </QueryClientProvider>
    );
}
