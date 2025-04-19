import { useState, useEffect } from 'react';
import { FiCreditCard } from 'react-icons/fi';
import ThemeSwitcher from '../navbar/ThemeSwitcher';
import UserProfileMenu from '../navbar/UserProfileMenu';
import UserSettingsForm from '../navbar/UserSettingsForm';
import logo from '../../assets/logo.svg';

export default function Navbar() {
  const [showUserDataForm, setShowUserDataForm] = useState(false);
  
  // Initialize user data from localStorage if available
  const [userData, setUserData] = useState(() => {
    const savedUserData = localStorage.getItem('heliaUserData');
    if (savedUserData) {
      try {
        return JSON.parse(savedUserData);
      } catch (e) {
        console.error("Error parsing user data:", e);
        return getDefaultUserData();
      }
    }
    return getDefaultUserData();
  });
  
  function getDefaultUserData() {
    return {
      name: '',
      age: '',
      occupation: '',
      tone_preference: 'casual',
      tech_familiarity: 'moderate',
      parent_type: '',
      time_with_kids: '2',
      children: []
    };
  }
  
  // Mock user data - would come from user context in a real app
  const user = {
    name: userData.name || 'User',
    credits: 120,
    subscriptionType: 'Free',
    language: 'English'
  };
  
  const handleOpenUserSettings = () => {
    setShowUserDataForm(true);
  };
  
  const handleCloseUserSettings = () => {
    setShowUserDataForm(false);
    // Refresh user data from localStorage if it was updated
    const savedUserData = localStorage.getItem('heliaUserData');
    if (savedUserData) {
      try {
        setUserData(JSON.parse(savedUserData));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  };
  
  // Close user data form on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showUserDataForm) {
        setShowUserDataForm(false);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showUserDataForm]);

  return (
    <>
      <nav className="fixed top-0 w-full bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-700 px-4 py-2 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="HeliaChat Logo" className="h-8" />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-300 hidden sm:flex items-center">
              <FiCreditCard className="mr-1" />
              <span>{user.credits} credits</span>
            </div>
            
            <ThemeSwitcher />
            <UserProfileMenu user={user} onOpenUserSettings={handleOpenUserSettings} />
          </div>
        </div>
      </nav>
      
      {/* User Settings Form */}
      {showUserDataForm && (
        <UserSettingsForm 
          onClose={handleCloseUserSettings} 
          initialData={userData}
        />
      )}
    </>
  );
}