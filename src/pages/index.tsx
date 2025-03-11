import { NextPage } from 'next'
import Link from 'next/link'
import Layout from '@/components/Layout'

/**
 * Home page for AA_02 Personal AI Assistant
 * 
 * Displays an overview of the application's main features
 * and provides quick access to major functionality
 */
const Home: NextPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            AA_02 Personal AI Assistant
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Your comprehensive AI companion for productivity, research, and creativity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat" legacyBehavior>
              <a className="btn-primary text-center">Start Chatting</a>
            </Link>
            <Link href="/research" legacyBehavior>
              <a className="btn-secondary text-center">Research Topics</a>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="card">
            <h2 className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-3">
              Powerful AI Conversations
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Chat with multiple AI models including Claude, GPT, and Gemini. Switch between models or run them in parallel for comprehensive insights.
            </p>
            <Link href="/chat" legacyBehavior>
              <a className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                Start chatting &rarr;
              </a>
            </Link>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-3">
              Deep Research Capabilities
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Use AI-powered research tools to gather information, analyze data, and generate reports on any topic with cited sources.
            </p>
            <Link href="/research" legacyBehavior>
              <a className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                Start researching &rarr;
              </a>
            </Link>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-3">
              Local & Cloud Models
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Choose between cloud-based API models or run AI locally for privacy and offline capabilities.
            </p>
            <Link href="/settings" legacyBehavior>
              <a className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                Configure models &rarr;
              </a>
            </Link>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-3">
              Browser Integration
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Access web content directly within the app for seamless research and information gathering.
            </p>
            <Link href="/browser" legacyBehavior>
              <a className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                Browse with AI &rarr;
              </a>
            </Link>
          </div>
        </section>
        
        <section className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="font-medium mb-1">Calendar Integration</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Schedule and manage events with AI assistance</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="font-medium mb-1">Screen Sharing</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Share your screen for better AI assistance</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="font-medium mb-1">Voice Control</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Control your AI assistant with voice commands</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Home 