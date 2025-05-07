import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useBookings } from '../contexts/BookingContext';
import { Calendar, Clock, User, MapPin, CheckCircle, X, AlertCircle, ChevronLeft } from 'lucide-react';

const BookingDetailPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { getBookingById, cancelBooking, updateBookingStatus } = useBookings();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      setError("Захиалгын дугаар олдсонгүй");
      setIsLoading(false);
      return;
    }

    const bookingData = getBookingById(bookingId);
    if (bookingData) {
      setBooking(bookingData);
      setIsLoading(false);
    } else {
      setError("Захиалга олдсонгүй");
      setIsLoading(false);
    }
  }, [bookingId, getBookingById]);

  const handleCancelBooking = () => {
    if (!bookingId) return;
    
    try {
      cancelBooking(bookingId);
      setBooking((prev: any) => ({ ...prev, status: 'cancelled' }));
      setShowCancelConfirm(false);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setError("Захиалгыг цуцлахад алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  const isPastBooking = () => {
    if (!booking) return false;
    
    const bookingDate = new Date(booking.date);
    const [hourStr, minuteStr, period] = booking.time.split(/[:\s]/);
    
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    
    // Convert 12-hour format to 24-hour
    if (period === 'PM' && hour < 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }
    
    bookingDate.setHours(hour, minute);
    return bookingDate < new Date();
  };

  const getStatusBadge = () => {
    if (!booking) return null;
    
    if (booking.status === 'cancelled') {
      return (
        <div className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full">
          <X size={16} className="mr-1" />
          <span className="font-medium">Цуцалсан</span>
        </div>
      );
    }
    
    if (booking.status === 'completed') {
      return (
        <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
          <CheckCircle size={16} className="mr-1" />
          <span className="font-medium">Дууссан</span>
        </div>
      );
    }
    
    if (isPastBooking()) {
      return (
        <div className="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
          <CheckCircle size={16} className="mr-1" />
          <span className="font-medium">Дууссан</span>
        </div>
      );
    }
    
    if (booking.status === 'confirmed') {
      return (
        <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          <CheckCircle size={16} className="mr-1" />
          <span className="font-medium">Баталгаажсан</span>
        </div>
      );
    }
    
    return (
      <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
        <Clock size={16} className="mr-1" />
        <span className="font-medium">Хүлээгдэж байна</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error || !booking) {
    return (
      <Layout>
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Алдаа</h3>
            <p className="text-gray-500 mb-6">{error || "Захиалга олдсонгүй"}</p>
            <button
              onClick={() => navigate('/bookings')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Захиалгууд руу буцах
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 py-6 pb-20">
        <button
          onClick={() => navigate('/bookings')}
          className="flex items-center text-blue-600 mb-6"
        >
          <ChevronLeft size={20} />
          <span className="font-medium">Захиалгууд руу буцах</span>
        </button>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Захиалгын дэлгэрэнгүй</h1>
              {getStatusBadge()}
            </div>
            <p className="text-gray-500">Захиалга #{booking.bookingId.substring(0, 8)}</p>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium mb-4">Үйлчилгээний мэдээлэл</h2>
                
                <div className="space-y-4">
                  <div className="flex">
                    <div className="w-8 flex-shrink-0 text-gray-400">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-medium">{booking.salonName}</p>
                      <p className="text-sm text-gray-500">Салон</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-8 flex-shrink-0 text-gray-400">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-medium">{booking.staffName}</p>
                      <p className="text-sm text-gray-500">Мэргэжилтэн</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-8 flex-shrink-0 text-gray-400">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="font-medium">{booking.date}</p>
                      <p className="text-sm text-gray-500">Огноо</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-8 flex-shrink-0 text-gray-400">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="font-medium">{booking.time}</p>
                      <p className="text-sm text-gray-500">Цаг</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-medium mb-4">Үйлчилгээ</h2>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <div>
                    <p className="font-medium">{booking.serviceName}</p>
                  </div>
                  <p className="font-bold">{booking.price}₮</p>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <p className="font-medium">Нийт төлбөр</p>
                  <p className="text-xl font-bold text-purple-600">{booking.price}₮</p>
                </div>
              </div>
            </div>
          </div>
          
          {booking.status !== 'cancelled' && !isPastBooking() && (
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              {!showCancelConfirm ? (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
                >
                  Захиалга цуцлах
                </button>
              ) : (
                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                  <p className="text-red-600 mb-4">Та энэ захиалгыг цуцлахдаа итгэлтэй байна уу?</p>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancelBooking}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
                    >
                      Тийм, цуцлах
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
                    >
                      Үгүй
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {booking.status !== 'cancelled' && !isPastBooking() && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Холбоотой үйлчилгээнүүд</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                onClick={() => navigate(`/salon/${booking.salonId}`)}
              >
                <h3 className="font-medium mb-2">Нэмэлт үйлчилгээ авах</h3>
                <p className="text-sm text-gray-500">Энэ салоны бусад үйлчилгээг үзэх</p>
              </div>
              
              <div 
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                onClick={() => navigate(`/salon/${booking.salonId}/service/${booking.serviceId}`)}
              >
                <h3 className="font-medium mb-2">Дахин захиалах</h3>
                <p className="text-sm text-gray-500">Энэ үйлчилгээг өөр цагт захиалах</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingDetailPage;