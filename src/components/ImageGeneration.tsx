import { useState, useEffect } from 'react';
import { Sparkles, Image as ImageIcon, X, ZoomIn, ZoomOut, RotateCcw, Maximize, Copy, Download, FileCode } from 'lucide-react';
import { ImageViewer } from './image-viewer';
import spidermanImg from '@/assets/wp4628531-spider-man-selfie-wallpapers.jpg';

export function ImageGeneration({ prompt, onComplete }: { prompt: string, onComplete?: () => void }) {
  const [isGenerated, setIsGenerated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const imageUrl = spidermanImg;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerated(true);
      onComplete?.();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);
  return (
    <div className="w-full max-w-[320px] animate-in fade-in slide-in-from-bottom-4 duration-700 mt-2 mb-8">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanMask {
          0% {
            -webkit-mask-position: 200% 0%;
            mask-position: 200% 0%;
          }
          100% {
            -webkit-mask-position: -100% 0%;
            mask-position: -100% 0%;
          }
        }
        .animate-scan-mask {
          -webkit-mask-image: radial-gradient(circle 120px at center, black 0%, transparent 100%);
          mask-image: radial-gradient(circle 120px at center, black 0%, transparent 100%);
          -webkit-mask-size: 200% 100%;
          mask-size: 200% 100%;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          animation: scanMask 3.5s ease-in-out infinite;
        }
        
        @keyframes dotTyping {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }
        .dot-1 { animation: dotTyping 1.5s infinite 0s; }
        .dot-2 { animation: dotTyping 1.5s infinite 0.2s; }
        .dot-3 { animation: dotTyping 1.5s infinite 0.4s; }
        
        @keyframes textShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-text-shimmer {
          background: linear-gradient(90deg, #9ca3af 25%, #4b5563 50%, #9ca3af 75%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: textShimmer 3s linear infinite;
        }
      `}} />

      <div className="flex flex-col">
        
        {/* Canvas Area */}
        <div 
          className="relative w-full aspect-square rounded-3xl bg-[#fbfbfb] dark:bg-zinc-900 overflow-hidden isolate border border-zinc-200 dark:border-zinc-800 shadow-sm cursor-pointer group"
          onClick={() => isGenerated && setIsModalOpen(true)}
        >
          
          {!isGenerated ? (
            <>
              {/* Base Grid (Light Dots) */}
              <div 
                className="absolute inset-0 text-zinc-200 dark:text-zinc-800" 
                style={{ 
                  backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1.5px, transparent 0)', 
                  backgroundSize: '24px 24px',
                  backgroundPosition: '12px 12px'
                }}
              />
              
              {/* Dark Grid (Moving Mask) */}
              <div 
                className="absolute inset-0 opacity-90 animate-scan-mask text-zinc-400 dark:text-zinc-500" 
                style={{ 
                  backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1.5px, transparent 0)', 
                  backgroundSize: '24px 24px',
                  backgroundPosition: '12px 12px'
                }}
              />
            </>
          ) : (
            <img 
              src={imageUrl} 
              alt={prompt} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          )}

          {/* Resolution Badge */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-xl text-[12px] font-mono text-zinc-500 font-medium shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-zinc-100/50">
            1024 × 1024
          </div>
          
          {isGenerated && (
             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
               <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium text-zinc-800 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                 Click to expand
               </div>
             </div>
          )}
        </div>

        {/* Text Area */}
        <div className="mt-5 px-1">
          <h3 className="text-zinc-900 dark:text-zinc-100 font-semibold text-[15px] mb-1.5 flex items-center">
            {isGenerated ? "Generated image" : "Generating image"}
            {!isGenerated && (
              <span className="ml-0.5 flex">
                <span className="dot-1">.</span>
                <span className="dot-2">.</span>
                <span className="dot-3">.</span>
              </span>
            )}
          </h3>
          <p className={isGenerated ? "text-[14px] text-zinc-500 font-light" : "text-[14px] font-light animate-text-shimmer"}>
            "{prompt}"
          </p>
        </div>

      </div>
      
      {/* Fullscreen Viewer Modal */}
      {isModalOpen && (
        <ImageViewer 
          src={imageUrl} 
          alt={prompt} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}
