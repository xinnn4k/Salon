import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { 
  Clock, Calendar, ChevronRight, AlertCircle, CreditCard, 
  CheckCircle, XCircle, ChevronsRight, Search
} from 'lucide-react';

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
  paymentMethod?: 'card' | 'qpay';
  paymentDate?: string;
  cardLastFour?: string;
}

const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    // Fetch bookings from localStorage
    const fetchBookings = () => {
      try {
        setIsLoading(true);
        const bookingsJSON = localStorage.getItem('salonBookings');
        const bookingsData = bookingsJSON ? JSON.parse(bookingsJSON) : [];
        
        // Sort bookings by date (newest first)
        bookingsData.sort((a: BookingDetails, b: BookingDetails) => {
          return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime();
        });
        
        setBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      case 'completed':
        return <CheckCircle size={16} className="text-blue-600" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Баталгаажсан';
      case 'pending':
        return 'Төлбөр хүлээгдэж байна';
      case 'completed':
        return 'Үйлчилгээ дууссан';
      case 'cancelled':
        return 'Цуцлагдсан';
      default:
        return 'Тодорхойгүй';
    }
  };

  // Filter bookings based on status and search term
  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = booking.salonName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.staffName.toLowerCase().includes(searchTerm.toLowerCase());
                          
    return matchesFilter && matchesSearch;
  });

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Та энэ захиалгыг цуцлахдаа итгэлтэй байна уу?')) {
      try {
        const bookingsJSON = localStorage.getItem('salonBookings');
        const bookingsData = bookingsJSON ? JSON.parse(bookingsJSON) : [];
        
        const updatedBookings = bookingsData.map((booking: BookingDetails) => {
          if (booking.bookingId === bookingId) {
            return {
              ...booking,
              status: 'cancelled'
            };
          }
          return booking;
        });
        
        localStorage.setItem('salonBookings', JSON.stringify(updatedBookings));
        setBookings(updatedBookings);
        
      } catch (error) {
        console.error("Error cancelling booking:", error);
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 py-6 md:py-8 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 md:p-8 text-white">
            <h1 className="text-2xl md:text-3xl font-bold">Миний захиалгууд</h1>
            <p className="text-white/80 mt-2">Бүх захиалга болон төлбөрийн мэдээлэл</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Хайх..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFilter('all')}
              >
                Бүгд
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFilter('pending')}
              >
                Хүлээгдэж буй
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFilter('confirmed')}
              >
                Баталгаажсан
              </button>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Захиалга олдсонгүй</h3>
            <p className="text-gray-500 mb-6">
              {filter !== 'all' 
                ? `${getStatusText(filter)} төлөвтэй захиалга байхгүй байна.` 
                : "Та одоогоор захиалга хийгээгүй байна."}
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Үйлчилгээ захиалах
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.bookingId} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{booking.serviceName}</h3>
                      <p className="text-gray-600">{booking.salonName}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1">{getStatusText(booking.status)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="px-5 py-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Мэргэжилтэн</p>
                    <p className="font-medium">{booking.staffName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Огноо</p>
                    <p className="font-medium">{booking.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Цаг</p>
                    <p className="font-medium">{booking.time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Үнэ</p>
                    <p className="font-medium text-purple-600">{booking.price}₮</p>
                  </div>
                </div>
                
                {booking.paymentMethod && (
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center">
                      <CreditCard size={16} className="text-gray-500 mr-2" />
                      <div className="text-sm text-gray-600">
                        {booking.paymentMethod === 'card' ? (
                          <>
                            Картаар төлсөн {booking.cardLastFour ? `(•••• ${booking.cardLastFour})` : ''}
                          </>
                        ) : (
                          <>QPay-ээр төлсөн</>
                        )}
                        {booking.paymentDate && (
                          <span className="ml-1 text-gray-500">
                            {new Date(booking.paymentDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="px-5 py-3 border-t border-gray-100 flex justify-between items-center">
                  {booking.status === 'pending' ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => navigate(`/payment/${booking.bookingId}`)}
                        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center"
                      >
                        Төлбөр төлөх
                        <ChevronsRight size={16} className="ml-1" />
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking.bookingId)}
                        className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
                      >
                        Цуцлах
                      </button>
                    </div>
                  ) : booking.status === 'confirmed' ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleCancelBooking(booking.bookingId)}
                        className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
                      >
                        Цуцлах
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      {booking.status === 'completed' && 'Үйлчилгээ дууссан'}
                      {booking.status === 'cancelled' && 'Захиалга цуцлагдсан'}
                    </div>
                  )}
                  
                  <button
                    onClick={() => navigate(`/booking/${booking.bookingId}`)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    Дэлгэрэнгүй
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingsPage;