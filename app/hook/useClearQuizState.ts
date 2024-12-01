// useClearQuizState.ts
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const useClearQuizState = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Effacer tous les quizStates du localStorage lorsqu'on est sur la page d'accueil
    if (pathname === '/') {  // Vérifie si on est sur la page d'accueil
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('quizState_')) {
          localStorage.removeItem(key);
          console.log(`QuizState ${key} supprimé du localStorage`);
        }
      }
    }
  }, [pathname]);  // Ce useEffect dépend du pathname (changement de route)
};

export default useClearQuizState;
