'use client';
import Link from 'next/link';
import { useState } from 'react';

interface LoginFormProps {
  onLogin: (credentials: {
    username: string;
    password: string;
  }) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    // Appeler la fonction de connexion avec les informations d'identification
    await onLogin({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Nom d'utilisateur"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Mot de passe"
        required
      />
      <button type="submit">Se connecter</button>
      <button>
        <Link href="/create">Creer un compte</Link>
      </button>
    </form>
  );
};

export default LoginForm;
