import { Check, Copy, Code2, ThumbsUp, ThumbsDown, RotateCw, Maximize2, X } from 'lucide-react';
import { useState } from 'react';
import { MessageTiming } from '@/components/message-timing';
import { MessageAttachments, type MessageAttachmentItem } from '@/components/message-attachments';
import { QuoteReply } from '@/components/quote-reply';
import { ImageViewer } from './image-viewer';
import { ArtifactCard } from './ArtifactCard';

function SelectableText({ text, className }: { text: string; className?: string }) {
  const [selection, setSelection] = useState<{before: string, selected: string, after: string} | null>(null);

  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      setSelection(null);
      return;
    }
    
    const selectedStr = sel.toString();
    if (!selectedStr || !text.includes(selectedStr)) {
       setSelection(null);
       return;
    }

    const index = text.indexOf(selectedStr);
    setSelection({
      before: text.substring(0, index),
      selected: selectedStr,
      after: text.substring(index + selectedStr.length)
    });
    
    sel.removeAllRanges(); // Clear native selection to show our custom blue highlight
  };

  // Click outside or anywhere else to dismiss selection
  const handleDismiss = () => {
    setSelection(null);
  };

  if (selection) {
    return (
      <div className="relative">
        {/* Invisible overlay to dismiss selection when clicking outside */}
        <div className="fixed inset-0 z-10" onClick={handleDismiss} />
        <div className="relative z-20">
          <QuoteReply 
            before={selection.before}
            selection={selection.selected}
            after={selection.after}
            actions={[
              { key: 'quote', label: 'Quote', icon: 'quote' },
              { key: 'explain', label: 'Explain', icon: 'explain' },
              { key: 'rewrite', label: 'Rewrite', icon: 'rewrite' }
            ]}
            toolbarVisible={true}
            onAction={() => setSelection(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <p onMouseUp={handleMouseUp} className={className}>
      {text}
    </p>
  );
}

export function MarkdownResponse({ content, onOpenArtifact, hasArtifact }: { content?: string, onOpenArtifact?: () => void, hasArtifact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mockAttachments: MessageAttachmentItem[] = [
    { id: '1', name: 'composer-regression.png', size: '412 KB', kind: 'image', swatch: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop)' },
    { id: '2', name: 'migration-0.14.pdf', size: '1.2 MB', pages: 14, kind: 'document' },
    { id: '3', name: 'vitest-run.log', size: '38 KB', kind: 'file' }
  ];

  const handleOpenAttachment = (id: string) => {
    const attachment = mockAttachments.find(a => a.id === id);
    if (!attachment) return;
    
    if (attachment.kind === 'image' && attachment.swatch) {
      const urlMatch = attachment.swatch.match(/url\((.*?)\)/);
      if (urlMatch && urlMatch[1]) {
        setSelectedImage(urlMatch[1]);
      }
    } else {
      if (onOpenArtifact) onOpenArtifact();
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500 mt-0 mb-12 relative group">
      {/* Rendered Markdown Body */}
      <div className="w-full flex flex-col gap-5 text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200">
        
        {content ? (
          <div className="whitespace-pre-wrap">
            <SelectableText text={content} />
            {hasArtifact && (
              <div className="mt-4">
                <ArtifactCard 
                  title="persona-deep-dive.md"
                  meta="1.2 KB"
                  onClick={onOpenArtifact}
                />
              </div>
            )}
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4">
                Analysis Complete: Quarterly Reimbursements
              </h2>
              <p className="mb-4">
                I've reviewed all employee reimbursements over <strong>₹20,000</strong> from Q2 and checked them against the updated compliance policies. Based on your inputs regarding acceptable variances and regional thresholds, here is the summary of the flagged items.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-3">Key Findings</h3>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Identified <span className="text-red-600 dark:text-red-400 font-semibold">4</span> out-of-policy claims primarily related to late submissions.</li>
                <li>Travel expenses in the APAC region accounted for <strong>68%</strong> of high-value reimbursements.</li>
                <li>No duplicate submissions detected in this quarter.</li>
              </ul>
              <div className="mt-4">
                <ArtifactCard 
                  title="persona-deep-dive.md"
                  meta="1.2 KB"
                  onClick={onOpenArtifact}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">Next Steps</h3>
              <SelectableText 
                text="You can use the exported JSON to trigger an automated email sequence to the respective employees asking for clarification, or I can generate a compliance report PDF for the finance team."
              />
            </div>

            <div className="mt-2">
              <MessageAttachments attachments={mockAttachments} onOpen={handleOpenAttachment} className="max-w-md" />
            </div>
          </>
        )}

      </div>

      <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-4 flex items-center justify-between w-full">
        {/* Message Actions on Hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
          <button className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors" title="Copy Message">
            <Copy className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-zinc-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Good Response">
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Bad Response">
            <ThumbsDown className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Regenerate">
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        <MessageTiming 
          stats={[
            { label: "ttft", value: "0.4s" },
            { label: "total", value: "2.6s" },
            { label: "tok/s", value: "61" },
            { label: "tokens", value: "1,204" },
            { label: "cost", value: "$0.018" }
          ]} 
          className="flex-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />
      </div>

      {/* Image Modal Lightbox */}
      {selectedImage && (
        <ImageViewer 
          src={selectedImage}
          alt="Attachment Preview"
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
