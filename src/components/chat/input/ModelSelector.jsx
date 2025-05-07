import { useState, useRef, useEffect } from 'react';
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
  },
];

export default function ModelSelector({
  models = defaultModels,
  selectedModel,
  onModelSelect,
  isDisabled,
  wrapperClass = '',
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    if (!isDisabled) {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const selectModel = model => {
    onModelSelect(model);
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`${wrapperClass}`}>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={toggleMenu}
          className={`flex items-center text-xs sm:text-sm text-foreground hover:text-foreground px-1 sm:px-2 py-0.5 sm:py-1 rounded-md bg-secondary ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isDisabled}
        >
          <span className="hidden md:inline">{selectedModel.name}</span>
          <span className="md:hidden">{selectedModel.name.split(' ').pop()}</span>
          <FiChevronDown className="ml-1" />
        </button>

        {isMenuOpen && !isDisabled && (
          <div className="absolute left-0 bottom-full mb-1 w-40 sm:w-56 origin-bottom-left rounded-md bg-card shadow-lg ring-1 ring-border focus:outline-none z-10">
            <div className="py-1">
              {models.map(model => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => selectModel(model)}
                  className={`flex flex-col w-full text-left px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm ${
                    model.id === selectedModel.id
                      ? 'bg-accent text-accent-foreground'
                      : 'text-card-foreground hover:bg-secondary'
                  }`}
                >
                  <span className="font-medium text-xs md:text-sm">{model.name}</span>
                  <span className="text-xs text-muted-foreground line-clamp-2 sm:line-clamp-none">
                    {model.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
