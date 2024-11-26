// auth.tsx
import axios from 'axios';
import { useEffect, useState } from 'react';

interface ProtectedData {
  id: number;
  name: string;
}

const ProtectedDataComponent = () => {
  const [data, setData] = useState<ProtectedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Token non disponible');
        return;
      }

      try {
        const response = await axios.get<ProtectedData>(
          'https://quizzapi.jomoreschi.fr/api/v1/protected-endpoint',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setData(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(
            'Erreur lors de la récupération des données : ' + err.message,
          );
        } else {
          setError('Erreur inconnue lors de la récupération des données.');
        }
      }
    };

    fetchProtectedData();
  }, []);

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  if (!data) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      {/* Affichez les données reçues ici */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ProtectedDataComponent;
