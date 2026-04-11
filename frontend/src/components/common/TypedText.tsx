'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface TypedTextProps {
  text: string;
  className?: string;
  once?: boolean;
}

export default function TypedText({ text, className = '', once = true }: TypedTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  const words = text.split(" ");

  // Total characters including spaces for timing
  const totalChars = text.length;
  const durationPerChar = Math.max(0.01, 1 / totalChars);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: durationPerChar, delayChildren: 0.1 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
    },
  };

  return (
    <motion.span
      ref={ref}
      style={{ display: 'inline-block' }}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split("").map((char, charIdx) => (
            <motion.span 
              key={charIdx} 
              variants={child}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
          {/* Add space between words */}
          {wordIdx < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}
