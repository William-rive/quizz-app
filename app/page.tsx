'use client';
import { useEffect, useState } from 'react';
import fetchDatabase from './lib/api';

export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDatabase();
      setData(data);
    };

    setTimeout(() => {
      fetchData();
    }, 1000);
  }, []);

  return (
    <div>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
}
