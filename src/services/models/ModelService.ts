/**
 * Interface for all AI model services
 * 
 * Provides a consistent interface for different AI models (both API-based and local)
 */
export interface ModelService {
  /**
   * Unique identifier for the model
   */
  id: string;
  
  /**
   * Display name for the model
   */
  name: string;
  
  /**
   * Provider of the model (e.g., OpenAI, Anthropic, Google, Local)
   */
  provider: string;
  
  /**
   * Whether the model is currently available for use
   */
  isAvailable: boolean;
  
  /**
   * Send a message to the model and get a response
   */
  sendMessage: (message: string, options?: ModelRequestOptions) => Promise<ModelResponse>;
  
  /**
   * Initialize the model service
   */
  initialize: () => Promise<void>;
}

/**
 * Configuration options for model requests
 */
export interface ModelRequestOptions {
  /**
   * Maximum number of tokens to generate in the response
   */
  maxTokens?: number;
  
  /**
   * Temperature for response generation (0-1)
   * Lower values are more deterministic, higher values more creative
   */
  temperature?: number;
  
  /**
   * System prompt to guide the model's behavior
   */
  systemPrompt?: string;
  
  /**
   * Message history for context
   */
  history?: ModelMessage[];
  
  /**
   * Stream the response as it's generated
   */
  stream?: boolean;
}

/**
 * Message in the model conversation
 */
export interface ModelMessage {
  /**
   * Role of the message sender (system, user, assistant)
   */
  role: 'system' | 'user' | 'assistant';
  
  /**
   * Content of the message
   */
  content: string;
}

/**
 * Response from the model
 */
export interface ModelResponse {
  /**
   * Content of the model's response
   */
  content: string;
  
  /**
   * Metadata about the response (e.g., token usage)
   */
  metadata?: Record<string, any>;
}

/**
 * Factory function to get a model service by ID
 */
export const getModelService = async (modelId: string): Promise<ModelService> => {
  // This would be implemented to return the appropriate model service
  // based on the modelId.
  
  throw new Error(`Model service for ${modelId} not implemented yet`);
}

/**
 * Get all available model services
 */
export const getAvailableModels = async (): Promise<ModelService[]> => {
  // This would be implemented to return all available model services
  
  return [];
} 