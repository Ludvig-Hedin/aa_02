import Link from 'next/link';
import Head from 'next/head';
import { useUser } from '@supabase/auth-helpers-react';

export default function Custom500() {
  const user = useUser();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center px-4">
      <Head>
        <title>Server Error | Personal AI Assistant</title>
        <meta name="description" content="Server error" />
      </Head>
      
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400">500</h1>
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">Server Error</h2>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
          Sorry, something went wrong on our servers. We're working on fixing it.
        </p>
        <div className="mt-8">
          <Link
            href={user ? '/dashboard' : '/'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {user ? 'Go to Dashboard' : 'Return Home'}
          </Link>
        </div>
      </div>
    </div>
  );
} 