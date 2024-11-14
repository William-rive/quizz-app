import { Question } from '../model/question';

const fetchDatabase = async (): Promise<Question[]> => {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=10');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export default fetchDatabase;
