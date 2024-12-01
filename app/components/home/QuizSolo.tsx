import React from 'react';
import RulesDialog from '../dialogs/RulesDialog';

interface SoloRulesProps {
  onOpenFilterDialog: () => void;
}

const SoloRules: React.FC<SoloRulesProps> = ({ onOpenFilterDialog }) => {
  return (
    <RulesDialog
      title="Quiz Solo"
      description="Le quiz est composé de 10 questions."
      contenu={
        <>
          <p>Vous avez 10 secondes pour répondre à chaque question.</p>
          <p>Les réponses correctes rapportent des points.</p>
          <p>Bonne chance !</p>
        </>
      }
      onConfirm={onOpenFilterDialog} // Ouvre le FilterDialog
    />
  );
};

export default SoloRules;
