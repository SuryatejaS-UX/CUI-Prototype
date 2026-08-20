import { useState } from 'react';
import { Search, FileText, Image as ImageIcon, Code, FileStack, Clock, Database, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockArtifacts = [
  {
    id: '1',
    name: 'Authentication Flow System',
    type: 'Code',
    date: '2 hours ago',
    size: '12 KB',
    description: 'React components and hooks for handling OAuth2 and JWT session states.',
    icon: Code,
    color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  },
  {
    id: '2',
    name: 'Q3 Product Strategy Review',
    type: 'Document',
    date: 'Yesterday',
    size: '4.2 MB',
    description: 'Comprehensive analysis of market trends and proposed roadmap for Q4.',
    icon: FileText,
    color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  },
  {
    id: '3',
    name: 'Dashboard Layout Wireframes',
    type: 'Image',
    date: 'Aug 18, 2026',
    size: '2.1 MB',
    description: 'High-fidelity mockups of the new analytics dashboard generated via AI.',
    icon: ImageIcon,
    color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  },
  {
    id: '4',
    name: 'Customer Churn Dataset',
    type: 'Data',
    date: 'Aug 15, 2026',
    size: '145 MB',
    description: 'Cleaned and normalized dataset of customer retention metrics from 2023-2025.',
    icon: Database,
    color: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
  },
  {
    id: '5',
    name: 'API Route Handlers',
    type: 'Code',
    date: 'Aug 10, 2026',
    size: '8 KB',
    description: 'Node.js Express handlers with input validation and rate limiting.',
    icon: Code,
    color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  },
  {
    id: '6',
    name: 'Employee Onboarding Manual',
    type: 'Document',
    date: 'Aug 01, 2026',
    size: '1.2 MB',
    description: 'Markdown documentation detailing the setup steps for new engineering hires.',
    icon: FileText,
    color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  }
];

const types = ['All', 'Code', 'Document', 'Image', 'Data'];

export function ArtifactsPage({ onOpenArtifact }: { onOpenArtifact: (id: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('All');

  const filteredArtifacts = mockArtifacts.filter(artifact => {
    const matchesSearch = artifact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          artifact.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeType === 'All' || artifact.type === activeType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden animate-in fade-in duration-300">
      <div className="flex-none px-8 pt-10 pb-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Artifacts</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-2xl">
          Browse and manage all generated files, code snippets, data sets, and documents created during your sessions.
        </p>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              type="text"
              placeholder="Search artifacts..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors",
                  activeType === type
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                    : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredArtifacts.map(artifact => (
            <div 
              key={artifact.id} 
              className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-300 cursor-pointer"
              onClick={() => onOpenArtifact(artifact.id)}
            >
              <div className="flex items-start gap-3 mb-2">
                <div className={cn("p-2 rounded-lg shrink-0", artifact.color)}>
                  <artifact.icon className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">{artifact.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                      {artifact.type}
                    </span>
                    <span className="text-[10px] text-zinc-400">{artifact.size}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-[12px] text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2 flex-1 mb-2.5">
                {artifact.description}
              </p>

              <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px]">{artifact.date}</span>
                </div>
                
                <button 
                  className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); /* handle download */ }}
                  title="Download Artifact"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredArtifacts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileStack className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />
            <h3 className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100 mb-1">No artifacts found</h3>
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
