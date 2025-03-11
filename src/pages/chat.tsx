import { NextPage } from 'next'
import { useState } from 'react'
import Layout from '@/components/Layout'
import ChatInterface, { Message } from '@/components/Chat/ChatInterface'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

/**
 * Chat page for AA_02 Personal AI Assistant
 * 
 * Provides a full-featured chat interface with model selection and message history
 */
const ChatPage: NextPage = () => {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: 'Welcome to AA_02 Chat! How can I assist you today?',
      timestamp: new Date(),
    }
  ])

  const handleSendMessage = async (messageText: string, modelId: string) => {
    try {
      // In a real implementation, this would call API services based on the selected model
      // For now, we'll simulate a response
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create simulated response
      const response: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `This is a simulated response from the AI model. In a production environment, this would connect to ${modelId} or a local model. Your message was: "${messageText}"`,
        timestamp: new Date(),
        model: modelId,
      }
      
      setMessages(prev => [...prev, response])
      
      // In a real implementation, you would also save the conversation to Supabase
      if (user) {
        // Save to Supabase (would be implemented in production)
        // await supabase.from('conversations').insert([...])
      }
    } catch (error) {
      console.error('Error processing message:', error)
      // Handle error appropriately
    }
  }

  return (
    <Layout title="Chat - AA_02">
      <div className="max-w-4xl mx-auto">
        <ChatInterface 
          initialMessages={messages} 
          onSendMessage={handleSendMessage}
        />
      </div>
    </Layout>
  )
}

export default ChatPage 