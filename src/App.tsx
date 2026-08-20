import { useState, useRef, useEffect } from 'react';
import { 
  Menu, Code, CircleHelp, User, Power, PanelLeft, Plus, Mic, ArrowUp,
  Image as ImageIcon, FileText, HardDrive, PanelLeftClose,
  MessageSquarePlus, Library, FileStack, MoreHorizontal, Pencil, Trash2,
  Square, ChevronLeft, ChevronRight, Copy, X, Search, BookOpen, GitBranch, Sparkles,
  PanelRight, Moon, Sun, HelpCircle, PanelLeftOpen
} from 'lucide-react';
import { WorkflowProgress } from '@/components/WorkflowProgress';
import { ImageGeneration } from '@/components/ImageGeneration';
import { Questionnaire } from '@/components/Questionnaire';
import type { HITLAnswer } from '@/components/Questionnaire';
import { GreetingText } from './components/GreetingText';
import { MarkdownResponse } from '@/components/MarkdownResponse';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ArtifactEditor } from "@/components/ArtifactEditor";
import { DaySeparator, type DatedMessage } from "@/components/day-separator";
import { ErrorState } from '@/components/error-state';
import { Suggestions } from '@/components/suggestions';
import { StoppedRun } from '@/components/stopped-run';
import { ProfileDropdown } from './components/uselayouts/smooth-dropdown';
import { MagneticWrapper } from './components/uselayouts/magnetic-wrapper';
import { cn } from '@/lib/utils';
import { useMessageScrollerVisibility, MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller";
import { UserMessageBlock } from "@/components/UserMessageBlock";

const mockTurns = [
  { 
    id: 'msg-1', 
    title: "Detail using ChatGPT - I'm working on develo...",
    messages: [
      { id: "1", day: "Yesterday", time: "2:30 PM", role: "user", text: "Detail using ChatGPT - I'm working on developing a new UI..." },
      { id: "2", day: "Yesterday", time: "2:31 PM", role: "assistant", text: "I can help with that. What kind of UI are you developing?" }
    ]
  },
  { 
    id: 'msg-2', 
    title: "Start with Step 1: how to research and audit ...",
    messages: [
      { id: "3", day: "Today", time: "10:00 AM", role: "user", text: "Start with Step 1: how to research and audit competitors." },
      { id: "4", day: "Today", time: "10:01 AM", role: "assistant", text: "Here is a guide on researching and auditing competitors..." }
    ]
  },
  { 
    id: 'msg-3', 
    title: "Step 2 dive deep",
    messages: [
      { id: "5", day: "Today", time: "11:00 AM", role: "user", text: "Step 2 dive deep" },
      { id: "6", day: "Today", time: "11:02 AM", role: "assistant", text: "Diving deep into Step 2, we need to analyze..." }
    ]
  },
  { 
    id: 'msg-4', 
    title: "Is this covered everything... don't explain just...",
    messages: [
      { id: "7", day: "Today", time: "1:00 PM", role: "user", text: "Is this covered everything... don't explain just list them." },
      { id: "8", day: "Today", time: "1:01 PM", role: "assistant", text: "- Item A\n- Item B\n- Item C" }
    ]
  },
  { 
    id: 'msg-5', 
    title: "How do I map these with components",
    messages: [
      { id: "9", day: "Today", time: "2:00 PM", role: "user", text: "How do I map these with components" },
      { id: "10", day: "Today", time: "2:02 PM", role: "assistant", text: "You can map them using the `map` function in React..." }
    ]
  },
  { 
    id: 'msg-6', 
    title: "COLOUR",
    messages: [
      { id: "11", day: "Today", time: "3:00 PM", role: "user", text: "COLOUR" },
      { id: "12", day: "Today", time: "3:01 PM", role: "assistant", text: "Colors can be configured in your CSS variables or Tailwind config." }
    ]
  },
  { 
    id: 'msg-7', 
    title: "ive created a design system using antigravity.",
    messages: [
      { id: "13", day: "Today", time: "4:00 PM", role: "user", text: "ive created a design system using antigravity." },
      { id: "14", day: "Today", time: "4:01 PM", role: "assistant", text: "That sounds great! Antigravity design systems provide an excellent foundation." }
    ]
  }
];

function ChatJumpMenu({ activeSessionId }: { activeSessionId: string | null }) {
  const { currentAnchorId } = useMessageScrollerVisibility();
  const [isOpen, setIsOpen] = useState(false);

  if (activeSessionId !== 'mock') return null;

  // Calculate the active index to highlight the burger lines
  const activeIndex = mockTurns.findIndex(t => t.id === currentAnchorId);
  const displayIndex = activeIndex >= 0 ? activeIndex : mockTurns.length - 1;

  // We show 4 lines in the burger menu icon to represent the document outline
  // We highlight the one that roughly corresponds to the scroll progress
  const progressPercent = mockTurns.length > 1 ? displayIndex / (mockTurns.length - 1) : 1;
  const activeLine = Math.round(progressPercent * 3);

  return (
    <div 
      className="absolute right-6 top-1/2 -translate-y-1/2 z-50 flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* 
        We use an invisible spacer (pr-2) to ensure the mouse doesn't leave the container 
        while moving from the button to the menu 
      */}
      {isOpen && (
        <div className="absolute right-full pr-2 py-8">
          <div className="w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 py-2 z-50 max-h-[60vh] overflow-y-auto">
            {mockTurns.map(turn => {
              const isActive = turn.id === currentAnchorId;
              return (
                <button 
                  key={turn.id}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-[14px] transition-colors truncate mx-2 max-w-[calc(100%-16px)] rounded-xl",
                    isActive ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  )}
                  onClick={() => {
                    const el = document.querySelector(`[data-message-id="${turn.id}"]`);
                    el?.scrollIntoView({ behavior: 'smooth' });
                    setIsOpen(false);
                  }}
                >
                  {turn.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button 
        className="p-1.5 flex flex-col gap-[3px] items-center justify-center w-8 h-8 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        {[0, 1, 2, 3].map(lineIdx => (
          <div 
            key={lineIdx} 
            className={cn(
              "h-[2px] rounded-full transition-colors duration-300",
              lineIdx === activeLine ? "bg-black dark:bg-zinc-100 w-4" : "bg-zinc-300 dark:bg-zinc-700 w-4"
            )}
          />
        ))}
      </button>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [promptText, setPromptText] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [chatState, setChatState] = useState<'idle' | 'generating' | 'completed' | 'stopped'>('idle');
  const [isFocused, setIsFocused] = useState(false);
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isArtifactOpen, setIsArtifactOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isHITL, setIsHITL] = useState(false);
  const [isHITLResolved, setIsHITLResolved] = useState(false);
  const [hitlAnswers, setHitlAnswers] = useState<HITLAnswer[]>([]);
  const [isWorkflowComplete, setIsWorkflowComplete] = useState(false);
  const [isImageMode, setIsImageMode] = useState(false);
  const [isEditingQuery, setIsEditingQuery] = useState(false);
  const [editQueryText, setEditQueryText] = useState('');
  const [queryBranches, setQueryBranches] = useState<string[]>([]);
  const [currentBranchIndex, setCurrentBranchIndex] = useState(0);
  const [isErrorMode, setIsErrorMode] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);


  const [attachments, setAttachments] = useState<{ name: string; size: string; type: string }[]>([]);
  const [isContextHovered, setIsContextHovered] = useState(false);

  const resetChatState = () => {
    setChatState('idle');
    setSubmittedQuery('');
    setIsWorkflowComplete(false);
    setHitlAnswers([]);
    setIsImageMode(false);
    setIsErrorMode(false);
    setQueryBranches([]);
    setAttachments([]);
    setPromptText('');
    setIsArtifactOpen(false);
  };

  const handleNewChat = () => {
    resetChatState();
    setActiveSessionId(null);
  };

  const handleSessionSelect = (id: string) => {
    resetChatState();
    setActiveSessionId(id);
  };

  const historyGroups = [
    {
      label: "Recent",
      items: [
        { id: '1', title: "Review all employee reimbursements over ₹20,000 from Q2 and summarize any compliance issues", time: "2h ago" },
        { id: '2', title: "Delinquency Roll Rate Analysis v2 for Q3", time: "3h ago" },
      ]
    },
    {
      label: "Yesterday",
      items: [
        { id: 'mock', title: "Detail using ChatGPT - I'm working on developing a new UI...", time: "2:30 pm" },
        { id: '3', title: "Compare Q1 and Q2 revenue for the North American market", time: "02:35 pm" },
        { id: '4', title: "Auto Loan Dropout Analysis Metrics", time: "11:37 am" },
      ]
    },
    {
      label: "2026-05-20",
      items: [
        { id: '5', title: "Generate a summary of the latest AI policies and guidelines", time: "09:15 am" },
        { id: '6', title: "Customer churn by segment - Q1 2026", time: "08:30 am" },
      ]
    }
  ];

  const suggestions = [
    "Why did appliance loans drop?",
    "Customer churn by segment",
    "90-day activation rate",
    "Delinquency roll rates"
  ];

  const filteredSuggestions = promptText.trim().length > 0
    ? suggestions.filter(s => s.toLowerCase().includes(promptText.toLowerCase()))
    : [];

  const handleSubmit = () => {
    if (!promptText.trim()) return;
    const lowerPrompt = promptText.toLowerCase();
    
    setQueryBranches([promptText]);
    setCurrentBranchIndex(0);

    setSubmittedQuery(promptText);
    setPromptText('');
    
    // Reset textarea height and blur
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(ta => {
      ta.style.height = 'auto';
      ta.blur();
    });
    setIsFocused(false);

    const isErr = lowerPrompt.includes('error');
    setIsErrorMode(isErr);
    
    setChatState(isErr ? 'generating' : (lowerPrompt.includes('image') ? 'completed' : 'generating'));
    setIsImageMode(lowerPrompt.includes('image'));
    setIsHITL(false);
    setIsHITLResolved(false);
    setHitlAnswers([]);
    setIsWorkflowComplete(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePrevBranch = () => {
    if (currentBranchIndex > 0) {
      const newIndex = currentBranchIndex - 1;
      setCurrentBranchIndex(newIndex);
      setSubmittedQuery(queryBranches[newIndex]);
    }
  };

  const handleNextBranch = () => {
    if (currentBranchIndex < queryBranches.length - 1) {
      const newIndex = currentBranchIndex + 1;
      setCurrentBranchIndex(newIndex);
      setSubmittedQuery(queryBranches[newIndex]);
    }
  };

  const renderInput = (disabled: boolean, placeholder: string) => (
    <div className="w-full relative max-w-3xl mx-auto pointer-events-auto">
      <div className={cn(
        "relative bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-[24px] flex flex-col pt-3 px-3 pb-2 transition-all duration-300 z-20",
        // Focus state
        isFocused && !disabled && "border border-blue-500 ring-4 ring-blue-500/10 shadow-md",
        // Default & Hover state
        !isFocused && !disabled && "border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700",
        // Processing/Disabled state
        disabled && "border border-blue-100 dark:border-zinc-800 bg-blue-50/30 dark:bg-zinc-900 shadow-inner"
      )}>
        
        {/* Processing Indicator */}
        {disabled && (
          <div className="absolute -inset-[1px] rounded-[24px] ring-2 ring-blue-400/50 animate-pulse pointer-events-none" />
        )}
        
        {/* Slash Commands Popup */}
        {promptText.startsWith('/') && (
          <div className="absolute bottom-[calc(100%+12px)] left-0 w-80 bg-white dark:bg-zinc-900 dark:backdrop-blur-xl rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 p-2 z-30 animate-in slide-in-from-bottom-2 fade-in">
            <div className="space-y-1">
              {[
                { cmd: '/review', desc: 'Review the current diff', icon: Search },
                { cmd: '/explain', desc: 'Explain the selection', icon: BookOpen },
                { cmd: '/branch', desc: 'Start a new branch', icon: GitBranch },
                { cmd: '/improve', desc: 'Suggest improvements', icon: Sparkles }
              ].map((item, idx) => (
                <button 
                  key={idx}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  onClick={() => {
                    setPromptText(item.cmd + ' ');
                    setIsFocused(true);
                  }}
                >
                  <item.icon className="w-4 h-4 text-zinc-400" />
                  <span className="font-medium text-[14px] text-zinc-900 dark:text-zinc-100">{item.cmd}</span>
                  <span className="text-[13px] text-zinc-400 dark:text-zinc-400">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 px-1">
            {attachments.map((file, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-[#f4f4f5] dark:bg-zinc-800 pl-2 pr-3 py-1.5 rounded-xl text-sm border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors group">
                <div className="bg-white dark:bg-zinc-900 p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 shadow-sm flex items-center justify-center">
                   {file.type === 'image' ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 text-[13px] leading-tight">{file.name}</span>
                  <span className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-tight mt-0.5">{file.size}</span>
                </div>
                <button 
                  className="ml-1 text-zinc-400 hover:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          onInput={(e) => {
            const target = e.currentTarget;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full bg-transparent resize-none outline-none text-[15px] text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 min-h-[44px] max-h-[200px] overflow-y-auto disabled:opacity-50 px-2 pt-1"
          rows={1}
        />
        
        <div className="flex items-center justify-between pt-1 pb-1">
          <div className="relative">
            <MagneticWrapper>
              <button 
                onClick={() => setIsAttachOpen(!isAttachOpen)}
                className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                  isAttachOpen 
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100' 
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Plus className={`h-5 w-5 transition-transform duration-200 ${isAttachOpen ? 'rotate-45' : ''}`} />
              </button>
            </MagneticWrapper>

            {isAttachOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.1)] border border-zinc-100 dark:border-zinc-800 p-2 z-30 animate-in zoom-in-95 fade-in duration-200">
                <ul className="space-y-1">
                  <li>
                    <button 
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-blue-600 rounded-lg transition-colors" 
                      onClick={() => {
                        setAttachments(prev => [...prev, { name: 'trace.log', size: '38 KB', type: 'file' }]);
                        setIsAttachOpen(false);
                      }}
                    >
                      <FileText className="h-4 w-4" /> Upload Document
                    </button>
                  </li>
                  <li>
                    <button 
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-blue-600 rounded-lg transition-colors" 
                      onClick={() => {
                        setAttachments(prev => [...prev, { name: 'screenshot.png', size: '128 KB', type: 'image' }]);
                        setIsAttachOpen(false);
                      }}
                    >
                      <ImageIcon className="h-4 w-4" /> Upload Image
                    </button>
                  </li>
                  <li>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-blue-600 rounded-lg transition-colors" onClick={() => setIsAttachOpen(false)}>
                      <HardDrive className="h-4 w-4" /> Connect Drive
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 pr-1">
            <div className="relative" onMouseEnter={() => setIsContextHovered(true)} onMouseLeave={() => setIsContextHovered(false)}>
              <button className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center">
                 <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M21 12a9 9 0 1 1-6.219-8.56" className="text-zinc-800 dark:text-zinc-100" />
                   <path d="M21 12a9 9 0 0 0-9-9" className="text-zinc-300 dark:text-zinc-700" />
                 </svg>
              </button>
              {isContextHovered && (
                <div className="absolute bottom-full right-0 mb-3 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 p-5 z-30 animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-[15px]">Context</span>
                    <span className="text-zinc-400 text-[13px]">37%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-5 flex overflow-hidden">
                    <div className="h-full bg-zinc-400 w-[20%]" />
                    <div className="h-full bg-zinc-700 w-[17%]" />
                  </div>
                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between items-center text-[13px]">
                      <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" /> System
                      </div>
                      <span className="text-zinc-400">12k</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" /> Tools
                      </div>
                      <span className="text-zinc-400">8k</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 dark:bg-zinc-400" /> Messages
                      </div>
                      <span className="text-zinc-400">54k</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-[13px]">
                    <span className="text-zinc-500 dark:text-zinc-400">Total</span>
                    <span className="text-zinc-400">74k <span className="text-zinc-300 dark:text-zinc-700 mx-1">/</span> 200k</span>
                  </div>
                </div>
              )}
            </div>

            <MagneticWrapper>
              <button className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <Mic className="h-5 w-5" />
              </button>
            </MagneticWrapper>
            
            {chatState === 'generating' ? (
              <MagneticWrapper>
                <button 
                  onClick={() => setChatState('stopped')}
                  className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all animate-in zoom-in group"
                >
                  <Square className="h-6 w-6 fill-current group-hover:fill-red-500 p-0.5" />
                </button>
              </MagneticWrapper>
            ) : promptText.length > 0 ? (
              <MagneticWrapper>
                <button 
                  onClick={handleSubmit}
                  className="p-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all animate-in zoom-in shadow-sm"
                >
                  <ArrowUp className="h-6 w-6 p-1" />
                </button>
              </MagneticWrapper>
            ) : (
              <div className="p-1.5 bg-[#f4f4f5] dark:bg-[#2A2A2A] text-zinc-400 dark:text-zinc-500 rounded-lg transition-all opacity-50 cursor-not-allowed">
                <ArrowUp className="h-6 w-6 p-1" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isFocused && filteredSuggestions.length > 0 && chatState === 'idle' && (
        <div className="absolute top-[85%] left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-lg rounded-b-2xl pt-8 pb-3 px-2 z-10 animate-in fade-in slide-in-from-top-2">
          <ul className="space-y-1">
            {filteredSuggestions.map((suggestion, index) => (
              <li key={index}>
                <button 
                  className="w-full text-left px-4 py-2.5 text-[15px] text-zinc-700 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors"
                  onClick={() => {
                    setPromptText(suggestion);
                    setIsFocused(false);
                  }}
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );  return (
    <div className="flex flex-col h-screen bg-[#fdfdfd] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      
      <header className="h-[52px] flex items-center justify-between px-4 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/80 dark:backdrop-blur-xl flex-shrink-0 z-20 relative">
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[15px] tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
              Gen AI Platform
            </span>
          </div>
          <div className="w-px h-4 bg-slate-200 dark:bg-zinc-800 mx-2" />
          <div className="flex items-center gap-1.5 text-[13px] text-zinc-500 dark:text-zinc-400">
            <span className="hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer transition-colors">Home</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer transition-colors">Gen AI Designer</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-medium text-zinc-900 dark:text-zinc-100">Purposive AI Agents</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
          <button 
            className="p-1.5 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="p-1.5 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <HelpCircle className="h-4 w-4" />
          </button>
          <button className="p-1.5 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <User className="h-4 w-4" />
          </button>
          <button className="p-1.5 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <Power className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden min-h-0">
        <ResizablePanelGroup direction="horizontal" className="flex-1 min-w-0 flex h-full">
        
        {isSidebarOpen && (
          <>
            <ResizablePanel defaultSize={18} minSize={15} maxSize={30} className="bg-[#fdfdfd] dark:bg-zinc-950/80 dark:backdrop-blur-xl border-r border-transparent dark:border-zinc-800 flex flex-col h-full z-10 transition-all duration-300">
              <aside className="flex flex-col h-full">
            <div className="h-12 flex items-center justify-between px-4 border-b border-zinc-100 dark:border-zinc-800 mb-2">
              <span className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100">MCCI Copilot</span>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>
            </div>

            <div className="px-3 pb-4 space-y-1">
              <MagneticWrapper>
                <button 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors ${activeSessionId === null ? 'bg-zinc-100 dark:bg-zinc-800 font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                  onClick={handleNewChat}
                >
                  <MessageSquarePlus className="h-[18px] w-[18px]" />
                  New Chat
                </button>
              </MagneticWrapper>
              <MagneticWrapper>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg text-[14px] transition-colors">
                  <Library className="h-[18px] w-[18px]" />
                  Agent Catalogue
                </button>
              </MagneticWrapper>
              <MagneticWrapper>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg text-[14px] transition-colors">
                  <FileStack className="h-[18px] w-[18px]" />
                  Artifacts
                </button>
              </MagneticWrapper>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-4">
              {historyGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="mb-6">
                  <div className="text-xs font-medium text-zinc-400 px-3 mb-2">{group.label}</div>
                  
                  {group.items.map((item) => {
                    const isMenuOpen = activeMenuId === item.id;
                    const isActive = activeSessionId === item.id;
                    
                    return (
                      <div key={item.id} className={`w-full flex justify-between items-center px-3 py-2 text-[14px] ${isActive ? 'bg-zinc-100 dark:bg-zinc-800 font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'} rounded-lg transition-colors group relative`}>
                        <span 
                          className="truncate pr-2 cursor-pointer flex-1 text-left" 
                          title={item.title}
                          onClick={() => handleSessionSelect(item.id)}
                        >
                          {item.title}
                        </span>
                        
                        <span className={`text-xs text-zinc-400 flex-none ${isMenuOpen ? 'hidden' : 'group-hover:hidden'}`}>
                          {item.time}
                        </span>

                        <button 
                          className={`${isMenuOpen ? 'flex bg-zinc-200 dark:bg-zinc-700' : 'hidden group-hover:flex'} items-center justify-center p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-500`}
                          onClick={() => setActiveMenuId(isMenuOpen ? null : item.id)}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-2 top-8 w-32 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-800 py-1 z-50 animate-in zoom-in-95 fade-in duration-100">
                            <button 
                              className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 flex items-center gap-2 text-zinc-700 transition-colors"
                              onClick={() => setActiveMenuId(null)}
                            >
                              <Pencil className="w-3.5 h-3.5" /> Rename
                            </button>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors"
                              onClick={() => setActiveMenuId(null)}
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            
            {/* Bottom Profile Section */}
            <div className="px-4 pb-4 pt-2">
              <ProfileDropdown />
            </div>
              </aside>
            </ResizablePanel>
            <ResizableHandle className="w-px bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors cursor-col-resize z-30" />
          </>
        )}

        <ResizablePanel defaultSize={isSidebarOpen ? (isArtifactOpen ? 42 : 82) : (isArtifactOpen ? 60 : 100)} className="flex flex-col relative min-w-0 min-h-0 h-full bg-[#f9f9f9] dark:bg-zinc-950">
            <main className="flex-1 flex flex-col min-w-0 min-h-0 h-full relative">
          
          <div className="h-[52px] flex items-center justify-between px-6 flex-shrink-0 bg-[#f9f9f9]/90 dark:bg-zinc-950/80 backdrop-blur-xl z-10">
            <div className="flex items-center gap-3">
              {!isSidebarOpen && (
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-1.5 -ml-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  title="Expand Sidebar"
                >
                  <PanelLeftOpen className="h-5 w-5" />
                </button>
              )}
              <span className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100">CodeMorph</span>
            </div>

            {!isSidebarOpen && (
              <button 
                onClick={handleNewChat}
                className="p-1.5 -mr-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors animate-in fade-in zoom-in"
                title="New chat"
              >
                <MessageSquarePlus className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col relative overflow-hidden min-h-0">
            
            {chatState === 'idle' && !submittedQuery && !activeSessionId ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto animate-in fade-in duration-500">
                <div className="w-full flex flex-col items-center -mt-20">
                  <GreetingText />
                  <div className="w-full relative max-w-3xl mx-auto mt-4">
                    {renderInput(false, "Ask anything")}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <MessageScrollerProvider autoScroll defaultScrollPosition="last-anchor">
                  <ChatJumpMenu activeSessionId={activeSessionId} />
                  <MessageScroller className="flex-1 flex flex-col relative overflow-hidden animate-in fade-in duration-500 min-h-0">
                    <MessageScrollerViewport className="flex-1 overflow-y-auto p-6 lg:px-12">
                      <MessageScrollerContent className="w-full max-w-5xl mx-auto space-y-6 mt-4 pb-8">
                        
                        {activeSessionId === 'mock' && mockTurns.map((turn, index) => {
                          const firstMessage = turn.messages[0];
                          const prevTurn = index > 0 ? mockTurns[index - 1] : null;
                          const prevLastMessage = prevTurn ? prevTurn.messages[prevTurn.messages.length - 1] : null;
                          const newDay = firstMessage && (!prevLastMessage || firstMessage.day !== prevLastMessage.day);

                          return (
                            <div key={`container-${turn.id}`} className="flex flex-col gap-6">
                              {newDay && (
                                <div className="flex items-center gap-2.5 py-2 w-full justify-center opacity-70">
                                  <span className="bg-zinc-200 dark:bg-zinc-700 h-px w-12" />
                                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
                                    {firstMessage.day}
                                  </span>
                                  <span className="bg-zinc-200 dark:bg-zinc-700 h-px w-12" />
                                </div>
                              )}
                              <MessageScrollerItem key={turn.id} messageId={turn.id} scrollAnchor>
                                <div className="w-full flex flex-col gap-6">
                                  {turn.messages.map((message) => (
                                    <div key={message.id}>
                                      {message.role === 'user' ? (
                                        <UserMessageBlock content={message.text} />
                                      ) : (
                                        <MarkdownResponse 
                                          content={message.text} 
                                          onOpenArtifact={() => setIsArtifactOpen(true)} 
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </MessageScrollerItem>
                            </div>
                          );
                        })}

                      {submittedQuery && (
                        <MessageScrollerItem messageId="user-query" scrollAnchor>
                          <UserMessageBlock 
                            content={submittedQuery}
                            isEditable={true}
                            branches={queryBranches}
                            currentBranchIndex={currentBranchIndex}
                            onPrevBranch={handlePrevBranch}
                            onNextBranch={handleNextBranch}
                            onEditSubmit={(newText) => {
                              const newBranches = [...queryBranches.slice(0, currentBranchIndex + 1), newText];
                              setQueryBranches(newBranches);
                              setCurrentBranchIndex(newBranches.length - 1);

                              setSubmittedQuery(newText);
                              setIsEditingQuery(false);
                              setChatState(newText.toLowerCase().includes('image') ? 'completed' : 'generating');
                              setIsImageMode(newText.toLowerCase().includes('image'));
                              setIsHITL(false);
                              setIsHITLResolved(false);
                              setHitlAnswers([]);
                              setIsWorkflowComplete(false);
                            }}
                          />
                        </MessageScrollerItem>
                      )}

                      {submittedQuery && (
                        <>
                          <MessageScrollerItem messageId="assistant-response">
                            <div className="w-full flex justify-start">
                          {isErrorMode ? (
                            <ErrorState 
                              title="Connection failed"
                              detail="Unable to establish a secure connection to the database. The agent cannot proceed without access to the financial records."
                              retrying={isRetrying}
                              onRetry={() => {
                                setIsRetrying(true);
                                setTimeout(() => {
                                  setIsRetrying(false);
                                  setIsErrorMode(false);
                                }, 1500);
                              }}
                            />
                          ) : chatState === 'stopped' ? (
                            <div className="w-full animate-in fade-in zoom-in-95 duration-200">
                              <StoppedRun 
                                words={["Based on the financial records, there are 3 main anomalies found in the Q2 employee reimbursement logs:"]}
                                reason="Stop requested"
                                onContinue={() => setChatState('completed')}
                                onDiscard={() => {
                                   setChatState('idle');
                                   setSubmittedQuery('');
                                }}
                              />
                            </div>
                          ) : isImageMode ? (
                            <ImageGeneration 
                              prompt={submittedQuery} 
                              onComplete={() => setChatState('completed')}
                            />
                          ) : (
                            <WorkflowProgress 
                              onRequireHITL={() => setIsHITL(true)}
                              isHITLResolved={isHITLResolved}
                              onComplete={() => {
                                setIsWorkflowComplete(true);
                                setChatState('completed');
                              }}
                            />
                          )}
                            </div>
                          </MessageScrollerItem>

                          {hitlAnswers.length > 0 && (
                            <MessageScrollerItem messageId="hitl-answers" scrollAnchor>
                              <div className="flex flex-col items-end gap-1 mb-8 animate-in fade-in slide-in-from-bottom-2">
                            <div className="bg-[#f0f0f0] dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-5 py-4 rounded-3xl rounded-tr-sm max-w-[70%] shadow-sm border border-zinc-100 dark:border-zinc-800">
                              <div className="space-y-4">
                                {hitlAnswers.map((item, idx) => (
                                  <div key={idx} className="space-y-1">
                                    <div className="font-medium text-zinc-500 dark:text-zinc-400 text-[13px]">{item.question}</div>
                                    <div className="text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200">{item.answer}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                              </div>
                            </MessageScrollerItem>
                          )}

                          {isWorkflowComplete && !isErrorMode && (
                            <MessageScrollerItem messageId="workflow-complete">
                              <MarkdownResponse onOpenArtifact={() => setIsArtifactOpen(true)} />
                              
                              <div className="flex flex-col items-end w-full mt-4 mb-4 animate-in fade-in slide-in-from-bottom-2">
                              <Suggestions 
                                suggestions={[
                                  "Add optimistic updates",
                                  "Show me the diff",
                                  "Why not React context?",
                                  "Write a regression test"
                                ]}
                                selectedSuggestion={null}
                                onSuggestion={(s) => {
                                  setPromptText(s);
                                  setIsFocused(true);
                                }}
                                cycle={0}
                                className="justify-end max-w-xl"
                              />
                              </div>
                            </MessageScrollerItem>
                          )}
                        </>
                      )}
                      
                    </MessageScrollerContent>
                  </MessageScrollerViewport>
                  <MessageScrollerButton />
                </MessageScroller>
              </MessageScrollerProvider>

              <div className="flex-none relative z-20">
                  {/* Fixed gradient overlay for scrolling text */}
                  <div className="absolute bottom-full left-0 right-0 h-4 bg-gradient-to-t from-[#f9f9f9]/60 dark:from-zinc-950/80 to-transparent pointer-events-none" />
                  
                  {/* Interactive Input/Questionnaire Container */}
                  <div className="bg-[#f9f9f9] dark:bg-zinc-950 p-6 pt-0 w-full flex flex-col justify-end pointer-events-none">
                    {isHITL ? (
                      <Questionnaire 
                        onSubmit={(answers) => {
                          setIsHITL(false);
                          setHitlAnswers(answers);
                          setIsHITLResolved(true);
                          setChatState('completed');
                        }}
                        onClose={() => setIsHITL(false)}
                      />
                    ) : (
                      <div className="w-full relative max-w-4xl mx-auto pointer-events-auto pb-4 animate-in fade-in duration-300">
                        {renderInput(
                          chatState === 'generating',
                          chatState === 'generating' ? "Agent is processing..." : "Ask anything"
                        )}
                        <p className="text-center text-[11px] text-zinc-400 mt-2 tracking-wide font-medium">
                          Review AI responses before use.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </ResizablePanel>

        {isArtifactOpen && (
          <>
            <ResizableHandle className="w-px bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors cursor-col-resize z-30" />
            <ResizablePanel defaultSize={40} minSize={25} maxSize={60} className="relative z-20">
              <ArtifactEditor onClose={() => setIsArtifactOpen(false)} />
            </ResizablePanel>
          </>
        )}

        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default App;
