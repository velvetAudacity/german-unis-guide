// react-components/LueckentestExercise.jsx
import React, { useState, useEffect } from 'react';

function LueckentestExercise() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [overallMessage, setOverallMessage] = useState('');
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch a new question
  const fetchQuestion = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentQuestion(null);
    setUserAnswers([]);
    setFeedback([]);
    setOverallMessage('');
    setShowCorrectAnswers(false);

    try {
      // Adjust the URL to your Flask backend and specify the test type and topic
      const response = await fetch('http://localhost:5000/api/questions?test_type=german&topic=lueckentest&limit=1');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.length > 0) {
        setCurrentQuestion(data[0]);
        // Initialize userAnswers based on the number of expected blanks (from correct_answers length)
        setUserAnswers(Array(data[0].correct_answers.length).fill(''));
        setFeedback(Array(data[0].correct_answers.length).fill(''));
      } else {
        setError('No questions found for this topic.');
      }
    } catch (err) {
      console.error("Failed to fetch question:", err);
      setError('Failed to load question. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion(); // Fetch question on component mount
  }, []); // Empty dependency array means it runs once on mount

  const handleChange = (e, index) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = e.target.value;
    setUserAnswers(newAnswers);
    const newFeedback = [...feedback];
    newFeedback[index] = ''; // Clear feedback when user types
    setFeedback(newFeedback);
    setOverallMessage('');
    setShowCorrectAnswers(false);
  };

  const checkAnswers = () => {
    if (!currentQuestion) return;

    let allCorrect = true;
    const newFeedback = userAnswers.map((answer, index) => {
      const correctAnswer = currentQuestion.correct_answers[index];
      if (answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
        return 'correct';
      } else {
        allCorrect = false;
        return 'incorrect';
      }
    });
    setFeedback(newFeedback);
    setShowCorrectAnswers(true);

    if (allCorrect) {
      setOverallMessage('All answers are correct! Well done!');
    } else {
      setOverallMessage('Some answers are incorrect. Please review and try again.');
    }
  };

  const resetExercise = () => {
    fetchQuestion(); // Fetch a new question (or just reset current one if you prefer)
  };

  if (isLoading) {
    return <div className="test-content"><p>Loading Lückentest exercise...</p></div>;
  }

  if (error) {
    return <div className="test-content"><p style={{color: 'red'}}>Error: {error}</p></div>;
  }

  if (!currentQuestion) {
      return <div className="test-content"><p>No Lückentest questions available.</p></div>;
  }

  // Split question text into parts for rendering blanks
  const questionParts = currentQuestion.question_text.split(/\{(\d+)\}/g);
  // Example: "Text {0} more {1}" -> ["Text ", "0", " more ", "1", ""]
  // We only care about the text parts and the blank indices

  return (
    <div>
      <h3>Lückentest (Gap Text)</h3>
      <div className="test-content">
        <p>Fill in the blanks with the correct words:</p>
        <div className="cloze-test">
          <p>
            {questionParts.map((part, index) => {
              if (index % 2 === 1) { // This is a blank index from the split
                const blankIndex = parseInt(part); // Get the number from {0}, {1}
                return (
                  <input
                    key={blankIndex}
                    type="text"
                    value={userAnswers[blankIndex] || ''}
                    onChange={(e) => handleChange(e, blankIndex)}
                    className={feedback[blankIndex]}
                    placeholder={`e.g., ${currentQuestion.correct_answers[blankIndex] || 'answer'}`}
                  />
                );
              }
              return <span key={index}>{part}</span>; // This is a text part
            })}
          </p>
          {showCorrectAnswers && (
            <div className="correct-answers-display">
              <p>Correct answers: {currentQuestion.correct_answers.join(', ')}</p>
            </div>
          )}
        </div>
        <button className="check-answers" onClick={checkAnswers}>Check Answers</button>
        <button className="reset-exercise" onClick={resetExercise} style={{marginLeft: '10px'}}>Next Question</button> {/* Changed to Next Question */}
        {overallMessage && (
            <p className={`overall-message ${overallMessage.includes('correct') ? 'correct' : 'incorrect'}`}>
                {overallMessage}
            </p>
        )}
      </div>
    </div>
  );
}

export default LueckentestExercise;