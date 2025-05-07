import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface BookingContextType {
  bookings: BookingDetails[];
  addBooking: (booking: BookingDetails) => void;
  cancelBooking: (bookingId: string) => void;
  updateBookingStatus: (bookingId: string, status: BookingDetails['status']) => void;
  getBookingById: (bookingId: string) => BookingDetails | undefined;
  activeBookingsCount: number;
  isLoading: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookings from localStorage on mount
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    setIsLoading(true);
    try {
      const bookingsJSON = localStorage.getItem('salonBookings');
      const loadedBookings: BookingDetails[] = bookingsJSON ? JSON.parse(bookingsJSON) : [];
      setBookings(loadedBookings);
    } catch (error) {
      console.error("Error loading bookings from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save bookings to localStorage whenever they change
  const saveBookings = (updatedBookings: BookingDetails[]) => {
    try {
      localStorage.setItem('salonBookings', JSON.stringify(updatedBookings));
    } catch (error) {
      console.error("Error saving bookings to localStorage:", error);
    }
  };

  const addBooking = (booking: BookingDetails) => {
    const updatedBookings = [...bookings, booking];
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
    return booking;
  };

  const cancelBooking = (bookingId: string) => {
    const updatedBookings = bookings.map(booking => 
      booking.bookingId === bookingId 
        ? { ...booking, status: 'cancelled' as const } 
        : booking
    );
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
  };

  const updateBookingStatus = (bookingId: string, status: BookingDetails['status']) => {
    const updatedBookings = bookings.map(booking => 
      booking.bookingId === bookingId 
        ? { ...booking, status } 
        : booking
    );
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
  };

  const getBookingById = (bookingId: string) => {
    return bookings.find(booking => booking.bookingId === bookingId);
  };
  
  // Helper to check if a booking is active
  const isActiveBooking = (booking: BookingDetails) => {
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
    
    const isPast = bookingDate < new Date();
    return !isPast && booking.status !== 'cancelled' && booking.status !== 'completed';
  };

  // Calculate active bookings count for notifications
  const activeBookingsCount = bookings.filter(isActiveBooking).length;

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        cancelBooking,
        updateBookingStatus,
        getBookingById,
        activeBookingsCount,
        isLoading
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook to use the booking context
export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};