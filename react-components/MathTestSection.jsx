// react-components/MathTestSection.jsx
import React, { useState } from 'react';
import AlgebraExercise from './AlgebraExercise';
import GeometryExercise from './GeometryExercise';
import FunctionsExercise from './FunctionsExercise';

function MathTestSection() {
  const [activeTopic, setActiveTopic] = useState('algebra'); // Default to Algebra

  const renderActiveExercise = () => {
    switch (activeTopic) {
      case 'algebra':
        return <AlgebraExercise />;
      case 'geometry':
        return <GeometryExercise />;
      case 'functions':
        return <FunctionsExercise />;
      default:
        return <AlgebraExercise />;
    }
  };

  return (
    <div>
      <h3>Mathematics Test</h3>
      <div className="test-selector"> {/* Reusing test-selector CSS */}
        <button
          className={`test-btn ${activeTopic === 'algebra' ? 'active' : ''}`}
          onClick={() => setActiveTopic('algebra')}
        >
          Algebra
        </button>
        <button
          className={`test-btn ${activeTopic === 'geometry' ? 'active' : ''}`}
          onClick={() => setActiveTopic('geometry')}
        >
          Geometry
        </button>
        <button
          className={`test-btn ${activeTopic === 'functions' ? 'active' : ''}`}
          onClick={() => setActiveTopic('functions')}
        >
          Functions
        </button>
      </div>
      {renderActiveExercise()}
    </div>
  );
}

export default MathTestSection;
