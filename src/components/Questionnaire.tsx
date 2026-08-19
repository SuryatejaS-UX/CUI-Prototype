import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ArrowUp, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionnaireProps {
  onSubmit: () => void;
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
      onSubmit(finalAnswers as any);
    }
  };

  const canSubmitCurrent = currentAnswers.length > 0 || customText.trim().length > 0;

  return (
    <div className="w-full relative max-w-4xl mx-auto pointer-events-auto flex justify-center pb-2">
      <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 w-full max-w-[540px] animate-in slide-in-from-bottom-4 fade-in duration-300">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <h3 className="text-gray-900 font-medium text-[15px]">{question.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
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
                  isSelected ? "bg-gray-50" : "hover:bg-gray-50/50"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center transition-all",
                  question.type === 'single' ? "w-5 h-5 rounded-full border-[1.5px]" : "w-5 h-5 rounded-[6px] border",
                  isSelected 
                    ? (question.type === 'single' ? "border-[#111] bg-transparent" : "bg-[#111] border-[#111] text-white") 
                    : "border-gray-200 bg-transparent"
                )}>
                  {question.type === 'single' && isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#111]" />
                  )}
                  {question.type === 'multiple' && isSelected && (
                    <Check className="w-3 h-3" strokeWidth={3} />
                  )}
                </div>
                <span className={cn(
                  "text-[15px]",
                  isSelected ? "text-gray-900" : "text-gray-500"
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
            className="w-full bg-transparent outline-none text-[15px] text-gray-800 placeholder:text-gray-400"
          />
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrev} 
              disabled={currentStep === 0}
              className="text-gray-400 disabled:opacity-30 hover:text-gray-700 transition-colors"
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
                      ? "w-2 h-2 border-[2px] border-gray-900 bg-transparent" 
                      : currentStep > idx
                        ? "w-1.5 h-1.5 bg-gray-400"
                        : "w-1.5 h-1.5 border-[1.5px] border-gray-300 bg-transparent"
                  )}
                />
              ))}
            </div>

            {currentStep < QUESTIONS.length - 1 ? (
              <button 
                onClick={handleNext} 
                className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-md transition-colors",
                  canSubmitCurrent ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-7" /> // Spacer
            )}
          </div>

          <button 
            onClick={handleSubmit}
            disabled={!canSubmitCurrent}
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300",
              canSubmitCurrent 
                ? "bg-[#111111] text-white shadow-md hover:bg-black hover:-translate-y-0.5" 
                : "bg-gray-100 text-gray-400"
            )}
          >
            <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </div>
  );
}
