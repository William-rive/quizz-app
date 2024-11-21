import { Question } from '../models/model';

const fetchDatabase = async (): Promise<Question[]> => {
  try {
    // Vérifie s'il y a des questions en cache
    const cachedQuestions = localStorage.getItem('questions');
    if (cachedQuestions) {
      return JSON.parse(cachedQuestions);
    }

    const response = await fetch('https://opentdb.com/api.php?amount=10');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    localStorage.setItem('questions', JSON.stringify(data.results)); // Cache les questions
    return data.results;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export default fetchDatabase;
