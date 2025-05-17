import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaThLarge, FaGripHorizontal } from 'react-icons/fa';

interface Salon {
  _id: string;
  name: string;
  location: string;
  phone: string;
  image?: string;
}

const HorizontalCardList: React.FC = () => {
  const [isGridView, setIsGridView] = useState<boolean>(false);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalons = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/salons');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data: Salon[] = await response.json();
        setSalons(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching salon data:', err);
        setError('Failed to load salons. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, []);

  const handleCardClick = (salon: Salon): void => {
    navigate(`/salon/${salon._id}`);
  };

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading salons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Онцлох газрууд</h2>
        <button
          onClick={() => setIsGridView(!isGridView)}
          className="bg-purple-500 text-white py-2 px-4 rounded-lg focus:outline-none"
        >
          {isGridView ? FaThLarge({size:20}) : FaGripHorizontal ({size:20}) }
        </button>
      </div>

      <div className={isGridView ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "flex overflow-x-auto gap-6"}>
        {salons.length > 0 ? (
          salons.map((salon) => (
            <div
              key={salon._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex-none w-64 h-64 hover:shadow-2xl transition-shadow cursor-pointer"
              onClick={() => handleCardClick(salon)}
            >
              <div
                className="w-full h-1/2 bg-cover bg-center rounded-t-lg"
                style={{ backgroundImage: `url(${salon.image || '/placeholder-salon.jpg'})` }}
              ></div>

              <div className="p-4 h-1/2">
                <h3 className="text-xl font-semibold text-gray-800">{salon.name}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-sm text-gray-500">{salon.location}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{salon.phone}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full text-center py-8">
            <p className="text-gray-500">No salons found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HorizontalCardList;
