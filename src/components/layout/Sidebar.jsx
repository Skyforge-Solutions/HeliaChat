import { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { FiPlus } from 'react-icons/fi';
import MobileMenuButton from '../sidebar/MobileMenuButton';
import SearchBar from '../sidebar/SearchBar';
import SessionItem from '../sidebar/SessionItem';
import ClearAllConfirmation from '../sidebar/ClearAllConfirmation';

export default function Sidebar({ collapsed }) {
  const {
    sessions,
    currentSessionId,
    switchSession,
    createNewSession,
    deleteSession,
    renameSession,
    clearAllSessions,
  } = useChat();
  const [isEditing, setIsEditing] = useState(null);
  const [editName, setEditName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleEditStart = (id, name, e) => {
    if (e) e.stopPropagation();
    setIsEditing(id);
    setEditName(name);
  };

  const handleEditSave = id => {
    if (editName.trim()) {
      renameSession(id, editName);
    }
    setIsEditing(null);
  };

  const handleDeleteSession = (id, e) => {
    if (e) e.stopPropagation();
    deleteSession(id);
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleClearAllSessions = () => {
    setShowClearConfirm(false);
    clearAllSessions();
  };

  // Filter sessions based on search query
  const filteredSessions = sessions.filter(session =>
    session.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile menu button - now as a component */}
      <MobileMenuButton
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-12 left-0 h-[calc(100vh-48px)] ${
          collapsed ? 'w-16' : 'w-64'
        } bg-background transform ${
          isMobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }  ease-in-out md:relative z-10 pt-4 pb-4 flex flex-col`}
      >
        <div className={`px-2 py-2 ${collapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={createNewSession}
            className={`${
              collapsed ? 'p-2' : 'w-full'
            } flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity shadow-sm`}
            title="New Chat"
          >
            <FiPlus size={16} />{' '}
            {!collapsed && <span className="font-medium">New Chat</span>}
          </button>
        </div>

        {/* Search bar - now as a component */}
        {!collapsed && (
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        <div className="flex-1 overflow-y-auto px-2">
          {!collapsed && (
            <h2 className="text-sm font-medium text-muted-foreground px-2 py-2">
              Chat History
            </h2>
          )}
          <ul className="space-y-1">
            {filteredSessions.map(session => (
              <li key={session.id} className="relative">
                <SessionItem
                  session={session}
                  currentSessionId={currentSessionId}
                  collapsed={collapsed}
                  switchSession={switchSession}
                  handleEditStart={handleEditStart}
                  handleEditSave={handleEditSave}
                  handleDeleteSession={handleDeleteSession}
                  isEditing={isEditing}
                  editName={editName}
                  setEditName={setEditName}
                  formatDate={formatDate}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Footer section - hidden when collapsed */}
        {!collapsed && (
          <div className="mt-auto px-4 py-2 text-xs text-muted-foreground">
            <div className="pt-2">
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full text-left py-1 px-2 rounded hover:bg-secondary transition-colors text-destructive"
              >
                <span>Clear all chats</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Clear all chats confirmation modal - now as a component */}
      {showClearConfirm && (
        <ClearAllConfirmation
          onClose={() => setShowClearConfirm(false)}
          onConfirm={handleClearAllSessions}
        />
      )}
    </>
  );
}
