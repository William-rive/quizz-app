'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../components/ui/button';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row text-center gap-8">
      <div className="flex-1 w-full md:flex-auto md:w-1/2 xl:w-[50rem]">
        <h1 className="text-6xl">Bienvenue sur le quiz</h1>
        <span className="text-xl mt-5 text-primary">Testez vos limites : </span>
        <p className="text-xl text-center">
          plongez dans notre Quiz Interactif et hissez-vous au sommet du
          classement !
          <br />
          Êtes-vous prêt à relever le défi ?
        </p>
        <span className="text-xl mt-5 text-primary">Règles du jeu : </span>
        <p className="text-xl text-center">
          Le quiz est composé de 10 questions.
          <br />
          Vous avez 10 secondes pour répondre à chaque question.
          <br />
          Vous gagnez des points en fonction de la rapidité de votre réponse.
          <br />
          Bonne chance !
        </p>
        <Button className="mt-8">
          <Link href="/start">Quiz Solo</Link>
        </Button>
        <Button>
          <Link href="/join">Quiz Multijoueur</Link>
        </Button>
        <Button>
          <Link href="/multiplayer">Créer une salle</Link>
        </Button>
      </div>
      <div className=" h-[40vh] md:h-auto flex items-center justify-center relative md:flex-auto">
        <Image
          src="/images/perso-1.png"
          alt="Quiz"
          width={200}
          height={200}
          className="max-w-40 top-28 absolute md:max-w-prose md:top-60 right-60"
        />
        <Image
          src="/images/icon.png"
          alt="Quiz"
          width={200}
          height={200}
          className="max-w-32 md:max-w-prose z-10 transform md:-translate-x-16 md:translate-y-16"
        />
        <Image
          src="/images/perso-2.png"
          alt="Quiz"
          width={200}
          height={200}
          className=" max-w-40 absolute left-60 top-12 md:max-w-prose md:left-24 md:top-8"
        />
      </div>
    </div>
  );
};

export default Home;
