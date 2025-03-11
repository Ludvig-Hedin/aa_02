import { useState, useEffect } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import '../styles/globals.css'

/**
 * AA_02 Application
 * 
 * Main application wrapper that provides global context providers:
 * - Supabase authentication
 * - Theme management (light/dark)
 * - Global styles
 */
function MyApp({ Component, pageProps }: AppProps) {
  // Initialize Supabase client
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionContextProvider>
  )
}

export default MyApp 