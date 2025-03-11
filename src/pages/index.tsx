import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { ArrowRightIcon, ChatBubbleOvalLeftEllipsisIcon, BoltIcon, CommandLineIcon, FolderIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';

/**
 * Home page for AA_02 Personal AI Assistant
 * 
 * Displays an overview of the application's main features
 * and provides quick access to major functionality
 */
const Home = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If user is logged in, redirect to dashboard
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!mounted || user) return null;

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      title: 'Advanced AI Conversations',
      description: 'Engage with state-of-the-art AI models for research, writing assistance, and problem-solving.',
      icon: ChatBubbleOvalLeftEllipsisIcon,
    },
    {
      title: 'Multi-Model Support',
      description: 'Choose from various AI models based on your specific needs, including local and cloud options.',
      icon: CommandLineIcon,
    },
    {
      title: 'Research Capabilities',
      description: 'Powerful AI-assisted research tools that help summarize information and extract key insights.',
      icon: BeakerIcon,
    },
    {
      title: 'Knowledge Management',
      description: 'Organize and access your information effortlessly with smart tagging and retrieval.',
      icon: FolderIcon,
    },
    {
      title: 'Workflow Automation',
      description: 'Streamline repetitive tasks and boost productivity with customizable AI workflows.',
      icon: BoltIcon,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>Personal AI Assistant</title>
        <meta name="description" content="Your personal AI assistant for everything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              Personal AI Assistant
            </span>
          </div>
          <div className="space-x-4">
            <Link href="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 dark:text-primary-100 dark:bg-primary-900 dark:hover:bg-primary-800">
              Sign In
            </Link>
            <Link href="/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-800 dark:hover:bg-primary-700">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-900 pt-10 sm:pt-16 lg:pt-8 lg:pb-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <h1>
                  <span className="block text-base font-semibold text-gray-600 dark:text-gray-400 tracking-wide uppercase">
                    Professional AI Workspace
                  </span>
                  <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                    <span className="block text-gray-900 dark:text-white">Your Personal</span>
                    <span className="block text-gray-700 dark:text-gray-300">AI Assistant</span>
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  A professional AI platform that combines multiple language models, research tools, and workflow automation to enhance your productivity and decision-making.
                </p>
                <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link href="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10">
                        Get started
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link href="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 dark:text-primary-100 dark:bg-primary-900 dark:hover:bg-primary-800 md:py-4 md:text-lg md:px-10">
                        Sign in
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                  <div className="relative block w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      className="w-full"
                      src="/images/ai-assistant-preview.png"
                      alt="AI Assistant Dashboard Preview"
                      onError={(e) => {
                        // Fallback to a monochrome placeholder if image doesn't exist
                        e.currentTarget.src = "https://placehold.co/600x400/4b5563/ffffff?text=AI+Assistant&font=Inter";
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="h-20 w-20 text-primary-500" fill="currentColor" viewBox="0 0 84 84">
                        <circle opacity="0.9" cx="42" cy="42" r="42" fill="white" />
                        <path d="M55.5039 40.3359L37.1094 28.0729C35.7803 27.1869 34 28.1396 34 29.737V54.263C34 55.8604 35.7803 56.8131 37.1094 55.9271L55.5038 43.6641C56.6913 42.8725 56.6913 41.1275 55.5039 40.3359Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Section */}
        <div className="py-12 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                A better way to interact with AI
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
                Everything you need to get the most out of AI technology, personalized to your needs.
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                {/* Feature 1 */}
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Smart Chat</h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                      Intelligent conversations with advanced AI models. Ask questions, get summaries, or brainstorm ideas.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Research Assistant</h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                      Accelerate your research with AI-powered search, summarization, and knowledge management.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Fully Customizable</h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                      Choose your AI models and customize settings to align with your preferences and workflow.
                    </p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Privacy First</h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                      Your data stays yours. Use local models or secure API connections for confidential information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; {new Date().getFullYear()} Personal AI Assistant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home 