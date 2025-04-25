import { useState } from 'react';
import {
  FiUser,
  FiChevronDown,
  FiGlobe,
  FiCreditCard,
  FiLogOut,
  FiSettings,
} from 'react-icons/fi';

export default function UserProfileMenu({ user, onOpenUserSettings, onLogout }) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  // Available languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
  ];

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isLanguageMenuOpen) setIsLanguageMenuOpen(false);
  };

  const toggleLanguageMenu = e => {
    e.stopPropagation();
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  const selectLanguage = language => {
    // Would update user's language preference in a real app
    console.log(`Selected language: ${language}`);
    setIsLanguageMenuOpen(false);
  };

  const openUserDataForm = e => {
    e.preventDefault(); // Prevent default to ensure click doesn't propagate
    e.stopPropagation(); // Stop propagation to prevent closing the menu
    onOpenUserSettings();
    setIsProfileMenuOpen(false);
  };

  const handleLogout = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsProfileMenuOpen(false);
    if (onLogout) onLogout();
  };

  return (
    <div className="relative">
      <button
        onClick={toggleProfileMenu}
        className="flex items-center space-x-1 p-1 rounded-full hover:bg-secondary transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          <FiUser />
        </div>
        <FiChevronDown className="text-muted-foreground" />
      </button>

      {isProfileMenuOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-md bg-background shadow-lg ring-1 ring-ring ring-opacity-5 focus:outline-none z-20">
          <div className="py-1 divide-y divide-border">
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">
                {user.subscriptionType} Plan
              </p>
              <div className="mt-3 flex items-center text-xs text-muted-foreground">
                <FiCreditCard className="mr-1" />
                <span>{user.credits} credits remaining</span>
              </div>
            </div>

            <div className="py-1">
              <button
                onClick={openUserDataForm}
                type="button"
                className="flex items-center w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary"
              >
                <FiSettings className="mr-2" /> Personal Settings
              </button>

              <div className="relative">
                <button
                  onClick={toggleLanguageMenu}
                  type="button"
                  className="flex items-center justify-between w-full px-4 py-2 text-sm text-foreground hover:bg-secondary"
                >
                  <div className="flex items-center">
                    <FiGlobe className="mr-2" />
                    <span>Language: {user.language}</span>
                  </div>
                  <FiChevronDown />
                </button>

                {isLanguageMenuOpen && (
                  <div className="absolute right-0 left-0 mt-1 rounded-md bg-background shadow-lg ring-1 ring-ring ring-opacity-5 z-30">
                    <div className="py-1">
                      {languages.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => selectLanguage(lang.code)}
                          type="button"
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary"
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
                onClick={handleLogout}
                type="button"
                className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-secondary"
              >
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
