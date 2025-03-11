import Anthropic from '@anthropic-ai/sdk';
import { ModelService, ModelRequestOptions, ModelResponse, ModelMessage } from './ModelService';

interface ClaudeServiceOptions {
  apiKey?: string;
  modelVersion: 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku';
}

/**
 * Implementation of ModelService for Anthropic's Claude models
 * 
 * Supports Claude 3 Opus, Sonnet, and Haiku models
 */
export class ClaudeService implements ModelService {
  private client: Anthropic | null = null;
  private apiKey: string | undefined;
  private initialized: boolean = false;
  
  id: string;
  name: string;
  provider: string = 'Anthropic';
  isAvailable: boolean = false;
  
  constructor(options: ClaudeServiceOptions) {
    this.apiKey = options.apiKey || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
    this.id = options.modelVersion;
    
    // Set the display name based on the model version
    switch (options.modelVersion) {
      case 'claude-3-opus':
        this.name = 'Claude 3 Opus';
        break;
      case 'claude-3-sonnet':
        this.name = 'Claude 3 Sonnet';
        break;
      case 'claude-3-haiku':
        this.name = 'Claude 3 Haiku';
        break;
    }
  }
  
  /**
   * Initialize the Claude service
   * Create the Anthropic client and verify the API key
   */
  async initialize(): Promise<void> {
    if (!this.apiKey) {
      throw new Error('Anthropic API key is required for Claude service');
    }
    
    try {
      this.client = new Anthropic({
        apiKey: this.apiKey,
      });
      
      // Check if the API key is valid
      await this.client.messages.create({
        model: this.id,
        max_tokens: 1,
        messages: [{ role: 'user', content: 'Hello' }],
      });
      
      this.isAvailable = true;
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Claude service:', error);
      this.isAvailable = false;
      throw new Error('Failed to initialize Claude service. Check your API key.');
    }
  }
  
  /**
   * Send a message to Claude and get a response
   */
  async sendMessage(message: string, options: ModelRequestOptions = {}): Promise<ModelResponse> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!this.client || !this.isAvailable) {
      throw new Error('Claude service is not available. Check your API key and internet connection.');
    }
    
    // Prepare the history messages in Anthropic's format
    const messages: {role: 'user' | 'assistant' | 'system'; content: string}[] = [];
    
    // Add system message if provided
    if (options.systemPrompt) {
      messages.push({
        role: 'system',
        content: options.systemPrompt,
      });
    }
    
    // Add conversation history if provided
    if (options.history && options.history.length > 0) {
      options.history.forEach(historyMessage => {
        messages.push({
          role: historyMessage.role,
          content: historyMessage.content,
        });
      });
    }
    
    // Add the current message
    messages.push({
      role: 'user',
      content: message,
    });
    
    try {
      const response = await this.client.messages.create({
        model: this.id,
        max_tokens: options.maxTokens || 4000,
        temperature: options.temperature || 0.7,
        messages,
      });
      
      return {
        content: response.content[0].text,
        metadata: {
          usage: response.usage,
          model: response.model,
          id: response.id,
        },
      };
    } catch (error) {
      console.error('Error sending message to Claude:', error);
      throw new Error('Failed to get response from Claude');
    }
  }
}

/**
 * Create a Claude service for a specific model version
 */
export const createClaudeService = (modelVersion: 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku'): ModelService => {
  return new ClaudeService({ modelVersion });
}; 