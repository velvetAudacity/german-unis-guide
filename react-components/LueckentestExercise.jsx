// react-components/GermanLueckentest.jsx
import React, { useState } from 'react';

function GermanLueckentest() {
  const sentenceParts = [
    "Die Stadt,",
    "ich wohne, ist sehr schön.",
    "Sommer gibt es viele Touristen,",
    "das Wetter meistens gut ist."
  ];
  const blanks = [
    { id: 0, correctAnswer: 'in der', placeholder: 'e.g., in der' },
    { id: 1, correctAnswer: 'Im', placeholder: 'e.g., Im' },
    { id: 2, correctAnswer: 'weil', placeholder: 'e.g., weil' }
  ];

  const [userAnswers, setUserAnswers] = useState(blanks.map(() => ''));
  const [feedback, setFeedback] = useState(blanks.map(() => ''));
  const [overallMessage, setOverallMessage] = useState('');
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);

  const handleChange = (e, index) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = e.target.value;
    setUserAnswers(newAnswers);
    // Clear feedback when user starts typing again
    const newFeedback = [...feedback];
    newFeedback[index] = '';
    setFeedback(newFeedback);
    setOverallMessage('');
    setShowCorrectAnswers(false);
  };

  const checkAnswers = () => {
    let allCorrect = true;
    const newFeedback = userAnswers.map((answer, index) => {
      if (answer.toLowerCase().trim() === blanks[index].correctAnswer.toLowerCase().trim()) {
        return 'correct';
      } else {
        allCorrect = false;
        return 'incorrect';
      }
    });
    setFeedback(newFeedback);
    setShowCorrectAnswers(true); // Show correct answers after check

    if (allCorrect) {
      setOverallMessage('All answers are correct! Well done!');
    } else {
      setOverallMessage('Some answers are incorrect. Please review and try again.');
    }
  };

  return (
    <div>
      <h3>German Lückentest Practice</h3>
      <div className="test-content">
        <p>Fill in the blanks with the correct words:</p>
        <div className="cloze-test">
          <p>
            {sentenceParts[0]}
            <input
              type="text"
              value={userAnswers[0]}
              onChange={(e) => handleChange(e, 0)}
              className={feedback[0]}
              placeholder={blanks[0].placeholder}
            />
            {sentenceParts[1]}
            <input
              type="text"
              value={userAnswers[1]}
              onChange={(e) => handleChange(e, 1)}
              className={feedback[1]}
              placeholder={blanks[1].placeholder}
            />
            {sentenceParts[2]}
            <input
              type="text"
              value={userAnswers[2]}
              onChange={(e) => handleChange(e, 2)}
              className={feedback[2]}
              placeholder={blanks[2].placeholder}
            />
            {sentenceParts[3]}
          </p>
          {showCorrectAnswers && (
            <div className="correct-answers-display">
              <p>Correct answers: {blanks.map(b => b.correctAnswer).join(', ')}</p>
            </div>
          )}
        </div>
        <button className="check-answers" onClick={checkAnswers}>Check Answers</button>
        {overallMessage && (
            <p className={`overall-message ${overallMessage.includes('correct') ? 'correct' : 'incorrect'}`}>
                {overallMessage}
            </p>
        )}
      </div>
    </div>
  );
}

export default GermanLueckentest;