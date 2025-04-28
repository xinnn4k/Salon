import { useNavigate, useParams } from 'react-router-dom';
import React, { useState } from 'react';
import BarberImage1 from '../../assets/barbershop.png';
import BarberImage2 from '../../assets/barbershop2.png';
import BeautySalon from '../../assets/beauty salon.png';
import EyeSalons from '../../assets/eye_salon.png';
import HairSalon from '../../assets/hair_salon.png';

interface PaginationCardListProps {}

const PaginationCardList: React.FC<PaginationCardListProps> = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { subcategoryId } = useParams<{ subcategoryId: string }>();
  const itemsPerPage = 6;

  const cardData = [
    { id: 1, name: 'Barbershop One', rating: 4.5, location: 'Натур', type: 'Үсчин', imageUrl: BarberImage1 },
    { id: 2, name: 'Beauty Salon', rating: 4.2, location: 'Маршал таун', type: 'Гоо сайхан', imageUrl: BeautySalon },
    { id: 3, name: 'Hair Salon', rating: 4.8, location: 'Зайсан', type: 'Үсчин', imageUrl: HairSalon },
    { id: 4, name: 'Barbershop Two', rating: 4.3, location: 'Яармаг', type: 'Үсчин', imageUrl: BarberImage2 },
    { id: 5, name: 'Eyebrow Specialist', rating: 4.7, location: 'Жуков', type: 'Гоо сайхан', imageUrl: EyeSalons },
    { id: 6, name: 'New Haircut', rating: 4.6, location: 'Баянмонгол', type: 'Үсчин', imageUrl: BarberImage1 },
    { id: 7, name: 'Luxury Spa', rating: 4.9, location: 'Төв цэнгэлдэх', type: 'Гоо сайхан', imageUrl: BeautySalon },
  ];

  // Define services for each salon - in a real app, you would fetch this from an API
  const serviceData = {
    1: [
      { id: 1, name: "Haircut", duration: "30 min", price: "25,000₮" },
      { id: 2, name: "Hair Styling", duration: "45 min", price: "35,000₮" },
      { id: 3, name: "Beard Trim", duration: "15 min", price: "15,000₮" }
    ],
    2: [
      { id: 1, name: "Facial", duration: "30 min", price: "40,000₮" },
      { id: 2, name: "Manicure", duration: "40 min", price: "30,000₮" },
      { id: 3, name: "Pedicure", duration: "50 min", price: "35,000₮" }
    ],
    // Add more for other salons as needed
  };

  const totalPages = Math.ceil(cardData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentCards = cardData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCardClick = (card: any) => {
    
    const baseUrl = `/salon/${card.id}`;
    
    if (subcategoryId) {
      const serviceId = serviceData[card.id as keyof typeof serviceData]?.[0]?.id || 1;
      navigate(`${baseUrl}/services/${serviceId}`);
    } else {
      navigate(baseUrl);
    }
  };
  
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Дараах газруудаас сонгоод захиалгаа хийгээрэй!</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentCards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer"
            onClick={() => handleCardClick(card)}
          >
            <div
              className="h-40 bg-cover bg-center"
              style={{ backgroundImage: `url(${card.imageUrl})` }}
            ></div>

            <div className="p-4">
              <h3 className="text-lg font-semibold">{card.name}</h3>
              <div className="flex items-center space-x-2 mt-2 text-gray-500 text-sm">
                <span>⭐ {card.rating}</span>
                <span>{card.location}</span>
              </div>
              <p className="mt-2 text-gray-600">{card.type}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 rounded-full ${
              currentPage === page
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-purple-100'
            } font-semibold transition`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaginationCardList;