import { useState } from 'react';
import { Search, Bot, Code, Edit3, LineChart, Shield, Layout, Star, Users, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockAgents = [
  {
    id: '1',
    name: 'Synthetix',
    author: 'Igris Team',
    category: 'Development',
    description: 'Advanced code generation and refactoring specialist. Proficient in React, Node, and Python.',
    icon: Code,
    users: '12.4k',
    rating: '4.9',
    color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  },
  {
    id: '2',
    name: 'Lexi',
    author: 'Igris Team',
    category: 'Writing',
    description: 'Expert copywriter and editor. Perfect for blogs, marketing copy, and documentation.',
    icon: Edit3,
    users: '8.2k',
    rating: '4.8',
    color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  },
  {
    id: '3',
    name: 'DataWeaver',
    author: 'Community',
    category: 'Data',
    description: 'Data analysis and visualization expert. Can process CSVs and generate Python plot code.',
    icon: LineChart,
    users: '5.1k',
    rating: '4.7',
    color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  },
  {
    id: '4',
    name: 'SecureOps',
    author: 'Igris Team',
    category: 'Productivity',
    description: 'Security auditing assistant. Scans configurations and code for potential vulnerabilities.',
    icon: Shield,
    users: '2.3k',
    rating: '4.9',
    color: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
  },
  {
    id: '5',
    name: 'ReactSculptor',
    author: 'Community',
    category: 'Design',
    description: 'Converts UI wireframes or descriptions into production-ready Tailwind React components.',
    icon: Layout,
    users: '9.8k',
    rating: '4.6',
    color: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
  },
  {
    id: '6',
    name: 'General Assistant',
    author: 'Igris Team',
    category: 'Productivity',
    description: 'Your versatile everyday AI. Good at answering general questions and brainstorming.',
    icon: Bot,
    users: '45.1k',
    rating: '4.9',
    color: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
  }
];

const categories = ['All', 'Development', 'Writing', 'Data', 'Productivity', 'Design'];

export function AgentCatalogue({ onSelectAgent }: { onSelectAgent: (agentId: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredAgents = mockAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || agent.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden animate-in fade-in duration-300">
      <div className="flex-none px-8 pt-10 pb-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Agent Catalogue</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-2xl">
          Discover and deploy specialized AI agents tailored for specific tasks. From code generation to creative writing, find the perfect assistant for your workflow.
        </p>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              type="text"
              placeholder="Search agents..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors",
                  activeCategory === category
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                    : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAgents.map(agent => (
            <div 
              key={agent.id} 
              className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:shadow-sm transition-all duration-300"
            >
              <div className="flex items-start gap-3 mb-2.5">
                <div className={cn("p-2 rounded-lg shrink-0 mt-0.5", agent.color)}>
                  <agent.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">{agent.name}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">{agent.rating}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">By {agent.author}</p>
                </div>
              </div>
              
              <p className="text-[12px] text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2 flex-1 mb-3">
                {agent.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                  <Users className="w-3 h-3" />
                  <span className="text-[11px] font-medium">{agent.users}</span>
                </div>
                
                <button 
                  onClick={() => onSelectAgent(agent.id)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-md text-[11px] font-medium transition-colors"
                >
                  Use Agent
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredAgents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bot className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />
            <h3 className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100 mb-1">No agents found</h3>
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
