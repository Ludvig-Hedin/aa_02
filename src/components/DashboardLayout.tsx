import React, { useState, ReactNode, Fragment, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { useUser } from '@supabase/auth-helpers-react';
import {
  HomeIcon,
  ChatBubbleLeftIcon,
  BeakerIcon,
  FolderIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon,
  DocumentTextIcon,
  CommandLineIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ServerIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

// Utility function for conditional class names
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

/**
 * Dashboard layout component for AA_02
 * 
 * Provides:
 * - Sidebar navigation
 * - Top header with profile and theme toggle
 * - Content area
 */
export default function DashboardLayout({
  children,
  title,
  description = 'Personal AI Assistant dashboard',
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const user = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Chat', href: '/chat', icon: ChatBubbleLeftIcon },
    { name: 'Models', href: '/models', icon: ServerIcon },
    { name: 'Documents', href: '/documents', icon: DocumentTextIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>{title} | Personal AI Assistant</title>
        {description && <meta name="description" content={description} />}
      </Head>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />

        <div className="fixed inset-y-0 left-0 flex flex-col w-full max-w-xs bg-white dark:bg-gray-800 shadow-xl">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                Personal AI Assistant
              </span>
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 px-2 space-y-1">
              {navigationItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    pathname === item.href
                      ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      pathname === item.href
                        ? 'text-primary-500 dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
            <Link
              href="/logout"
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
            >
              <ArrowLeftOnRectangleIcon
                className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                aria-hidden="true"
              />
              Sign out
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link href="/dashboard" className="flex items-center">
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  Personal AI Assistant
                </span>
              </Link>
            </div>
            <nav className="mt-8 flex-1 px-4 space-y-1">
              {navigationItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    pathname === item.href
                      ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      pathname === item.href
                        ? 'text-primary-500 dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
            <Link
              href="/logout"
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
            >
              <ArrowLeftOnRectangleIcon
                className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                aria-hidden="true"
              />
              Sign out
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="border-r border-gray-200 dark:border-gray-700 px-4 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex flex-1 items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="rounded-full p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <span className="sr-only">Toggle theme</span>
                {resolvedTheme === 'dark' ? (
                  <SunIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <MoonIcon className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
              <div className="relative inline-block text-left">
                <div>
                  <button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary-200 dark:bg-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-300">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 