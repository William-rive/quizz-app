'use client';
import axios from 'axios';
import LoginForm from '../components/LoginForm';

const App = () => {
  const handleLogin = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await axios.post(
        'https://quizzapi.jomoreschi.fr/auth/login',
        {
          username,
          password,
        },
      );
      const { token } = response.data;
      // Stocker le token pour une utilisation ultérieure
      localStorage.setItem('authToken', token);
      alert('Connexion réussie !');
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      alert(
        "Échec de la connexion. Veuillez vérifier vos informations d'identification.",
      );
    }
  };

  return (
    <div>
      <h1>Page de connexion</h1>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default App;
