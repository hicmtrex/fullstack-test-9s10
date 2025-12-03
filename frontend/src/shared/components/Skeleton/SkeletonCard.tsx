import React from 'react';
import { Skeleton } from './Skeleton';

/**
 * SkeletonCard component props
 */
export interface SkeletonCardProps {
  className?: string;
  showImage?: boolean;
  lines?: number;
}

/**
 * Skeleton card component for card loading states
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  className = '',
  showImage = true,
  lines = 3,
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {showImage && <Skeleton variant="rectangular" height={200} className="mb-4" />}
      <Skeleton variant="text" height={24} width="60%" className="mb-2" />
      <Skeleton variant="text" height={20} width="80%" className="mb-2" />
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          height={16}
          width={index === lines - 1 ? '60%' : '100%'}
          className="mb-1"
        />
      ))}
    </div>
  );
};
