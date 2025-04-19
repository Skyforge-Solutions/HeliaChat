import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import ModelSelector from './input/ModelSelector';
import ImageUploader from './input/ImageUploader';
import MessageInput from './input/MessageInput';

export default function ChatInput({ onSendMessage, isDisabled }) {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const models = [
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
    <div className="bg-background py-4 px-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        {/* image preview row */}
        {imagePreview && (
          <div className="mb-2 relative inline-block">
            <img 
              src={imagePreview} 
              alt="Preview"
              className="h-20 rounded-md border border-border" 
            />
            <button 
              type="button"
              onClick={removeImage}
              className="absolute top-1 right-1 bg-background/70 text-foreground rounded-full p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* input bar  */}
        <div className="flex items-center w-full bg-secondary rounded-xl
                px-3 gap-2 focus-within:ring-2
                focus-within:ring-primary">

          {/* + icon */}
          <ImageUploader
            inline
            selectedFile={selectedFile}
            onFileChange={handleFileChange}
            isDisabled={isDisabled}
          />

          {/* model badge */}
          <ModelSelector
            models={models}
            selectedModel={selectedModel}
            onModelSelect={setSelectedModel}
            isDisabled={isDisabled}
          />

          {/* textarea */}
          <MessageInput
            message={message}
            setMessage={setMessage}
            onKeyDown={handleKeyDown}
            isDisabled={isDisabled}
            extraClass="flex-1 bg-transparent py-3"
          />

          {/* send arrow */}
          <button
            type="submit"
            disabled={!message.trim() && !selectedFile || isDisabled}
            className="text-muted-foreground hover:text-primary disabled:opacity-40"
          >
            <FiSend size={20}/>
          </button>
        </div>

        {isDisabled && (
          <p className="mt-2 text-center text-sm text-destructive animate-pulse">
            AI is responding…
          </p>
        )}
      </form>
    </div>
  );
}