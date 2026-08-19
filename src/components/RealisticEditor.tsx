import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface RealisticEditorProps {
  initialCode: string;
  language?: string;
  className?: string;
}

export function RealisticEditor({ initialCode, className }: RealisticEditorProps) {
  const [code, setCode] = useState(initialCode);

  const lines = code.split('\n');

  // Extremely basic syntax highlighting for Java (Light Theme)
  const highlightLine = (line: string) => {
    if (line.trim().startsWith('//')) {
      return <span className="text-[#008000]">{line}</span>;
    }

    // Replace < and > first
    let escaped = line.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // We'll use custom tokens to avoid replacing our own HTML classes
    const keywords = /\b(public|private|protected|class|static|void|import|new|double|char|int|boolean|if|else|switch|case|break|default|return)\b/g;
    const classes = /\b(String|System|Scanner|Math|Exception)\b/g;
    const strings = /("[^"]*")/g;
    
    // Mark keywords and classes with temporary placeholders
    escaped = escaped.replace(keywords, '@@KW@@$1@@END@@');
    escaped = escaped.replace(classes, '@@CL@@$1@@END@@');
    escaped = escaped.replace(strings, '@@ST@@$1@@END@@');
    
    // Replace placeholders with spans
    let highlighted = escaped
      .replace(/@@KW@@(.*?)@@END@@/g, '<span style="color:#0000ff">$1</span>')
      .replace(/@@CL@@(.*?)@@END@@/g, '<span style="color:#267f99">$1</span>')
      .replace(/@@ST@@(.*?)@@END@@/g, '<span style="color:#a31515">$1</span>');

    return <span dangerouslySetInnerHTML={{ __html: highlighted || ' ' }} />;
  };

  return (
    <div className={cn("flex flex-col w-full h-full bg-white font-mono text-[14px]", className)}>
      <div className="flex-1 flex overflow-auto">
        <div className="flex flex-col text-right py-4 px-4 bg-gray-50 text-gray-400 select-none border-r border-gray-200 min-w-[50px]">
          {lines.map((_, i) => (
            <div key={i} className="leading-relaxed">{i + 1}</div>
          ))}
        </div>
        <div className="flex-1 relative overflow-hidden">
          {/* Syntax Display */}
          <div 
            id="syntax-display"
            className="absolute inset-0 w-full h-full p-4 pointer-events-none whitespace-pre font-mono text-[14px] leading-relaxed overflow-hidden text-gray-900"
            style={{ tabSize: 4 }}
          >
            {lines.map((line, i) => (
              <div key={i} className="min-h-[1.5em]">
                {highlightLine(line)}
              </div>
            ))}
          </div>
          {/* Textarea overlay */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onScroll={(e) => {
              const display = document.getElementById('syntax-display');
              if (display) {
                display.scrollTop = e.currentTarget.scrollTop;
                display.scrollLeft = e.currentTarget.scrollLeft;
              }
            }}
            spellCheck={false}
            className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-black outline-none resize-none font-mono text-[14px] leading-relaxed whitespace-pre"
            style={{ tabSize: 4 }}
          />
        </div>
      </div>
    </div>
  );
}
