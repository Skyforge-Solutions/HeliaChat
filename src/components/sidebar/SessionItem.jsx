import { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiMoreVertical } from 'react-icons/fi';
import SessionDropdownMenu from './SessionDropdownMenu';
import { Link, useParams } from 'react-router-dom';

export default function SessionItem({
  session,
  collapsed,
  formatDate
}) {
  const { chatId } = useParams();
  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef();

  const toggleMenu = e => {
    e.stopPropagation();
    setOpenMenu(!openMenu);
  };

  useEffect(() => {
    const handleClickOutside = e => {
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

  return (
    <div
      ref={dropdownRef}
      className={`flex items-center justify-between rounded-md px-2 py-2 ${
        chatId === session.id
          ? 'bg-secondary'
          : 'hover:bg-secondary/50'
      }`}
    >
      <Link
        to={`/chat/${session.id}`}
        className={`flex items-center flex-1 text-left ${collapsed ? 'justify-center' : 'truncate'}`}
        title={collapsed ? session.name : ''}
      >
        <FiMessageSquare
          className={`${collapsed ? 'mr-0' : 'mr-2'} flex-shrink-0 text-foreground`}
        />
        {!collapsed && (
          <>
            <span className="truncate text-foreground">{session.name}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              {formatDate(session.created_at)}
            </span>
          </>
        )}
      </Link>

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
        />
      )}
    </div>
  );
}
