import { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiMoreVertical } from 'react-icons/fi';
import SessionDropdownMenu from './SessionDropdownMenu';

export default function SessionItem({ 
  session, 
  currentSessionId, 
  collapsed, 
  switchSession, 
  handleEditStart, 
  handleEditSave, 
  handleDeleteSession, 
  isEditing,
  editName,
  setEditName,
  formatDate
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setOpenMenu(!openMenu);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    if (openMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenu]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditSave(session.id);
      setOpenMenu(false); // Close the dropdown after rename
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className={`flex items-center justify-between rounded-md px-2 py-2 ${
        currentSessionId === session.id 
          ? 'bg-secondary' 
          : 'hover:bg-secondary/50'
      }`}
    >
      {isEditing === session.id ? (
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={() => handleEditSave(session.id)}
          onKeyDown={(e) => handleKeyDown(e)}
          className="bg-background border border-input rounded px-2 py-1 text-sm w-full text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          autoFocus
        />
      ) : (
        <>
          <button
            className={`flex items-center flex-1 text-left ${collapsed ? 'justify-center' : 'truncate'}`}
            onClick={() => switchSession(session.id)}
            title={collapsed ? session.name : ''}
          >
            <FiMessageSquare className={`${collapsed ? 'mr-0' : 'mr-2'} flex-shrink-0 text-foreground`} />
            {!collapsed && (
              <>
                <span className="truncate text-foreground">{session.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">{formatDate(session.timestamp)}</span>
              </>
            )}
          </button>
          
          {!collapsed && (
            <button
              onClick={toggleMenu}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <FiMoreVertical size={16} />
            </button>
          )}
          
          {openMenu && !collapsed && (
            <SessionDropdownMenu 
              sessionId={session.id} 
              sessionName={session.name} 
              handleEditStart={handleEditStart} 
              handleDeleteSession={handleDeleteSession}
            />
          )}
        </>
      )}
    </div>
  );
}