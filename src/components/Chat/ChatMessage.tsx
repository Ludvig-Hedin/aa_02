import { Message } from './ChatInterface'

interface ChatMessageProps {
  message: Message
}

/**
 * Component to display individual chat messages
 * 
 * Handles different message types (user, assistant, system)
 * and provides proper styling for each
 */
const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'
  
  // Format the timestamp
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(message.timestamp)
  
  if (isSystem) {
    return (
      <div className="py-2 px-3 my-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-md text-center">
        {message.content}
      </div>
    )
  }
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`
          max-w-[80%] px-4 py-3 rounded-lg
          ${isUser
            ? 'bg-primary-600 text-white rounded-tr-none'
            : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
          }
        `}
      >
        {!isUser && message.model && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {message.model}
          </div>
        )}
        
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        <div
          className={`
            text-xs mt-1 text-right
            ${isUser
              ? 'text-primary-100'
              : 'text-gray-500 dark:text-gray-400'
            }
          `}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage 