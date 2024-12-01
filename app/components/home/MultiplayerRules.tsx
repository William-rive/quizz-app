import RulesDialog from '../dialogs/RulesDialog';
import { useRouter } from 'next/navigation';

const MultiplayerRules: React.FC = () => {
  const router = useRouter();

  return (
    <RulesDialog
      title="Quiz Multijoueur"
      description="Affrontez vos amis dans un quiz interactif."
      contenu={
        <>
          <p>Chaque joueur doit répondre à une série de questions.</p>
          <p>Les réponses correctes rapportent des points.</p>
          <p>Le joueur avec le plus de points à la fin gagne.</p>
          <p>Bonne chance à tous !</p>
        </>
      }
      onConfirm={() => router.push('/multiplayer')}
    />
  );
};

export default MultiplayerRules;