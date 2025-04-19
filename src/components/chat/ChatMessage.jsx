import { FiCopy, FiVolume2, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { useState } from 'react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const [vote, setVote] = useState(null); // 'up' | 'down' | null

  const copyToClipboard = () => navigator.clipboard.writeText(message.content);

  const readAloud = () => {
    const utter = new SpeechSynthesisUtterance(message.content);
    speechSynthesis.speak(utter);
  };

  const toggleUp = () => setVote(vote === 'up' ? null : 'up');
  const toggleDown = () => setVote(vote === 'down' ? null : 'down');

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
              {!isUser && (
                <div className="mt-2 flex gap-3 text-gray-500 dark:text-gray-400 text-sm">
                  <button onClick={copyToClipboard} className="hover:text-gray-700 dark:hover:text-gray-200">
                    <FiCopy />
                  </button>
                  <button onClick={readAloud} className="hover:text-gray-700 dark:hover:text-gray-200">
                    <FiVolume2 />
                  </button>
                  <button
                    onClick={toggleUp}
                    className={`${vote === 'up' ? 'text-teal-600' : 'hover:text-gray-700 dark:hover:text-gray-200'}`}
                  >
                    <FiThumbsUp />
                  </button>
                  <button
                    onClick={toggleDown}
                    className={`${vote === 'down' ? 'text-red-600' : 'hover:text-gray-700 dark:hover:text-gray-200'}`}
                  >
                    <FiThumbsDown />
                  </button>
                </div>
              )}
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