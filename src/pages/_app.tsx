import { useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'

/**
 * AA_02 Application
 * 
 * Main application wrapper that provides global context providers:
 * - Supabase authentication
 * - Theme management (light/dark)
 * - Global styles
 * - Toast notifications
 */
function MyApp({ Component, pageProps }: AppProps) {
  // Initialize Supabase client
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem={true}
        disableTransitionOnChange
      >
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </ThemeProvider>
    </SessionContextProvider>
  )
}

export default MyApp 