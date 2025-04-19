import { useRef } from 'react';
import { FiImage, FiPlus } from 'react-icons/fi';

export default function ImageUploader({ 
  selectedFile,
  imagePreview, 
  onFileChange, 
  onRemoveImage,
  isDisabled,
  inline = false
}) {
  const fileInputRef = useRef(null);
  
  const handleFileButtonClick = () => {
    if (!isDisabled) {
      fileInputRef.current.click();
    }
  };
  
  const btnCls = inline
    ? 'w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground'
    : 'p-3 rounded-full bg-secondary text-secondary-foreground hover:bg-accent ' + (isDisabled ? 'opacity-50 cursor-not-allowed' : '');
  
  return (
    <>
      {/* Image preview area */}
      {imagePreview && (
        <div className="mb-2 relative inline-block">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="h-20 rounded-md border border-border" 
          />
          <button 
            type="button"
            onClick={onRemoveImage}
            disabled={isDisabled}
            className="absolute top-1 right-1 bg-background/70 text-foreground rounded-full p-1"
            aria-label="Remove image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      )}
      
      {/* File input (hidden) */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/*"
        className="hidden"
        disabled={isDisabled}
      />
      
      {/* Image upload button */}
      <button
        type="button"
        onClick={handleFileButtonClick}
        disabled={isDisabled}
        className={btnCls}
      >
        {inline ? <FiPlus size={18}/> : <FiImage size={18}/>}
      </button>
    </>
  );
}