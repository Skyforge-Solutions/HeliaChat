export default function ClearAllConfirmation({ onClose, onConfirm, isDeleting }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-medium text-foreground">Clear all chats</h3>
        <p className="mt-2 text-muted-foreground">
          Are you sure you want to clear all your chat history? This action
          cannot be undone.
        </p>
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-input text-foreground hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Clear all'}
          </button>
        </div>
      </div>
    </div>
  );
}
