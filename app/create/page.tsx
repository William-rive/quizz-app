'use client';
import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';

const CreateAccount: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'https://quizzapi.jomoreschi.fr/auth/register',
        {
          username,
          password,
        },
      );
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      alert('Compte créé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création du compte :', error);
      alert('Échec de la création du compte. Veuillez réessayer.');
    }
  };

  return (
    <div>
      <h1>Créer un compte</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Nom d&apos;utilisateur :</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Créer le compte</button>
      </form>
      <button>
        <Link href="/auth">Se connecter</Link>
      </button>
    </div>
  );
};

export default CreateAccount;
