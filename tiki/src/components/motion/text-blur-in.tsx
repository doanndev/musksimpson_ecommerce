'use client';

import { type MotionProps, motion } from 'framer-motion';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

interface TextBlurInProps extends MotionProps, Omit<ComponentPropsWithoutRef<'p'>, keyof MotionProps> {
  children: any;
  className?: string;
  variant?: {
    hidden: { filter: string; opacity: number };
    visible: { filter: string; opacity: number };
  };
  duration?: number;
  useInView?: boolean;
}
export const TextBlurIn = ({ children, className, variant, duration = 1, useInView, ...props }: TextBlurInProps) => {
  const defaultVariants = {
    hidden: { filter: 'blur(10px)', opacity: 0 },
    visible: { filter: 'blur(0px)', opacity: 1 },
  };
  const combinedVariants = variant || defaultVariants;

  return (
    <motion.p
      initial='hidden'
      {...(useInView ? { whileInView: 'visible', viewport: { once: true } } : { animate: 'visible' })}
      transition={{ duration }}
      variants={combinedVariants}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.p>
  );
};
