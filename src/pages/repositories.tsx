import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import {
  FolderIcon,
  StarIcon,
  CodeBracketIcon,
  ArrowPathIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';

interface Repository {
  id: string;
  name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
  updatedAt: string;
  isPrivate: boolean;
}

const RepositoriesPage = () => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    setMounted(true);
    
    // Simulate fetching repositories
    const timer = setTimeout(() => {
      const mockRepositories: Repository[] = [
        {
          id: '1',
          name: 'personal-ai-assistant',
          description: 'A personal AI assistant with multiple integrations',
          url: 'https://github.com/username/personal-ai-assistant',
          stars: 24,
          language: 'TypeScript',
          updatedAt: '2023-11-15',
          isPrivate: false,
        },
        {
          id: '2',
          name: 'data-analysis-tools',
          description: 'Collection of data analysis and visualization tools',
          url: 'https://github.com/username/data-analysis-tools',
          stars: 18,
          language: 'Python',
          updatedAt: '2023-10-22',
          isPrivate: false,
        },
        {
          id: '3',
          name: 'machine-learning-examples',
          description: 'Examples of machine learning algorithms and techniques',
          url: 'https://github.com/username/machine-learning-examples',
          stars: 42,
          language: 'Python',
          updatedAt: '2023-09-30',
          isPrivate: false,
        },
        {
          id: '4',
          name: 'web-development-project',
          description: 'Personal website and portfolio',
          url: 'https://github.com/username/web-development-project',
          stars: 5,
          language: 'JavaScript',
          updatedAt: '2023-11-05',
          isPrivate: true,
        },
      ];
      
      setRepositories(mockRepositories);
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/');
    }
  }, [mounted, user, router]);

  if (!mounted || !user) return null;

  return (
    <DashboardLayout title="Repositories" description="Manage your GitHub repositories">
      <div className="space-y-6">
        {/* Repositories header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                GitHub Repositories
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Manage and analyze your GitHub repositories
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <GlobeAltIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                Connect GitHub
              </button>
              <button 
                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => setIsLoading(true)}
              >
                <ArrowPathIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                Refresh
              </button>
            </div>
          </div>
        </div>
        
        {/* Repository filters */}
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500">
            All
          </button>
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500">
            Public
          </button>
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500">
            Private
          </button>
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500">
            <StarIcon className="mr-1.5 h-4 w-4 text-yellow-500" aria-hidden="true" />
            Starred
          </button>
        </div>
        
        {/* Repositories list */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-750">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">
                Your Repositories
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {repositories.length} repositories
              </span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <ArrowPathIcon className="mx-auto h-10 w-10 animate-spin text-primary-600 dark:text-primary-400" />
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading repositories...</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {repositories.map((repo) => (
                <li key={repo.id} className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-750">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <FolderIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h4 className="text-lg font-medium text-primary-600 dark:text-primary-400 truncate">
                          {repo.name}
                        </h4>
                        {repo.isPrivate && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                            Private
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {repo.description}
                      </p>
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center mr-4">
                          <span className="mr-1 inline-block h-3 w-3 rounded-full bg-yellow-400"></span>
                          {repo.language}
                        </div>
                        <div className="flex items-center mr-4">
                          <StarIcon className="mr-1 h-4 w-4" aria-hidden="true" />
                          {repo.stars}
                        </div>
                        <div>Updated on {repo.updatedAt}</div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex space-x-2 ml-4">
                      <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <CodeBracketIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">View code</span>
                      </button>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <ArrowTopRightOnSquareIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">Open repository</span>
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RepositoriesPage; 