export default function Welcome() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold text-primary-light dark:text-primary-dark">Welcome to HeliaChat</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md">
          Start a conversation with Helia, your AI assistant. Ask questions, get information, or just chat!
        </p>
      </div>
    </div>
  );
}