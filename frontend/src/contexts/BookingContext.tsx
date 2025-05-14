import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface BookingDetails {
  bookingId: string;
  userId: string; // Added userId field
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

interface BookingContextType {
  bookings: BookingDetails[];
  addBooking: (booking: BookingDetails) => BookingDetails;
  cancelBooking: (bookingId: string) => void;
  updateBookingStatus: (bookingId: string, status: BookingDetails['status']) => void;
  updateBookingPayment: (bookingId: string, paymentDetails: Partial<BookingDetails>) => void;
  getBookingById: (bookingId: string) => BookingDetails | undefined;
  getUserBookings: (userId: string) => BookingDetails[];
  activeBookingsCount: (userId?: string) => number;
  isLoading: boolean;
  error: string | null;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const STORAGE_KEY = 'salonBookings';

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load bookings from localStorage on mount
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    setIsLoading(true);
    setError(null);
    try {
      const bookingsJSON = localStorage.getItem(STORAGE_KEY);
      const loadedBookings: BookingDetails[] = bookingsJSON ? JSON.parse(bookingsJSON) : [];
      
      // Validate data structure
      if (!Array.isArray(loadedBookings)) {
        throw new Error('Invalid booking data format');
      }
      
      setBookings(loadedBookings);
    } catch (error) {
      console.error("Error loading bookings from localStorage:", error);
      setError("Failed to load bookings. Please try refreshing the page.");
      // Initialize with empty array if data is corrupted
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save bookings to localStorage whenever they change
  const saveBookings = useCallback((updatedBookings: BookingDetails[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookings));
    } catch (error) {
      console.error("Error saving bookings to localStorage:", error);
      setError("Failed to save booking changes. Please try again.");
    }
  }, []);

  const addBooking = (booking: BookingDetails) => {
    // Validate booking data
    if (!booking.bookingId || !booking.salonId || !booking.serviceId || !booking.userId) {
      throw new Error('Invalid booking data: Missing required fields');
    }

    const updatedBookings = [...bookings, booking];
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
    return booking;
  };

  const cancelBooking = useCallback((bookingId: string) => {
    const existingBooking = bookings.find(b => b.bookingId === bookingId);
    if (!existingBooking) {
      setError(`Booking with ID ${bookingId} not found`);
      return;
    }

    const updatedBookings = bookings.map(booking => 
      booking.bookingId === bookingId 
        ? { ...booking, status: 'cancelled' as const } 
        : booking
    );
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
  }, [bookings, saveBookings]);

  const updateBookingStatus = useCallback((bookingId: string, status: BookingDetails['status']) => {
    const existingBooking = bookings.find(b => b.bookingId === bookingId);
    if (!existingBooking) {
      setError(`Booking with ID ${bookingId} not found`);
      return;
    }

    const updatedBookings = bookings.map(booking => 
      booking.bookingId === bookingId 
        ? { ...booking, status } 
        : booking
    );
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
  }, [bookings, saveBookings]);

  const updateBookingPayment = useCallback((
    bookingId: string, 
    paymentDetails: Pick<BookingDetails, 'paymentMethod' | 'paymentDate' | 'cardLastFour'>
  ) => {
    const existingBooking = bookings.find(b => b.bookingId === bookingId);
    if (!existingBooking) {
      setError(`Booking with ID ${bookingId} not found`);
      return;
    }

    const updatedBookings = bookings.map(booking => 
      booking.bookingId === bookingId 
        ? { 
            ...booking, 
            ...paymentDetails,
            status: 'confirmed' as const 
          } 
        : booking
    );
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
  }, [bookings, saveBookings]);

  const getBookingById = useCallback((bookingId: string) => {
    return bookings.find(booking => booking.bookingId === bookingId);
  }, [bookings]);

  // Add new function to get bookings by userId
  const getUserBookings = useCallback((userId: string) => {
    return bookings.filter(booking => booking.userId === userId);
  }, [bookings]);
  
  const isActiveBooking = useCallback((booking: BookingDetails) => {
    try {
      // Parse the date string from booking
      const bookingDate = new Date(booking.date);
      if (isNaN(bookingDate.getTime())) {
        console.error('Invalid date format:', booking.date);
        return false;
      }
      
      // Parse the time string (handle both 12h and 24h formats)
      let hour = 0;
      let minute = 0;
      
      // Handle different time formats
      if (booking.time.includes(':')) {
        const timeParts = booking.time.split(':');
        hour = parseInt(timeParts[0], 10);
        
        // Handle minute part which might include AM/PM
        if (timeParts[1].includes('AM') || timeParts[1].includes('PM')) {
          const minuteAndPeriod = timeParts[1].split(/\s+/);
          minute = parseInt(minuteAndPeriod[0], 10);
          
          // Adjust for AM/PM
          if (minuteAndPeriod[1] === 'PM' && hour < 12) {
            hour += 12;
          } else if (minuteAndPeriod[1] === 'AM' && hour === 12) {
            hour = 0;
          }
        } else {
          // Handle 24-hour format
          minute = parseInt(timeParts[1], 10);
        }
      }
      
      // Set the correct time on the booking date
      bookingDate.setHours(hour, minute, 0, 0);
      
      // Check if the booking is in the past
      const now = new Date();
      const isPast = bookingDate < now;
      
      // Check if booking is active (not in past and not cancelled/completed)
      return !isPast && booking.status !== 'cancelled' && booking.status !== 'completed';
    } catch (error) {
      console.error('Error checking if booking is active:', error);
      return false;
    }
  }, []);

  // Modified to support filtering by userId
  const activeBookingsCount = useCallback((userId?: string) => {
    if (userId) {
      return bookings.filter(booking => 
        booking.userId === userId && isActiveBooking(booking)
      ).length;
    }
    return bookings.filter(isActiveBooking).length;
  }, [bookings, isActiveBooking]);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        cancelBooking,
        updateBookingStatus,
        updateBookingPayment,
        getBookingById,
        getUserBookings,
        activeBookingsCount,
        isLoading,
        error
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