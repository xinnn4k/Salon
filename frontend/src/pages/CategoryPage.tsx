import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { FaArrowLeft } from 'react-icons/fa';

interface Subcategory {
  _id: string;
  name: string;
  description: string;
  image?: string;
}

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchSubcategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/api/categories/${id}`);

        if (!response.ok) {
          throw new Error('Category not found');
        }

        const data: Subcategory[] = await response.json();

        setSubcategories(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-screen-xl mx-auto px-4 py-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-md focus:outline-none"
          >
            {FaArrowLeft ({size: 15})}
            Буцах
          </button>

          <h1 className="text-3xl font-bold flex-grow text-center">Subcategories</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subcategories.length > 0 ? (
            subcategories.map((subcategory) => (
              <div
                key={subcategory._id}
                className="group relative overflow-hidden bg-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/subcategory/${subcategory._id}`)}
              >
                <div
                  className="w-full h-56 bg-cover bg-center"
                  style={{ 
                    backgroundImage: subcategory.image 
                      ? `url(${subcategory.image})` 
                      : 'none' 
                  }}
                ></div>

                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white">
                  <h3 className="text-lg font-semibold">{subcategory.name}</h3>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">No subcategories found</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;