import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ShopInfo from '../components/BarberShop/ShopInfo';
import Services from '../components/BarberShop/Services';
import Barbers from '../components/BarberShop/Barbers';
import Reviews from '../components/BarberShop/Reviews';
import BusinessHours from '../components/BarberShop/BusinessHours';
import LocationCard from '../components/UI/LocationCard';
import Button from '../components/UI/Button';
import { useBarberShop } from '../hooks/useBarberShop';
import { useBooking } from '../hooks/useBooking';

const ShopDetailPage: React.FC = () => {
  const { shopId = '1' } = useParams<{ shopId: string }>();
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const {
    loading,
    services,
    barbers,
    reviews,
    businessHours,
    shopInfo,
    nearbyLocations
  } = useBarberShop(shopId);
  
  const {
    selectedService,
    setSelectedService,
    bookingStep,
    setBookingStep,
    bookAppointment
  } = useBooking();
  
  const handleBookService = (serviceId: string) => {
    setSelectedService(serviceId);
    setShowBookingModal(true);
  };
  
  const handleCloseModal = () => {
    setShowBookingModal(false);
    setBookingStep(1);
  };
  
  if (loading || !shopInfo) {
    return (
      <Layout>
        <div className="max-w-screen-lg mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm">
              <li className="inline-flex items-center">
                <a href="/" className="text-gray-700 hover:text-blue-600">
                  Home
                </a>
              </li>
              <li>
                <span className="mx-2 text-gray-400">/</span>
                <a href="/barbershops" className="text-gray-700 hover:text-blue-600">
                  Barbershops
                </a>
              </li>
              <li>
                <span className="mx-2 text-gray-400">/</span>
                <a href="/locations/hong-kong" className="text-gray-700 hover:text-blue-600">
                  Hong Kong Island
                </a>
              </li>
            </ol>
          </nav>
        </div>
        
        <div className="bg-gray-100 mb-6 rounded-lg overflow-hidden h-64 flex items-center justify-center">
          <button className="text-blue-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            See all images
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <ShopInfo 
              name={shopInfo.name}
              address={shopInfo.address}
              description={shopInfo.description}
              rating={shopInfo.rating}
              status={shopInfo.status}
            />
            
            <Services services={services} onBookService={handleBookService} />
            
            <Barbers barbers={barbers} />
            
            <Reviews reviews={reviews} />
          </div>
          
          <div>
            <div className="sticky top-20">
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-2">Book an appointment</h3>
                <Button onClick={() => setShowBookingModal(true)} fullWidth>
                  Book now
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Instant Confirmation
                </p>
              </div>
              
              <BusinessHours hours={businessHours} />
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Other locations</h2>
                <div>
                  {nearbyLocations.slice(0, 3).map((location) => (
                    <LocationCard 
                      key={location.id} 
                      location={location} 
                      onClick={() => {
                        // In a real app, this would navigate to the location
                        console.log(`Navigate to location: ${location.name}`);
                      }} 
                    />
                  ))}
                </div>
                {nearbyLocations.length > 3 && (
                  <button className="w-full text-blue-600 mt-4 py-2">
                    See all
                  </button>
                )}
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Additional information</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-green-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Instant Confirmation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Book an appointment</h3>
                <button onClick={handleCloseModal}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              {bookingStep === 1 && (
                <div>
                  <h4 className="font-medium mb-3">Select a service</h4>
                  <div className="space-y-3">
                    {services.map((service) => (
                      <div 
                        key={service.id}
                        className={`p-3 border rounded-lg cursor-pointer ${
                          selectedService === service.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{service.name}</h5>
                            <p className="text-sm text-gray-500">{service.duration}</p>
                          </div>
                          <p className="font-semibold">
                            {service.priceFrom ? 'from ' : ''}{service.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Additional booking steps would be implemented here */}
            </div>
            <div className="p-4 border-t">
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => bookingStep < 3 ? setBookingStep(bookingStep + 1) : bookAppointment()}
                  disabled={!selectedService}
                >
                  {bookingStep < 3 ? 'Continue' : 'Book now'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ShopDetailPage;