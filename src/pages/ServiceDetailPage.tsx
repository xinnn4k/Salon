import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { Star, ArrowLeft, Clock, Calendar, User, ChevronDown, CheckCircle } from 'lucide-react';

interface ServiceDetailProps {
  id: number;
  name: string;
  duration: string;
  price: string;
  description: string;
  image: string;
  category: string;
}

interface StaffMember {
  id: number;
  name: string;
  position: string;
  avatar?: string;
  specialties: string[];
  availability: string[];
}

const ServiceDetailPage: React.FC = () => {
  const { salonId, serviceId } = useParams<{ salonId: string; serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceDetailProps | null>(null);
  const [salonDetails, setSalonDetails] = useState<any>(null);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  // Sample data - in a real app, you would fetch this from an API
  useEffect(() => {
    if (salonId && serviceId) {
      // Sample salon data
      const salonData = [
        { id: 1, name: 'Barbershop One', rating: 4.5, location: 'Натур', type: 'Үсчин', imageUrl: '/assets/barbershop.png' },
        { id: 2, name: 'Beauty Salon', rating: 4.2, location: 'Маршал таун', type: 'Гоо сайхан', imageUrl: '/assets/beauty_salon.png' },
        { id: 3, name: 'Hair Salon', rating: 4.8, location: 'Зайсан', type: 'Үсчин', imageUrl: '/assets/hair_salon.png' },
        { id: 4, name: 'Barbershop Two', rating: 4.3, location: 'Яармаг', type: 'Үсчин', imageUrl: '/assets/barbershop2.png' },
        { id: 5, name: 'Eyebrow Specialist', rating: 4.7, location: 'Жуков', type: 'Гоо сайхан', imageUrl: '/assets/eye_salon.png' },
        { id: 6, name: 'New Haircut', rating: 4.6, location: 'Баянмонгол', type: 'Үсчин', imageUrl: '/assets/barbershop.png' },
        { id: 7, name: 'Luxury Spa', rating: 4.9, location: 'Төв цэнгэлдэх', type: 'Гоо сайхан', imageUrl: '/assets/beauty_salon.png' },
      ];

      // Sample service data
      const serviceData: ServiceDetailProps[] = [
        {
          id: 1,
          name: "Үс Засах",
          duration: "30 мин",
          price: "25,000₮",
          description: "Манай мэргэжлийн үс засах үйлчилгээ нь зөвлөгөө өгөх, үс угаах, нарийн тайралт, болон гоёжилт зэрэг багтана. Манай стилистүүд таны нүүрний хэлбэр, амьдралын хэв маягт тохирсон стиль өгөх хамгийн сүүлийн техникүүдийг сурч мэдсэн.",
          image: "/api/placeholder/800/400",
          category: "Үсчин"
        },
        {
          id: 2,
          name: "Үс Стайлинг",
          duration: "45 мин",
          price: "35,000₮",
          description: "Манай мэргэжлийн стайлинг үйлчилгээтэй таныг шинэ төрхтэй болгоно. Үс хагалах, буржгар үс хийх эсвэл тусгай арга хэмжээний өмнө үсээ янзлах зэрэг зүйлсийг манай стилистүүд таны хүссэн төрхөд тохируулах болно.",
          image: "/api/placeholder/800/400",
          category: "Үсчин"
        },
        {
          id: 3,
          name: "Үс Будалт",
          duration: "90 мин",
          price: "65,000₮",
          description: "Манай үс будалтын үйлчилгээтэй таны төрхийг өөрчлөнө. Манай өнгийн мэргэжилтнүүд нарийн өнгийн хаялттай эсвэл тод өнгийн загварлаг өнгүүдийг та хүссэн өнгөнд тохируулан тохируулах чадвартай.",
          image: "/api/placeholder/800/400",
          category: "Үсчин"
        }
      ];
      const staffData: StaffMember[] = [
        {
          id: 1,
          name: "Батболд Д.",
          position: "Ахлах Стилист",
          specialties: ["Үс Засах", "Үс Стайлинг", "Үс Будалт"],
          availability: ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]
        },
        {
          id: 2,
          name: "Оюунаа Т.",
          position: "Өнгөчин",
          specialties: ["Үс Будалт", "Үс Стайлинг"],
          availability: ["9:00 AM", "12:00 PM", "1:00 PM", "5:00 PM"]
        },
        {
          id: 3,
          name: "Төгөлдөр С.",
          position: "Барбер",
          specialties: ["Үс Засах", "Сахал Тайруулах"],
          availability: ["9:00 AM", "10:00 AM", "11:00 AM", "3:00 PM", "4:00 PM"]
        }
      ];

      const foundSalon = salonData.find(s => s.id === Number(salonId));
      const foundService = serviceData.find(s => s.id === Number(serviceId));
      
      if (foundSalon) {
        setSalonDetails(foundSalon);
      }
      
      if (foundService) {
        setService(foundService);
        
        const relevantStaff = staffData.filter(staff => 
          staff.specialties.includes(foundService.name)
        );
        setStaffMembers(relevantStaff);
      }
    }
  }, [salonId, serviceId]);

  const getNextDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric' 
      });
      days.push(formattedDate);
    }
    
    return days;
  };

  const availableDates = getNextDays();

  const handleBooking = () => {
    if (!selectedStaff || !selectedDate || !selectedTime) {
      alert("Тавтай морилно уу! та үйлчилгээний ажилтан, огноо болон цагаа сонгоно уу.");
      return;
    }
    
    const bookingDetails = {
      salonId: salonId,
      salonName: salonDetails?.name,
      serviceId: service?.id,
      serviceName: service?.name,
      staffId: selectedStaff,
      staffName: staffMembers.find(s => s.id === selectedStaff)?.name,
      date: selectedDate,
      time: selectedTime,
      price: service?.price
    };
    
    console.log("Захиалгын дэлгэрэнгүй:", bookingDetails);
    
    alert("Таны захиалга амжилттай! Бид удахгүй холбогдох болно. ");
    navigate(`/salon/${salonId}`);
  };

  if (!service || !salonDetails) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8 pb-20">

        <button 
          onClick={() => navigate(`/salon/${salonId}`)} 
          className="flex items-center text-gray-600 mb-4 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to {salonDetails.name}</span>
        </button>
        

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">          
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-2">
                  {service.category}
                </span>
                <h1 className="text-2xl font-bold">{service.name}</h1>
                <h2 className="text-lg text-gray-600">at {salonDetails.name}</h2>
                <div className="flex items-center mt-1 text-gray-600">
                  <Clock size={16} className="mr-1" />
                  <span>{service.duration}</span>
                </div>
              </div>
              <div className="text-xl font-bold text-blue-600">{service.price}</div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <h2 className="text-lg font-medium mb-2">Дэлгэрэнгүй</h2>
              <p className="text-gray-700">{service.description}</p>
            </div>
          </div>
        </div>
        
        {/* Booking Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6">Цагаа захиалаарай</h2>
          
          {/* Select Staff */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Мэргэжилтэн сонгох
            </label>
            <div className="relative">
              <button
                className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setShowStaffDropdown(!showStaffDropdown)}
              >
                <div className="flex items-center">
                  <User size={18} className="text-gray-400 mr-2" />
                  <span>{selectedStaff ? staffMembers.find(s => s.id === selectedStaff)?.name : "Select Staff"}</span>
                </div>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
              
              {showStaffDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                  {staffMembers.map(staff => (
                    <div
                      key={staff.id}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedStaff(staff.id);
                        setShowStaffDropdown(false);
                      }}
                    >
                      <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mr-3">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{staff.name}</div>
                        <div className="text-sm text-gray-500">{staff.position}</div>
                      </div>
                      {selectedStaff === staff.id && (
                        <CheckCircle size={18} className="ml-auto text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Select Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Огноо сонгох
            </label>
            <div className="relative">
              <button
                className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setShowDateDropdown(!showDateDropdown)}
              >
                <div className="flex items-center">
                  <Calendar size={18} className="text-gray-400 mr-2" />
                  <span>{selectedDate || "Select Date"}</span>
                </div>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
              
              {showDateDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                  {availableDates.map((date, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center"
                      onClick={() => {
                        setSelectedDate(date);
                        setShowDateDropdown(false);
                      }}
                    >
                      {date}
                      {selectedDate === date && (
                        <CheckCircle size={18} className="ml-auto text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Select Time */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Цаг сонгох
            </label>
            <div className="relative">
              <button
                className={`w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${!selectedStaff || !selectedDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (selectedStaff && selectedDate) {
                    setShowTimeDropdown(!showTimeDropdown);
                  }
                }}
                disabled={!selectedStaff || !selectedDate}
              >
                <div className="flex items-center">
                  <Clock size={18} className="text-gray-400 mr-2" />
                  <span>{selectedTime || "Select Time"}</span>
                </div>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
              
              {showTimeDropdown && selectedStaff && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                  {staffMembers.find(s => s.id === selectedStaff)?.availability.map((time, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center"
                      onClick={() => {
                        setSelectedTime(time);
                        setShowTimeDropdown(false);
                      }}
                    >
                      {time}
                      {selectedTime === time && (
                        <CheckCircle size={18} className="ml-auto text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Booking Summary */}
          {selectedStaff && selectedDate && selectedTime && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Захиалгын хураангуй</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Салон:</div>
                <div>{salonDetails.name}</div>
                <div className="text-gray-600">Үйлчилгээ:</div>
                <div>{service.name}</div>
                <div className="text-gray-600">Ажилтан:</div>
                <div>{staffMembers.find(s => s.id === selectedStaff)?.name}</div>
                <div className="text-gray-600">Огноо:</div>
                <div>{selectedDate}</div>
                <div className="text-gray-600">Цаг:</div>
                <div>{selectedTime}</div>
                <div className="text-gray-600">Үргэлжлэх хугацаа:</div>
                <div>{service.duration}</div>
                <div className="text-gray-600 font-medium">Нийт үнэ:</div>
                <div className="font-medium">{service.price}</div>
              </div>
            </div>
          )}
          
          {/* Book Button */}
          <button
            className={`w-full py-3 font-medium rounded-lg transition-colors ${
              selectedStaff && selectedDate && selectedTime
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleBooking}
            disabled={!selectedStaff || !selectedDate || !selectedTime}
          >
            Захиалах
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceDetailPage;