import { FiMenu, FiX } from 'react-icons/fi';

export default function MobileMenuButton({ isMobileMenuOpen, toggleMobileMenu }) {
  return (
    <button 
      className="md:hidden fixed top-2 left-4 z-20 p-2 rounded-md bg-secondary text-foreground hover:bg-muted transition-colors"
      onClick={toggleMobileMenu}
      aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
    >
      {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
    </button>
  );
}