'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { getLocalModels } from '@/services/models/ModelService';
import { LocalModelService } from '@/services/models/LocalModelService';
import { formatBytes } from '@/utils/formatters';

export default function ModelsPage() {
  const [localModels, setLocalModels] = useState<LocalModelService[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch available local models
  useEffect(() => {
    const fetchLocalModels = async () => {
      setLoading(true);
      const models = getLocalModels();
      setLocalModels(models as LocalModelService[]);
      setLoading(false);
    };

    fetchLocalModels();

    // Set up interval to refresh model status
    const interval = setInterval(() => {
      const updatedModels = getLocalModels();
      setLocalModels(updatedModels as LocalModelService[]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Function to download a model
  const handleDownload = async (model: LocalModelService) => {
    try {
      const success = await model.downloadModel?.();
      if (success) {
        // Refresh the list after download
        setLocalModels([...getLocalModels() as LocalModelService[]]);
      }
    } catch (error) {
      console.error('Error downloading model:', error);
    }
  };

  // Function to cancel a download
  const handleCancelDownload = async (model: LocalModelService) => {
    try {
      await model.cancelDownload?.();
      // Refresh the list after cancelling
      setLocalModels([...getLocalModels() as LocalModelService[]]);
    } catch (error) {
      console.error('Error cancelling download:', error);
    }
  };

  return (
    <DashboardLayout title="Model Management" description="Manage your AI models">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Local Models</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Download and manage local AI models to use offline. Local models run directly on your device, ensuring privacy and reducing latency.
        </p>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 h-20 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {localModels.length === 0 ? (
              <div className="text-center p-8 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">No local models available</p>
              </div>
            ) : (
              localModels.map((model) => (
                <div
                  key={model.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{model.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{model.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Size: {model.modelSize ? formatBytes(model.modelSize) : 'Unknown'}
                      </p>
                    </div>
                    <div>
                      {model.isAvailable ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Ready
                        </span>
                      ) : model.downloadProgress && model.downloadProgress > 0 && model.downloadProgress < 100 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          Downloading
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          Not Downloaded
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar for downloading models */}
                  {model.downloadProgress !== undefined && model.downloadProgress > 0 && model.downloadProgress < 100 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-gray-600 dark:bg-gray-300 h-2.5 rounded-full"
                          style={{ width: `${model.downloadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                        {model.downloadProgress}%
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end space-x-2">
                    {model.isAvailable ? (
                      <button
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm rounded-md"
                        disabled
                      >
                        Downloaded
                      </button>
                    ) : model.downloadProgress && model.downloadProgress > 0 && model.downloadProgress < 100 ? (
                      <button
                        onClick={() => handleCancelDownload(model)}
                        className="px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-900 dark:text-red-100 text-sm rounded-md"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDownload(model)}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm rounded-md"
                      >
                        Download
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 