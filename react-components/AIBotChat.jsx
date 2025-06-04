// react-components/AIBotChat.jsx
import React, { useState, useEffect, useRef } from 'react';

function AIBotChat() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I can help you practice for your Studienkolleg exam. Ask me anything about German grammar, basic math, or the application process.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll to bottom whenever messages change

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare conversation history for the API (exclude system message if any)
      // OpenAI expects messages in the format: {role: "user" | "assistant", content: "..."}
      const historyToSend = messages.slice(1).map(msg => ({ // Skip initial AI greeting if it's not part of the actual conversation
        role: msg.role === 'ai' ? 'assistant' : 'user', // Map 'ai' to 'assistant' for OpenAI
        content: msg.content
      }));
      historyToSend.push({ role: 'user', content: userMessage.content }); // Add current user message


      const response = await fetch('http://localhost:5000/api/chat', { // <-- IMPORTANT: Flask backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: historyToSend // Send previous messages
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, { role: 'ai', content: data.response }]);

    } catch (error) {
      console.error('Error sending message to AI backend:', error);
      setMessages((prevMessages) => [...prevMessages, { role: 'ai', content: 'Sorry, I am having trouble connecting to the AI. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <section className="ai-practice">
      <h2>AI Practice Assistant</h2>
      <div className="ai-chat-container">
        <div className="ai-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`ai-message ${msg.role}`}>
              <p>{msg.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="ai-message ai loading-indicator">
              <p>AI is thinking...</p> {/* You can replace with a spinner */}
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Element to scroll to */}
        </div>
        <div className="ai-input">
          <input
            type="text"
            placeholder="Ask your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} disabled={isLoading}>
            Send
          </button>
        </div>
      </div>
    </section>
  );
}

export default AIBotChat;