import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useBookings } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Clock, Calendar, ChevronRight, AlertCircle, CreditCard, 
  CheckCircle, XCircle, ChevronsRight, Search, FilterIcon,
  Loader, ExternalLink, AlertTriangle
} from 'lucide-react';

type BookingStatus = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, cancelBooking, isLoading, error } = useBookings();
  const { user, isAuthenticated } = useAuth(); // Get the current user
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<BookingStatus>('all');
  const [showFilters, setShowFilters] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: '/bookings' } });
    }
  }, [isAuthenticated, navigate]);

  const getStatusColor = useCallback((status: string) => {
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
  }, []);

  const getStatusIcon = useCallback((status: string) => {
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
  }, []);

  const getStatusText = useCallback((status: string) => {
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
  }, []);

  const filteredBookings = useMemo(() => {
    if (!user || !user.id) return [];
    
    return bookings

    .filter(booking => booking.userId === user.id)

    .filter(booking => {
        const matchesFilter = filter === 'all' || booking.status === filter;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          booking.salonName.toLowerCase().includes(searchLower) || 
          booking.serviceName.toLowerCase().includes(searchLower) ||
          booking.staffName.toLowerCase().includes(searchLower) ||
          booking.bookingId.toLowerCase().includes(searchLower);
                            
        return matchesFilter && matchesSearch;
      });
  }, [bookings, filter, searchTerm, user]);

  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
      const dateA = new Date(a.bookingDate);
      const dateB = new Date(b.bookingDate);
      
      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return dateB.getTime() - dateA.getTime();
      }
      
      return a.bookingId > b.bookingId ? -1 : 1;
    });
  }, [filteredBookings]);

  const handleCancelBooking = useCallback((bookingId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (window.confirm('Та энэ захиалгыг цуцлахдаа итгэлтэй байна уу?')) {
      cancelBooking(bookingId);
    }
  }, [cancelBooking]);

  const handleBookingClick = useCallback((bookingId: string) => {
    navigate(`/booking/${bookingId}`);
  }, [navigate]);

  const handlePayment = useCallback((bookingId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/payment/${bookingId}`);
  }, [navigate]);


  const formatDate = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return new Intl.DateTimeFormat('mn-MN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return dateString;
    }
  }, []);


  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setFilter('all');
  }, []);

  if (error) {
    return (
      <Layout>
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Алдаа гарлаа</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Дахин оролдох
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const userBookingsCount = user && user.id ? bookings.filter(b => b.userId === user.id).length : 0;

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 py-6 md:py-8 pb-20">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 md:p-8 text-white">
            <h1 className="text-2xl md:text-3xl font-bold">Миний захиалгууд</h1>
            <p className="text-white/80 mt-2">Бүх захиалга болон төлбөрийн мэдээлэл</p>
            <div className="mt-3 flex items-center">
              <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                Нийт: {userBookingsCount} захиалга
              </span>
              {filteredBookings.length !== userBookingsCount && (
                <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full ml-2">
                  Шүүсэн: {filteredBookings.length}
                </span>
              )}
            </div>
          </div>
        </div>

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
            
            <div className="flex items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden mr-2 p-2 rounded-lg bg-gray-100 text-gray-700"
                aria-expanded={showFilters}
              >
                <FilterIcon size={18} />
              </button>
              
              <div className={`flex space-x-2 ${showFilters ? 'flex' : 'hidden md:flex'}`}>
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
          
          {showFilters && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                <button 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setFilter('completed')}
                >
                  Дууссан
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setFilter('cancelled')}
                >
                  Цуцлагдсан
                </button>
                {(searchTerm || filter !== 'all') && (
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                    onClick={resetFilters}
                  >
                    Цэвэрлэх
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center">
              <Loader size={32} className="text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Захиалгууд ачааллаж байна...</p>
            </div>
          </div>
        ) : sortedBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Захиалга олдсонгүй</h3>
            <p className="text-gray-500 mb-6">
              {filter !== 'all' 
                ? `${getStatusText(filter)} төлөвтэй захиалга байхгүй байна.` 
                : searchTerm 
                  ? "Хайлтад тохирох захиалга олдсонгүй."
                  : "Та одоогоор захиалга хийгээгүй байна."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Үйлчилгээ захиалах
                <ChevronRight size={16} className="ml-1" />
              </button>
              {(searchTerm || filter !== 'all') && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Шүүлтүүр арилгах
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedBookings.map((booking) => (
              <div 
                key={booking.bookingId} 
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleBookingClick(booking.bookingId)}
              >
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
                    <p className="font-medium">{formatDate(booking.date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Цаг</p>
                    <p className="font-medium">{booking.time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Үнэ</p>
                    <p className="font-medium text-purple-600">{booking.price.toLocaleString()}₮</p>
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
                        onClick={(e) => handlePayment(booking.bookingId, e)}
                        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center"
                      >
                        Төлбөр төлөх
                        <ChevronsRight size={16} className="ml-1" />
                      </button>
                      <button
                        onClick={(e) => handleCancelBooking(booking.bookingId, e)}
                        className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
                      >
                        Цуцлах
                      </button>
                    </div>
                  ) : booking.status === 'confirmed' ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={(e) => handleCancelBooking(booking.bookingId, e)}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/booking/${booking.bookingId}`);
                    }}
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
        
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white p-4 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="w-full max-w-md py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg flex items-center justify-center shadow-lg"
          >
            <Calendar size={18} className="mr-2" />
            Шинэ захиалга хийх
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage;