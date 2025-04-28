import { useState } from 'react';

export const useBooking = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState<number>(1);
  
  const canProceed = () => {
    switch (bookingStep) {
      case 1:
        return !!selectedService;
      case 2:
        return !!selectedBarber;
      case 3:
        return !!selectedDate && !!selectedTime;
      default:
        return false;
    }
  };
  
  const resetBooking = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedService(null);
    setSelectedBarber(null);
    setBookingStep(1);
  };
  
  const bookAppointment = async () => {
    // In a real app, this would be an API call
    if (canProceed()) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        resetBooking();
        return { success: true, message: 'Booking successful!' };
      } catch (error) {
        console.error('Error booking appointment:', error);
        return { success: false, message: 'Failed to book appointment. Please try again.' };
      }
    }
    return { success: false, message: 'Please complete all required fields.' };
  };
  
  return {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedService,
    setSelectedService,
    selectedBarber,
    setSelectedBarber,
    bookingStep,
    setBookingStep,
    canProceed,
    resetBooking,
    bookAppointment
  };
};