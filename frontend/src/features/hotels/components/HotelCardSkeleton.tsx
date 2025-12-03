import React from 'react';
import { SkeletonCard } from '@/shared/components/Skeleton/SkeletonCard';

/**
 * Skeleton component for hotel card loading state
 */
export const HotelCardSkeleton: React.FC = () => {
  return <SkeletonCard showImage={false} lines={4} className="h-64" />;
};

