import { type MotionProps, motion } from 'framer-motion';
import React, { type ComponentPropsWithoutRef } from 'react';

interface Props extends MotionProps, Omit<ComponentPropsWithoutRef<'span'>, keyof MotionProps> {
  children: string;
  className?: string;
  useInView?: boolean;
  duration?: number;
}

export const variantsSlideUp = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const TextSlideUp = ({ children, useInView, duration = 0.6, className, ...props }: Props) => {
  return (
    <motion.div
      initial='hidden'
      {...(useInView ? { whileInView: 'visible', viewport: { once: true } } : { animate: 'visible' })}
      className={className}
    >
      {children.split(' ').map((str, i) => (
        <span key={i} className='relative inline-block overflow-hidden whitespace-nowrap'>
          <motion.span
            variants={variantsSlideUp}
            transition={{
              duration,
              delay: 0.06 * i,
              ease: [0.65, 0.05, 0.36, 1],
            }}
            className='inline-block'
          >
            {str}&nbsp;
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
};

export { TextSlideUp };
