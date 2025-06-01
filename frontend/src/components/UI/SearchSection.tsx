import React, { useState, useEffect } from 'react';
import Button from '../UI/Button';
import { MapPin, Search, Star, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchSectionProps {
  className?: string;
  fullWidth?: boolean;
  variant?: 'default' | 'card' | 'minimal';
}

interface Subcategory {
  _id: string;
  name: string;
  description?: string;
  image?: string; // Now it's a base64 string from backend
  categoryId?: string;
  categoryName?: string;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  className = '',
  fullWidth = false,
  variant = 'default'
}) => {
  const [searchParams, setSearchParams] = useState({ service: '' });
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const navigate = useNavigate();


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };



  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    
    try {
      const query = searchParams.service.trim();
      const endpoint = query 
        ? `http://localhost:4000/api/categories/subcategories/search?query=${encodeURIComponent(query)}`
        : 'http://localhost:4000/api/categories/subcategories';
      
      const res = await fetch(endpoint);
      const data = await res.json();

      if (Array.isArray(data)) {
        setSubcategories(data);
      } else {
        console.warn('Unexpected data format:', data);
        setSubcategories([]);
      }
    } catch (err) {
      console.error('Failed to search subcategories:', err);
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    // Navigate to subcategory page or handle selection
    console.log('Selected subcategory:', subcategory);
    
    // Example: Navigate to services filtered by this subcategory
    navigate(`/subcategory/${subcategory._id}`);
    
    // Or update search input with subcategory name
    // setSearchParams(prev => ({ ...prev, service: subcategory.name }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const containerClasses = {
    default: 'bg-white rounded-xl p-3 shadow-lg',
    card: 'bg-white rounded-xl p-4 shadow-md border border-gray-100',
    minimal: 'bg-gray-50 rounded-lg p-3'
  };

  const getResultsTitle = () => {
    if (!hasSearched) {
      return 'Бүх үйлчилгээний төрөл';
    }
    
    if (searchParams.service.trim()) {
      return `"${searchParams.service}" хайлтын үр дүн`;
    }
    
    return 'Үйлчилгээний төрөл';
  };

  return (
    <section className={`py-8 ${fullWidth ? 'w-full' : 'max-w-screen-xl mx-auto'} ${className}`}>
      <div className="px-4">
        {/* Search Inputs */}
        <div className={containerClasses[variant]}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="service"
                value={searchParams.service}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Үйлчилгээний төрөл хайх..."
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-900"
              />
            </div>

            <div className="relative group">
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

            <div className={`flex items-center ${variant === 'minimal' ? 'col-span-1' : 'md:col-span-4 lg:col-span-1'}`}>
              <Button
                onClick={handleSearch}
                fullWidth
                className="bg-purple-500 hover:bg-purple-700 text-white"
                disabled={loading}
              >
                {loading ? 'Хайж байна...' : 'Хайх'}
              </Button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-8">

          {/* Subcategories Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : subcategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {subcategories.map(subcategory => (
                <button
                  key={subcategory._id}
                  onClick={() => handleSubcategoryClick(subcategory)}
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 text-center transform hover:-translate-y-1"
                >
                  {/* Icon/Image */}
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
                    {subcategory.image ? (
                      <img 
                        src={subcategory.image}
                        alt={subcategory.name}
                        className="w-10 h-10 object-cover rounded-xl"
                      />
                    ) : (
                      <Tag className="w-8 h-8 text-purple-600 group-hover:text-purple-700 transition-colors" />
                    )}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors mb-2">
                    {subcategory.name}
                  </h3>
                  
                  {/* Category Badge */}
                  {subcategory.categoryName && (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mb-2">
                      {subcategory.categoryName}
                    </span>
                  )}
                  
                  {/* Description */}
                  {subcategory.description && (
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                      {subcategory.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
          ) : hasSearched ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Үр дүн олдсонгүй</h3>
              <p className="text-gray-600 mb-4">
                "{searchParams.service}" хайлтаар үр дүн олдсонгүй. Өөр түлхүүр үг ашиглан дахин хайж үзнэ үү.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default SearchSection;