import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  BookmarkIcon,
  ArrowPathIcon,
  LinkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';

interface ResearchResult {
  id: string;
  title: string;
  snippet: string;
  url: string;
  source: string;
  date: string;
}

const ResearchPage = () => {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ResearchResult[]>([]);
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/');
    }
  }, [mounted, user, router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    
    // Simulate search results
    setTimeout(() => {
      const mockResults: ResearchResult[] = [
        {
          id: '1',
          title: 'Introduction to AI Research',
          snippet: 'An overview of current AI research trends and methodologies. Focuses on machine learning applications.',
          url: 'https://example.com/ai-research',
          source: 'AI Journal',
          date: '2023-09-15',
        },
        {
          id: '2',
          title: `Research findings related to "${query}"`,
          snippet: `This simulated result contains information about ${query} and its applications in modern technology.`,
          url: 'https://example.com/research',
          source: 'Tech Research',
          date: '2023-10-25',
        },
        {
          id: '3',
          title: 'Advanced Machine Learning Techniques',
          snippet: 'Deep dive into neural networks, reinforcement learning, and natural language processing.',
          url: 'https://example.com/ml-techniques',
          source: 'ML Database',
          date: '2023-11-05',
        },
      ];
      
      setResults(mockResults);
      setIsSearching(false);
    }, 1500);
    
    // In a real implementation, you would fetch from an API
    // const response = await fetch('/api/research', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ query }),
    // });
    // const data = await response.json();
    // setResults(data.results);
    // setIsSearching(false);
  };

  const saveResearch = (result: ResearchResult) => {
    // In a real implementation, you would save this to your database
    console.log('Saving research:', result);
  };

  if (!mounted || !user) return null;

  return (
    <DashboardLayout title="Research" description="AI-powered research assistant">
      <div className="space-y-6">
        {/* Research header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            AI Research Assistant
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Use AI to research topics, find information, and generate detailed reports
          </p>
          
          {/* Search form */}
          <form onSubmit={handleSearch} className="relative">
            <div className="flex">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Search for any topic or question..."
                  disabled={isSearching}
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Searching...
                  </>
                ) : (
                  'Research'
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Research tools */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Research Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center space-x-3 hover:shadow-md transition-shadow duration-200">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <DocumentTextIcon className="h-5 w-5 text-primary-600 dark:text-primary-300" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Generate Report</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Create detailed reports from research</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center space-x-3 hover:shadow-md transition-shadow duration-200">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center">
                <BookmarkIcon className="h-5 w-5 text-secondary-600 dark:text-secondary-300" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Saved Research</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Access your saved research items</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center space-x-3 hover:shadow-md transition-shadow duration-200">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <PlusIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">New Collection</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Create a new research collection</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Research results */}
        {(results.length > 0 || isSearching) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {isSearching ? 'Searching...' : `Results for "${query}"`}
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {isSearching ? (
                <div className="p-6 text-center">
                  <ArrowPathIcon className="animate-spin mx-auto h-8 w-8 text-primary-600 dark:text-primary-400" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Searching and analyzing information...
                  </p>
                </div>
              ) : (
                results.map((result) => (
                  <div key={result.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {result.title}
                        </h4>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {result.snippet}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span>{result.source}</span>
                          <span className="mx-2">•</span>
                          <span>{result.date}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex space-x-2">
                        <button
                          onClick={() => saveResearch(result)}
                          className="p-1 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                          <BookmarkIcon className="h-5 w-5" />
                          <span className="sr-only">Save</span>
                        </button>
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                          <LinkIcon className="h-5 w-5" />
                          <span className="sr-only">Open link</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResearchPage; 