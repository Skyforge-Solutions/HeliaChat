import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import ModelSelector from './input/ModelSelector';
import ImageUploader from './input/ImageUploader';
import MessageInput from './input/MessageInput';

export default function ChatInput({ onSendMessage, isDisabled }) {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Model selection state 
  const models = [
    { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model' },
    { id: 'gpt-3.5', name: 'GPT-3.5', description: 'Fast and efficient' },
    { id: 'claude', name: 'Claude', description: 'Anthropic\'s assistant' }
  ];
  const [selectedModel, setSelectedModel] = useState(models[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((message.trim() || selectedFile) && !isDisabled) {
      onSendMessage(message, selectedFile);
      setMessage('');
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isDisabled) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-4 px-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <ImageUploader
          selectedFile={selectedFile}
          imagePreview={imagePreview}
          onFileChange={handleFileChange}
          onRemoveImage={removeImage}
          isDisabled={isDisabled}
        />
        
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg relative">
            <ModelSelector
              models={models}
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
              isDisabled={isDisabled}
            />
            
            <MessageInput
              message={message}
              setMessage={setMessage}
              onKeyDown={handleKeyDown}
              isDisabled={isDisabled}
            />
          </div>
          
          {/* Send button */}
          <button
            type="submit"
            disabled={!message.trim() && !selectedFile || isDisabled}
            className={`p-3 rounded-full ${
              (message.trim() || selectedFile) && !isDisabled
                ? 'bg-primary-light dark:bg-primary-dark text-white' 
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50'
            }`}
          >
            <FiSend size={18} />
          </button>
        </div>
        
        {isDisabled && (
          <div className="mt-2 flex items-center justify-center text-sm text-amber-600 dark:text-amber-400">
            <span className="animate-pulse">AI is responding...</span>
          </div>
        )}
      </form>
    </div>
  );
}