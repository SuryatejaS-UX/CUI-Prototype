import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const greetings = [
  "Hello Surya...",
  "What are we building today?",
  "Let's write some code.",
  "Ready to ship something amazing?"
];

export function GreetingText() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const currentString = greetings[index % greetings.length];

    if (subIndex === currentString.length + 1 && !isDeleting) {
      // Pause before backspacing
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && isDeleting) {
      // Move to next string
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % greetings.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 40 : 80); // Backspace faster than typing

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting]);

  return (
    <div className="h-12 flex items-center justify-center mb-6">
      <h1 className="text-[28px] font-medium text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center">
        {(greetings[index] || "").substring(0, subIndex)}
        <span 
          className={cn(
            "inline-block w-[3px] h-[32px] bg-blue-500 ml-1 rounded-full",
            blink ? "opacity-100" : "opacity-0"
          )} 
        />
      </h1>
    </div>
  );
}
