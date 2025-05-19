import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  icon: string;
}

const iconMap: { [key: string]: React.ElementType } = {
  scissors: require('lucide-react').Scissors,
  brush: require('lucide-react').Brush,
  nail: require('lucide-react').Sparkles,
};

const CategoryDisplay: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/categories');
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Ангилал</h2>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="ml-2">Loading...</span>
          </div>
        ) : error ? (
          <p className="text-red-500">Failed to load: {error}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = iconMap[category.icon] || require('lucide-react').Scissors;
              return (
                <Link
                  key={category._id}
                  to={`/category/${category._id}`}
                  state={{ name: category.name }}
                  className="block p-4 border rounded-lg hover:shadow-lg transition-shadow text-center"
                >
                  <Icon className="text-purple-500 text-3xl mx-auto mb-2" />
                  <span className="text-sm font-medium">{category.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryDisplay;
