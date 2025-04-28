import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaThLarge, FaGripHorizontal } from 'react-icons/fa';
import BarberImage1 from '../../assets/barbershop.png';
import BarberImage2 from '../../assets/barbershop2.png';
import BeautySalon from '../../assets/beauty salon.png';
import EyeSalons from '../../assets/eye_salon.png';
import HairSalon from '../../assets/hair_salon.png';



const HorizontalCardList: React.FC = () => {
  const [isGridView, setIsGridView] = useState(false);
  const navigate = useNavigate();

  const cardData = [
    { id: 1, name: 'Barbershop One', rating: 4.5, location: 'Натур', type: 'Үсчин', imageUrl: BarberImage1 },
    { id: 2, name: 'Beauty Salon', rating: 4.2, location: 'Маршал таун', type: 'Гоо сайхан', imageUrl: BeautySalon },
    { id: 3, name: 'Hair Salon', rating: 4.8, location: 'Зайсан', type: 'Үсчин', imageUrl: HairSalon },
    { id: 4, name: 'Barbershop Two', rating: 4.3, location: 'Яармаг', type: 'Үсчин', imageUrl: BarberImage2 },
    { id: 5, name: 'Eyebrow Specialist', rating: 4.7, location: 'Жуков', type: 'Гоо сайхан', imageUrl: EyeSalons },
  ];

  const handleCardClick = (card: any) => {
    
      navigate( `/salon/${card.id}`);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Онцлох газрууд</h2>
        <button
          onClick={() => setIsGridView(!isGridView)}
          className="bg-purple-500 text-white py-2 px-4 rounded-lg focus:outline-none"
        >
          {isGridView ? FaThLarge({ size: 20 }) : FaGripHorizontal({ size: 20 })}
        </button>
      </div>

      <div className={isGridView ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "flex overflow-x-auto gap-6"}>
        {cardData.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex-none w-64 h-64 hover:shadow-2xl transition-shadow cursor-pointer"
            onClick={() => handleCardClick(card)}
          >
            <div
              className="w-full h-1/2 bg-cover bg-center rounded-t-lg"
              style={{ backgroundImage: `url(${card.imageUrl})` }}
            ></div>

            <div className="p-4 h-1/2">
              <h3 className="text-xl font-semibold text-gray-800">{card.name}</h3>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-yellow-500">⭐ {card.rating}</span>
                <span className="text-sm text-gray-500">{card.location}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{card.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalCardList;
