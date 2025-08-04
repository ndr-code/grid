import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  pauseDuration?: number;
  className?: string;
}

export const TypingAnimation = ({
  text,
  speed = 100,
  pauseDuration = 2000,
  className = '',
}: TypingAnimationProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTyping && currentIndex < text.length) {
      // Typing phase
      timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex((prev) => prev + 1);
      }, speed);
    } else if (isTyping && currentIndex >= text.length) {
      // Pause before restart
      timeout = setTimeout(() => {
        setIsTyping(false);
        setCurrentIndex(0);
        setDisplayedText('');
      }, pauseDuration);
    } else if (!isTyping) {
      // Start typing again
      timeout = setTimeout(() => {
        setIsTyping(true);
      }, 100);
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, isTyping, text, speed, pauseDuration]);

  return (
    <div className={`${className} relative`}>
      <span>{displayedText}</span>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className='inline-block w-0.5 h-4 bg-gray-500 ml-0.5'
      />
    </div>
  );
};
