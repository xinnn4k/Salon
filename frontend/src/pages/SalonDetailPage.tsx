import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { Star, MapPin, Clock, Phone, Calendar, ChevronRight } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';

interface SalonDetailProps {
  _id: string;
  name: string;
  location: string;
  phone: string;
  image?: string;
}

interface ServiceProps {
  _id: string;
  name: string;
  price: string;
  description: string;
  image?: string;
  salonId: string;
}

interface StaffProps {
  _id: string;
  name: string;
  specialty: string;
  image?: string;
  salonId: string;
}

const SalonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('about');
  const [salon, setSalon] = useState<SalonDetailProps | null>(null);
  const [services, setServices] = useState<ServiceProps[]>([]);
  const [staff, setStaff] = useState<StaffProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch salon details
  useEffect(() => {
    const fetchSalonDetails = async () => {
      try {
        if (!id) return;
        
        const response = await fetch(`http://localhost:4000/api/salons/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch salon details');
        }
        
        const data = await response.json();
        setSalon(data);
      } catch (err) {
        console.error('Error fetching salon details:', err);
        setError('Could not load salon details');
      } finally {
        setLoading(false);
      }
    };

    fetchSalonDetails();
  }, [id]);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        if (!id) return;
        
        const response = await fetch(`http://localhost:4000/api/services/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        
        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
        // We don't set error here since salon details might still be available
      }
    };

    fetchServices();
  }, [id]);

  // Fetch staff
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        if (!id) return;
        
        const response = await fetch(`http://localhost:4000/api/staff/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch staff');
        }
        
        const data = await response.json();
        setStaff(data);
      } catch (err) {
        console.error('Error fetching staff:', err);
        // We don't set error here since salon details might still be available
      }
    };

    fetchStaff();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error || !salon) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-xl font-semibold text-red-500 mb-4">{error || 'Salon not found'}</div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all"
          >
            {FaArrowLeft ({size: 15})}
            <span>Go Back</span>
          </button>
        </div>
      </Layout>
    );
  }

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'about':
        return (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">{salon.name}</h3>
            <p className="text-gray-700">
              {salon.name} нь {salon.location}-ийн төвд байрлах өндөр зэрэглэлийн салон юм.
              Бид тав тухтай, орчин үеийн орчинд чанартай үйлчилгээ үзүүлэхэд мэргэшсэн.
              Манай туршлагатай мэргэжилтнүүд таны гоо үзэсгэлэн, сайхан мэдрэмжийг бүрэн мэдрүүлэхэд зориулагдсан болно.
            </p>
            
            <div className="mt-8">
              <h4 className="text-lg font-medium mb-3">Ажлын цаг</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between px-3 py-2 bg-gray-50 rounded">
                  <span>Даваа - Баасан</span>
                  <span>9:00 - 20:00</span>
                </div>
                <div className="flex justify-between px-3 py-2 bg-gray-50 rounded">
                  <span>Бямба</span>
                  <span>10:00 - 18:00</span>
                </div>
                <div className="flex justify-between px-3 py-2 bg-gray-50 rounded">
                  <span>Ням</span>
                  <span>11:00 - 16:00</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="text-lg font-medium mb-3">Холбоо барих</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone size={18} className="text-gray-500 mr-2" />
                  <span>{salon.phone || '+976 9911 2233'}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={18} className="text-gray-500 mr-2" />
                  <span>{salon.location}, Ulaanbaatar, Mongolia</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'services':
        return (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Бидний үйлчилгээ</h3>
            {services.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Үйлчилгээний мэдээлэл байхгүй байна.</p>
            ) : (
              <div className="space-y-3">
                {services.map(service => (
                  <div 
                    key={service._id} 
                    className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow transition-shadow cursor-pointer"
                    onClick={() => navigate(`/salon/${id}/services/${service._id}`)}
                  >
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800 mr-2">{service.price}</span>
                      <ChevronRight size={18} className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'staff':
        return (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Хамт олон</h3>
            {staff.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Ажилтны мэдээлэл байхгүй байна.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staff.map(person => (
                  <div key={person._id} className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                    {person.image ? (
                      <img 
                        src={person.image} 
                        alt={person.name} 
                        className="w-16 h-16 object-cover rounded-full mb-3"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-full mb-3 flex items-center justify-center text-gray-500">
                        {person.name.charAt(0)}
                      </div>
                    )}
                    <h4 className="font-medium">{person.name}</h4>
                    <p className="text-sm text-gray-600">{person.specialty}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
        
        <div className="relative rounded-xl overflow-hidden h-64 md:h-80 mb-6">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: salon.image ? `url(${salon.image})` : 'url(/placeholder-salon.jpg)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>
          
          <div className="absolute top-0 left-0 p-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-3 rounded-full shadow-md transition-all"
            >
              {FaArrowLeft ({size: 15})}
              <span className="ml-1">Буцах</span>
            </button>
          </div>

          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-3xl font-semibold">{salon.name}</h1>
            <div className="flex items-center mt-2">
              <MapPin size={16} className="mr-1" />
              <span>{salon.location}</span>
            </div>
          </div>
        </div>

        <div className="flex border-b">
          <button 
            onClick={() => setSelectedTab('about')} 
            className={`py-3 px-6 text-lg font-semibold ${selectedTab === 'about' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Бидний тухай
          </button>
          <button 
            onClick={() => setSelectedTab('services')} 
            className={`py-3 px-6 text-lg font-semibold ${selectedTab === 'services' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Үйлчилгээ
          </button>
          <button 
            onClick={() => setSelectedTab('staff')} 
            className={`py-3 px-6 text-lg font-semibold ${selectedTab === 'staff' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Ажилтан
          </button>
        </div>

        {renderTabContent()}
      </div>
    </Layout>
  );
};

export default SalonDetailPage;