import { ReactNode, useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

interface LayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

/**
 * Main layout component that wraps all pages
 * 
 * Provides:
 * - Consistent header/footer
 * - Theme toggle functionality
 * - Navigation
 * - Authentication controls
 */
const Layout = ({ 
  children, 
  title = 'AA_02 - Personal AI Assistant',
  description = 'A comprehensive AI assistant integrating multiple functionalities'
}: LayoutProps) => {
  const { theme, setTheme } = useTheme()
  const session = useSession()
  const supabase = useSupabaseClient()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // After component mounts, we can safely show the theme toggle
  // to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" legacyBehavior>
              <a className="text-2xl font-bold text-primary-600 dark:text-primary-400">AA_02</a>
            </Link>
            
            <div className="hidden md:flex space-x-6 items-center">
              <Link href="/chat" legacyBehavior>
                <a className="hover:text-primary-600 dark:hover:text-primary-400">Chat</a>
              </Link>
              <Link href="/research" legacyBehavior>
                <a className="hover:text-primary-600 dark:hover:text-primary-400">Research</a>
              </Link>
              <Link href="/settings" legacyBehavior>
                <a className="hover:text-primary-600 dark:hover:text-primary-400">Settings</a>
              </Link>
              
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Toggle theme"
              >
                {mounted ? (theme === 'dark' ? '🌞' : '🌙') : <span>🔆</span>}
              </button>
              
              {session ? (
                <button 
                  onClick={handleSignOut}
                  className="btn-outline"
                >
                  Sign Out
                </button>
              ) : (
                <Link href="/auth" legacyBehavior>
                  <a className="btn-primary">Sign In</a>
                </Link>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
          
          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 space-y-4 pb-4">
              <Link href="/chat" legacyBehavior>
                <a className="block hover:text-primary-600 dark:hover:text-primary-400">Chat</a>
              </Link>
              <Link href="/research" legacyBehavior>
                <a className="block hover:text-primary-600 dark:hover:text-primary-400">Research</a>
              </Link>
              <Link href="/settings" legacyBehavior>
                <a className="block hover:text-primary-600 dark:hover:text-primary-400">Settings</a>
              </Link>
              
              <div className="flex justify-between pt-2">
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                  aria-label="Toggle theme"
                >
                  {mounted ? (theme === 'dark' ? '🌞' : '🌙') : <span>🔆</span>}
                </button>
                
                {session ? (
                  <button 
                    onClick={handleSignOut}
                    className="btn-outline"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link href="/auth" legacyBehavior>
                    <a className="btn-primary">Sign In</a>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow-inner">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} AA_02 Personal AI Assistant</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout 