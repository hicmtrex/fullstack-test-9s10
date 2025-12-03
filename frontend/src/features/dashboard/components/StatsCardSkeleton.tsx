import React from 'react';
import { Card, CardContent, CardHeader } from '@/shared/components/Card';
import { Skeleton } from '@/shared/components/Skeleton';

/**
 * Skeleton component for stats card loading state
 */
export const StatsCardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton variant="text" height={16} width="60%" />
        <Skeleton variant="circular" height={16} width={16} />
      </CardHeader>
      <CardContent>
        <Skeleton variant="text" height={32} width="40%" className="mb-2" />
        <Skeleton variant="text" height={12} width="80%" />
      </CardContent>
    </Card>
  );
};
