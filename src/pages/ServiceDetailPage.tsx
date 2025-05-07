import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { Star, Clock, Calendar, User, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { useCardData } from '../hooks/useSalonData';

interface ServiceDetailProps {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
}

interface StaffMember {
  id: number;
  name: string;
  position: string;
  avatar?: string;
  specialties: string[];
  availability: string[];
}

interface BookingDetails {
  bookingId: string;
  salonId: string;
  salonName: string;
  serviceId: string;
  serviceName: string;
  staffId: number;
  staffName: string;
  date: string;
  time: string;
  price: number;
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

// Define staffData outside of the component to avoid recreation on each render
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

const ServiceDetailPage: React.FC = () => {
  const { salonId, serviceId } = useParams<{ salonId: string; serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceDetailProps | null>(null);
  const [salonDetails, setSalonDetails] = useState<any>(null);
  const [staffMembers] = useState<StaffMember[]>(staffData); // Initialize with staffData directly
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const cardDatas = useCardData();

  // Get existing bookings from localStorage
  const getExistingBookings = (): BookingDetails[] => {
    const bookingsJSON = localStorage.getItem('salonBookings');
    return bookingsJSON ? JSON.parse(bookingsJSON) : [];
  };
  
  // Save booking to localStorage
  const saveBookingToLocalStorage = (booking: BookingDetails) => {
    const existingBookings = getExistingBookings();
    const updatedBookings = [...existingBookings, booking];
    localStorage.setItem('salonBookings', JSON.stringify(updatedBookings));
  };
  
  useEffect(() => {
    if (!salonId || !serviceId) return;
    if (!cardDatas || cardDatas.length === 0) return;
  
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const foundSalon = cardDatas.find(s => s.id === Number(salonId));
      
      if (!foundSalon) {
        throw new Error("Salon not found");
      }
      
      const foundService = foundSalon?.services.find(s => s.id === serviceId);
      
      if (!foundService) {
        throw new Error("Service not found");
      }
  
      setSalonDetails(foundSalon);
      setService(foundService);
    } catch (error) {
      setErrorMessage("Мэдээлэл олдсонгүй. Дахин оролдоно уу.");
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [salonId, serviceId, cardDatas]);
  
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

  // Reset selection when staff changes
  useEffect(() => {
    if (selectedStaff) {
      setSelectedTime('');
    }
  }, [selectedStaff]);

  const handleBooking = () => {
    if (!selectedStaff || !selectedDate || !selectedTime) {
      setErrorMessage("Тавтай морилно уу! Та үйлчилгээний ажилтан, огноо болон цагаа сонгоно уу.");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Generate unique booking ID
      const bookingId = `book-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const bookingDetails: BookingDetails = {
        bookingId: bookingId,
        salonId: salonId || '',
        salonName: salonDetails?.name || '',
        serviceId: service?.id || '',
        serviceName: service?.name || '',
        staffId: selectedStaff,
        staffName: staffMembers.find(s => s.id === selectedStaff)?.name || '',
        date: selectedDate,
        time: selectedTime,
        price: service?.price || 0,
        bookingDate: new Date().toISOString(),
        status: 'pending'
      };
      
      // Save to localStorage
      saveBookingToLocalStorage(bookingDetails);
      
      console.log("Захиалгын дэлгэрэнгүй:", bookingDetails);
      
      // Set booking success first, then navigate after a short delay
      setBookingSuccess(true);
      
      // Navigate after a short delay to allow the success message to be seen
      setTimeout(() => {
        navigate(`/payment/${bookingId}`);
      }, 1000);
      
    } catch (error) {
      setErrorMessage("Захиалга бүртгэхэд алдаа гарлаа. Дахин оролдоно уу.");
      console.error("Booking error:", error);
      setIsLoading(false);
    }
  };

  // Check time availability (simulate checking against existing bookings)
  const isTimeAvailable = (time: string) => {
    const existingBookings = getExistingBookings();
    
    // Check if there's already a booking with the same staff, date and time
    const conflictingBooking = existingBookings.find(booking => 
      booking.staffId === selectedStaff && 
      booking.date === selectedDate && 
      booking.time === time &&
      booking.status !== 'cancelled'
    );
    
    return !conflictingBooking;
  };

  if (isLoading && !service) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (errorMessage && !service) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <p className="text-lg text-red-500">{errorMessage}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg"
          >
            Буцах
          </button>
        </div>
      </Layout>
    );
  }

  if (!service || !salonDetails) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (bookingSuccess) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen">
          <CheckCircle size={64} className="text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-green-500 mb-2">Захиалга амжилттай!</h2>
          <p className="text-gray-600 mb-8">Таны захиалга амжилттай бүртгэгдлээ. Таныг төлбөр хийх хуудас руу удирдан.</p>
          <div className="animate-pulse text-blue-500">Удахгүй шилжих болно...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8 pb-20">     
        <div className="relative w-full h-60 md:h-80 overflow-hidden">
          <img
            src={salonDetails.imageUrl}
            alt="Salon Banner"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 flex items-center bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300"
          >
            {FaArrowLeft ({size: 15})}
            <span className="ml-1">Буцах</span>
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">          
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{service.name}</h1>
                <h2 className="text-lg text-gray-600">{salonDetails.name}</h2>
                <div className="flex items-center mt-2">
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < salonDetails.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">{salonDetails.rating}/5</span>
                </div>
              </div>
              <div className="text-4xl font-bold text-purple-500">{service.price}₮</div>
            </div>
          </div>
        </div>
        
        {/* Booking Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6">Цагаа захиалаарай</h2>
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center">
              <AlertCircle size={18} className="mr-2" />
              {errorMessage}
            </div>
          )}
          
          {/* Select Staff */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Мэргэжилтэн сонгох
            </label>
            <div className="relative">
              <button
                className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => {
                  setShowStaffDropdown(!showStaffDropdown);
                  setShowDateDropdown(false);
                  setShowTimeDropdown(false);
                }}
              >
                <div className="flex items-center">
                  <User size={18} className="text-gray-400 mr-2" />
                  <span>{selectedStaff ? staffMembers.find(s => s.id === selectedStaff)?.name : "Ажилтан сонгох"}</span>
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
                        <div className="text-xs text-gray-400 mt-1">
                          {staff.specialties.join(", ")}
                        </div>
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
                className={`w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${!selectedStaff ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (selectedStaff) {
                    setShowDateDropdown(!showDateDropdown);
                    setShowStaffDropdown(false);
                    setShowTimeDropdown(false);
                  }
                }}
                disabled={!selectedStaff}
              >
                <div className="flex items-center">
                  <Calendar size={18} className="text-gray-400 mr-2" />
                  <span>{selectedDate || "Огноо сонгох"}</span>
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
                    setShowStaffDropdown(false);
                    setShowDateDropdown(false);
                  }
                }}
                disabled={!selectedStaff || !selectedDate}
              >
                <div className="flex items-center">
                  <Clock size={18} className="text-gray-400 mr-2" />
                  <span>{selectedTime || "Цаг сонгох"}</span>
                </div>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
              
              {showTimeDropdown && selectedStaff && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {staffMembers.find(s => s.id === selectedStaff)?.availability.map((time, index) => {
                    const available = isTimeAvailable(time);
                    return (
                      <div
                        key={index}
                        className={`px-4 py-3 flex items-center ${
                          available 
                            ? 'hover:bg-gray-50 cursor-pointer' 
                            : 'opacity-50 bg-gray-100 cursor-not-allowed'
                        }`}
                        onClick={() => {
                          if (available) {
                            setSelectedTime(time);
                            setShowTimeDropdown(false);
                            setErrorMessage(null);
                          }
                        }}
                      >
                        {time}
                        {selectedTime === time && available && (
                          <CheckCircle size={18} className="ml-auto text-green-500" />
                        )}
                        {!available && (
                          <span className="ml-auto text-xs text-red-500">Захиалгатай</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          {/* Booking Summary */}
          {selectedStaff && selectedDate && selectedTime && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-3 text-blue-600">Захиалгын хураангуй</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Салон:</div>
                <div className="font-medium">{salonDetails.name}</div>
                <div className="text-gray-600">Үйлчилгээ:</div>
                <div className="font-medium">{service.name}</div>
                <div className="text-gray-600">Ажилтан:</div>
                <div className="font-medium">{staffMembers.find(s => s.id === selectedStaff)?.name}</div>
                <div className="text-gray-600">Огноо:</div>
                <div className="font-medium">{selectedDate}</div>
                <div className="text-gray-600">Цаг:</div>
                <div className="font-medium">{selectedTime}</div>
                <div className="text-gray-600 font-medium">Нийт үнэ:</div>
                <div className="font-bold text-purple-600">{service.price}₮</div>
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
            disabled={!selectedStaff || !selectedDate || !selectedTime || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Боловсруулж байна...
              </div>
            ) : (
              "Захиалах"
            )}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceDetailPage;