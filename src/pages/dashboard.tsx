import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import {
  BeakerIcon,
  ChatBubbleLeftRightIcon,
  FolderIcon,
  CalendarIcon,
  EnvelopeIcon,
  CommandLineIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';

const DashboardPage = () => {
  const [mounted, setMounted] = useState(false);
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

  if (!mounted || !user) return null;

  const quickActions = [
    { name: 'Start a Chat', icon: ChatBubbleLeftRightIcon, href: '/chat', color: 'bg-primary-50 dark:bg-primary-900/30' },
    { name: 'Research Topics', icon: BeakerIcon, href: '/research', color: 'bg-secondary-50 dark:bg-secondary-900/30' },
    { name: 'Check Calendar', icon: CalendarIcon, href: '/calendar', color: 'bg-gray-100 dark:bg-gray-800' },
    { name: 'View Emails', icon: EnvelopeIcon, href: '/emails', color: 'bg-gray-100 dark:bg-gray-800' },
  ];

  const recentActivity = [
    { type: 'chat', title: 'Project planning with AI', time: '2 hours ago' },
    { type: 'research', title: 'Advances in machine learning', time: '1 day ago' },
    { type: 'repository', title: 'Checked repository: personal-projects', time: '2 days ago' },
  ];

  const repositories = [
    { name: 'personal-projects', description: 'Collection of personal coding projects', stars: 12 },
    { name: 'ai-research', description: 'Research on AI capabilities and limitations', stars: 8 },
    { name: 'web-development', description: 'Web development projects and experiments', stars: 15 },
  ];

  return (
    <DashboardLayout title="Dashboard" description="Your personal AI assistant dashboard">
      <div className="space-y-8">
        {/* Welcome message */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.email?.split('@')[0] || 'User'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your personal AI assistant is ready to help you with research, coding, and productivity tasks.
          </p>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.name}
                onClick={() => router.push(action.href)}
                className={`${action.color} p-4 rounded-lg shadow-sm flex items-center space-x-3 hover:shadow-md transition-shadow duration-200`}
              >
                <action.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{action.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main dashboard content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent activity */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
            </div>
            <div className="px-6 py-4">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentActivity.map((activity, index) => (
                  <li key={index} className="py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {activity.type === 'chat' ? (
                          <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
                        ) : activity.type === 'research' ? (
                          <BeakerIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <FolderIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <button className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 flex items-center">
                  View all activity
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Repositories */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Repositories</h3>
            </div>
            <div className="px-6 py-4">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {repositories.map((repo, index) => (
                  <li key={index} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{repo.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{repo.description}</p>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>⭐ {repo.stars}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <button 
                  onClick={() => router.push('/repositories')}
                  className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 flex items-center"
                >
                  View all repositories
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Command Line */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CommandLineIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Command</h3>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Ask your AI anything or type a command..."
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 py-3 pl-4 pr-12"
            />
            <button className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-gray-400">
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage; 