// react-components/AlgebraExercise.jsx
import React, { useState, useEffect } from 'react';

function AlgebraExercise() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [overallMessage, setOverallMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestion = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentQuestion(null);
    setUserAnswer('');
    setFeedback('');
    setOverallMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/questions?test_type=math&topic=algebra&limit=1');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.length > 0) {
        setCurrentQuestion(data[0]);
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
    fetchQuestion();
  }, []);

  const checkSolution = () => {
    if (!currentQuestion) return;
    const correctAnswer = currentQuestion.correct_answers[0]; // Assuming one correct answer for algebra

    if (userAnswer.trim() === correctAnswer) {
      setFeedback('correct');
      setOverallMessage(`Correct! The answer is ${correctAnswer}`);
    } else {
      setFeedback('incorrect');
      setOverallMessage('Incorrect. Try again!');
    }
  };

  const resetExercise = () => {
    fetchQuestion(); // Fetch a new question
  };

  if (isLoading) {
    return <div className="test-content"><p>Loading Algebra exercise...</p></div>;
  }

  if (error) {
    return <div className="test-content"><p style={{color: 'red'}}>Error: {error}</p></div>;
  }

  if (!currentQuestion) {
      return <div className="test-content"><p>No Algebra questions available.</p></div>;
  }

  return (
    <div>
      <h3>Algebra Problems</h3>
      <div className="test-content">
        <div className="math-problem">
          <p>{currentQuestion.question_text}</p>
          <input
            type="text"
            placeholder="Your answer"
            value={userAnswer}
            onChange={(e) => {
              setUserAnswer(e.target.value);
              setFeedback('');
              setOverallMessage('');
            }}
            className={feedback}
          />
        </div>
        <button className="check-answers" onClick={checkSolution}>Check Solution</button>
        <button className="reset-exercise" onClick={resetExercise} style={{marginLeft: '10px'}}>Next Question</button>
        {overallMessage && (
            <p className={`overall-message ${overallMessage.includes('Correct') ? 'correct' : 'incorrect'}`}>
                {overallMessage}
            </p>
        )}
      </div>
    </div>
  );
}

export default AlgebraExercise;