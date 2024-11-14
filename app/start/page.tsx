'use client';
import React, { useState } from 'react';

const Start: React.FC = () => {
  const [category, setCategory] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');

  const handleStartQuiz = () => {
    console.log(`Category: ${category}, Difficulty: ${difficulty}`);
  };

  return (
    <div>
      <div>
        <label htmlFor="category">Choose a category:</label>
        <select
          id="category"
          value={category}
          onChange={e => setCategory(e.target.value)}>
          <option value="">Select a category</option>
          <option value="general">General Knowledge</option>
          <option value="science">Science</option>
          <option value="history">History</option>
        </select>
      </div>
      <div>
        <label htmlFor="difficulty">Choose a difficulty:</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}>
          <option value="">Select a difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <button onClick={handleStartQuiz}>Start Quiz</button>
    </div>
  );
};

export default Start;
