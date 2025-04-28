import React from 'react';
import { Service } from '../../types';
import ServiceCard from '../UI/ServiceCard';

interface ServicesProps {
  services: Service[];
  onBookService: (serviceId: string) => void;
}

const Services: React.FC<ServicesProps> = ({ services, onBookService }) => {
  const categories = ['Hair Cut', 'Combination', 'Wet Shave', 'Beard Trimming', 'Others'];
  const [activeCategory, setActiveCategory] = React.useState(categories[0]);

  return (
    <div className="mb-8">
      <div className="flex overflow-x-auto space-x-4 mb-6 pb-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 whitespace-nowrap ${
              activeCategory === category
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="space-y-4">
        {services.map((service) => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            onBookClick={onBookService} 
          />
        ))}
      </div>
      
      {services.length > 2 && (
        <button className="w-full text-blue-600 mt-4 py-2">
          See all
        </button>
      )}
    </div>
  );
};

export default Services;