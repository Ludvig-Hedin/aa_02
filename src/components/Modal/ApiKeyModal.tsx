import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface ApiKeyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (key: string, provider: string) => Promise<void>
  provider: string
  title: string
  description: string
  placeholder: string
  initialValue?: string
}

/**
 * Modal component for entering API keys
 * 
 * Used in the chat interface to allow users to quickly enter API keys
 * when they don't have one set yet
 */
const ApiKeyModal = ({
  isOpen,
  onClose,
  onSave,
  provider,
  title,
  description,
  placeholder,
  initialValue = '',
}: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState(initialValue)
  const [isSaving, setIsSaving] = useState(false)
  
  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setApiKey(initialValue)
      setIsSaving(false)
    }
  }, [isOpen, initialValue])
  
  // Handle save
  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key')
      return
    }
    
    setIsSaving(true)
    
    try {
      await onSave(apiKey, provider)
      toast.success('API key saved successfully')
      onClose()
    } catch (error) {
      console.error('Error saving API key:', error)
      toast.error('Failed to save API key')
    } finally {
      setIsSaving(false)
    }
  }
  
  // If modal is closed, don't render anything
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>
        
        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {description}
                  </p>
                </div>
                
                <div className="mt-4">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="input"
                    placeholder={placeholder}
                    autoFocus
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiKeyModal 