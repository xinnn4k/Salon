import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useCategories } from '../hooks/useCategories';
import { FaArrowLeft } from 'react-icons/fa'; // Import the left arrow icon

const CategoryPage: React.FC = () => {
  const { id } = useParams();
  const categories = useCategories();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentCategory = categories.find(category => category.id === id);
  
  if (!currentCategory) {
    return <div>Category not found</div>;
  }

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 transform  shadow-md focus:outline-none"
          >
            {FaArrowLeft({ size: 15 })}
            Буцах
          </button>
          
          <h1 className="text-3xl font-bold flex-grow text-center">{currentCategory.name}</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentCategory.subcategories.map(subcategory => (
            <div
              key={subcategory.id}
              className="group relative overflow-hidden bg-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
              onClick={() => navigate(`/subcategory/${subcategory.id}`)}
            >
              <div
                className="w-full h-56 bg-cover bg-center"
                style={{ backgroundImage: `url(${subcategory.imageUrl})` }}
              ></div>

              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white">
                <h3 className="text-lg font-semibold">{subcategory.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;