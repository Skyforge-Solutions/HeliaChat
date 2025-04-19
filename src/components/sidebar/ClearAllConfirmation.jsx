export default function ClearAllConfirmation({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-text-light dark:text-text-dark">Clear all chats</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Are you sure you want to clear all your chat history? This action cannot be undone.
        </p>
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  );
}