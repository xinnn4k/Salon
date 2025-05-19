import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { Star, Clock, Calendar, User, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext'; // Import auth hook - make sure you have this

interface ServiceDetailProps {
    _id: string;
    name: string;
    image?: string;
    price: number;
    description?: string;
    salonId: string;
}

interface SalonDetailProps {
    _id: string;
    name: string;
    location: string;
    phone: string;
    email: string;
    image?: string;
    rating?: number;
}

interface StaffMember {
  _id: string;
  name: string;
  specialty: string;
  image?: string;
  email: string;
  salonId: string;
  availability?: string[]; // We'll add default availability times
}

interface BookingDetails {
  bookingId?: string;
  userId?: string;
  salonId: string;
  salonName?: string;
  serviceId: string;
  serviceName?: string;
  staffId: string;
  staffName?: string;
  customerName?: string;
  customerPhone?: string;
  date: string;
  time: string;
  price?: number;
  bookingDate?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'booked';
}

// Define default availability times that we'll use since the API doesn't provide them
const DEFAULT_AVAILABILITY = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

const ServiceDetailPage: React.FC = () => {
  const { salonId, serviceId } = useParams<{ salonId: string; serviceId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [service, setService] = useState<ServiceDetailProps | null>(null);
  const [salonDetails, setSalonDetails] = useState<SalonDetailProps | null>(null);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [existingBookings, setExistingBookings] = useState<BookingDetails[]>([]);

  useEffect(() => {
    if (!isAuthenticated && errorMessage === null) {
      setErrorMessage("Та үйлчилгээ захиалахын тулд нэвтрэх шаардлагатай");
    } else if (isAuthenticated && errorMessage === "Та үйлчилгээ захиалахын тулд нэвтрэх шаардлагатай") {
      setErrorMessage(null);
    }
  }, [isAuthenticated, errorMessage]);

  // Fetch existing bookings from the backend
  const fetchExistingBookings = async () => {
    if (!salonId) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/orders/pay/${salonId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch existing bookings");
      }
      const bookingsData = await response.json();
      setExistingBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching existing bookings:", error);
    }
  };
  
  useEffect(() => {
    if (!salonId || !serviceId) return;
  
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      
      try {
        // Fetch salon details
        const salonResponse = await fetch(`http://localhost:4000/api/salons/${salonId}`);
        if (!salonResponse.ok) {
          throw new Error("Failed to fetch salon details");
        }
        const salonData = await salonResponse.json();
        
        // Fetch service details
        const serviceResponse = await fetch(`http://localhost:4000/api/services/${salonId}/${serviceId}`);
        if (!serviceResponse.ok) {
          throw new Error("Failed to fetch service details");
        }
        const serviceData = await serviceResponse.json();
        
        // Fetch staff members
        const staffResponse = await fetch(`http://localhost:4000/api/staffs/${salonId}`);
        if (!staffResponse.ok) {
          throw new Error("Failed to fetch staff members");
        }
        const staffData = await staffResponse.json();
        
        // Add availability to staff members
        const staffWithAvailability = staffData.map((staff: StaffMember) => ({
          ...staff,
          availability: DEFAULT_AVAILABILITY
        }));
    
        setSalonDetails(salonData);
        setService(serviceData);
        setStaffMembers(staffWithAvailability);
        
        // Fetch existing bookings
        await fetchExistingBookings();
      } catch (error) {
        setErrorMessage("Мэдээлэл олдсонгүй. Дахин оролдоно уу.");
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  useEffect(() => {
    if (selectedStaff) {
      setSelectedTime('');
    }
  }, [selectedStaff]);

  const handleBooking = async () => {
    if (!isAuthenticated || !user) {
      setErrorMessage("Та үйлчилгээ захиалахын тулд нэвтрэх шаардлагатай");
      navigate('/login', { state: { from: `/salon/${salonId}/service/${serviceId}` } });
      return;
    }

    if (!selectedStaff || !selectedDate || !selectedTime) {
      setErrorMessage("Тавтай морилно уу! Та үйлчилгээний ажилтан, огноо болон цагаа сонгоно уу.");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create booking details for the API
      const bookingDetails: BookingDetails = {
        salonId: salonId || '',
        serviceId: serviceId || '',
        staffId: selectedStaff,
        userId: user.id,
        date: selectedDate,
        time: selectedTime,
        status: 'booked',
        price: service?.price
      };
      
      // Send booking to API
      const response = await fetch(`http://localhost:4000/api/orders/${salonId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDetails)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create booking');
      }
      
      const createdBooking = await response.json();
      console.log("Захиалгын дэлгэрэнгүй:", createdBooking);
      
      setBookingSuccess(true);
      
      setTimeout(() => {
        navigate(`/payment/${createdBooking._id}`);
      }, 1000);
      
    } catch (error) {
      setErrorMessage("Захиалга бүртгэхэд алдаа гарлаа. Дахин оролдоно уу.");
      console.error("Booking error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isTimeAvailable = (time: string) => {

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
            src={salonDetails.image || '/placeholder-salon.jpg'}
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
                      <Star key={i} size={16} fill={i < (salonDetails.rating || 4) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">{salonDetails.rating || 4}/5</span>
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

          {!isAuthenticated && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg">
              <h3 className="font-medium mb-2">Цаг захиалах</h3>
              <p className="mb-3">Та үйлчилгээ захиалахын тулд нэвтрэх шаардлагатай.</p>
              <button 
                onClick={() => navigate('/login', { state: { from: `/salon/${salonId}/service/${serviceId}` } })}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Нэвтрэх
              </button>
            </div>
          )}
          
          {/* Select Staff */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Мэргэжилтэн сонгох
            </label>
            <div className="relative">
              <button
                className={`w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (isAuthenticated) {
                    setShowStaffDropdown(!showStaffDropdown);
                    setShowDateDropdown(false);
                    setShowTimeDropdown(false);
                  }
                }}
                disabled={!isAuthenticated}
              >
                <div className="flex items-center">
                  <User size={18} className="text-gray-400 mr-2" />
                  <span>{selectedStaff ? staffMembers.find(s => s._id === selectedStaff)?.name : "Ажилтан сонгох"}</span>
                </div>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
              
              {showStaffDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                  {staffMembers.length > 0 ? staffMembers.map(staff => (
                    <div
                      key={staff._id}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedStaff(staff._id);
                        setShowStaffDropdown(false);
                      }}
                    >
                      <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mr-3">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{staff.name}</div>
                        <div className="text-sm text-gray-500">{staff.specialty}</div>
                      </div>
                      {selectedStaff === staff._id && (
                        <CheckCircle size={18} className="ml-auto text-green-500" />
                      )}
                    </div>
                  )) : (
                    <div className="px-4 py-3 text-gray-500">Ажилтан олдсонгүй</div>
                  )}
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
                className={`w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${!selectedStaff || !isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (selectedStaff && isAuthenticated) {
                    setShowDateDropdown(!showDateDropdown);
                    setShowStaffDropdown(false);
                    setShowTimeDropdown(false);
                  }
                }}
                disabled={!selectedStaff || !isAuthenticated}
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
                className={`w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${!selectedStaff || !selectedDate || !isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (selectedStaff && selectedDate && isAuthenticated) {
                    setShowTimeDropdown(!showTimeDropdown);
                    setShowStaffDropdown(false);
                    setShowDateDropdown(false);
                  }
                }}
                disabled={!selectedStaff || !selectedDate || !isAuthenticated}
              >
                <div className="flex items-center">
                  <Clock size={18} className="text-gray-400 mr-2" />
                  <span>{selectedTime || "Цаг сонгох"}</span>
                </div>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
              
              {showTimeDropdown && selectedStaff && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {staffMembers.find(s => s._id === selectedStaff)?.availability?.map((time, index) => {
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
                <div className="font-medium">{staffMembers.find(s => s._id === selectedStaff)?.name}</div>
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
              selectedStaff && selectedDate && selectedTime && isAuthenticated
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleBooking}
            disabled={!selectedStaff || !selectedDate || !selectedTime || isLoading || !isAuthenticated}
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