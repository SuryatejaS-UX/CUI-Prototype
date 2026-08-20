import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn, ZoomOut, RotateCcw, Maximize, Copy, Download, FileCode } from 'lucide-react';
import { DynamicToolbar } from './uselayouts/dynamic-toolbar';

export function ImageViewer({ src, alt, onClose }: { src: string, alt: string, onClose: () => void }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse drag-to-pan state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle touchpad pinch-to-zoom (ctrl + wheel)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault(); // Prevent browser from zooming the whole page
        e.stopPropagation();
        
        // Use a smoother sensitivity for trackpads
        const delta = -e.deltaY * 0.01; 
        setZoomLevel(prev => Math.min(Math.max(prev + delta, 0.25), 5));
      }
    };

    // Attach to window to guarantee we catch the event before the browser triggers native page zoom
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  if (!mounted) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setScrollStart({
      x: containerRef.current.scrollLeft,
      y: containerRef.current.scrollTop
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    containerRef.current.scrollLeft = scrollStart.x - dx;
    containerRef.current.scrollTop = scrollStart.y - dy;
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-200"
      onPointerDown={onClose}
    >
      <div 
        className="relative w-[95vw] max-w-[1600px] h-full max-h-[95vh] bg-white dark:bg-zinc-950 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onPointerDown={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-none flex items-center justify-between px-6 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="font-semibold text-zinc-800 dark:text-zinc-100 text-[15px]">{alt}</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Scrollable Image Container */}
        <div 
          ref={containerRef}
          className={`flex-1 min-h-0 overflow-auto bg-white dark:bg-zinc-950/50 relative flex items-center justify-center p-4 md:p-8 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
           <img 
             src={src} 
             alt={alt} 
             style={{ transform: `scale(${zoomLevel})` }} 
             className="max-w-none origin-center pointer-events-none" 
           />
        </div>
        
        {/* Bottom Toolbar */}
        <div className="flex-none pb-6 pt-2 w-full flex justify-center z-10 absolute bottom-0 left-0 right-0 pointer-events-none">
           <div className="pointer-events-auto flex items-center gap-1 p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg">
             {[
               { icon: ZoomIn, label: "Zoom In", onClick: () => setZoomLevel(prev => Math.min(prev + 0.25, 3)) },
               { icon: ZoomOut, label: "Zoom Out", onClick: () => setZoomLevel(prev => Math.max(prev - 0.25, 0.25)) },
               { icon: RotateCcw, label: "Reset", onClick: () => setZoomLevel(1) },
               { icon: Maximize, label: "Fit", onClick: () => setZoomLevel(1) },
               { type: "divider" },
               { icon: Copy, label: "Copy", onClick: () => {} },
               { icon: Download, label: "PNG", onClick: () => {} },
               { icon: FileCode, label: "SVG", onClick: () => {} },
             ].map((tool, index) => {
               if (tool.type === "divider") {
                 return <div key={index} className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 mx-1" />;
               }
               return (
                 <button
                   key={index}
                   onClick={tool.onClick}
                   className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                 >
                   {tool.icon && <tool.icon className="w-4 h-4" />}
                   <span className="text-sm font-medium">{tool.label}</span>
                 </button>
               );
             })}
           </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
