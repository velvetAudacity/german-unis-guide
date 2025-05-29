// js/examPrepApp.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Use createRoot for React 18+
import MockTestsContainer from '../react-components/MockTestsContainer';
import AIBotChat from '../react-components/AIBotChat';

// 1. Render Mock Tests Container
const mockTestsRootElement = document.getElementById('mock-tests-root');
if (mockTestsRootElement) {
  const root = ReactDOM.createRoot(mockTestsRootElement);
  root.render(
    <React.StrictMode>
      <MockTestsContainer />
    </React.StrictMode>
  );
} else {
  console.warn("Element with ID 'mock-tests-root' not found. Mock Tests React app not mounted.");
}

// 2. Render AI Chat Bot
const aiChatRootElement = document.getElementById('ai-chat-root');
if (aiChatRootElement) {
  const root = ReactDOM.createRoot(aiChatRootElement);
  root.render(
    <React.StrictMode>
      <AIBotChat />
    </React.StrictMode>
  );
} else {
  console.warn("Element with ID 'ai-chat-root' not found. AI Chat React app not mounted.");
}