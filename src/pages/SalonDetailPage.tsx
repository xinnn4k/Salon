import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BarberImage1 from '../assets/barbershop.png';
import BarberImage2 from '../assets/barbershop2.png';
import BeautySalon from '../assets/beauty salon.png';
import EyeSalons from '../assets/eye_salon.png';
import HairSalon from '../assets/hair_salon.png';
import Layout from '../components/Layout/Layout';
import { Star, MapPin, Clock, Phone, Calendar, ChevronRight } from 'lucide-react';
import Breadcrumb from '../components/UI/BreadCrumb';
import { FaArrowLeft } from 'react-icons/fa';

interface SalonDetailProps {
  id: Number;
  name: string;
  rating: number;
  location: string;
  type: string;
  imageUrl: string;
}

const SalonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [salonDetails, setSalonDetails] = useState<SalonDetailProps | null>(null);
  const [selectedTab, setSelectedTab] = useState('about');
  const navigate = useNavigate();
  
  
  const services = [
    { id: 1, name: "Haircut", duration: "30 мин", price: "25,000₮" },
    { id: 2, name: "Hair Styling", duration: "45 мин", price: "35,000₮" },
    { id: 3, name: "Hair Coloring", duration: "90 мин", price: "65,000₮" },
    { id: 4, name: "Beard Trim", duration: "15 мин", price: "15,000₮" },
    { id: 5, name: "Facial", duration: "30 мин", price: "40,000₮" }
  ];

  const staff = [
    { id: 1, name: "Д.Батболд", position: "Senior Stylist", experience: "8 жил" },
    { id: 2, name: "Т.Оюунаа", position: "Colorist", experience: "5 жил" },
    { id: 3, name: "С.Төгөлдөр", position: "Barber", experience: "4 жил" }
  ];

  useEffect(() => {
    if (id) {
      const salonData = [
        { id: 1, name: 'Barbershop One', rating: 4.5, location: 'Натур', type: 'Үсчин', imageUrl: BarberImage1 },
        { id: 2, name: 'Beauty Salon', rating: 4.2, location: 'Маршал таун', type: 'Гоо сайхан', imageUrl: BeautySalon },
        { id: 3, name: 'Hair Salon', rating: 4.8, location: 'Зайсан', type: 'Үсчин', imageUrl: HairSalon },
        { id: 4, name: 'Barbershop Two', rating: 4.3, location: 'Яармаг', type: 'Үсчин', imageUrl: BarberImage2 },
        { id: 5, name: 'Eyebrow Specialist', rating: 4.7, location: 'Жуков', type: 'Гоо сайхан', imageUrl: EyeSalons },
        { id: 6, name: 'New Haircut', rating: 4.6, location: 'Баянмонгол', type: 'Үсчин', imageUrl: BarberImage1 },
        { id: 7, name: 'Luxury Spa', rating: 4.9, location: 'Төв цэнгэлдэх', type: 'Гоо сайхан', imageUrl: BeautySalon },
      ];

      const foundSalon = salonData.find((salon) => salon.id === Number(id));

      if (foundSalon) {
        setSalonDetails(foundSalon);
      }
    }
  }, [id]);

  if (!salonDetails) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'about':
        return (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">{salonDetails.name}</h3>
            <p className="text-gray-700">
            {salonDetails.name} нь {salonDetails.location}-ийн төвд байрлах өндөр зэрэглэлийн {salonDetails.type.toLowerCase()} салон юм.
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
                  <span>+976 9911 2233</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={18} className="text-gray-500 mr-2" />
                  <span>{salonDetails.location}, Ulaanbaatar, Mongolia</span>
                </div>
              </div>
            </div>
          </div>
        );
        case 'services':
        return (
            <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Бидний үйлчилгээ</h3>
            <div className="space-y-3">
                {services.map(service => (
                <div 
                    key={service.id} 
                    className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow transition-shadow cursor-pointer"
                    onClick={() => navigate(`/salon/${id}/services/${service.id}`)}
                >
                    <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock size={14} className="mr-1" />
                        <span>{service.duration}</span>
                    </div>
                    </div>
                    <div className="flex items-center">
                    <span className="font-medium text-gray-800 mr-2">{service.price}</span>
                    <ChevronRight size={18} className="text-gray-400" />
                    </div>
                </div>
                ))}
            </div>
            <button className="mt-6 w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <Calendar size={18} className="mr-2" />
                Book Appointment
            </button>
            </div>
        );
      case 'staff':
        return (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Хамт олон</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staff.map(person => (
                <div key={person.id} className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-3 flex items-center justify-center text-gray-500">
                    {person.name.charAt(0)}
                  </div>
                  <h4 className="font-medium">{person.name}</h4>
                  <p className="text-sm text-gray-600">{person.position}</p>
                  <p className="text-xs text-gray-500 mt-1">Туршлага: {person.experience}</p>
                </div>
              ))}
            </div>
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
            style={{ backgroundImage: `url(${salonDetails.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>
          
            <div className="absolute top-0 left-0 p-4">
                <button
                onClick={() => navigate(-1)}
                className="flex items-center bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-3 rounded-full shadow-md transition-all"
                >
                {FaArrowLeft({ size: 15 })}
                </button>
            </div>

            <div className="absolute bottom-0 left-0 p-6 text-white">
                <div className="inline-block px-3 py-1 bg-purple-600 text-sm font-semibold rounded-full mb-4">
                    {salonDetails.type}
                </div>
                    <h1 className="text-3xl font-semibold">{salonDetails.name}</h1>
                    <div className="flex items-center mt-2">
                    <Star size={16} className="text-yellow-400 mr-1" />
                    <span className="text-lg font-medium">{salonDetails.rating} / 5.0</span>
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

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </Layout>
  );
};

export default SalonDetailPage;
