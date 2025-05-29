// react-components/AIBotChat.jsx
import React, { useState } from 'react';

function AIBotChat() {
  const [messages, setMessages] = useState([
    { type: 'ai', text: 'Hello! I can help you practice for your Studienkolleg exam. Ask me anything about German grammar, math problems, or the application process.' }
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const newUserMessage = { type: 'user', text: input.trim() };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput('');

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'ai', text: `You asked: "${newUserMessage.text}". I'm still learning, but I'll get back to you soon!` }
      ]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <section className="ai-practice">
      <h2>AI Practice Assistant</h2>
      <div className="ai-chat-container">
        <div className="ai-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`ai-message ${msg.type}`}>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
        <div className="ai-input">
          <input
            type="text"
            placeholder="Ask your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </section>
  );
}

export default AIBotChat;