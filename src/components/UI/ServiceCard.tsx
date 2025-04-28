import React from 'react';
import { Service } from '../../types';
import Button from './Button';

interface ServiceCardProps {
  service: Service;
  onBookClick: (serviceId: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBookClick }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium">{service.name}</h3>
        <span className="text-gray-500">{service.duration}</span>
      </div>
      <div className="flex justify-between items-center mt-4">
        <p className="font-semibold">
          {service.priceFrom ? 'from ' : ''}{service.price}
        </p>
        <Button onClick={() => onBookClick(service.id)}>Book</Button>
      </div>
    </div>
  );
};

export default ServiceCard;