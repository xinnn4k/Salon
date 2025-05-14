import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useBookings, BookingDetails } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, Calendar, Clock, MapPin, User, CreditCard, 
  CheckCircle, XCircle, AlertCircle, Share2, ChevronRight, 
  Loader, AlertTriangle, Trash, Edit
} from 'lucide-react';

const BookingDetailsPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { getBookingById, cancelBooking, error, isLoading } = useBookings();
  const { isAuthenticated } = useAuth();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: `/booking/${bookingId}` } });
    }
  }, [isAuthenticated, navigate, bookingId]);

  useEffect(() => {
    if (!bookingId) return;
    
    const fetchBooking = () => {
      const foundBooking = getBookingById(bookingId);
      if (foundBooking) {
        setBooking(foundBooking);
      } else {
        navigate('/bookings', { state: { error: 'Захиалга олдсонгүй' } });
      }
    };
    
    fetchBooking();
  }, [bookingId, getBookingById, navigate]);

  const handleCancelBooking = () => {
    if (!booking) return;
    
    setIsCancelling(true);
    
    setTimeout(() => {
      try {
        cancelBooking(booking.bookingId);
        setShowCancelModal(false);
        setBooking({
          ...booking,
          status: 'cancelled'
        });
      } catch (error) {
        console.error('Error cancelling booking:', error);
      } finally {
        setIsCancelling(false);
      }
    }, 800);
  };

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
        return <CheckCircle size={20} className="text-green-600" />;
      case 'pending':
        return <Clock size={20} className="text-yellow-600" />;
      case 'completed':
        return <CheckCircle size={20} className="text-blue-600" />;
      case 'cancelled':
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <AlertCircle size={20} className="text-gray-600" />;
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return new Intl.DateTimeFormat('mn-MN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  const shareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: `${booking?.serviceName} захиалга`,
        text: `${booking?.salonName}-д ${booking?.date} өдрийн ${booking?.time}-д ${booking?.serviceName} үйлчилгээ захиалсан.`,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {

      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Хуваалцах холбоос хуулагдлаа!'))
        .catch(err => console.error('Error copying to clipboard:', err));
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Алдаа гарлаа</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => navigate('/bookings')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Буцах
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading || !booking) {
    return (
      <Layout>
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader size={40} className="text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Захиалгын мэдээлэл ачааллаж байна...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 py-6 md:py-8 pb-20">
        {/* Back button */}
        <button
          onClick={() => navigate('/bookings')}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} className="mr-1" />
          Миний захиалгууд руу буцах
        </button>

        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className={`p-6 flex items-center justify-between ${
            booking.status === 'cancelled' ? 'bg-red-50' : 
            booking.status === 'confirmed' ? 'bg-green-50' : 
            booking.status === 'completed' ? 'bg-blue-50' : 'bg-yellow-50'
          }`}>
            <div className="flex items-center">
              {getStatusIcon(booking.status)}
              <div className="ml-3">
                <p className="text-sm text-gray-500">Захиалгын төлөв</p>
                <h3 className="text-xl font-medium">
                  {getStatusText(booking.status)}
                </h3>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg ${getStatusColor(booking.status)}`}>
              #{booking.bookingId.slice(-6).toUpperCase()}
            </div>
          </div>
          
          {booking.status === 'pending' && (
            <div className="bg-yellow-50 p-4 border-t border-yellow-100 flex justify-between items-center">
              <p className="text-sm text-yellow-700">
                Захиалгаа баталгаажуулахын тулд төлбөрөө төлнө үү.
              </p>
              <button
                onClick={() => navigate(`/payment/${booking.bookingId}`)}
                className="py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg"
              >
                Төлбөр төлөх
              </button>
            </div>
          )}
        </div>

        {/* Service Details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-1">{booking.serviceName}</h2>
            <p className="text-gray-600 mb-4">{booking.salonName}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar size={20} className="text-gray-400 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Огноо</p>
                    <p className="font-medium">{formatDate(booking.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock size={20} className="text-gray-400 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Цаг</p>
                    <p className="font-medium">{booking.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <User size={20} className="text-gray-400 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Мэргэжилтэн</p>
                    <p className="font-medium">{booking.staffName}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin size={20} className="text-gray-400 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Салон</p>
                    <p className="font-medium">{booking.salonName}</p>
                    <button className="text-blue-600 text-sm flex items-center mt-1">
                      Харах
                      <ChevronRight size={14} className="ml-1" />
                    </button>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar size={20} className="text-gray-400 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Захиалга хийсэн огноо</p>
                    <p className="font-medium">
                      {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Төлбөрийн мэдээлэл</h3>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Үйлчилгээний үнэ</span>
              <span className="font-medium">{booking.price.toLocaleString()}₮</span>
            </div>
            
            {/* Only show if there was a discount */}
            {false && (
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Хөнгөлөлт</span>
                <span className="text-green-600 font-medium">-5,000₮</span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-3 mt-2">
              <span className="text-gray-900 font-medium">Нийт төлбөр</span>
              <span className="text-xl font-bold text-purple-600">{booking.price.toLocaleString()}₮</span>
            </div>

            {booking.paymentMethod && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center mb-2">
                  <CreditCard size={18} className="text-gray-500 mr-2" />
                  <h4 className="font-medium">Төлбөр төлсөн</h4>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-sm">Төлбөрийн хэлбэр</p>
                      <p className="font-medium">
                        {booking.paymentMethod === 'card' 
                          ? `Карт (•••• ${booking.cardLastFour || '****'})` 
                          : 'QPay'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-sm">Төлсөн огноо</p>
                      <p className="font-medium">
                        {booking.paymentDate 
                          ? new Date(booking.paymentDate).toLocaleDateString() 
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {booking.status === 'pending' && (
              <div className="mt-6">
                <button
                  onClick={() => navigate(`/payment/${booking.bookingId}`)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                >
                  Төлбөр төлөх
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {(booking.status === 'pending' || booking.status === 'confirmed') && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full p-4 bg-white rounded-xl shadow-sm flex items-center justify-between hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
            >
              <div className="flex items-center">
                <Trash size={20} className="text-red-500 mr-3" />
                <span className="font-medium text-red-600">Захиалга цуцлах</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          )}

          {booking.status === 'confirmed' && (
            <button
              onClick={() => navigate(`/reschedule/${booking.bookingId}`)}
              className="w-full p-4 bg-white rounded-xl shadow-sm flex items-center justify-between hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100"
            >
              <div className="flex items-center">
                <Edit size={20} className="text-blue-500 mr-3" />
                <span className="font-medium text-blue-600">Дахин цаг захиалах</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          )}
          
          <button
            onClick={shareBooking}
            className="w-full p-4 bg-white rounded-xl shadow-sm flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <Share2 size={20} className="text-gray-500 mr-3" />
              <span className="font-medium">Хуваалцах</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Захиалга цуцлах</h3>
            <p className="text-gray-600 mb-4">
              Та энэ захиалгыг цуцлахдаа итгэлтэй байна уу? Цуцалсны дараа буцаан сэргээх боломжгүй.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цуцлах шалтгаан (заавал биш)
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Цуцлах шалтгаанаа оруулна уу..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg"
                disabled={isCancelling}
              >
                Болих
              </button>
              <button
                onClick={handleCancelBooking}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg flex items-center justify-center"
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <>
                    <Loader size={16} className="animate-spin mr-2" />
                    Цуцалж байна...
                  </>
                ) : (
                  'Цуцлах'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BookingDetailsPage;