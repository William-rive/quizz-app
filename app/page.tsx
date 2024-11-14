'use client';
import { useEffect, useState } from 'react';
import fetchDatabase from './lib/api';
import getCategories from './lib/filter';

export default function Page() {
  const [data, setData] = useState(null);
  interface Category {
    id: number;
    name: string;
  }

  const [categories, setCategories] = useState<Category[]>([]);

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
        console.log('cotegorie :', categories);
      }
    };

    fetchCategories();
  }, [data]);

  return (
    <div>
      {/* {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>} */}
      {categories.length > 0 ? (
        <div>
          <h1>Categories</h1>
          <ul>
            {categories.map(category => (
              <li key={category.id}>{category.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading categories...</p>
      )}
    </div>
  );
}
