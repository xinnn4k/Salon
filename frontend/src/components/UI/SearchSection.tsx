import React, { useState } from 'react';
import Button from '../UI/Button';
import { Calendar, MapPin, Search, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchSectionProps {
  className?: string;
  fullWidth?: boolean;
  variant?: 'default' | 'card' | 'minimal';
}

const SearchSection: React.FC<SearchSectionProps> = ({ 
  className = '', 
  fullWidth = false,
  variant = 'default'
}) => {
  const [searchParams, setSearchParams] = useState({
    service: '',
    location: '',
    date: '',
    time: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    // Implementation for search functionality
    console.log('Search with params:', searchParams);
    // You can add navigation or API call here
  };

  const containerClasses = {
    default: 'bg-white rounded-xl p-3 shadow-lg',
    card: 'bg-white rounded-xl p-4 shadow-md border border-gray-100',
    minimal: 'bg-gray-50 rounded-lg p-3'
  };

  return (
    <section className={`py-8 ${fullWidth ? 'w-full' : 'max-w-screen-xl mx-auto'} ${className}`}>
      <div className="px-4">
        <div className={containerClasses[variant]}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="service"
                value={searchParams.service}
                onChange={handleInputChange}
                placeholder="Бүх үйлчилгээ, салон"
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-900"
              />
            </div>
            
            <div className="relative">
              {/* Location button with animated border */}
              <div className="relative group">
                {/* Animated border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-md opacity-75 group-hover:opacity-100 blur-sm group-hover:blur transition duration-1000 animate-spin-slow"></div>
                <button
                  type="button"
                  onClick={() => navigate('/map')}
                  className="relative w-full p-2 pl-10 bg-white border border-transparent rounded-md focus:ring-purple-500 focus:border-purple-500 text-left text-gray-900 flex items-center"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                  </div>
                  <span className="group-hover:text-purple-700 transition-colors">Байршил</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-gray-400" />
              </div>
              <input
                type="date"
                name="date"
                value={searchParams.date}
                onChange={handleInputChange}
                placeholder="Огноо"
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-900"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock size={18} className="text-gray-400" />
              </div>
              <input
                type="time"
                name="time"
                value={searchParams.time}
                onChange={handleInputChange}
                placeholder="Цаг"
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-900"
              />
            </div>
            
            <div className={`flex items-center ${variant === 'minimal' ? 'col-span-1' : 'md:col-span-4 lg:col-span-1'}`}>
              <Button 
                onClick={handleSearch}
                fullWidth 
                className="bg-purple-500 hover:bg-purple-700 text-white"
              >
                Хайх
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;