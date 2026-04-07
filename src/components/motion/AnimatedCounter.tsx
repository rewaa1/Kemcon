"use client";

import { useEffect, useRef } from "react";
import { useInView, animate } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  // Extract the numeric part (including commas/decimals)
  const numericMatch = value.match(/[\d,.]+/);
  
  useEffect(() => {
    if (!isInView || !numericMatch || !ref.current) return;
    
    const numericString = numericMatch[0].replace(/,/g, "");
    const targetNumber = parseFloat(numericString);
    
    if (isNaN(targetNumber)) return;

    const prefix = value.substring(0, numericMatch.index);
    const suffix = value.substring(numericMatch.index! + numericMatch[0].length);
    const hasComma = value.includes(",");
    const isFloat = numericString.includes(".");

    // Ensure it starts at 0 immediately when the animation triggers
    const controls = animate(0, targetNumber, {
      duration: 2.5, // 2.5 seconds for a premium, dramatic reveal
      ease: [0.22, 1, 0.36, 1], // Custom bouncy ease out
      onUpdate(currentValue) {
        if (!ref.current) return;
        
        let displayValue = isFloat ? currentValue.toFixed(1) : Math.floor(currentValue).toString();
        
        if (hasComma && !isFloat) {
          displayValue = parseInt(displayValue).toLocaleString();
        }
        
        ref.current.textContent = `${prefix}${displayValue}${suffix}`;
      }
    });

    return () => controls.stop();
  }, [isInView, value, numericMatch]);

  if (!numericMatch) {
    return <span className={className}>{value}</span>;
  }

  return <span ref={ref} className={className}>{value}</span>;
}
