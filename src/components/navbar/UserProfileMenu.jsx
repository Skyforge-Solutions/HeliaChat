import { useState } from 'react';
import { FiUser, FiChevronDown, FiGlobe, FiCreditCard, FiLogOut, FiSettings } from 'react-icons/fi';

export default function UserProfileMenu({ user, onOpenUserSettings }) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  
  // Available languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' }
  ];

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isLanguageMenuOpen) setIsLanguageMenuOpen(false);
  };
  
  const toggleLanguageMenu = (e) => {
    e.stopPropagation();
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };
  
  const selectLanguage = (language) => {
    // Would update user's language preference in a real app
    console.log(`Selected language: ${language}`);
    setIsLanguageMenuOpen(false);
  };
  
  const openUserDataForm = (e) => {
    e.preventDefault(); // Prevent default to ensure click doesn't propagate
    e.stopPropagation(); // Stop propagation to prevent closing the menu
    onOpenUserSettings();
    setIsProfileMenuOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleProfileMenu}
        className="flex items-center space-x-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary-light dark:bg-primary-dark text-black flex items-center justify-center">
          <FiUser />
        </div>
        <FiChevronDown className="text-gray-600 dark:text-gray-300" />
      </button>
      
      {isProfileMenuOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
          <div className="py-1 divide-y divide-gray-200 dark:divide-gray-700">
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.subscriptionType} Plan</p>
              <div className="mt-3 flex items-center text-xs text-gray-600 dark:text-gray-400">
                <FiCreditCard className="mr-1" />
                <span>{user.credits} credits remaining</span>
              </div>
            </div>
            
            <div className="py-1">
              <button
                onClick={openUserDataForm}
                type="button"
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiSettings className="mr-2" /> Personal Settings
              </button>
              
              <div className="relative">
                <button
                  onClick={toggleLanguageMenu}
                  type="button"
                  className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center">
                    <FiGlobe className="mr-2" />
                    <span>Language: {user.language}</span>
                  </div>
                  <FiChevronDown />
                </button>
                
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 left-0 mt-1 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-30">
                    <div className="py-1">
                      {languages.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => selectLanguage(lang.code)}
                          type="button"
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="py-1">
              <button 
                type="button"
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiLogOut className="mr-2" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Backdrop to close menus when clicked outside */}
      {isProfileMenuOpen && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setIsProfileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}