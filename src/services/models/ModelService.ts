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
   * Maximum number of tokens to generate in the response
   */
  maxTokens?: number;
  
  /**
   * Model type (chat, completion, embedding)
   */
  modelType?: 'chat' | 'completion' | 'embedding';
  
  /**
   * Status of the model (ready, loading, error)
   */
  status?: 'ready' | 'loading' | 'error';
  
  /**
   * Temperature for response generation (0-1)
   * Lower values are more deterministic, higher values more creative
   */
  temperature?: number;
  
  /**
   * Description of the model
   */
  description?: string;
  
  /**
   * Whether the model is local
   */
  isLocal?: boolean;
  
  /**
   * Model size in bytes, for local models
   */
  modelSize?: number;
  
  /**
   * Download progress for local models (0-100)
   */
  downloadProgress?: number;
  
  /**
   * Send a message to the model and get a response
   */
  sendMessage: (messages: ModelMessage[], options?: ModelRequestOptions) => Promise<ModelResponse>;
  
  /**
   * Initialize the model service
   */
  initialize: () => Promise<void>;
  
  // Methods specific to local models
  downloadModel?: () => Promise<boolean>;
  cancelDownload?: () => Promise<void>;
  getModelDetails?: () => Promise<any>;
}

/**
 * Configuration options for model requests
 */
export interface ModelRequestOptions {
  /**
   * Model identifier
   */
  model?: string;
  
  /**
   * Temperature for response generation (0-1)
   * Lower values are more deterministic, higher values more creative
   */
  temperature?: number;
  
  /**
   * Maximum number of tokens to generate in the response
   */
  maxTokens?: number;
  
  /**
   * Stream the response as it's generated
   */
  stream?: boolean;
  
  /**
   * System prompt to guide the model's behavior
   */
  systemPrompt?: string;
  
  /**
   * Functions to be used with the model
   */
  functions?: any[];
  
  /**
   * API key for authentication
   */
  apiKey?: string;
  
  /**
   * Top P for sampling
   */
  topP?: number;
  
  /**
   * Top K for sampling
   */
  topK?: number;
}

/**
 * Message in the model conversation
 */
export interface ModelMessage {
  /**
   * Role of the message sender (user, assistant, system)
   */
  role: 'user' | 'assistant' | 'system';
  
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
   * Model identifier
   */
  model?: string;
  
  /**
   * Completion tokens used in the response
   */
  completionTokens?: number;
  
  /**
   * Prompt tokens used in the response
   */
  promptTokens?: number;
  
  /**
   * Total tokens used in the response
   */
  totalTokens?: number;
  
  /**
   * Finish reason for the response
   */
  finishReason?: string;
}

// Keep track of model services
const modelServices: Record<string, ModelService> = {};

/**
 * Get a model service by its ID
 */
export function getModelService(modelId: string): ModelService | undefined {
  return modelServices[modelId];
}

/**
 * Register a new model service
 */
export function registerModelService(service: ModelService): void {
  modelServices[service.id] = service;
}

/**
 * Get all available model services
 */
export function getAvailableModels(): ModelService[] {
  return Object.values(modelServices).filter(service => service.isAvailable);
}

/**
 * Get all local model services
 */
export function getLocalModels(): ModelService[] {
  return Object.values(modelServices).filter(service => service.isLocal);
}

/**
 * Get models grouped by provider
 */
export function getModelsByProvider(): Record<string, ModelService[]> {
  const result: Record<string, ModelService[]> = {};
  
  Object.values(modelServices).forEach(service => {
    if (!result[service.provider]) {
      result[service.provider] = [];
    }
    result[service.provider].push(service);
  });
  
  return result;
}

// Helper for formatting model response from different providers to a common format
export function formatModelResponse(rawResponse: any, modelId: string): ModelResponse {
  // Default values
  const response: ModelResponse = {
    content: '',
    model: modelId,
  };
  
  if (typeof rawResponse === 'string') {
    response.content = rawResponse;
  } else if (rawResponse && typeof rawResponse === 'object') {
    // Handle different response formats from different providers
    if (rawResponse.content) {
      response.content = rawResponse.content;
    } else if (rawResponse.choices && rawResponse.choices[0]) {
      if (rawResponse.choices[0].message) {
        response.content = rawResponse.choices[0].message.content || '';
      } else {
        response.content = rawResponse.choices[0].text || '';
      }
      response.finishReason = rawResponse.choices[0].finish_reason;
    }
    
    // Handle token counting if available
    if (rawResponse.usage) {
      response.promptTokens = rawResponse.usage.prompt_tokens;
      response.completionTokens = rawResponse.usage.completion_tokens;
      response.totalTokens = rawResponse.usage.total_tokens;
    }
  }
  
  return response;
} 