import OpenAI from 'openai';
import { ModelMessage, ModelRequestOptions, ModelResponse, ModelService, formatModelResponse, registerModelService } from './ModelService';

/**
 * Options for configuring the OpenAI service
 */
export interface OpenAIServiceOptions {
  /**
   * Model ID to use
   */
  modelId: string;
  
  /**
   * API key for OpenAI
   */
  apiKey?: string;
}

/**
 * Service implementation for OpenAI models
 */
export class OpenAIService implements ModelService {
  id: string;
  name: string;
  provider = 'OpenAI';
  isAvailable: boolean;
  client: OpenAI | null = null;
  apiKey?: string;
  maxTokens?: number = 4096;
  modelType: 'chat' | 'completion' | 'embedding' = 'chat';
  status: 'ready' | 'loading' | 'error' = 'loading';
  temperature?: number = 0.7;
  description?: string;

  /**
   * Create a new OpenAI service
   */
  constructor(options: OpenAIServiceOptions) {
    this.id = options.modelId;
    
    // Set the model name based on the model ID
    switch (options.modelId) {
      case 'gpt-4o':
        this.name = 'GPT-4o';
        this.description = 'OpenAI\'s most capable model with vision and audio abilities';
        this.maxTokens = 4096;
        break;
      case 'gpt-4-turbo':
        this.name = 'GPT-4 Turbo';
        this.description = 'Fast and powerful model with a large context window';
        this.maxTokens = 4096;
        break;
      case 'gpt-4':
        this.name = 'GPT-4';
        this.description = 'OpenAI\'s high-capability model with improved reasoning';
        this.maxTokens = 8192;
        break;
      case 'gpt-3.5-turbo':
        this.name = 'GPT-3.5 Turbo';
        this.description = 'Fast and cost-effective model for general tasks';
        this.maxTokens = 4096;
        break;
      default:
        this.name = options.modelId;
        this.description = 'OpenAI model';
    }
    
    this.apiKey = options.apiKey;
    this.isAvailable = false;
  }
  
  /**
   * Initialize the OpenAI service
   */
  async initialize(): Promise<void> {
    try {
      // Get API key from environment if not provided
      const apiKey = this.apiKey || process.env.OPENAI_API_KEY;
      
      if (!apiKey) {
        console.warn(`No API key provided for OpenAI service ${this.id}`);
        this.isAvailable = false;
        this.status = 'error';
        return;
      }
      
      // Create OpenAI client
      this.client = new OpenAI({ apiKey });
      this.isAvailable = true;
      this.status = 'ready';
    } catch (error) {
      console.error(`Failed to initialize OpenAI service ${this.id}:`, error);
      this.isAvailable = false;
      this.status = 'error';
    }
  }
  
  /**
   * Send a message to OpenAI and get a response
   */
  async sendMessage(messages: ModelMessage[], options?: ModelRequestOptions): Promise<ModelResponse> {
    if (!this.client) {
      await this.initialize();
      
      if (!this.client) {
        throw new Error(`OpenAI service ${this.id} is not available`);
      }
    }
    
    try {
      // Call OpenAI API
      const response = await this.client.chat.completions.create({
        model: this.id,
        max_tokens: options?.maxTokens || this.maxTokens,
        temperature: options?.temperature !== undefined ? options.temperature : (this.temperature || 0.7),
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        functions: options?.functions,
      });
      
      // Format the response
      return formatModelResponse(response, this.id);
    } catch (error) {
      console.error(`Error sending message to OpenAI service ${this.id}:`, error);
      throw error;
    }
  }
}

/**
 * Create a new OpenAI service
 */
export function createOpenAIService(
  modelId: string,
  apiKey?: string
): OpenAIService {
  const service = new OpenAIService({
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

// Initialize OpenAI services during module load
const openaiModels = [
  'gpt-4o',
  'gpt-4-turbo',
  'gpt-4',
  'gpt-3.5-turbo'
];

openaiModels.forEach(modelId => {
  createOpenAIService(modelId);
}); 