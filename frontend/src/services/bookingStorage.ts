// src/services/bookingStorage.ts

export interface BookingDetails {
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
  
  const BOOKINGS_STORAGE_KEY = 'salonBookings';
  
  /**
   * Retrieves all bookings from localStorage
   */
  export const getAllBookings = (): BookingDetails[] => {
    try {
      const bookingsJSON = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      return bookingsJSON ? JSON.parse(bookingsJSON) : [];
    } catch (error) {
      console.error('Error retrieving bookings from localStorage:', error);
      return [];
    }
  };
  
  /**
   * Adds a new booking to localStorage
   */
  export const addBooking = (booking: BookingDetails): boolean => {
    try {
      const existingBookings = getAllBookings();
      const updatedBookings = [...existingBookings, booking];
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updatedBookings));
      return true;
    } catch (error) {
      console.error('Error adding booking to localStorage:', error);
      return false;
    }
  };
  
  /**
   * Updates an existing booking in localStorage
   */
  export const updateBooking = (bookingId: string, updatedFields: Partial<BookingDetails>): boolean => {
    try {
      const existingBookings = getAllBookings();
      const bookingIndex = existingBookings.findIndex(b => b.bookingId === bookingId);
      
      if (bookingIndex === -1) {
        return false;
      }
      
      existingBookings[bookingIndex] = {
        ...existingBookings[bookingIndex],
        ...updatedFields
      };
      
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(existingBookings));
      return true;
    } catch (error) {
      console.error('Error updating booking in localStorage:', error);
      return false;
    }
  };
  
  /**
   * Cancels a booking by setting its status to 'cancelled'
   */
  export const cancelBooking = (bookingId: string): boolean => {
    return updateBooking(bookingId, { status: 'cancelled' });
  };
  
  /**
   * Gets a single booking by ID
   */
  export const getBookingById = (bookingId: string): BookingDetails | null => {
    try {
      const bookings = getAllBookings();
      const booking = bookings.find(b => b.bookingId === bookingId);
      return booking || null;
    } catch (error) {
      console.error('Error getting booking by ID:', error);
      return null;
    }
  };
  
  /**
   * Checks for time slot availability
   */
  export const isTimeSlotAvailable = (staffId: number, date: string, time: string): boolean => {
    const existingBookings = getAllBookings();
    
    // Check if there's already a booking with the same staff, date and time
    const conflictingBooking = existingBookings.find(booking => 
      booking.staffId === staffId && 
      booking.date === date && 
      booking.time === time &&
      booking.status !== 'cancelled'
    );
    
    return !conflictingBooking;
  };
  
  /**
   * Generates a unique booking ID
   */
  export const generateBookingId = (): string => {
    return `book-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };
  
  /**
   * Get upcoming bookings (not cancelled and not in the past)
   */
  export const getUpcomingBookings = (): BookingDetails[] => {
    const now = new Date();
    return getAllBookings().filter(booking => {
      // Skip cancelled bookings
      if (booking.status === 'cancelled') return false;
      
      // Parse booking date and time
      const [weekday, month, day] = booking.date.split(' ');
      const [time, period] = booking.time.split(' ');
      const [hours, minutes] = time.split(':');
      
      // Create booking datetime
      const bookingDate = new Date();
      bookingDate.setDate(parseInt(day));
      
      // Set proper month
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      bookingDate.setMonth(months.indexOf(month));
      
      // Set time
      let hour = parseInt(hours);
      if (period === 'PM' && hour < 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      bookingDate.setHours(hour, parseInt(minutes), 0, 0);
      
      // Compare with current time
      return bookingDate > now;
    });
  };
  
  /**
   * Get past bookings (completed or in the past)
   */
  export const getPastBookings = (): BookingDetails[] => {
    const now = new Date();
    return getAllBookings().filter(booking => {
      // Include cancelled bookings in past bookings
      if (booking.status === 'cancelled' || booking.status === 'completed') return true;
      
      // Parse booking date and time
      const [weekday, month, day] = booking.date.split(' ');
      const [time, period] = booking.time.split(' ');
      const [hours, minutes] = time.split(':');
      
      // Create booking datetime
      const bookingDate = new Date();
      bookingDate.setDate(parseInt(day));
      
      // Set proper month
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      bookingDate.setMonth(months.indexOf(month));
      
      // Set time
      let hour = parseInt(hours);
      if (period === 'PM' && hour < 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      bookingDate.setHours(hour, parseInt(minutes), 0, 0);
      
      // Compare with current time
      return bookingDate <= now;
    });
  };
  
  export default {
    getAllBookings,
    addBooking,
    updateBooking,
    cancelBooking,
    getBookingById,
    isTimeSlotAvailable,
    generateBookingId,
    getUpcomingBookings,
    getPastBookings
  };