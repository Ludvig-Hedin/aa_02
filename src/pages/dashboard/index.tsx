import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import Head from 'next/head';
import DashboardLayout from '../../components/DashboardLayout';

// Define types for our data
interface Conversation {
  id: string;
  title: string;
  date: string;
  preview: string;
}

interface Research {
  id: string;
  title: string;
  date: string;
  tags: string[];
}

export default function DashboardPage() {
  const router = useRouter();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [recentConversations, setRecentConversations] = useState<Conversation[]>([]);
  const [savedResearch, setSavedResearch] = useState<Research[]>([]);

  useEffect(() => {
    // Check if user is logged in
    if (!user && !loading) {
      router.push('/login');
    } else {
      setLoading(false);
      
      // Here you would fetch real data
      // For now, using placeholder data
      setRecentConversations([
        {
          id: '1',
          title: 'Research on quantum computing',
          date: '2023-10-15',
          preview: 'We discussed the latest advances in quantum computing and its applications...'
        },
        {
          id: '2',
          title: 'Project planning session',
          date: '2023-10-12',
          preview: 'Outlined the next steps for the AI project and reviewed the timeline...'
        }
      ]);
      
      setSavedResearch([
        {
          id: '1',
          title: 'Machine Learning Frameworks Comparison',
          date: '2023-10-10',
          tags: ['ML', 'AI', 'Frameworks']
        },
        {
          id: '2',
          title: 'Neural Network Architecture Guide',
          date: '2023-10-05',
          tags: ['Neural Networks', 'Deep Learning']
        }
      ]);
    }
  }, [user, router, loading]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // If no user is authenticated, return null (will redirect in useEffect)
  if (!user) return null;

  return (
    <DashboardLayout title="Dashboard" description="Your personal AI assistant dashboard">
      <Head>
        <title>Dashboard | Personal AI Assistant</title>
      </Head>

      <div className="space-y-6">
        {/* Welcome section */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.email?.split('@')[0] || 'User'}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Here's a summary of your recent activity and saved content.
          </p>
        </div>

        {/* Activity overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent conversations */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Conversations
            </h3>
            {recentConversations.length > 0 ? (
              <div className="space-y-4">
                {recentConversations.map((conversation) => (
                  <div 
                    key={conversation.id} 
                    className="p-4 border border-gray-100 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white">{conversation.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{conversation.date}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{conversation.preview}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No recent conversations found.</p>
            )}
            <div className="mt-4 text-right">
              <a href="/chat" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:text-primary-700 dark:hover:text-primary-300">
                Start a new conversation →
              </a>
            </div>
          </div>

          {/* Saved research */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Saved Research
            </h3>
            {savedResearch.length > 0 ? (
              <div className="space-y-4">
                {savedResearch.map((research) => (
                  <div 
                    key={research.id} 
                    className="p-4 border border-gray-100 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white">{research.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{research.date}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {research.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No saved research found.</p>
            )}
            <div className="mt-4 text-right">
              <a href="/research" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:text-primary-700 dark:hover:text-primary-300">
                View all research →
              </a>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <a 
              href="/chat"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <div className="flex-shrink-0 mr-4">
                <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">New Chat</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Start a conversation with AI</p>
              </div>
            </a>
            
            <a 
              href="/research"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <div className="flex-shrink-0 mr-4">
                <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Research</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Research and save information</p>
              </div>
            </a>
            
            <a 
              href="/models"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <div className="flex-shrink-0 mr-4">
                <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">AI Models</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your AI models</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 