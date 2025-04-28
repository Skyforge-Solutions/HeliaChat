import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import apiClient from '../../services/api/ApiClient';

export default function SessionDropdownMenu({
  sessionId,
  sessionName,
}) {
  const { mutate: renameSession } = apiClient.chat.useRenameSession();
  const { mutate: deleteSession } = apiClient.chat.useDeleteSession();

  const handleRename = (e) => {
    console.log(sessionId,sessionName)
    e.stopPropagation();
    const newName = prompt("Enter new name:", sessionName);
    if (newName && newName !== sessionName) {
      renameSession({ chatId: sessionId, name: newName });
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this chat?")) {
      deleteSession(sessionId);
    }
  };

  return (
    <div className="absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg bg-background ring-1 ring-border ring-opacity-5 z-20">
      <div className="py-1">
        <button
          onClick={handleRename}
          className="flex items-center w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary"
        >
          <FiEdit2 size={14} className="mr-2" /> Rename
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center w-full text-left px-4 py-2 text-sm text-destructive hover:bg-secondary"
        >
          <FiTrash2 size={14} className="mr-2" /> Delete
        </button>
      </div>
    </div>
  );
}
