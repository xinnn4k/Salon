import { useState, useEffect, useMemo } from 'react';
import { useCategories } from './useCategories';

import BarberImage1 from '../assets/barbershop.png';
import BarberImage2 from '../assets/barbershop2.png';
import BeautySalon from '../assets/beauty salon.png';
import EyeSalons from '../assets/eye_salon.png';
import HairSalon from '../assets/hair_salon.png';

type Card = {
  id: number;
  name: string;
  rating: number;
  location: string;
  type: string;
  imageUrl: string;
  services: {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
  }[];
};

export const useCardData = (): Card[] => {
  const categories = useCategories();
  
  const cardData = useMemo(() => {
    const getSubcategoryById = (id: string) => {
      for (const cat of categories) {
        const found = cat.subcategories.find(sub => sub.id === id);
        if (found) return found;
      }
  
      return {
        id: '',
        name: 'Unknown Service',
        imageUrl: '',
        price: 0
      };
    };
  
    return [
      {
        id: 1,
        name: 'Barbershop One',  
        rating: 4.5,
        location: 'Натур',
        type: 'Үсчин',
        imageUrl: BarberImage1,
        services: [
          { ...getSubcategoryById('2-1'), price: 15000 },
          { ...getSubcategoryById('2-3'), price: 20000 }, // Эрэгтэй үс засалт
          { ...getSubcategoryById('8-1'), price: 5000 },  // Хүйтэн хатаалт
        ]
      },
      {
        id: 2,
        name: 'Beauty Salon',
        rating: 4.2,
        location: 'Маршал таун',
        type: 'Гоо сайхан',
        imageUrl: BeautySalon,
        services: [
          { ...getSubcategoryById('4-1'), price: 25000 }, // Арьс арчилгаа
          { ...getSubcategoryById('4-2'), price: 30000 }, // Массаж
          { ...getSubcategoryById('4-3'), price: 18000 }, // Гарын арчилгаа
        ]
      },
      {
        id: 3,
        name: 'Hair Salon',
        rating: 4.8,
        location: 'Зайсан',
        type: 'Үсчин',
        imageUrl: HairSalon,
        services: [
          { ...getSubcategoryById('1-1'), price: 12000 }, // Хүүхдийн үс засалт
          { ...getSubcategoryById('1-3'), price: 25000 }, // Онцгой арга хэмжээний засалт
          { ...getSubcategoryById('7-1'), price: 35000 }, // Бүх үс будах
        ]
      },
      {
        id: 4,
        name: 'Barbershop Two',
        rating: 4.3,
        location: 'Яармаг',
        type: 'Үсчин',
        imageUrl: BarberImage2,
        services: [
          { ...getSubcategoryById('2-2'), price: 18000 }, // Хусалт ба тэгшилгээ
          { ...getSubcategoryById('8-2'), price: 6000 },  // Халуун хатаалт
          { ...getSubcategoryById('7-2'), price: 30000 }, // Омбре будаг
        ]
      },
      {
        id: 5,
        name: 'Eyebrow Specialist',
        rating: 4.7,
        location: 'Жуков',
        type: 'Гоо сайхан',
        imageUrl: EyeSalons,
        services: [
          { ...getSubcategoryById('6-1'), price: 8000 }, // Хөмсөг засалт
          { ...getSubcategoryById('6-2'), price: 12000 }, // Сормуус сунгалт
          { ...getSubcategoryById('6-3'), price: 15000 }, // Сормуус буржгар
        ]
      }
    ];
  }, [categories]);

  return cardData;
};