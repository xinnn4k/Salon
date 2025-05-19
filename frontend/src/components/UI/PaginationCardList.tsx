
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Salon {
  _id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  image?: string;
  [key: string]: any;
}

interface PaginationCardListProps {
  items: Salon[];
}

const PaginationCardList: React.FC<PaginationCardListProps> = ({ items }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { subcategoryId } = useParams<{ subcategoryId: string }>();
  const itemsPerPage = 6;

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentCards = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCardClick = (card: Salon) => {
    if (subcategoryId) {
      navigate(`/salon/${card._id}`);
    } 
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Дараах газруудаас сонгоод захиалгаа хийгээрэй!</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentCards.map((card) => (
          <div
            key={card._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer"
            onClick={() => handleCardClick(card)}
          >
            <div
              className="h-40 bg-cover bg-center"
              style={{ backgroundImage: `url(${card.image || '/default-salon-image.jpg'})` }}
            ></div>

            <div className="p-4">
              <h3 className="text-lg font-semibold">{card.name}</h3>
              <div className="flex items-center space-x-2 mt-2 text-gray-500 text-sm">
                <span>⭐</span>
                <span>{card.location}</span>
              </div>
              <p className="mt-2 text-gray-600">{card.phone}</p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
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
      )}
    </div>
  );
};

export default PaginationCardList;