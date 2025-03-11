import fs from 'fs';
import path from 'path';
import os from 'os';
import { createLocalModelService } from './models/LocalModelService';
import { ModelService } from './models/ModelService';
import https from 'https';
import { createWriteStream } from 'fs';
import { exec } from 'child_process';
import util from 'util';

// Convert exec to Promise-based
const execAsync = util.promisify(exec);

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  size: number;
  parameters: number;
  quantization?: string;
  format: string;
  downloadUrl?: string;
  description?: string;
  downloaded: boolean;
  path?: string;
}

export interface DownloadProgress {
  modelId: string;
  bytesDownloaded: number;
  totalBytes: number;
  percentage: number;
  status: 'downloading' | 'verifying' | 'extracting' | 'completed' | 'error';
  error?: string;
}

/**
 * Manages local AI models - discovery, download, and organization
 */
export class ModelManager {
  private modelsDirectory: string;
  private availableModels: Map<string, ModelInfo> = new Map();
  private downloadProgress: Map<string, DownloadProgress> = new Map();
  private progressCallbacks: ((progress: DownloadProgress) => void)[] = [];
  
  constructor() {
    this.modelsDirectory = this.getDefaultModelDirectory();
    this.ensureDirectoryExists(this.modelsDirectory);
  }
  
  /**
   * Get the default directory for storing models based on OS
   */
  private getDefaultModelDirectory(): string {
    const homeDir = os.homedir();
    
    if (process.platform === 'darwin') {
      return path.join(homeDir, 'Library', 'Application Support', 'AI Assistant', 'models');
    } else if (process.platform === 'win32') {
      return path.join(homeDir, 'AppData', 'Local', 'AI Assistant', 'models');
    } else {
      return path.join(homeDir, '.ai-assistant', 'models');
    }
  }
  
  /**
   * Ensure the models directory exists
   */
  private ensureDirectoryExists(directory: string): void {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }
  
  /**
   * Initialize the model manager and discover local models
   */
  async initialize(): Promise<void> {
    await this.discoverLocalModels();
    await this.fetchAvailableModelsList();
  }
  
  /**
   * Discover models already downloaded and available locally
   */
  async discoverLocalModels(): Promise<ModelInfo[]> {
    try {
      const files = await fs.promises.readdir(this.modelsDirectory);
      
      const modelInfos: ModelInfo[] = [];
      
      for (const file of files) {
        // Skip metadata files and directories
        if (file.endsWith('.json') || !file.includes('.')) continue;
        
        const filePath = path.join(this.modelsDirectory, file);
        const stats = await fs.promises.stat(filePath);
        
        if (stats.isFile()) {
          // Try to get metadata from companion json file
          const baseName = path.basename(file, path.extname(file));
          const metadataPath = path.join(this.modelsDirectory, `${baseName}.json`);
          
          let modelInfo: Partial<ModelInfo> = {
            id: baseName,
            name: baseName,
            provider: 'Local',
            size: stats.size,
            parameters: 0,
            format: path.extname(file).slice(1),
            downloaded: true,
            path: filePath,
          };
          
          try {
            if (fs.existsSync(metadataPath)) {
              const metadata = JSON.parse(await fs.promises.readFile(metadataPath, 'utf-8'));
              modelInfo = { ...modelInfo, ...metadata };
            }
          } catch (e) {
            console.error(`Error reading metadata for ${file}:`, e);
          }
          
          const completeModelInfo = modelInfo as ModelInfo;
          this.availableModels.set(completeModelInfo.id, completeModelInfo);
          modelInfos.push(completeModelInfo);
        }
      }
      
      return modelInfos;
    } catch (error) {
      console.error('Error discovering local models:', error);
      return [];
    }
  }
  
  /**
   * Fetch list of available models from repository
   */
  async fetchAvailableModelsList(): Promise<ModelInfo[]> {
    try {
      // In a real implementation, this would fetch from a repository API
      // For now, we'll define some sample models
      const remoteModels: ModelInfo[] = [
        {
          id: 'llama-2-7b-chat-q4_0',
          name: 'Llama 2 7B Chat Q4_0',
          provider: 'Meta',
          size: 3800000000, // ~3.8GB
          parameters: 7000000000,
          quantization: 'Q4_0',
          format: 'gguf',
          downloadUrl: 'https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.q4_0.gguf',
          description: 'Llama 2 7B Chat model optimized for dialogue use cases, quantized to 4-bit.',
          downloaded: false,
        },
        {
          id: 'mistral-7b-instruct-v0.2-q4_0',
          name: 'Mistral 7B Instruct Q4_0',
          provider: 'Mistral AI',
          size: 3700000000, // ~3.7GB
          parameters: 7000000000,
          quantization: 'Q4_0',
          format: 'gguf',
          downloadUrl: 'https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/mistral-7b-instruct-v0.2.q4_0.gguf',
          description: 'Mistral 7B Instruct v0.2 model fine-tuned for instruction following, quantized to 4-bit.',
          downloaded: false,
        }
      ];
      
      // Merge with known local models to update download status
      for (const model of remoteModels) {
        const localModel = this.availableModels.get(model.id);
        if (localModel) {
          model.downloaded = true;
          model.path = localModel.path;
          // Update the local model info with remote details
          this.availableModels.set(model.id, {...model, ...localModel});
        } else {
          this.availableModels.set(model.id, model);
        }
      }
      
      return Array.from(this.availableModels.values());
    } catch (error) {
      console.error('Error fetching available models:', error);
      return Array.from(this.availableModels.values());
    }
  }
  
  /**
   * Get all available models (both local and remote)
   */
  getAvailableModels(): ModelInfo[] {
    return Array.from(this.availableModels.values());
  }
  
  /**
   * Get only downloaded models
   */
  getLocalModels(): ModelInfo[] {
    return Array.from(this.availableModels.values()).filter(model => model.downloaded);
  }
  
  /**
   * Get a model by ID
   */
  getModel(modelId: string): ModelInfo | undefined {
    return this.availableModels.get(modelId);
  }
  
  /**
   * Check if a model is downloaded
   */
  isModelDownloaded(modelId: string): boolean {
    const model = this.availableModels.get(modelId);
    return model ? model.downloaded : false;
  }
  
  /**
   * Start downloading a model
   */
  async downloadModel(modelId: string, onProgress?: (progress: DownloadProgress) => void): Promise<void> {
    const model = this.availableModels.get(modelId);
    
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }
    
    if (model.downloaded) {
      throw new Error(`Model ${modelId} is already downloaded`);
    }
    
    if (!model.downloadUrl) {
      throw new Error(`No download URL available for model ${modelId}`);
    }
    
    // Initialize progress
    const progress: DownloadProgress = {
      modelId,
      bytesDownloaded: 0,
      totalBytes: model.size,
      percentage: 0,
      status: 'downloading'
    };
    
    this.downloadProgress.set(modelId, progress);
    
    if (onProgress) {
      this.progressCallbacks.push(onProgress);
    }
    
    this.updateProgress(progress);
    
    try {
      // Download the model
      const outputPath = path.join(this.modelsDirectory, `${modelId}.${model.format}`);
      await this.downloadFile(model.downloadUrl, outputPath, progress);
      
      // Update progress to completed
      progress.status = 'completed';
      progress.percentage = 100;
      this.updateProgress(progress);
      
      // Update model info
      model.downloaded = true;
      model.path = outputPath;
      this.availableModels.set(modelId, model);
      
      // Save metadata
      const metadataPath = path.join(this.modelsDirectory, `${modelId}.json`);
      await fs.promises.writeFile(metadataPath, JSON.stringify(model, null, 2));
      
      // Clean up progress
      this.downloadProgress.delete(modelId);
      
      // If onProgress was provided, remove it from callbacks
      if (onProgress) {
        this.progressCallbacks = this.progressCallbacks.filter(cb => cb !== onProgress);
      }
    } catch (error) {
      // Update progress to error
      progress.status = 'error';
      progress.error = (error as Error).message;
      this.updateProgress(progress);
      
      // Clean up progress
      this.downloadProgress.delete(modelId);
      
      // If onProgress was provided, remove it from callbacks
      if (onProgress) {
        this.progressCallbacks = this.progressCallbacks.filter(cb => cb !== onProgress);
      }
      
      throw error;
    }
  }
  
  /**
   * Cancel downloading a model
   */
  cancelDownload(modelId: string): void {
    // Implementation would go here
  }
  
  /**
   * Delete a downloaded model
   */
  async deleteModel(modelId: string): Promise<void> {
    const model = this.availableModels.get(modelId);
    
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }
    
    if (!model.downloaded || !model.path) {
      throw new Error(`Model ${modelId} is not downloaded`);
    }
    
    try {
      // Delete the model file
      await fs.promises.unlink(model.path);
      
      // Delete metadata file if it exists
      const metadataPath = path.join(this.modelsDirectory, `${modelId}.json`);
      try {
        await fs.promises.unlink(metadataPath);
      } catch (e) {
        // Ignore error if metadata file doesn't exist
      }
      
      // Update model info
      model.downloaded = false;
      model.path = undefined;
      this.availableModels.set(modelId, model);
      
      return;
    } catch (error) {
      throw new Error(`Failed to delete model ${modelId}: ${(error as Error).message}`);
    }
  }
  
  /**
   * Create a ModelService for a local model
   */
  createModelService(modelId: string): ModelService {
    const model = this.availableModels.get(modelId);
    
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }
    
    if (!model.downloaded || !model.path) {
      throw new Error(`Model ${modelId} is not downloaded`);
    }
    
    return createLocalModelService(model.id, model.name, model.path);
  }
  
  /**
   * Update download progress and notify callbacks
   */
  private updateProgress(progress: DownloadProgress): void {
    this.downloadProgress.set(progress.modelId, progress);
    
    for (const callback of this.progressCallbacks) {
      callback(progress);
    }
  }
  
  /**
   * Download a file from a URL to a local path with progress tracking
   */
  private downloadFile(url: string, outputPath: string, progress: DownloadProgress): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = createWriteStream(outputPath);
      
      https.get(url, (response) => {
        const totalBytes = parseInt(response.headers['content-length'] || '0', 10);
        progress.totalBytes = totalBytes || progress.totalBytes;
        
        let bytesDownloaded = 0;
        
        response.on('data', (chunk) => {
          bytesDownloaded += chunk.length;
          progress.bytesDownloaded = bytesDownloaded;
          progress.percentage = Math.round((bytesDownloaded / progress.totalBytes) * 100);
          this.updateProgress(progress);
        });
        
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', (err) => {
        // Clean up the file
        fs.unlink(outputPath, () => {});
        reject(err);
      });
    });
  }
}

// Export singleton instance
export const modelManager = new ModelManager(); 