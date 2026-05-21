'use client';

import { useEffect, useRef, useState } from 'react';
import {
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';

type CountUpTextProps = {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  className?: string;
};

const CountUpText = ({
  to,
  from = 0,
  duration = 4,
  delay = 0,
  className,
}: CountUpTextProps) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });
  const roundedValue = useTransform(() => Math.round(springValue.get()));
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    const unsubscribe = roundedValue.on('change', (latest) => {
      setDisplayValue(latest);
    });

    return unsubscribe;
  }, [roundedValue]);

  useEffect(() => {
    if (!isInView) {
      return;
    }

    if (prefersReducedMotion) {
      motionValue.set(to);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      motionValue.set(to);
    }, delay * 1000);

    return () => window.clearTimeout(timeoutId);
  }, [delay, isInView, motionValue, prefersReducedMotion, to]);

  return (
    <span ref={ref} className={className}>
      {displayValue.toLocaleString('en-IN')}
    </span>
  );
};

export default CountUpText;
