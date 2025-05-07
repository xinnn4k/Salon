import { useNavigate, useParams } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { useEffect, useState, useMemo } from 'react';
import Layout from '../components/Layout/Layout';
import PaginationCardList from '../components/UI/PaginationCardList';
import { FaArrowLeft } from 'react-icons/fa';
import { useCardData } from '../hooks/useSalonData';

export default function SubcategoryDetailPage() {
  const { subcategoryId } = useParams<{ subcategoryId: string }>();
  const navigate = useNavigate();
  const categories = useCategories();
  const cardData = useCardData();
  
  // Use useMemo to find the subcategory
  const subcategory = useMemo(() => {
    return categories.flatMap(c => c.subcategories).find(sc => sc.id === subcategoryId) || null;
  }, [subcategoryId, categories]);
  
  // Use useMemo to filter the salons
  const matchedSalons = useMemo(() => {
    if (!subcategory) return [];
    
    return cardData.filter(salon =>
      salon.services.some(service => service.id === subcategory.id)
    );
  }, [subcategory, cardData]);

  if (!subcategory) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
        <div className="bg-white max-w-6xl w-full rounded-2xl shadow-xl p-8 space-y-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 transform shadow-md focus:outline-none"
          >
            {FaArrowLeft({ size: 15 })}
            <span className="ml-2">Буцах</span>
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <img
              src={subcategory.imageUrl.startsWith('http') ? subcategory.imageUrl : `${subcategory.imageUrl}`}
              alt={subcategory.name}
              className="w-48 h-48 object-cover rounded-2xl shadow-md"
            />

            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{subcategory.name}</h1>
              <p className="text-gray-600 mb-6">
                Энэ бол {subcategory.name} дэлгэрэнгүй тайлбар. Энд та илүү их мэдээлэл оруулж болно.
              </p>
            </div>
          </div>

          <hr className="border-gray-300" />

          <div>
            <PaginationCardList items={matchedSalons} />
          </div>
        </div>
      </div>
    </Layout>
  );
}