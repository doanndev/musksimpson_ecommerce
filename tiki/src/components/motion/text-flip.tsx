'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

interface Props {
  children: string;
  className?: string;
}

const DURATION = 0.25;
const STAGGER = 0.025;

const TextFlip = ({ children, className }: Props) => {
  return (
    <motion.div
      initial='initial'
      whileHover='hovered'
      className={cn('relative block overflow-hidden whitespace-nowrap', className)}
    >
      <div>
        {children.split('').map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: 0,
              },
              hovered: {
                y: '-100%',
              },
            }}
            transition={{
              duration: DURATION,
              ease: 'easeInOut',
              delay: STAGGER * i,
            }}
            className='inline-block'
            key={i}
          >
            {l}
            {l === ' ' ? '\u00A0' : ''}
          </motion.span>
        ))}
      </div>
      <div className='absolute inset-0'>
        {children.split('').map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: '100%',
              },
              hovered: {
                y: 0,
              },
            }}
            transition={{
              duration: DURATION,
              ease: 'easeInOut',
              delay: STAGGER * i,
            }}
            className='inline-block'
            key={i}
          >
            {l}
            {l === ' ' ? '\u00A0' : ''}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

export { TextFlip };
