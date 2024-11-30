// app/lib/userId.ts
import { nanoid } from 'nanoid';

export const getUserId = (): string => {
  if (typeof window === 'undefined') {
    return ''; // Retournez une valeur par défaut ou gérez en conséquence
  }

  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = nanoid();
    localStorage.setItem('userId', userId);
  }
  return userId;
};
