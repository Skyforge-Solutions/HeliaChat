import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import ModelSelector from './input/ModelSelector';
import ImageUploader from './input/ImageUploader';
import MessageInput from './input/MessageInput';

export default function ChatInput({ onSendMessage, isDisabled, placeholder }) {
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
    },
  ];
  const [selectedModel, setSelectedModel] = useState(models[0]);

  const handleSubmit = e => {
    e.preventDefault();
    if ((message.trim() || selectedFile) && !isDisabled) {
      onSendMessage(message, selectedFile, selectedModel.id);
      setMessage('');
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey && !isDisabled) {
      e.preventDefault();
      handleSubmit(e);
    }
    // Allow Shift+Enter for new lines
    if (e.key === 'Enter' && e.shiftKey) {
      // Let the default behavior happen (new line)
    }
  };

  const handleFileChange = e => {
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
        <div
          className={`flex items-center w-full bg-secondary rounded-xl
                px-3 gap-2 focus-within:ring-2
                focus-within:ring-primary ${isDisabled ? 'opacity-70' : ''}`}
        >
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
            placeholder={placeholder || "Send a message..."}
          />

          {/* send arrow */}
          <button
            type="submit"
            disabled={(!message.trim() && !selectedFile) || isDisabled}
            className="text-muted-foreground hover:text-primary disabled:opacity-40"
          >
            <FiSend size={20} />
          </button>
        </div>


        {isDisabled ? (
          <div className="mt-2 flex items-center justify-center gap-2 h-6">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <p className="text-sm text-primary">
              {placeholder || "AI is responding..."}
            </p>
          </div>
        ) : (
          <div className="mt-2  text-xs text-muted-foreground text-center h-6">
            Press Enter to send, Shift+Enter for new line
          </div>
        )}
      </form>
    </div>
  );
}
