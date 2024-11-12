'use client';
import { useEffect, useState } from 'react';
import fetchDatabase from './lib/api';
import getCategories from './lib/filter';

export default function Page() {
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDatabase();
      setData(data);
    };

    setTimeout(() => {
      fetchData();
    }, 1000);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (data) {
        const categories = await getCategories();
        setCategories(categories);
      }
    };

    fetchCategories();
  }, [data]);

  return (
    <div>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
      {categories ? (
        <ul>
          {categories.map(category => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      ) : (
        <p>Loading categories...</p>
      )}
    </div>
  );

}
