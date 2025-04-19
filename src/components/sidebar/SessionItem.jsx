import { useState } from 'react';
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

  const toggleMenu = (e) => {
    e.stopPropagation();
    setOpenMenu(!openMenu);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditSave(session.id);
    }
  };

  return (
    <div 
      className={`flex items-center justify-between rounded-md px-2 py-2 ${
        currentSessionId === session.id 
          ? 'bg-gray-200 dark:bg-gray-700' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      {isEditing === session.id ? (
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={() => handleEditSave(session.id)}
          onKeyDown={(e) => handleKeyDown(e)}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm w-full"
          autoFocus
        />
      ) : (
        <>
          <button
            className={`flex items-center flex-1 text-left ${collapsed ? 'justify-center' : 'truncate'}`}
            onClick={() => switchSession(session.id)}
            title={collapsed ? session.name : ''}
          >
            <FiMessageSquare className={`${collapsed ? 'mr-0' : 'mr-2'} flex-shrink-0`} />
            {!collapsed && (
              <>
                <span className="truncate">{session.name}</span>
                <span className="ml-2 text-xs text-gray-500">{formatDate(session.timestamp)}</span>
              </>
            )}
          </button>
          
          {!collapsed && (
            <button
              onClick={toggleMenu}
              className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
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