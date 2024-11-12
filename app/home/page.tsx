import Link from 'next/link';
import { Button } from '../components/ui/button';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <h1 className="text-3xl">Bienvenue sur le quiz</h1>
      <span className="text-xl mt-5 text-primary">Testez vos limites : </span>
      <p className="text-xl text-center">
        plongez dans notre Quiz Interactif et hissez-vous au sommet du
        classement !
        <br />
        Êtes-vous prêt à relever le défi ?
      </p>
      <Button className="mt-8">
        <Link href="/start"> Start Quiz</Link>
      </Button>
    </div>
  );
};

export default Home;
