import { useState, useEffect } from 'react';
import { 
  Check, 
  Loader2, 
  ChevronDown, 
  ChevronRight, 
  AlertTriangle, 
  CodeXml,
  ChevronRightIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
interface WorkflowProgressProps {
  onRequireHITL?: () => void;
  isHITLResolved?: boolean;
  onComplete?: () => void;
}

export function WorkflowProgress({ onRequireHITL, isHITLResolved, onComplete }: WorkflowProgressProps = {}) {
  const [simulationState, setSimulationState] = useState(0);
  const [isStep3Expanded, setIsStep3Expanded] = useState(true);
  const [isMainExpanded, setIsMainExpanded] = useState(true);

  useEffect(() => {
    // Sequence the animation states to reach the error state
    // 0: Initial
    // 1: Step 1 done
    // 2: Step 2 done
    // 3: Step 3 typing in terminal
    // 4: Error on Step 4
    
    if (simulationState === 0) {
      setTimeout(() => setSimulationState(1), 1000);
    } else if (simulationState === 1) {
      setTimeout(() => setSimulationState(2), 1200);
    } else if (simulationState === 2) {
      setTimeout(() => setSimulationState(3), 1500);
    } else if (simulationState === 3) {
      const timer = setTimeout(() => {
        setSimulationState(4);
        onRequireHITL?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [simulationState, onRequireHITL]);

  useEffect(() => {
    if (isHITLResolved && simulationState === 4) {
      setSimulationState(5);
      setTimeout(() => setSimulationState(6), 1500);
    }
  }, [isHITLResolved, simulationState]);

  useEffect(() => {
    if (simulationState === 6) {
      setIsMainExpanded(false);
      const timer = setTimeout(() => {
        onComplete?.();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [simulationState, onComplete]);

  return (
    <div className="w-full max-w-[700px] animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Header */}
      <div 
        className="flex items-center justify-between px-5 py-3.5 bg-transparent rounded-xl cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        onClick={() => setIsMainExpanded(!isMainExpanded)}
      >
        <div className="flex items-center gap-3">
          {simulationState >= 6 ? (
            <Check className="w-4 h-4 text-green-600 dark:text-green-400" strokeWidth={3} />
          ) : (
            <Loader2 className="w-4 h-4 text-blue-500 dark:text-blue-400 animate-spin" />
          )}
          <span className="font-medium text-[14px] text-zinc-900 dark:text-zinc-100">
            {simulationState >= 6 ? "Workflow completed" : "Agent is processing..."}
          </span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-zinc-400 transition-transform duration-200", isMainExpanded ? "" : "-rotate-90")} />
      </div>
      
      {/* Timeline Steps (Collapsible) */}
      {isMainExpanded && (
        <div className="px-5 py-4 relative animate-in fade-in duration-300">
          {/* The continuous vertical line */}
          <div className="absolute left-[34px] top-6 bottom-8 w-px bg-zinc-200/60 dark:bg-zinc-800/60"></div>

          {/* Step 1: Analyze */}
          <div className="relative flex items-center justify-between py-3 -mx-2 px-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer group">
            <div className="flex items-center gap-4 z-10">
              <div className={cn(
                "flex items-center justify-center shrink-0 w-7 h-7 rounded-full transition-colors duration-300",
                simulationState >= 1 ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
              )}>
                {simulationState >= 1 ? <Check className="w-3 h-3" strokeWidth={3.5} /> : <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />}
              </div>
              <span className={cn(
                "text-[15px] transition-colors",
                simulationState >= 1 ? "text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" : "text-zinc-400"
              )}>
                Analyze request and extract constraints
              </span>
            </div>
            {simulationState >= 1 && (
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-xs font-mono">0.4s</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Step 2: Search UI knowledge base */}
          <div className="relative flex items-center justify-between py-3 -mx-2 px-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer group">
            <div className="flex items-center gap-4 z-10">
              <div className={cn(
                "flex items-center justify-center shrink-0 w-7 h-7 rounded-full transition-colors duration-300",
                simulationState >= 2 ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
              )}>
                {simulationState >= 2 ? <Check className="w-3 h-3" strokeWidth={3.5} /> : <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />}
              </div>
              <span className={cn(
                "text-[15px] transition-colors",
                simulationState >= 2 ? "text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" : "text-zinc-400"
              )}>
                Search UI knowledge base
              </span>
            </div>
            {simulationState >= 2 && (
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-xs font-mono">1.2s</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Step 3: Synthesize logic (Active / Expanded) */}
          <div className="relative py-3">
            <div 
              className={cn(
                "flex items-center justify-between mb-2 -mx-2 px-2 py-1 rounded-lg transition-all group",
                simulationState >= 2 ? "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800" : ""
              )}
              onClick={() => {
                if (simulationState >= 2) setIsStep3Expanded(!isStep3Expanded);
              }}
            >
              <div className="flex items-center gap-4 z-10">
                <div className={cn(
                  "flex items-center justify-center shrink-0 w-7 h-7 rounded-full transition-colors duration-300",
                  simulationState >= 4 ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : 
                  simulationState >= 2 ? "bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
                )}>
                  {simulationState >= 2 && simulationState < 4 ? <Loader2 className="w-3 h-3 animate-spin" strokeWidth={3} /> : 
                   simulationState >= 4 ? <Check className="w-3 h-3 text-green-600 dark:text-green-400" strokeWidth={3.5} /> : <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />}
                </div>
                <span className={cn(
                  "text-[15px] transition-colors",
                  simulationState >= 2 && simulationState < 4 ? "text-zinc-900 dark:text-zinc-100 font-medium" : 
                  simulationState >= 4 ? "text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" : "text-zinc-400"
                )}>
                  Synthesize component logic
                </span>
              </div>
              {simulationState >= 2 && (
                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="text-lg leading-none tracking-widest mb-2">...</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isStep3Expanded ? "" : "-rotate-90")} />
                </div>
              )}
            </div>

            {/* Expanded Nested Section */}
            {simulationState >= 2 && isStep3Expanded && (
              <div className="pl-12 pr-4 pb-2 pt-2 animate-in slide-in-from-top-2 fade-in duration-300">
                <div className="flex items-center gap-2 mb-3">
                  {simulationState >= 4 ? (
                    <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                  ) : (
                    <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                  )}
                  <span className={cn(
                    "text-sm font-mono",
                    simulationState >= 4 ? "text-green-600" : "text-blue-600"
                  )}>
                    {simulationState >= 4 ? "Structured timeline layout generated" : "Generating structured timeline layout..."}
                  </span>
                </div>
                
                {/* Terminal Box */}
                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl p-4 font-mono text-[13px] leading-relaxed shadow-sm">
                  <div className="mb-2">
                    <span className="text-purple-600 dark:text-purple-400">const</span> <span className="text-blue-600 dark:text-blue-400">timelineLayout</span> <span className="text-zinc-500">=</span> <span className="text-amber-600 dark:text-amber-400">useMemo</span><span className="text-zinc-500">(...)</span>
                  </div>
                  <div className="text-zinc-500 dark:text-zinc-400 space-y-1.5 pl-4">
                    <div className="flex gap-2">
                      <span className="text-zinc-400 dark:text-zinc-600">-</span>
                      <span>Fixing absolute positioning overlaps</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-zinc-400 dark:text-zinc-600">-</span>
                      <span>Applying distinct icon columns</span>
                    </div>
                    {simulationState >= 3 && (
                      <div className="flex gap-2 text-zinc-900 dark:text-zinc-100 font-medium animate-in fade-in">
                        <span className="text-blue-500">&gt;</span>
                        <span>Injecting rich content panels</span>
                        {simulationState < 4 && <span className="w-1.5 h-3.5 bg-zinc-800 dark:bg-zinc-200 animate-pulse ml-0.5 mt-0.5 inline-block"></span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 4: Error -> Resolved */}
          <div className="relative flex items-center justify-between py-3 -mx-2 px-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer">
            <div className="flex items-center gap-4 z-10">
              <div className={cn(
                "flex items-center justify-center shrink-0 w-7 h-7 rounded-full transition-colors duration-300",
                simulationState >= 5 ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" :
                simulationState === 4 ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-500"
              )}>
                {simulationState >= 5 ? <Check className="w-3 h-3" strokeWidth={3.5} /> :
                 simulationState === 4 ? <AlertTriangle className="w-3 h-3" strokeWidth={2.5} /> : <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-600" />}
              </div>
              <span className={cn(
                "text-[15px] transition-colors",
                simulationState >= 5 ? "text-zinc-900 dark:text-zinc-100" :
                simulationState === 4 ? "text-red-500 dark:text-red-400" : "text-zinc-400"
              )}>
                {simulationState >= 5 ? "Dependencies resolved via user input" : "Review dependency conflicts"}
              </span>
            </div>
            {simulationState === 4 && (
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-xs font-mono">0.8s</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Step 5: Pending */}
          <div className="relative flex items-center justify-between py-3 -mx-2 px-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer">
            <div className="flex items-center gap-4 z-10">
              <div className={cn(
                "flex items-center justify-center shrink-0 w-7 h-7 rounded-full transition-colors duration-300",
                simulationState >= 6 ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" :
                simulationState === 5 ? "bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-500"
              )}>
                {simulationState >= 6 ? <Check className="w-3 h-3 text-green-600 dark:text-green-400" strokeWidth={3.5} /> :
                 simulationState === 5 ? <Loader2 className="w-3 h-3 animate-spin" strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-600" />}
              </div>
              <span className={cn(
                "text-[15px] transition-colors",
                simulationState >= 6 ? "text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" : 
                simulationState === 5 ? "text-zinc-900 dark:text-zinc-100 font-medium" : "text-zinc-400"
              )}>
                Update application state and UI
              </span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
