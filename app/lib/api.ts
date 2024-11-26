import { Question } from '../model/question';

const CACHE_KEY = 'questions';
const CACHE_EXPIRATION_KEY = 'questions_expiration';
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 heure

const fetchDatabase = async (category: string, difficulty: string, limit: number = 10): Promise<Question[]> => {
  try {
    // Vérifie s'il y a des questions en cache
    const cachedQuestions = localStorage.getItem(CACHE_KEY);
    const cacheExpiration = localStorage.getItem(CACHE_EXPIRATION_KEY);

    if (cachedQuestions && cacheExpiration && Date.now() < parseInt(cacheExpiration, 10)) {
      return JSON.parse(cachedQuestions) as Question[];
    }

    // Construit l'URL avec les paramètres de catégorie et de difficulté
    let url = `https://quizzapi.jomoreschi.fr/api/v1/quiz?limit=${limit}`;
    if (category !== 'all') {
      url += `&category=${encodeURIComponent(category)}`;
    }
    if (difficulty !== 'all') {
      url += `&difficulty=${encodeURIComponent(difficulty)}`;
    }

    // Appelle l'API si le cache est invalide ou expiré
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Assurez-vous que data.quizzes existe et est un tableau
    if (!data.quizzes || !Array.isArray(data.quizzes)) {
      throw new Error('Invalid API response: Missing or malformed quizzes');
    }

    // Met en cache les questions et met à jour la date d'expiration
    localStorage.setItem(CACHE_KEY, JSON.stringify(data.quizzes));
    localStorage.setItem(CACHE_EXPIRATION_KEY, (Date.now() + CACHE_DURATION_MS).toString());

    return data.quizzes as Question[];
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export default fetchDatabase;