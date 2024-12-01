import { Question } from '../model/question';

export const fetchQuestions = async (
  category: string,
  difficulty: string,
  limit: number = 10,
): Promise<Question[]> => {
  try {
    // Construit l'URL avec les paramètres de catégorie et de difficulté
    let url = `https://quizzapi.jomoreschi.fr/api/v1/quiz?limit=${limit}`;
    if (category !== 'all') {
      url += `&category=${encodeURIComponent(category)}`;
    }
    if (difficulty !== 'all') {
      url += `&difficulty=${encodeURIComponent(difficulty)}`;
    }

    // Appelle l'API
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Ajoutez des logs pour vérifier la réponse de l'API
    console.log("Réponse brute de l'API :", data);

    // Vérifie que les données reçues contiennent un tableau de questions
    if (data.quizzes && Array.isArray(data.quizzes)) {
      return data.quizzes as Question[];
    } else {
      throw new Error('Invalid API response: Expected an array of questions');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
