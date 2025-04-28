import React from 'react';
import { Barber } from '../../types';
import BarberCard from '../UI/BarberCard';

interface BarbersProps {
  barbers: Barber[];
}

const Barbers: React.FC<BarbersProps> = ({ barbers }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Team</h2>
      <div className="grid grid-cols-3 gap-2">
        {barbers.map((barber) => (
          <BarberCard key={barber.id} barber={barber} />
        ))}
      </div>
      {barbers.length > 3 && (
        <button className="w-full text-blue-600 mt-4 py-2">
          See all
        </button>
      )}
    </div>
  );
};

export default Barbers;