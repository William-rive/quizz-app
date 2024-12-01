// app/lib/userId.ts
'use client';
import { nanoid } from 'nanoid';

export const getUserId = (): string => {
  if (typeof window !== 'undefined') {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = nanoid();
      localStorage.setItem('userId', userId);
    }
    return userId;
  } else {
    return ''; // Retournez une valeur par défaut ou gérez en conséquence pour le serveur
  }
};
