// react-components/MathTest.jsx
import React, { useState } from 'react';

function MathTest() {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const checkSolution = () => {
    // Example problem: 3(x + 5) = 2x + 20  => 3x + 15 = 2x + 20 => x = 5
    if (answer.trim() === '5') {
      setFeedback('Correct! x = 5');
    } else {
      setFeedback('Incorrect. Try again!');
    }
  };

  return (
    <div>
      <h3>Mathematics Problems</h3>
      <div className="test-content">
        <div className="math-problem">
          <p>Solve for x: 3(x + 5) = 2x + 20</p>
          <input type="text" placeholder="Your answer" value={answer} onChange={(e) => {setAnswer(e.target.value); setFeedback('');}} />
        </div>
        <button className="check-answers" onClick={checkSolution}>Check Solution</button>
        {feedback && <p className="math-feedback">{feedback}</p>}
      </div>
    </div>
  );
}

export default MathTest;