import React from 'react';
import { Barber } from '../../types';

interface BarberCardProps {
  barber: Barber;
}

const BarberCard: React.FC<BarberCardProps> = ({ barber }) => {
  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-2">
        {barber.image ? (
          <img src={barber.image} alt={barber.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      <h3 className="font-medium">{barber.name}</h3>
      <p className="text-sm text-gray-500">{barber.role}</p>
    </div>
  );
};

export default BarberCard;