import React, { useEffect, useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import '../hooks/fixLeafletIcon';
import { Search, Phone, Mail, MapPin, List, X, Layers, ChevronDown, Star, Clock } from 'lucide-react';
import Button from '../components/UI/Button';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

type Salon = {
  _id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  image?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  rating?: number; // Optional rating field
};

// Custom hook for responsive design
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Component to fly to a specific location
const FlyToMarker = ({ salon }: { salon: Salon | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (salon) {
      map.flyTo(
        [salon.coordinates.latitude, salon.coordinates.longitude],
        15,
        { duration: 1.5 }
      );
    }
  }, [salon, map]);
  
  return null;
};

const SalonMap: React.FC = () => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredSalons, setFilteredSalons] = useState<Salon[]>([]);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [mapLayer, setMapLayer] = useState<string>('basic');
  const [showLayerOptions, setShowLayerOptions] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 768;
  
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const layers = {
    basic: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  };

  useEffect(() => {
    const fetchSalons = async () => {
      setLoading(true);
      try {
        const res = await axios.get<Salon[]>('http://localhost:4000/api/salons');
        const validSalons = res.data.filter(salon => 
          salon.coordinates && 
          salon.coordinates.latitude && 
          salon.coordinates.longitude
        );
        
        // Add mock ratings for demo purpose
        const salonsWithRatings = validSalons.map(salon => ({
          ...salon,
          rating: Math.floor(Math.random() * 5) + 1
        }));
        
        setSalons(salonsWithRatings);
        setFilteredSalons(salonsWithRatings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching salons:', error);
        setError('Failed to load salon data. Please try again later.');
        setLoading(false);
      }
    };

    fetchSalons();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSalons(salons);
      return;
    }

    const filtered = salons.filter(salon => 
      salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salon.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSalons(filtered);
  }, [searchQuery, salons]);

  useEffect(() => {
    if (isMobile && showSidebar) {
      setShowSidebar(false);
    }
  }, [isMobile]);

  // Generate stars for ratings
  const renderRatingStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={`${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };


  const defaultCenter = useMemo(() => {
    if (filteredSalons.length > 0) {
      return [
        filteredSalons[0].coordinates.latitude,
        filteredSalons[0].coordinates.longitude
      ];
    }
    return [47.918873, 106.917701]; // Default center
  }, [filteredSalons]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4 mx-auto"></div>
            <p className="text-gray-600 font-medium">Loading salon data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <div className="text-red-500 text-5xl mb-4">!</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const selectSalon = (salon: Salon) => {
    setSelectedSalon(salon);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  return (
    <Layout>
      <div className="relative h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-md p-4 z-10">
          <div className="max-w-screen-xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-purple-800">Find Your Perfect Salon</h1>
            {isMobile && (
              <button 
                onClick={toggleSidebar} 
                className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200"
              >
                {showSidebar ? <X size={20} /> : <List size={20} />}
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div 
            className={`${
              showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            } transform transition-transform duration-300 ease-in-out md:relative fixed left-0 top-0 md:top-auto h-full z-30 md:z-0 w-full md:w-96 bg-white shadow-lg md:shadow overflow-hidden flex flex-col`}
            style={{ marginTop: isMobile ? "4rem" : "0" }}
          >
            {/* Search Bar */}
            <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-500">
              <h2 className="text-white font-medium mb-3">Search for Salons</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by salon name or location..."
                  className="w-full p-3 pl-10 rounded-lg text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3 text-gray-500" size={20} />
              </div>
              <p className="mt-2 text-white/80 text-sm">Found {filteredSalons.length} salon{filteredSalons.length !== 1 ? 's' : ''}</p>
            </div>

            {/* Salon List */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {filteredSalons.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Search size={36} className="mx-auto mb-2 text-gray-400" />
                  <p className="font-medium">No salons found.</p>
                  <p className="text-sm mt-1">Try adjusting your search criteria.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {filteredSalons.map((salon) => (
                    <li 
                      key={salon._id} 
                      className={`p-4 hover:bg-purple-50 cursor-pointer transition-colors ${
                        selectedSalon?._id === salon._id ? 'bg-purple-100' : ''
                      }`}
                      onClick={() => selectSalon(salon)}
                    >
                      <div className="flex space-x-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                          {salon.image ? (
                            <img 
                              src={salon.image} 
                              alt={salon.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
                              <span className="text-purple-600 font-bold text-lg">
                                {salon.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{salon.name}</h3>
                          <div className="flex items-center mb-1 mt-1">
                            {salon.rating && renderRatingStars(salon.rating)}
                          </div>
                          <div className="flex items-start text-sm text-gray-500">
                            <MapPin size={14} className="mr-1 mt-0.5 flex-shrink-0 text-gray-400" />
                            <span className="truncate">{salon.location}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Mobile Close Button */}
            {isMobile && showSidebar && (
              <div className="p-4 bg-white border-t">
                <button 
                  onClick={toggleSidebar}
                  className="w-full py-2 flex items-center justify-center text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  <X size={18} className="mr-2" />
                  Close
                </button>
              </div>
            )}
          </div>

          {/* Map Container */}
          <div className="flex-1 relative" ref={mapContainerRef}>
            <MapContainer 
              center={defaultCenter as [number, number]} 
              zoom={12} 
              style={{ height: '100%', width: '100%' }}
              className="z-0"
              zoomControl={false}
            >
              <TileLayer
                url={layers[mapLayer as keyof typeof layers]}
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              />
              {filteredSalons.map((salon) => (
                <Marker
                  key={salon._id}
                  position={[salon.coordinates.latitude, salon.coordinates.longitude]}
                  eventHandlers={{
                    click: () => {
                      setSelectedSalon(salon);
                    }
                  }}
                >
                  <Popup className="salon-popup">
                    <div className="w-64">
                      <div className="h-32 bg-gray-200 rounded-t-md overflow-hidden">
                        {salon.image ? (
                          <img
                            src={salon.image}
                            alt={salon.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
                            <span className="text-purple-600 font-bold text-2xl">
                              {salon.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-bold text-lg mb-1">{salon.name}</h3>
                        
                        {salon.rating && (
                          <div className="flex mb-2">
                            {renderRatingStars(salon.rating)}
                          </div>
                        )}
                        
                        <div className="mb-1 flex items-start">
                          <MapPin size={16} className="text-purple-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{salon.location}</span>
                        </div>
                        <div className="mb-1 flex items-start">
                          <Phone size={16} className="text-purple-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{salon.phone}</span>
                        </div>
                        <div className="mb-1 flex items-start">
                          <Mail size={16} className="text-purple-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{salon.email}</span>
                        </div>
                        <div className="mb-3 flex items-start">
                          <Clock size={16} className="text-purple-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">Open: 9:00 - 19:00</span>
                        </div>
                        
                        <Button 
                          className="w-full text-center"
                          onClick={() => navigate(`/salon/${salon._id}`)}
                        >
                          Book Appointment
                        </Button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {selectedSalon && <FlyToMarker salon={selectedSalon} />}
            </MapContainer>
            
            {/* Map Controls */}
            <div className="absolute right-4 top-4 z-10 flex flex-col space-y-2">
              {/* Layer Selector */}
              <div className="relative">
                <button 
                  className="bg-white rounded-md shadow-md p-2 hover:bg-gray-50 flex items-center"
                  onClick={() => setShowLayerOptions(!showLayerOptions)}
                >
                  <Layers size={20} className="text-gray-700" />
                  <ChevronDown size={16} className="ml-1 text-gray-500" />
                </button>
                
                {showLayerOptions && (
                  <div className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-md overflow-hidden w-40 z-50">
                    <ul>
                      <li 
                        className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${mapLayer === 'basic' ? 'bg-purple-100' : ''}`}
                        onClick={() => {
                          setMapLayer('basic');
                          setShowLayerOptions(false);
                        }}
                      >
                        Standard Map
                      </li>
                      <li 
                        className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${mapLayer === 'satellite' ? 'bg-purple-100' : ''}`}
                        onClick={() => {
                          setMapLayer('satellite');
                          setShowLayerOptions(false);
                        }}
                      >
                        Satellite
                      </li>
                      <li 
                        className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${mapLayer === 'light' ? 'bg-purple-100' : ''}`}
                        onClick={() => {
                          setMapLayer('light');
                          setShowLayerOptions(false);
                        }}
                      >
                        Light Mode
                      </li>
                      <li 
                        className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${mapLayer === 'dark' ? 'bg-purple-100' : ''}`}
                        onClick={() => {
                          setMapLayer('dark');
                          setShowLayerOptions(false);
                        }}
                      >
                        Dark Mode
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Toggle Sidebar for Desktop */}
              {!isMobile && (
                <button 
                  className="bg-white rounded-md shadow-md p-2 hover:bg-gray-50 flex items-center"
                  onClick={toggleSidebar}
                >
                  <List size={20} className="text-gray-700" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SalonMap;