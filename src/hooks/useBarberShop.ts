import { useState, useEffect } from 'react';
import { Service, Barber, Review, BusinessHour, ShopLocation } from '../types';

export const useBarberShop = (shopId: string) => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [shopInfo, setShopInfo] = useState<any>(null);
  const [nearbyLocations, setNearbyLocations] = useState<ShopLocation[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchShopData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data based on the PDF
        setServices([
          { id: '1', name: 'Hair cut with hot towel', duration: '40 mins', price: 'HK$380', priceFrom: true },
          { id: '2', name: 'Kids hair cut (below 18 yrs old only）', duration: '35 mins', price: 'HK$270' },
        ]);
        
        setBarbers([
          { id: '1', name: 'Kash', role: 'Barber' },
          { id: '2', name: 'Larry', role: 'Barber' },
          { id: '3', name: 'Lok', role: 'Barber Lok' },
        ]);
        
        setReviews([
          { id: '1', author: 'David Bien P', date: 'Sat, Apr 19, 2025 at 14:58', content: 'good barbershop' },
          { id: '2', author: 'Ichiro S', date: 'Thu, Apr 17, 2025 at 14:37', content: 'Larry was terric. Engaging, professional and provided me with exactly the haircut I wanted.' },
          { id: '3', author: 'Kyle L', date: 'Thu, Apr 10, 2025 at 14:48', content: '👍 good' },
          { id: '4', author: 'Jackson P', date: 'Sat, Apr 5, 2025 at 16:16', content: 'Excellent work!' },
          { id: '5', author: 'Billy L', date: 'Fri, Apr 4, 2025 at 16:35', content: 'Great quick cut 👏😁' },
          { id: '6', author: 'Lucas C', date: 'Thu, Apr 3, 2025 at 12:09', content: 'Kash is a professional stylist' },
        ]);
        
        setBusinessHours([
          { day: 'Monday', hours: '11:00 - 21:00' },
          { day: 'Tuesday', hours: '11:00 - 21:00' },
          { day: 'Wednesday', hours: '11:00 - 21:00' },
          { day: 'Thursday', hours: '11:00 - 21:00' },
          { day: 'Friday', hours: '11:00 - 21:00' },
          { day: 'Saturday', hours: '11:00 - 21:00' },
          { day: 'Sunday', hours: '11:00 - 21:00' },
        ]);
        
        setShopInfo({
          name: 'Canton Barber Quarry Bay',
          address: 'Riviera Mansion, 18 Hoi Tai Street, Quarry Bay, Hong Kong Island',
          description: 'Canton Barber established in 2018, aiming to provide a relaxing and decent men\'s grooming experience. An integrated barber shop providing hair cut, bespoke tailoring and eyewear services located in Quarry Bay, Hong Kong. Our skilled professionals ensure every visit is a refined and enjoyable experience tailored to your individual style.',
          rating: '4,126',
          status: 'Closed - opens on Saturday at 11:00'
        });
        
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching shop data:', error);
        setLoading(false);
      }
    };

    fetchShopData();
  }, [shopId]);

  return {
    loading,
    services,
    barbers,
    reviews,
    businessHours,
    shopInfo,
    nearbyLocations
  };
};