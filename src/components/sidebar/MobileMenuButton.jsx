import { FiMenu, FiX } from 'react-icons/fi';

export default function MobileMenuButton({ isMobileMenuOpen, toggleMobileMenu }) {
  return (
    <button 
      className="md:hidden fixed top-2 left-4 z-20 p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark"
      onClick={toggleMobileMenu}
    >
      {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
    </button>
  );
}