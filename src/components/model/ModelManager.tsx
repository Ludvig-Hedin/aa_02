import React, { useState, useEffect } from 'react';
import { modelManager, ModelInfo, DownloadProgress } from '@/services/ModelManager';
import { formatBytes } from '@/utils/formatters';
import { Download, Trash2, Check, AlertCircle, RotateCcw } from 'lucide-react';

export function ModelManager() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<Map<string, DownloadProgress>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeModelManager() {
      try {
        await modelManager.initialize();
        setModels(modelManager.getAvailableModels());
        setIsInitialized(true);
      } catch (err) {
        setError(`Failed to initialize model manager: ${(err as Error).message}`);
      }
    }

    initializeModelManager();
  }, []);

  const handleDownload = async (modelId: string) => {
    setError(null);
    try {
      const onProgress = (progress: DownloadProgress) => {
        setDownloadProgress(prev => {
          const newMap = new Map(prev);
          newMap.set(modelId, progress);
          return newMap;
        });
      };

      await modelManager.downloadModel(modelId, onProgress);
      
      // Update models list to reflect the newly downloaded model
      setModels(modelManager.getAvailableModels());
    } catch (err) {
      setError(`Failed to download model: ${(err as Error).message}`);
    }
  };

  const handleDelete = async (modelId: string) => {
    setError(null);
    try {
      await modelManager.deleteModel(modelId);
      
      // Update models list
      setModels(modelManager.getAvailableModels());
    } catch (err) {
      setError(`Failed to delete model: ${(err as Error).message}`);
    }
  };

  const handleRefresh = async () => {
    setError(null);
    try {
      await modelManager.discoverLocalModels();
      await modelManager.fetchAvailableModelsList();
      setModels(modelManager.getAvailableModels());
    } catch (err) {
      setError(`Failed to refresh models: ${(err as Error).message}`);
    }
  };

  if (!isInitialized) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        <span className="ml-3">Initializing model manager...</span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Local AI Models</h2>
        <button 
          onClick={handleRefresh} 
          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Refresh
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map(model => (
          <div key={model.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{model.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{model.provider}</p>
                </div>
                {model.downloaded && (
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    Downloaded
                  </div>
                )}
              </div>
              
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Size:</span>
                  <span>{formatBytes(model.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Parameters:</span>
                  <span>{(model.parameters / 1000000000).toFixed(1)}B</span>
                </div>
                {model.quantization && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Quantization:</span>
                    <span>{model.quantization}</span>
                  </div>
                )}
              </div>
              
              {model.description && (
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{model.description}</p>
              )}
              
              {downloadProgress.has(model.id) && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{downloadProgress.get(model.id)!.status}</span>
                    <span>{downloadProgress.get(model.id)!.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-primary-500 dark:bg-primary-400 h-2.5 rounded-full"
                      style={{ width: `${downloadProgress.get(model.id)!.percentage}%` }}
                    ></div>
                  </div>
                  {downloadProgress.get(model.id)!.status === 'downloading' && (
                    <div className="text-xs text-center mt-1 text-gray-500 dark:text-gray-400">
                      {formatBytes(downloadProgress.get(model.id)!.bytesDownloaded)} / {formatBytes(downloadProgress.get(model.id)!.totalBytes)}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-900 flex justify-end space-x-2">
              {!model.downloaded ? (
                <button 
                  onClick={() => handleDownload(model.id)} 
                  disabled={downloadProgress.has(model.id)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              ) : (
                <button 
                  onClick={() => handleDelete(model.id)} 
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
        
        {models.length === 0 && (
          <div className="col-span-full p-8 text-center bg-gray-100 dark:bg-gray-800/30 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">No models available. Try refreshing the list.</p>
          </div>
        )}
      </div>
    </div>
  );
} 