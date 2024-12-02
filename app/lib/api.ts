import { Question } from '../model/question';


interface Filters {
  category?: string;
  difficulty?: string;
  limit?: number;
}

const fetchDatabase = async (filters: Filters = {}): Promise<Question[]> => {
  try {
    // Construit l'URL avec les paramètres de catégorie et de difficulté
    let url = 'https://quizzapi.jomoreschi.fr/api/v1/quiz?';
    const params = new URLSearchParams();

    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }
    if (filters.category && filters.category !== 'all') {
      params.append('category', encodeURIComponent(filters.category));
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      params.append('difficulty', encodeURIComponent(filters.difficulty));
    }

    url += params.toString();

    // Appelle l'API
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Assurez-vous que data.quizzes existe et est un tableau
    if (!data.quizzes || !Array.isArray(data.quizzes)) {
      throw new Error('Invalid API response: Missing or malformed quizzes');
    }

    return data.quizzes as Question[];
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export default fetchDatabase;