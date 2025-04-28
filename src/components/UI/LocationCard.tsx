import React from 'react';
import { ShopLocation } from '../../types';

interface LocationCardProps {
  location: ShopLocation;
  onClick?: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onClick }) => {
  return (
    <div 
      className="border-b border-gray-200 py-3 last:border-b-0 cursor-pointer hover:bg-gray-50"
      onClick={onClick}
    >
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium">{location.name}</h3>
          <p className="text-sm text-gray-600">{location.address}</p>
          <p className="text-xs text-gray-500 mt-1">{location.type}</p>
        </div>
        {location.rating && (
          <div className="flex items-center text-sm">
            <span className="text-gray-500">({location.rating})</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationCard;