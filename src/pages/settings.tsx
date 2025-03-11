import { NextPage } from 'next'
import { useState, useEffect, useCallback } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Layout from '@/components/Layout'
import { toast } from 'react-hot-toast'

/**
 * Settings page for AA_02
 * 
 * Allows users to:
 * - Enter and save their API keys
 * - Connect to third-party services
 * - Configure application preferences
 */
const SettingsPage: NextPage = () => {
  const supabase = useSupabaseClient()
  const user = useUser()
  
  // API Keys state
  const [apiKeys, setApiKeys] = useState({
    anthropicApiKey: '',
    openaiApiKey: '',
    googleAiApiKey: '',
  })
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleConnecting, setIsGoogleConnecting] = useState(false)
  
  // Service connection states
  const [connectedServices, setConnectedServices] = useState({
    googleCalendar: false,
    googleMail: false,
  })
  
  // Define fetchUserSettings using useCallback to avoid dependency issues
  const fetchUserSettings = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch the user's settings from Supabase
      const { data, error } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data?.settings) {
        // Decrypt/decode API keys if necessary
        setApiKeys({
          anthropicApiKey: data.settings.anthropicApiKey || '',
          openaiApiKey: data.settings.openaiApiKey || '',
          googleAiApiKey: data.settings.googleAiApiKey || '',
        });
        
        setConnectedServices({
          googleCalendar: data.settings.googleCalendar || false,
          googleMail: data.settings.googleMail || false,
        });
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
      // If not found, that's ok - new user
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Load saved API keys when the user is authenticated
  useEffect(() => {
    if (user) {
      fetchUserSettings();
    }
  }, [user, fetchUserSettings]);
  
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setApiKeys(prev => ({
      ...prev,
      [name]: value,
    }))
  }
  
  const saveApiKeys = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('You must be signed in to save settings')
      return
    }
    
    setIsLoading(true)
    try {
      // Save API keys to Supabase
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          settings: {
            ...apiKeys,
            ...connectedServices,
          },
          updated_at: new Date().toISOString(),
        })
      
      if (error) throw error
      
      toast.success('API keys saved successfully')
    } catch (error) {
      console.error('Error saving API keys:', error)
      toast.error('Failed to save API keys')
    } finally {
      setIsLoading(false)
    }
  }
  
  const connectToGoogle = async () => {
    if (!user) {
      toast.error('You must be signed in to connect services')
      return
    }
    
    setIsGoogleConnecting(true)
    
    try {
      // Redirect to Google OAuth flow
      // This will be handled by our API route
      window.location.href = '/api/auth/google'
    } catch (error) {
      console.error('Error connecting to Google:', error)
      toast.error('Failed to connect to Google')
      setIsGoogleConnecting(false)
    }
  }
  
  if (!user) {
    return (
      <Layout title="Settings - AA_02">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Sign in Required</h1>
          <p className="mb-6">You need to be signed in to access settings.</p>
          <a href="/auth" className="btn-primary">
            Sign In
          </a>
        </div>
      </Layout>
    )
  }
  
  return (
    <Layout title="Settings - AA_02">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left sidebar - categories */}
          <div className="col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <nav className="space-y-1">
                <a href="#api-keys" className="block px-3 py-2 rounded-md bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium">
                  API Keys
                </a>
                <a href="#connected-services" className="block px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
                  Connected Services
                </a>
                <a href="#preferences" className="block px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
                  Preferences
                </a>
              </nav>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="col-span-1 md:col-span-2">
            {/* API Keys Section */}
            <section id="api-keys" className="mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">API Keys</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your API keys are stored securely and are used to access the respective AI services.
                </p>
                
                <form onSubmit={saveApiKeys} className="space-y-6">
                  <div>
                    <label htmlFor="anthropicApiKey" className="block text-sm font-medium mb-1">
                      Anthropic API Key (Claude)
                    </label>
                    <input
                      id="anthropicApiKey"
                      name="anthropicApiKey"
                      type="password"
                      value={apiKeys.anthropicApiKey}
                      onChange={handleApiKeyChange}
                      className="input"
                      placeholder="sk-ant-..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="openaiApiKey" className="block text-sm font-medium mb-1">
                      OpenAI API Key (GPT)
                    </label>
                    <input
                      id="openaiApiKey"
                      name="openaiApiKey"
                      type="password"
                      value={apiKeys.openaiApiKey}
                      onChange={handleApiKeyChange}
                      className="input"
                      placeholder="sk-..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="googleAiApiKey" className="block text-sm font-medium mb-1">
                      Google AI API Key (Gemini)
                    </label>
                    <input
                      id="googleAiApiKey"
                      name="googleAiApiKey"
                      type="password"
                      value={apiKeys.googleAiApiKey}
                      onChange={handleApiKeyChange}
                      className="input"
                      placeholder="AIza..."
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save API Keys'}
                    </button>
                  </div>
                </form>
              </div>
            </section>
            
            {/* Connected Services Section */}
            <section id="connected-services" className="mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Connected Services</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Connect to third-party services to enhance your AI assistant's capabilities.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-medium">Google Services</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Connect to Google Calendar, Gmail, and more.
                      </p>
                    </div>
                    <button
                      onClick={connectToGoogle}
                      className={`btn ${
                        connectedServices.googleCalendar
                          ? 'btn-outline'
                          : 'btn-primary'
                      }`}
                      disabled={isGoogleConnecting}
                    >
                      {isGoogleConnecting
                        ? 'Connecting...'
                        : connectedServices.googleCalendar
                          ? 'Reconnect'
                          : 'Connect'}
                    </button>
                  </div>
                  
                  {/* Connected service details */}
                  {connectedServices.googleCalendar && (
                    <div className="p-4 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
                      <h4 className="font-medium">Connected Services:</h4>
                      <ul className="list-disc list-inside ml-4 text-sm mt-2">
                        <li>Google Calendar {connectedServices.googleCalendar ? '✓' : '✗'}</li>
                        <li>Google Mail {connectedServices.googleMail ? '✓' : '✗'}</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </section>
            
            {/* Preferences Section */}
            <section id="preferences" className="mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Preferences</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Customize your AI assistant experience.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Use Local Models</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Run AI models locally for privacy (requires setup).
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                      <input
                        type="checkbox"
                        id="use-local-models"
                        className="absolute w-6 h-6 opacity-0 cursor-pointer"
                      />
                      <label
                        htmlFor="use-local-models"
                        className={`flex items-center h-6 overflow-hidden rounded-full cursor-pointer transition-colors duration-200 ease-in-out bg-gray-300 dark:bg-gray-600`}
                      >
                        <span className={`h-6 w-6 transform duration-200 ease-in-out rounded-full bg-white shadow-sm`}></span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Additional preferences can be added here */}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SettingsPage 