import { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Layout from '@/components/Layout'

/**
 * Authentication page for AA_02
 * 
 * Provides user sign in/sign up functionality using Supabase Auth
 * Supports email/password and OAuth providers
 */
const AuthPage: NextPage = () => {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const user = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // If user is already signed in, redirect to home page
  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])
  
  // Handle email authentication
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      if (isSignUp) {
        // Sign up with email
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        
        if (error) throw error
      } else {
        // Sign in with email
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle OAuth authentication
  const handleOAuthAuth = async (provider: 'google' | 'github') => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
      })
      
      if (error) throw error
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }
  
  return (
    <Layout title={isSignUp ? 'Sign Up - AA_02' : 'Sign In - AA_02'}>
      <div className="max-w-md mx-auto">
        <div className="card">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isSignUp ? 'Create an Account' : 'Sign In to AA_02'}
          </h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading
                ? 'Processing...'
                : isSignUp
                  ? 'Create Account'
                  : 'Sign In'
              }
            </button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthAuth('google')}
                className="btn-outline flex justify-center"
                disabled={loading}
              >
                Google
              </button>
              
              <button
                type="button"
                onClick={() => handleOAuthAuth('github')}
                className="btn-outline flex justify-center"
                disabled={loading}
              >
                GitHub
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm">
            {isSignUp ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Sign up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AuthPage 