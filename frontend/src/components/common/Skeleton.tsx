import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle' | 'rounded';
}

/**
 * Skeleton component using DaisyUI's built-in skeleton class.
 * This provides the exact professional pulse effect seen in DaisyUI documentation.
 */
export default function Skeleton({ 
  className, 
  variant = 'rect'
}: SkeletonProps) {
  
  const variantStyles = {
    text: "h-4 w-full",
    rect: "h-32 w-full", // Default rectangle height
    circle: "rounded-full h-12 w-12",
    rounded: "rounded-2xl h-full w-full"
  };

  return (
    <div 
      className={clsx(
        "skeleton",  // Essential DaisyUI skeleton class
        "bg-base-300/40 opacity-80", // Extra visibility insurance
        variantStyles[variant], 
        className
      )}
    />
  );
}
