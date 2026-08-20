import { Pencil, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface UserMessageBlockProps {
  content: string;
  isEditable?: boolean;
  onEditSubmit?: (newText: string) => void;
  branches?: string[];
  currentBranchIndex?: number;
  onPrevBranch?: () => void;
  onNextBranch?: () => void;
}

export function UserMessageBlock({
  content,
  isEditable = false,
  onEditSubmit,
  branches = [],
  currentBranchIndex = 0,
  onPrevBranch,
  onNextBranch
}: UserMessageBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(content);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleSend = () => {
    if (!editText.trim()) return;
    if (onEditSubmit) {
      onEditSubmit(editText);
    }
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-end gap-1 animate-in fade-in slide-in-from-bottom-2 group w-full">
      <div className="flex w-full justify-end group mt-6 relative">
      {isEditing && isEditable ? (
        <div className="bg-[#f0f0f0] dark:bg-zinc-900 p-4 rounded-3xl w-full max-w-[80%] flex flex-col gap-2 shadow-sm border border-zinc-100 dark:border-zinc-800">
          <textarea 
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full bg-white dark:bg-black/20 text-zinc-900 dark:text-zinc-100 rounded-xl p-3 text-[15px] border border-blue-500/50 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none min-h-[100px]"
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-4 py-1.5 bg-white dark:bg-[#2A2A2A] text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-full text-[13px] font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button 
              onClick={handleSend}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[13px] font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 max-w-full justify-end relative">
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity duration-200">
            {isEditable && (
              <button 
                onClick={() => {
                  setEditText(content);
                  setIsEditing(true);
                }}
                className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                title="Edit query"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={handleCopy}
              className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              title="Copy query"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-[#f0f0f0] dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-5 py-4 rounded-3xl rounded-tr-sm shadow-sm break-words max-w-[80%] border border-zinc-100 dark:border-zinc-800">
            <p className="text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">{content}</p>
          </div>

          {!isEditing && branches.length > 1 && (
            <div className="absolute -bottom-8 right-2 flex items-center bg-[#f0f0f0] dark:bg-zinc-900 rounded-full px-2 py-1 shadow-sm border border-zinc-100 dark:border-zinc-800">
              <button 
                onClick={onPrevBranch} 
                disabled={currentBranchIndex === 0}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-30 disabled:hover:text-zinc-400 p-0.5 rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 px-2 min-w-[32px] text-center tracking-wide">
                {currentBranchIndex + 1}/{branches.length}
              </span>
              <button 
                onClick={onNextBranch}
                disabled={currentBranchIndex === branches.length - 1}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-30 disabled:hover:text-zinc-400 p-0.5 rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
