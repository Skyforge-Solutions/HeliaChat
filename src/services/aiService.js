/**
 * Simple mock AI response service
 * In a real app, this would call an actual AI API
 */
export const getAIResponse = message => {
  const responses = [
    "I'm Helia, your helpful AI assistant. How can I help you today?",
    "That's an interesting question! Let me think about that for a moment...",
    "I understand what you're asking. Here's what I think about that...",
    'Thanks for sharing that with me. Would you like to know more?',
    "I'm designed to be helpful, harmless, and honest in my responses.",
    "I don't have personal opinions, but I can provide information on that topic.",
  ];

  if (
    message.toLowerCase().includes('hello') ||
    message.toLowerCase().includes('hi')
  ) {
    return 'Hello! How can I assist you today?';
  } else if (message.toLowerCase().includes('help')) {
    return "I'm here to help! Ask me anything and I'll do my best to assist you.";
  } else if (message.toLowerCase().includes('thank')) {
    return "You're welcome! Is there anything else you'd like to know?";
  } else if (message.toLowerCase().includes('image')) {
    return "I see you're interested in images. I can now process and discuss images that you upload.";
  }

  return responses[Math.floor(Math.random() * responses.length)];
};
