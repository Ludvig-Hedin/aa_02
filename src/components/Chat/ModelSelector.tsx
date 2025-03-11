interface ModelSelectorProps {
  selectedModel: string
  onSelectModel: (model: string) => void
}

/**
 * Model selection dropdown component
 * 
 * Allows users to select which AI model to use for the conversation
 * Groups models by provider (Claude, OpenAI, Google, Local)
 */
const ModelSelector = ({ selectedModel, onSelectModel }: ModelSelectorProps) => {
  const models = [
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
  ]

  // Group models by provider
  const groupedModels: Record<string, typeof models> = {}
  models.forEach(model => {
    if (!groupedModels[model.provider]) {
      groupedModels[model.provider] = []
    }
    groupedModels[model.provider].push(model)
  })

  return (
    <div className="flex items-center">
      <label htmlFor="model-selector" className="mr-2 text-sm font-medium">
        Model:
      </label>
      <select
        id="model-selector"
        value={selectedModel}
        onChange={(e) => onSelectModel(e.target.value)}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 p-2"
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
  )
}

export default ModelSelector 