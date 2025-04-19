export default function MessageInput({ 
  message, 
  setMessage, 
  onKeyDown, 
  isDisabled 
}) {
  return (
    <textarea
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={isDisabled ? "Waiting for response..." : "Type your message..."}
      disabled={isDisabled}
      className={`w-full bg-transparent pl-24 pr-4 py-3 focus:outline-none text-text-light dark:text-text-dark resize-none ${isDisabled ? 'opacity-60' : ''}`}
      rows={1}
      style={{
        minHeight: '44px',
        maxHeight: '200px',
      }}
    />
  );
}