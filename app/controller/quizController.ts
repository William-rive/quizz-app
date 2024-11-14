import { NextApiRequest, NextApiResponse } from 'next';
import fetchDatabase from '../lib/api';
import { Question } from '../model/question';

export const getQuizQuestions = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const data = await fetchDatabase();

  if (data) {
    const questions: Question[] = data;
    res.status(200).json(questions);
  } else {
    res
      .status(500)
      .json({ message: 'Erreur lors de la récupération des questions.' });
  }
};
