import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

// Default model options
const defaultModels = [
  {
    id: 'sun-shield',
    name: 'Helia Sun Shield',
    description: 'Digital safety & online awareness for your family',
  },
  {
    id: 'growth-ray',
    name: 'Helia Growth Ray',
    description: 'Emotional intelligence & behavior guidance for kids',
  },
  {
    id: 'sunbeam',
    name: 'Helia Sunbeam',
    description: 'Confidence building & family bonding support',
  },
  {
    id: 'inner-dawn',
    name: 'Helia Inner Dawn',
    description: 'Mindfulness, calm parenting & relationship wellness',
  }
];

export default function ModelSelector({ 
  models = defaultModels,
  selectedModel,
  onModelSelect,
  isDisabled,
  wrapperClass = ''
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    if (!isDisabled) {
      setIsMenuOpen(!isMenuOpen);
    }
  };
  
  const selectModel = (model) => {
    onModelSelect(model);
    setIsMenuOpen(false);
  };

  return (
    <div className={`${wrapperClass}`}>
      <div className="relative">
        <button
          type="button"
          onClick={toggleMenu}
          className={`flex items-center text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isDisabled}
        >
          {selectedModel.name} <FiChevronDown className="ml-1" />
        </button>
        
        {isMenuOpen && !isDisabled && (
          <div className="absolute left-0 bottom-full mb-1 w-56 origin-bottom-left rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div className="py-1">
              {models.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => selectModel(model)}
                  className={`flex flex-col w-full text-left px-4 py-2 text-sm ${
                    model.id === selectedModel.id 
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="font-medium">{model.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{model.description}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}