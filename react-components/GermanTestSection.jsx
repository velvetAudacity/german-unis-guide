// react-components/GermanTestSection.jsx
import React, { useState } from 'react';
import LueckentestExercise from './LueckentestExercise';
import ReadingExercise from './ReadingExercise';
import GrammarExercise from './GrammarExercise';

function GermanTestSection() {
  const [activeTopic, setActiveTopic] = useState('lueckentest'); // Default to Lückentest

  const renderActiveExercise = () => {
    switch (activeTopic) {
      case 'lueckentest':
        return <LueckentestExercise />;
      case 'reading':
        return <ReadingExercise />;
      case 'grammar':
        return <GrammarExercise />;
      default:
        return <LueckentestExercise />;
    }
  };

  return (
    <div>
      <h3>German Test</h3>
      <div className="test-selector"> {/* Reusing test-selector CSS */}
        <button
          className={`test-btn ${activeTopic === 'lueckentest' ? 'active' : ''}`}
          onClick={() => setActiveTopic('lueckentest')}
        >
          Lückentest
        </button>
        <button
          className={`test-btn ${activeTopic === 'reading' ? 'active' : ''}`}
          onClick={() => setActiveTopic('reading')}
        >
          Reading
        </button>
        <button
          className={`test-btn ${activeTopic === 'grammar' ? 'active' : ''}`}
          onClick={() => setActiveTopic('grammar')}
        >
          Grammar
        </button>
      </div>
      {renderActiveExercise()}
    </div>
  );
}

export default GermanTestSection;