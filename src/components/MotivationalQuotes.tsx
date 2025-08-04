import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Quote {
  text: string;
  author: string;
}

interface MotivationalQuotesProps {
  speed?: number;
  pauseDuration?: number;
  className?: string;
}

const motivationalQuotes: Quote[] = [
  {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
  },
  {
    text: 'Innovation distinguishes between a leader and a follower.',
    author: 'Steve Jobs',
  },
  {
    text: "Life is what happens to you while you're busy making other plans.",
    author: 'John Lennon',
  },
  {
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
  },
  {
    text: 'It is during our darkest moments that we must focus to see the light.',
    author: 'Aristotle',
  },
  {
    text: 'The way to get started is to quit talking and begin doing.',
    author: 'Walt Disney',
  },
  {
    text: "Don't let yesterday take up too much of today.",
    author: 'Will Rogers',
  },
  {
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
  },
  {
    text: 'The only impossible journey is the one you never begin.',
    author: 'Tony Robbins',
  },
  {
    text: 'In the middle of difficulty lies opportunity.',
    author: 'Albert Einstein',
  },
  {
    text: "Whether you think you can or you think you can't, you're right.",
    author: 'Henry Ford',
  },
  {
    text: "I have not failed. I've just found 10,000 ways that won't work.",
    author: 'Thomas Edison',
  },
  {
    text: 'A person who never made a mistake never tried anything new.',
    author: 'Albert Einstein',
  },
  {
    text: 'The best time to plant a tree was 20 years ago. The second best time is now.',
    author: 'Chinese Proverb',
  },
  { text: "Your limitation—it's only your imagination.", author: 'Unknown' },
  { text: 'Great things never come from comfort zones.', author: 'Unknown' },
  { text: 'Dream it. Wish it. Do it.', author: 'Unknown' },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: 'Unknown',
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: 'Unknown',
  },
  { text: 'Dream bigger. Do bigger.', author: 'Unknown' },
  {
    text: "Don't stop when you're tired. Stop when you're done.",
    author: 'Unknown',
  },
  {
    text: 'Wake up with determination. Go to bed with satisfaction.',
    author: 'Unknown',
  },
  {
    text: 'Do something today that your future self will thank you for.',
    author: 'Sean Patrick Flanery',
  },
  { text: 'Little things make big days.', author: 'Unknown' },
  {
    text: "It's going to be hard, but hard does not mean impossible.",
    author: 'Unknown',
  },
  { text: "Don't wait for opportunity. Create it.", author: 'Unknown' },
];

export const MotivationalQuotes = ({
  speed = 80,
  pauseDuration = 4000,
  className = '',
}: MotivationalQuotesProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const currentQuote = motivationalQuotes[currentQuoteIndex];
  const fullText = `"${currentQuote.text}"\n— ${currentQuote.author}`;

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTyping && currentIndex < fullText.length) {
      // Typing phase
      timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex((prev) => prev + 1);
      }, speed);
    } else if (isTyping && currentIndex >= fullText.length) {
      // Pause before moving to next quote
      timeout = setTimeout(() => {
        setIsTyping(false);
        setCurrentIndex(0);
        setDisplayedText('');
        // Move to next quote
        setCurrentQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
      }, pauseDuration);
    } else if (!isTyping) {
      // Start typing next quote
      timeout = setTimeout(() => {
        setIsTyping(true);
      }, 100);
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, isTyping, fullText, speed, pauseDuration]);

  return (
    <div className={`${className} relative max-w-sm`}>
      <div className='text-xs leading-relaxed whitespace-pre-line'>
        <span>{displayedText}</span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className='inline-block w-0.5 h-3 bg-gray-400 ml-0.5'
        />
      </div>
    </div>
  );
};
