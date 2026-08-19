import { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Maximize, Copy, Download, FileCode } from 'lucide-react';

export function ImageViewer({ src, alt, onClose }: { src: string, alt: string, onClose: () => void }) {
  const [zoomLevel, setZoomLevel] = useState(1);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 text-sm">{alt}</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto bg-gray-50 relative flex items-center justify-center p-8">
           <img 
             src={src} 
             alt={alt} 
             style={{ transform: `scale(${zoomLevel})` }} 
             className="max-w-full max-h-full object-contain transition-transform duration-200 origin-center shadow-md rounded-md bg-white" 
           />
        </div>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
           <div className="bg-white border border-gray-200 shadow-lg rounded-full px-6 py-2 flex items-center gap-2">
             <button onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3))} className="flex items-center gap-1.5 px-4 py-1.5 hover:bg-gray-100 rounded-full text-sm font-medium text-gray-700 transition-colors">
               <ZoomIn className="w-4 h-4" /> Zoom In
             </button>
             <button onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.25))} className="flex items-center gap-1.5 px-4 py-1.5 hover:bg-gray-100 rounded-full text-sm font-medium text-gray-700 transition-colors">
               <ZoomOut className="w-4 h-4" /> Zoom Out
             </button>
             <div className="w-px h-6 bg-gray-200 mx-1" />
             <button onClick={() => setZoomLevel(1)} className="flex items-center gap-1.5 px-4 py-1.5 hover:bg-gray-100 rounded-full text-sm font-medium text-gray-700 transition-colors">
               <RotateCcw className="w-4 h-4" /> Reset
             </button>
             <button onClick={() => setZoomLevel(1)} className="flex items-center gap-1.5 px-4 py-1.5 hover:bg-gray-100 rounded-full text-sm font-medium text-gray-700 transition-colors">
               <Maximize className="w-4 h-4" /> Fit
             </button>
             <div className="w-px h-6 bg-gray-200 mx-1" />
             <button className="flex items-center gap-1.5 px-4 py-1.5 hover:bg-gray-100 rounded-full text-sm font-medium text-gray-700 transition-colors">
               <Copy className="w-4 h-4" /> Copy
             </button>
             <button className="flex items-center gap-1.5 px-4 py-1.5 hover:bg-gray-100 rounded-full text-sm font-medium text-gray-700 transition-colors">
               <Download className="w-4 h-4" /> PNG
             </button>
             <button className="flex items-center gap-1.5 px-4 py-1.5 hover:bg-gray-100 rounded-full text-sm font-medium text-gray-700 transition-colors">
               <FileCode className="w-4 h-4" /> SVG
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
