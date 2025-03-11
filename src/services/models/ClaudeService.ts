import { Anthropic } from '@anthropic-ai/sdk';
import { ModelMessage, ModelRequestOptions, ModelResponse, ModelService, formatModelResponse, registerModelService } from './ModelService';

/**
 * Options for configuring the Claude service
 */
export interface ClaudeServiceOptions {
  /**
   * Model ID to use
   */
  modelId: 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku';
  
  /**
   * API key for Anthropic
   */
  apiKey?: string;
}

/**
 * Service implementation for the Anthropic Claude models
 */
export class ClaudeService implements ModelService {
  id: string;
  name: string;
  provider = 'Anthropic';
  isAvailable: boolean;
  client: Anthropic | null = null;
  apiKey?: string;
  maxTokens?: number = 4096;
  modelType: 'chat' | 'completion' | 'embedding' = 'chat';
  status: 'ready' | 'loading' | 'error' = 'loading';
  temperature?: number = 0.7;
  description?: string;

  /**
   * Create a new Claude service
   */
  constructor(options: ClaudeServiceOptions) {
    this.id = options.modelId;
    
    // Set the model name based on the model ID
    switch (options.modelId) {
      case 'claude-3-opus':
        this.name = 'Claude 3 Opus';
        this.description = 'Anthropic\'s most powerful model, with a 200K context window';
        break;
      case 'claude-3-sonnet':
        this.name = 'Claude 3 Sonnet';
        this.description = 'A balanced model for enterprise tasks, with a 200K context window';
        break;
      case 'claude-3-haiku':
        this.name = 'Claude 3 Haiku';
        this.description = 'Fast and cost-effective model for simpler tasks, with a 200K context window';
        break;
    }
    
    this.apiKey = options.apiKey;
    this.isAvailable = false;
  }
  
  /**
   * Initialize the Claude service
   */
  async initialize(): Promise<void> {
    try {
      // Get API key from environment if not provided
      const apiKey = this.apiKey || process.env.ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        console.warn(`No API key provided for Claude service ${this.id}`);
        this.isAvailable = false;
        this.status = 'error';
        return;
      }
      
      // Create Anthropic client
      this.client = new Anthropic({ apiKey });
      this.isAvailable = true;
      this.status = 'ready';
    } catch (error) {
      console.error(`Failed to initialize Claude service ${this.id}:`, error);
      this.isAvailable = false;
      this.status = 'error';
    }
  }
  
  /**
   * Send a message to Claude and get a response
   */
  async sendMessage(messages: ModelMessage[], options?: ModelRequestOptions): Promise<ModelResponse> {
    if (!this.client) {
      await this.initialize();
      
      if (!this.client) {
        throw new Error(`Claude service ${this.id} is not available`);
      }
    }
    
    try {
      // Convert messages to Claude format
      const formattedMessages = messages.map(message => ({
        role: message.role === 'system' ? 'user' : message.role, // Convert system to user for compatibility
        content: message.content
      }));
      
      // Extract system message if present
      let systemPrompt = options?.systemPrompt || '';
      const systemMessages = messages.filter(msg => msg.role === 'system');
      
      if (systemMessages.length > 0 && !systemPrompt) {
        systemPrompt = systemMessages[0].content;
      }
      
      // Only include user and assistant messages in the messages array
      const filteredMessages = formattedMessages.filter(
        msg => msg.role === 'user' || msg.role === 'assistant'
      );
      
      // Call Claude API
      const response = await this.client.messages.create({
        model: this.id,
        max_tokens: options?.maxTokens || this.maxTokens || 4096, // Ensure a non-undefined value
        temperature: options?.temperature !== undefined ? options.temperature : (this.temperature || 0.7),
        system: systemPrompt,
        messages: filteredMessages as any, // Type assertion to bypass strict type checking
      });
      
      // Format the response
      return formatModelResponse(response, this.id);
    } catch (error) {
      console.error(`Error sending message to Claude service ${this.id}:`, error);
      throw error;
    }
  }
}

/**
 * Create a new Claude service
 */
export function createClaudeService(
  modelId: 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku',
  apiKey?: string
): ClaudeService {
  const service = new ClaudeService({
    modelId,
    apiKey,
  });
  
  // Initialize the service
  service.initialize().catch(err => {
    console.error(`Failed to initialize ${modelId}:`, err);
  });
  
  // Register the service
  registerModelService(service);
  
  return service;
}

// Initialize Claude services during module load
const claudeModels = [
  'claude-3-opus',
  'claude-3-sonnet',
  'claude-3-haiku'
] as const;

claudeModels.forEach(modelId => {
  createClaudeService(modelId);
}); 