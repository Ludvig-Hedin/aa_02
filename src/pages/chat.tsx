import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import {
  PaperAirplaneIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model?: string;
}

interface Model {
  id: string;
  name: string;
  provider: string;
}

/**
 * Chat page for AA_02 Personal AI Assistant
 * 
 * Provides a full-featured chat interface with model selection and message history
 */
const ChatPage = () => {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude-3-opus');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const user = useUser();

  // Available models
  const models: Model[] = [
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic' },
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
    { id: 'gemini-flash', name: 'Gemini Flash', provider: 'Google' },
    { id: 'local-deepseek', name: 'DeepSeek (Local)', provider: 'Local' },
    { id: 'local-qwen', name: 'Qwen (Local)', provider: 'Local' },
  ];

  // Group models by provider
  const groupedModels: Record<string, Model[]> = {};
  models.forEach(model => {
    if (!groupedModels[model.provider]) {
      groupedModels[model.provider] = [];
    }
    groupedModels[model.provider].push(model);
  });

  useEffect(() => {
    setMounted(true);
    // Initialize with a welcome message
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! How can I assist you today?',
        timestamp: new Date(),
        model: selectedModel,
      },
    ]);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/login');
    }
  }, [mounted, user, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Get the currently selected model
    const model = models.find(m => m.id === selectedModel);
    const modelName = model ? model.name : selectedModel;

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `I'm responding as ${modelName}. This is a placeholder response for your message: "${input}".`,
        timestamp: new Date(),
        model: selectedModel,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);

    // Here you would typically send the message to your AI backend
    // const response = await fetch('/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message: input, model: selectedModel }),
    // });
    // const data = await response.json();
    // setMessages((prev) => [...prev, data.message]);
    // setIsLoading(false);
  };

  if (!mounted || !user) return null;

  return (
    <DashboardLayout title="AI Chat" description="Chat with your AI assistant">
      <div className="flex flex-col h-[calc(100vh-9rem)]">
        {/* Chat header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Chat Assistant</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ask questions, get assistance, and collaborate with AI</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Model selector */}
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm rounded-md focus:ring-gray-500 focus:border-gray-500 p-2 pr-8"
              >
                {Object.entries(groupedModels).map(([provider, providerModels]) => (
                  <optgroup key={provider} label={provider}>
                    {providerModels.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            
            {/* Action buttons */}
            <div className="flex space-x-2">
              <button
                type="button"
                className="p-2 rounded-md bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                <span className="sr-only">New Chat</span>
              </button>
              <button
                type="button"
                className="p-2 rounded-md bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <DocumentTextIcon className="w-5 h-5" />
                <span className="sr-only">View Documents</span>
              </button>
              <button
                type="button"
                className="p-2 rounded-md bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <span className="sr-only">Settings</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4 mb-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white'
                  }`}
                >
                  {message.model && message.role === 'assistant' && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {models.find(m => m.id === message.model)?.name || message.model}
                    </div>
                  )}
                  <div className="text-sm">{message.content}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[75%] rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-700">
                  <div className="flex items-center space-x-2">
                    <ArrowPathIcon className="w-4 h-4 animate-spin text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Chat input */}
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-3 px-4 pr-12 focus:border-gray-500 focus:ring-gray-500 disabled:opacity-75"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
            <span className="sr-only">Send message</span>
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ChatPage; 