import { FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function SessionDropdownMenu({
  sessionId,
  sessionName,
  handleEditStart,
  handleDeleteSession,
}) {
  return (
    <div className="absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg bg-background ring-1 ring-border ring-opacity-5 z-20">
      <div className="py-1">
        <button
          onClick={e => handleEditStart(sessionId, sessionName, e)}
          className="flex items-center w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary"
        >
          <FiEdit2 size={14} className="mr-2" /> Rename
        </button>
        <button
          onClick={e => handleDeleteSession(sessionId, e)}
          className="flex items-center w-full text-left px-4 py-2 text-sm text-destructive hover:bg-secondary"
        >
          <FiTrash2 size={14} className="mr-2" /> Delete
        </button>
      </div>
    </div>
  );
}
