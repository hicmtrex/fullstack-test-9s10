import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Create a new QueryClient instance
 * Configured with default options for the application
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: data is considered fresh for 5 minutes (optimized for hotel data)
      staleTime: 5 * 60 * 1000,
      // Cache time: unused data stays in cache for 30 minutes (longer for better performance)
      gcTime: 30 * 60 * 1000,
      // Retry failed requests 2 times (reduced from 3 for faster error feedback)
      retry: 2,
      // Retry delay increases exponentially
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus (disabled for better performance - hotels don't change often)
      refetchOnWindowFocus: false,
      // Refetch on reconnect (enabled for data consistency)
      refetchOnReconnect: true,
      // Refetch on mount (disabled if data is fresh)
      refetchOnMount: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

/**
 * QueryProvider component
 * Wraps the application with React Query's QueryClientProvider
 */
export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
