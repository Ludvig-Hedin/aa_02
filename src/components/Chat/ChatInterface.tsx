import { useState, useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'
import ModelSelector from './ModelSelector'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  model?: string
}

interface ChatInterfaceProps {
  initialMessages?: Message[]
  onSendMessage?: (message: string, model: string) => Promise<void>
}

/**
 * Main chat interface component
 * 
 * Handles message display, user input, and model selection
 */
const ChatInterface = ({
  initialMessages = [],
  onSendMessage,
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('claude-3-opus')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || isLoading) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    try {
      if (onSendMessage) {
        await onSendMessage(input, selectedModel)
      } else {
        // Fallback for demo/development if no handler provided
        setTimeout(() => {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `This is a simulated response from ${selectedModel}. In production, this would be a real response from the AI model.`,
            timestamp: new Date(),
            model: selectedModel,
          }
          setMessages(prev => [...prev, assistantMessage])
          setIsLoading(false)
        }, 1000)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date(),
        model: selectedModel,
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] max-h-[800px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">AI Chat</h2>
        <ModelSelector 
          selectedModel={selectedModel} 
          onSelectModel={setSelectedModel} 
        />
      </div>
      
      <div className="flex-grow overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-gray-500">
            <p className="text-center">No messages yet. Start a conversation!</p>
            <p className="text-center text-sm mt-2">
              Try asking about research topics, writing assistance, or technical questions.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="input"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="btn-primary whitespace-nowrap"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

export default ChatInterface 