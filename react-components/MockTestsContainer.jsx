// react-components/MockTestsContainer.jsx
import React, { useState } from 'react';
import GermanLueckentest from './GermanLueckentest';
import MathTest from './MathTest';

function MockTestsContainer() {
  const [activeTest, setActiveTest] = useState('german'); // 'german' or 'math'

  return (
    <section className="mock-tests">
      <h2>Interactive Mock Tests</h2> {/* This H2 is now part of the React component */}
      <div className="test-selector">
        <button
          className={`test-btn ${activeTest === 'german' ? 'active' : ''}`}
          onClick={() => setActiveTest('german')}
        >
          German
        </button>
        <button
          className={`test-btn ${activeTest === 'math' ? 'active' : ''}`}
          onClick={() => setActiveTest('math')}
        >
          Mathematics
        </button>
      </div>

      <div className="test-interface"> {/* This div now dynamically holds the active test */}
        {activeTest === 'german' ? <GermanLueckentest /> : <MathTest />}
      </div>
    </section>
  );
}

export default MockTestsContainer;