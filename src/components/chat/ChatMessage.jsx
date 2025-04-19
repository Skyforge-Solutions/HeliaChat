export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`py-4 ${isUser ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-start gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser 
              ? 'bg-primary-light dark:bg-primary-dark text-white'
              : 'bg-teal-500 text-white'
          }`}>
            {isUser ? 'U' : 'A'}
          </div>
          
          <div className="flex-1">
            <p className="font-medium text-text-light dark:text-text-dark">
              {isUser ? 'You' : 'Helia'}
            </p>
            <div className="mt-1 text-text-light dark:text-text-dark prose dark:prose-invert">
              {message.content}
            </div>
            
            {/* Display image attachment if present */}
            {message.image && (
              <div className="mt-3 inline-block">
                <img 
                  src={message.image} 
                  alt="Attachment" 
                  className="max-h-64 rounded-md border border-gray-300 dark:border-gray-700" 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}