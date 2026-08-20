import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ArrowUp, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusButton } from './uselayouts/status-button';
import type { ButtonStatus } from './uselayouts/status-button';

interface QuestionnaireProps {
  onSubmit: (answers: any) => void;
  onClose: () => void;
}

const QUESTIONS = [
  {
    id: 1,
    type: 'single',
    title: 'How many flavors should we launch?',
    options: ['Three (core line)', 'Five (full case)', 'Just one hero']
  },
  {
    id: 2,
    type: 'multiple',
    title: 'Which mix-ins should we stock?',
    options: ['Chocolate chips', 'Waffle bits', 'Sprinkles']
  },
  {
    id: 3,
    type: 'single',
    title: 'Which market do we enter first?',
    options: ['Food trucks', 'Grocery freezers', 'Scoop shops']
  }
];

export function Questionnaire({ onSubmit, onClose }: QuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [customText, setCustomText] = useState('');
  const [submitStatus, setSubmitStatus] = useState<ButtonStatus>("idle");

  const question = QUESTIONS[currentStep];
  const currentAnswers = answers[question.id] || [];

  const handleOptionToggle = (option: string) => {
    if (question.type === 'single') {
      setAnswers({ ...answers, [question.id]: [option] });
    } else {
      const isSelected = currentAnswers.includes(option);
      if (isSelected) {
        setAnswers({ ...answers, [question.id]: currentAnswers.filter(a => a !== option) });
      } else {
        setAnswers({ ...answers, [question.id]: [...currentAnswers, option] });
      }
    }
  };

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setCustomText('');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setCustomText('');
    }
  };

  const handleSubmit = () => {
    if (currentAnswers.length > 0 || customText.trim().length > 0) {
      setSubmitStatus("loading");
      const finalAnswers: { question: string, answer: string }[] = [];
      QUESTIONS.forEach((q, idx) => {
        let answerText = (answers[q.id] || []).join(', ');
        
        // Include custom text if we are on this question
        if (idx === currentStep && customText.trim()) {
          answerText = answerText ? `${answerText}, ${customText.trim()}` : customText.trim();
        }

        if (answerText) {
          finalAnswers.push({ question: q.title, answer: answerText });
        }
      });
      
      setTimeout(() => {
        setSubmitStatus("success");
        setTimeout(() => {
          onSubmit(finalAnswers as any);
        }, 800);
      }, 1000);
    }
  };

  const canSubmitCurrent = currentAnswers.length > 0 || customText.trim().length > 0;

  return (
    <div className="w-full relative max-w-4xl mx-auto pointer-events-auto flex justify-center pb-2">
      <div className="bg-white dark:bg-zinc-950/90 dark:backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-zinc-100 dark:border-zinc-800/50 w-full max-w-[540px] animate-in slide-in-from-bottom-4 fade-in duration-300">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <h3 className="text-zinc-900 dark:text-zinc-100 font-medium text-[15px]">{question.title}</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-1 mb-3">
          {question.options.map((option) => {
            const isSelected = currentAnswers.includes(option);
            return (
              <div 
                key={option}
                onClick={() => handleOptionToggle(option)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors",
                  isSelected ? "bg-zinc-50 dark:bg-zinc-800" : "dark:bg-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center transition-all",
                  question.type === 'single' ? "w-5 h-5 rounded-full border-[1.5px]" : "w-5 h-5 rounded-[6px] border",
                  isSelected 
                    ? (question.type === 'single' ? "border-[#111] dark:border-zinc-100 bg-transparent" : "bg-[#111] dark:bg-zinc-100 border-[#111] dark:border-zinc-100 text-white dark:text-zinc-900") 
                    : "border-zinc-200 dark:border-zinc-700 bg-transparent"
                )}>
                  {question.type === 'single' && isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#111] dark:bg-zinc-100" />
                  )}
                  {question.type === 'multiple' && isSelected && (
                    <Check className="w-3 h-3" strokeWidth={3} />
                  )}
                </div>
                <span className={cn(
                  "text-[15px]",
                  isSelected ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"
                )}>
                  {option}
                </span>
              </div>
            );
          })}
        </div>

        {/* Custom Text Input */}
        <div className="px-3 mb-8">
          <input 
            type="text" 
            placeholder="Type something..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full bg-transparent outline-none text-[15px] text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          />
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrev} 
              disabled={currentStep === 0}
              className="text-zinc-400 disabled:opacity-30 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1.5">
              {QUESTIONS.map((_, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    currentStep === idx 
                      ? "w-2 h-2 border-[2px] border-zinc-900 dark:border-zinc-100 bg-transparent" 
                      : currentStep > idx
                        ? "w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-600"
                        : "w-1.5 h-1.5 border-[1.5px] border-zinc-300 dark:border-zinc-700 bg-transparent"
                  )}
                />
              ))}
            </div>

            {currentStep < QUESTIONS.length - 1 ? (
              <button 
                onClick={handleNext} 
                className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-md transition-colors",
                  canSubmitCurrent ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                )}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-7" />
            )}
          </div>

          {currentStep === QUESTIONS.length - 1 ? (
            <StatusButton
              status={submitStatus}
              onClick={handleSubmit}
              disabled={!canSubmitCurrent}
              idleText="Submit"
              loadingText="Submitting..."
              successText="Done"
              className="ml-auto"
            />
          ) : (
            <button 
              onClick={handleNext}
              disabled={!canSubmitCurrent}
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 ml-auto",
                canSubmitCurrent 
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
              )}
            >
              <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
