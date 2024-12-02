import Image from 'next/image';
import React from 'react';

const Images: React.FC = () => {
  return (
    <div className=" h-[30vh] flex items-center justify-center relative md:flex-auto">
      <Image
        src="/images/perso-1.png"
        alt="Quiz"
        width={200}
        height={200}
        className="max-w-60 top-8 absolute md:max-w-prose md:top-60 right-60"
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
        className="max-w-60 absolute bottom-0 left-64 md:max-w-prose md:left-44"
      />
    </div>
  );
};

export default Images;
