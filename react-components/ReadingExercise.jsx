import React from 'react';

function ReadingExercise(){
    return(
        <div>
            <h3>Reading Comprehension</h3>
            <div className='test-content'> 
                   <p>This is a placeholder for a German reading comprehension exercise. You can add a text passage here and then questions (multiple choice, short answer).</p>
                <p>Example: Read the text and answer the questions below.</p>
                <button className='check-answers' disabled>Check Answers</button>
            </div>
        </div>
    );
}

export default ReadingExercise;

