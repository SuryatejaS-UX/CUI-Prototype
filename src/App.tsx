import { useState, useRef, useEffect } from 'react';
import { 
  Menu, Code, CircleHelp, User, Power, PanelLeft, Plus, Mic, ArrowUp,
  Image as ImageIcon, FileText, HardDrive, PanelLeftClose,
  MessageSquarePlus, Library, FileStack, MoreHorizontal, Pencil, Trash2,
  Square, ChevronLeft, ChevronRight, Copy, X, Search, BookOpen, GitBranch, Sparkles,
  PanelRight
} from 'lucide-react';
import { WorkflowProgress } from '@/components/WorkflowProgress';
import { ImageGeneration } from '@/components/ImageGeneration';
import { Questionnaire } from '@/components/Questionnaire';
import type { HITLAnswer } from '@/components/Questionnaire';
import { MarkdownResponse } from '@/components/MarkdownResponse';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ArtifactEditor } from "@/components/ArtifactEditor";
import { DaySeparator, type DatedMessage } from "@/components/day-separator";
import { ErrorState } from '@/components/error-state';
import { Suggestions } from '@/components/suggestions';
import { StoppedRun } from '@/components/stopped-run';

const mockHistory: DatedMessage[] = [
  {
    id: "1",
    day: "Yesterday",
    time: "2:30 PM",
    role: "user",
    text: "Why does the draft survive a reload?"
  },
  {
    id: "2",
    day: "Yesterday",
    time: "2:31 PM",
    role: "assistant",
    text: "It's persisted per thread, so the slot is read\nback on mount."
  },
  {
    id: "3",
    day: "Today",
    time: "9:00 AM",
    role: "user",
    text: "And across thread switches?"
  },
  {
    id: "4",
    day: "Today",
    time: "9:01 AM",
    role: "assistant",
    text: "Each thread owns its own slot, so nothing leaks\nbetween them."
  }
];

function App() {
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [promptText, setPromptText] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [chatState, setChatState] = useState<'idle' | 'generating' | 'completed' | 'stopped'>('idle');
  const [isFocused, setIsFocused] = useState(false);
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isArtifactOpen, setIsArtifactOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState, isWorkflowComplete, isHITL, hitlAnswers.length, currentBranchIndex]);

  const [attachments, setAttachments] = useState<{ name: string; size: string; type: string }[]>([]);
  const [isContextHovered, setIsContextHovered] = useState(false);

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
    
    // Reset textarea height
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(ta => ta.style.height = 'auto');

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
      <div className={`relative bg-white rounded-[24px] flex flex-col pt-3 px-3 pb-2 transition-all duration-300 z-20 ${
        isFocused && !disabled
          ? 'border-2 border-gray-200 shadow-md' 
          : 'border border-gray-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_-4px_rgba(0,0,0,0.08)]'
      } ${disabled ? 'opacity-90' : ''}`}>
        
        {/* Slash Commands Popup */}
        {promptText.startsWith('/') && (
          <div className="absolute bottom-[calc(100%+12px)] left-0 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-30 animate-in slide-in-from-bottom-2 fade-in">
            <div className="space-y-1">
              {[
                { cmd: '/review', desc: 'Review the current diff', icon: Search },
                { cmd: '/explain', desc: 'Explain the selection', icon: BookOpen },
                { cmd: '/branch', desc: 'Start a new branch', icon: GitBranch },
                { cmd: '/improve', desc: 'Suggest improvements', icon: Sparkles }
              ].map((item, idx) => (
                <button 
                  key={idx}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-xl hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setPromptText(item.cmd + ' ');
                    setIsFocused(true);
                  }}
                >
                  <item.icon className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-[14px] text-gray-900">{item.cmd}</span>
                  <span className="text-[13px] text-gray-400">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 px-1">
            {attachments.map((file, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-[#f4f4f5] pl-2 pr-3 py-1.5 rounded-xl text-sm border border-transparent hover:border-gray-200 transition-colors group">
                <div className="bg-white p-1.5 rounded-lg text-gray-600 shadow-sm flex items-center justify-center">
                   {file.type === 'image' ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-medium text-gray-900 text-[13px] leading-tight">{file.name}</span>
                  <span className="text-gray-500 text-[11px] leading-tight mt-0.5">{file.size}</span>
                </div>
                <button 
                  className="ml-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" 
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
          className="w-full bg-transparent resize-none outline-none text-[15px] text-gray-800 placeholder:text-gray-400 min-h-[44px] max-h-[200px] overflow-y-auto disabled:opacity-50 px-2 pt-1"
          rows={1}
        />
        
        <div className="flex items-center justify-between pt-1 pb-1">
          <div className="relative">
            <button 
              onClick={() => setIsAttachOpen(!isAttachOpen)}
              className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                isAttachOpen 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'text-gray-400 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Plus className={`h-5 w-5 transition-transform duration-200 ${isAttachOpen ? 'rotate-45' : ''}`} />
            </button>

            {isAttachOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.1)] border border-gray-100 p-2 z-30 animate-in zoom-in-95 fade-in duration-200">
                <ul className="space-y-1">
                  <li>
                    <button 
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors" 
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
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors" 
                      onClick={() => {
                        setAttachments(prev => [...prev, { name: 'screenshot.png', size: '128 KB', type: 'image' }]);
                        setIsAttachOpen(false);
                      }}
                    >
                      <ImageIcon className="h-4 w-4" /> Upload Image
                    </button>
                  </li>
                  <li>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors" onClick={() => setIsAttachOpen(false)}>
                      <HardDrive className="h-4 w-4" /> Connect Drive
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 pr-1">
            <div className="relative" onMouseEnter={() => setIsContextHovered(true)} onMouseLeave={() => setIsContextHovered(false)}>
              <button className="p-2 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
                 <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M21 12a9 9 0 1 1-6.219-8.56" className="text-gray-800" />
                   <path d="M21 12a9 9 0 0 0-9-9" className="text-gray-300" />
                 </svg>
              </button>
              {isContextHovered && (
                <div className="absolute bottom-full right-0 mb-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-30 animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-gray-900 text-[15px]">Context</span>
                    <span className="text-gray-400 text-[13px]">37%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mb-5 flex overflow-hidden">
                    <div className="h-full bg-gray-400 w-[20%]" />
                    <div className="h-full bg-gray-700 w-[17%]" />
                  </div>
                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between items-center text-[13px]">
                      <div className="flex items-center gap-3 text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" /> System
                      </div>
                      <span className="text-gray-400">12k</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <div className="flex items-center gap-3 text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Tools
                      </div>
                      <span className="text-gray-400">8k</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <div className="flex items-center gap-3 text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-800" /> Messages
                      </div>
                      <span className="text-gray-400">54k</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-[13px]">
                    <span className="text-gray-500">Total</span>
                    <span className="text-gray-400">74k <span className="text-gray-300 mx-1">/</span> 200k</span>
                  </div>
                </div>
              )}
            </div>

            <button className="p-2 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
              <Mic className="h-5 w-5" />
            </button>
            
            {chatState === 'generating' ? (
              <button 
                onClick={() => setChatState('stopped')}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all animate-in zoom-in group"
              >
                <Square className="h-6 w-6 fill-current group-hover:fill-red-500 p-0.5" />
              </button>
            ) : promptText.length > 0 ? (
              <button 
                onClick={handleSubmit}
                className="p-1.5 bg-[#0a0a0a] text-white hover:bg-black rounded-lg transition-all animate-in zoom-in shadow-sm"
              >
                <ArrowUp className="h-6 w-6 p-1" />
              </button>
            ) : (
              <button 
                disabled
                className="p-1.5 bg-[#f4f4f5] text-gray-400 rounded-lg transition-all"
              >
                <ArrowUp className="h-6 w-6 p-1" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {isFocused && filteredSuggestions.length > 0 && chatState === 'idle' && (
        <div className="absolute top-[85%] left-0 right-0 bg-white border border-gray-100 shadow-lg rounded-b-2xl pt-8 pb-3 px-2 z-10 animate-in fade-in slide-in-from-top-2">
          <ul className="space-y-1">
            {filteredSuggestions.map((suggestion, index) => (
              <li key={index}>
                <button 
                  className="w-full text-left px-4 py-2.5 text-[15px] text-gray-700 hover:text-blue-500 rounded-lg transition-colors"
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
  );

  return (
    <div className="flex flex-col h-screen bg-[#fdfdfd] text-gray-900 font-sans">
      
      <header className="h-[52px] flex items-center justify-between px-4 border-b border-slate-200 bg-white flex-shrink-0 z-20 relative">
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center">
            <span className="text-xl font-bold tracking-tight">Gen AI Platform</span>
          </div>

          <div className="h-6 w-px bg-gray-300 ml-2"></div>

          <div className="flex items-center text-sm text-gray-600 ml-2 space-x-2">
            <span>Home</span>
            <span className="text-gray-400">&gt;</span>
            <span>Gen AI Designer</span>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-900">Purposive AI Agents</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-500">
          <button className="p-1.5 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <CircleHelp className="h-5 w-5" />
          </button>
          <button className="p-1.5 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <User className="h-5 w-5" />
          </button>
          <button className="p-1.5 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Power className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden min-h-0">
        <ResizablePanelGroup direction="horizontal" className="flex-1 min-w-0 flex h-full">
        
        {isSidebarOpen && (
          <>
            <ResizablePanel defaultSize={18} minSize={15} maxSize={30} className="bg-[#f9f9f9] flex flex-col h-full z-10 transition-all duration-300">
              <aside className="flex flex-col h-full">
            <div className="h-12 flex items-center justify-between px-4 border-b border-gray-100 mb-2">
              <span className="text-[15px] font-medium text-gray-900">MCCI Copilot</span>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>
            </div>

            <div className="px-3 pb-4 space-y-1">
              <button 
                className="w-full flex items-center gap-3 px-3 py-2.5 bg-blue-50/70 text-blue-700 rounded-lg font-medium text-[14px]"
                onClick={() => setChatState('idle')}
              >
                <MessageSquarePlus className="h-[18px] w-[18px]" />
                New Chat
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-[14px] transition-colors">
                <Library className="h-[18px] w-[18px]" />
                Agent Catalogue
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-[14px] transition-colors">
                <FileStack className="h-[18px] w-[18px]" />
                Artifacts
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-4">
              {historyGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="mb-6">
                  <div className="text-xs font-medium text-gray-400 px-3 mb-2">{group.label}</div>
                  
                  {group.items.map((item) => {
                    const isMenuOpen = activeMenuId === item.id;
                    
                    return (
                      <div key={item.id} className="w-full flex justify-between items-center px-3 py-2 text-[14px] text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group relative">
                        <span 
                          className="truncate pr-2 cursor-pointer flex-1 text-left" 
                          title={item.title}
                        >
                          {item.title}
                        </span>
                        
                        <span className={`text-xs text-gray-400 flex-none ${isMenuOpen ? 'hidden' : 'group-hover:hidden'}`}>
                          {item.time}
                        </span>

                        <button 
                          className={`${isMenuOpen ? 'flex bg-gray-200' : 'hidden group-hover:flex'} items-center justify-center p-1 hover:bg-gray-200 rounded-lg text-gray-500`}
                          onClick={() => setActiveMenuId(isMenuOpen ? null : item.id)}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-2 top-8 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in zoom-in-95 fade-in duration-100">
                            <button 
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700 transition-colors"
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
              </aside>
            </ResizablePanel>
            <ResizableHandle className="w-px bg-slate-200 hover:bg-slate-300 transition-colors cursor-col-resize z-30" />
          </>
        )}

        <ResizablePanel defaultSize={isSidebarOpen ? (isArtifactOpen ? 42 : 82) : (isArtifactOpen ? 60 : 100)} className="flex flex-col relative min-w-0 min-h-0 h-full bg-[#fdfdfd]">
            <main className="flex-1 flex flex-col min-w-0 min-h-0 h-full relative">
          
          <div className="h-[52px] flex items-center justify-between px-6 flex-shrink-0 bg-white/90 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              {!isSidebarOpen && (
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-1.5 mr-3 -ml-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors animate-in fade-in zoom-in"
                  title="Open sidebar"
                >
                  <PanelLeft className="h-5 w-5" />
                </button>
              )}
              <span className="text-[15px] font-medium text-gray-900">CodeMorph</span>
            </div>

            {!isSidebarOpen && (
              <button 
                onClick={() => {
                  setChatState('idle');
                  setSubmittedQuery('');
                }}
                className="p-1.5 -mr-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors animate-in fade-in zoom-in"
                title="New chat"
              >
                <MessageSquarePlus className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col relative overflow-hidden min-h-0">
            
            {chatState === 'idle' && !submittedQuery ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto animate-in fade-in duration-500">
                <div className="w-full flex flex-col items-center -mt-20">
                  <div className="mb-6 flex items-center justify-center w-[72px] h-[72px] rounded-2xl bg-gray-100/80 text-gray-300 border border-gray-200/60 shadow-sm">
                    <Code className="h-10 w-10" strokeWidth={2.5} />
                  </div>

                  <h1 className="text-2xl font-medium text-gray-900 mb-8 tracking-tight">
                    How can I help you today?
                  </h1>

                  <div className="w-full relative max-w-3xl mx-auto">
                    {renderInput(false, "Ask anything")}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col relative overflow-hidden animate-in fade-in duration-500 min-h-0">
                
                <div className="flex-1 overflow-y-auto p-6 lg:px-12">
                  <div className="w-full max-w-5xl mx-auto space-y-10 mt-4 pb-8">
                    
                    <div className="w-full mb-8">
                      <DaySeparator messages={mockHistory} />
                    </div>

                    <div className="flex flex-col items-end gap-1 animate-in fade-in slide-in-from-bottom-2 group w-full">
                      {isEditingQuery ? (
                        <div className="bg-[#f0f0f0] p-4 rounded-3xl w-full max-w-[80%] flex flex-col gap-2 shadow-sm border border-gray-100">
                          <textarea 
                            value={editQueryText}
                            onChange={(e) => setEditQueryText(e.target.value)}
                            className="bg-transparent w-full text-[15px] outline-none resize-none min-h-[50px] text-gray-900 placeholder:text-gray-400"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button 
                              onClick={() => setIsEditingQuery(false)}
                              className="px-4 py-1.5 bg-white text-gray-900 border border-gray-200 rounded-full text-[13px] font-medium hover:bg-gray-50 transition-colors shadow-sm"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => {
                                if (!editQueryText.trim()) return;
                                
                                const newBranches = [...queryBranches.slice(0, currentBranchIndex + 1), editQueryText];
                                setQueryBranches(newBranches);
                                setCurrentBranchIndex(newBranches.length - 1);

                                setSubmittedQuery(editQueryText);
                                setIsEditingQuery(false);
                                setChatState(editQueryText.toLowerCase().includes('image') ? 'completed' : 'generating');
                                setIsImageMode(editQueryText.toLowerCase().includes('image'));
                                setIsHITL(false);
                                setIsHITLResolved(false);
                                setHitlAnswers([]);
                                setIsWorkflowComplete(false);
                              }}
                              className="px-4 py-1.5 bg-[#0a0a0a] text-white rounded-full text-[13px] font-medium hover:bg-black transition-colors shadow-sm"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 max-w-full justify-end">
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                            <button 
                              onClick={() => {
                                setEditQueryText(submittedQuery);
                                setIsEditingQuery(true);
                              }}
                              className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-white hover:shadow-sm rounded-full transition-all"
                              title="Edit query"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => navigator.clipboard.writeText(submittedQuery)}
                              className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-white hover:shadow-sm rounded-full transition-all"
                              title="Copy query"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="bg-gray-100 text-gray-900 px-5 py-4 rounded-3xl rounded-tr-sm shadow-sm break-words max-w-[80%]">
                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{submittedQuery}</p>
                          </div>
                        </div>
                      )}
                      
                      {!isEditingQuery && (
                        <div className="flex items-center gap-2 justify-end w-full max-w-[80%] pr-1 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                          {queryBranches.length > 1 && (
                            <div className="flex items-center gap-1.5 text-gray-500 bg-white shadow-sm rounded-full px-2 py-0.5 text-[11px] font-medium font-mono border border-gray-100/50">
                              <button 
                                onClick={handlePrevBranch} 
                                disabled={currentBranchIndex === 0}
                                className="hover:text-gray-900 disabled:opacity-30 transition-colors"
                              ><ChevronLeft className="w-3.5 h-3.5" /></button>
                              <span>{currentBranchIndex + 1} / {queryBranches.length}</span>
                              <button 
                                onClick={handleNextBranch}
                                disabled={currentBranchIndex === queryBranches.length - 1}
                                className="hover:text-gray-900 disabled:opacity-30 transition-colors"
                              ><ChevronRight className="w-3.5 h-3.5" /></button>
                            </div>
                          )}
                          <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                            You
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="w-full flex justify-start mb-8">
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



                    {hitlAnswers.length > 0 && (
                      <div className="flex flex-col items-end gap-1 mb-8 animate-in fade-in slide-in-from-bottom-2">
                        <div className="bg-gray-100 text-gray-900 px-5 py-4 rounded-3xl rounded-tr-sm max-w-[70%] shadow-sm">
                          <div className="space-y-4">
                            {hitlAnswers.map((item, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="font-medium text-gray-500 text-[13px]">{item.question}</div>
                                <div className="text-[15px] leading-relaxed">{item.answer}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-[11px] text-gray-400 font-medium px-1 uppercase tracking-wider">
                          You
                        </div>
                      </div>
                    )}

                    {isWorkflowComplete && !isErrorMode && (
                      <>
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
                      </>
                    )}
                    
                    <div ref={chatEndRef} />
                  </div>
                </div>

                <div className="flex-none relative z-20">
                  {/* Fixed gradient overlay for scrolling text */}
                  <div className="absolute bottom-full left-0 right-0 h-4 bg-gradient-to-t from-[#fdfdfd]/60 to-transparent pointer-events-none" />
                  
                  {/* Interactive Input/Questionnaire Container */}
                  <div className="bg-[#fdfdfd] p-6 pt-0 w-full flex flex-col justify-end pointer-events-none">
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
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </ResizablePanel>

        {isArtifactOpen && (
          <>
            <ResizableHandle className="w-px bg-slate-200 hover:bg-slate-300 transition-colors cursor-col-resize z-30" />
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
