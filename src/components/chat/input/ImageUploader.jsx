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
    ? 'w-6 h-6 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
    : 'p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 ' + (isDisabled ? 'opacity-50 cursor-not-allowed' : '');
  
  return (
    <>
      {/* Image preview area */}
      {imagePreview && (
        <div className="mb-2 relative inline-block">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="h-20 rounded-md border border-gray-300 dark:border-gray-700" 
          />
          <button 
            type="button"
            onClick={onRemoveImage}
            disabled={isDisabled}
            className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 text-white rounded-full p-1"
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