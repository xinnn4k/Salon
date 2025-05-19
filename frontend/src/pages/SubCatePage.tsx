import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import PaginationCardList from '../components/UI/PaginationCardList';
import { FaArrowLeft } from 'react-icons/fa';

interface Subcategory {
  _id: string;
  name: string;
  image?: string;
  description?: string;
}

interface Salon {
  _id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  image?: string;
  [key: string]: any;
}

export default function SubcategoryDetailPage() {
  const { subcategoryId } = useParams<{ subcategoryId: string }>();
  const navigate = useNavigate();

  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        if (!subcategoryId) {
          throw new Error('Subcategory ID is missing');
        }
        
        const subcategoryRes = await fetch(`http://localhost:4000/api/categories/subcategory/${subcategoryId}`);
        
        if (!subcategoryRes.ok) {
          throw new Error('Failed to fetch subcategory');
        }
        
        const subcategoryData: Subcategory = await subcategoryRes.json();
        setSubcategory(subcategoryData);
        
        const salonsRes = await fetch(`http://localhost:4000/api/salons/by-subcategory/${subcategoryId}`);
        
        if (!salonsRes.ok) {
          throw new Error('Failed to fetch salons');
        }
        
        const salonsData: Salon[] = await salonsRes.json();
        setSalons(salonsData);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [subcategoryId]);

  if (loading || !subcategory) {
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
            {FaArrowLeft ({size: 15})}
            <span className="ml-2">Буцах</span>
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <img
              src={subcategory.image || '/default-image.jpg'}
              alt={subcategory.name}
              className="w-48 h-48 object-cover rounded-2xl shadow-md"
            />

            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{subcategory.name}</h1>
              <p className="text-gray-600 mb-6">
                {subcategory.description || `Энэ бол ${subcategory.name} дэлгэрэнгүй тайлбар.`}
              </p>
            </div>
          </div>

          <hr className="border-gray-300" />

          <div>
            {salons.length > 0 ? (
              <PaginationCardList items={salons} />
            ) : (
              <p className="text-center text-gray-500 py-8">
                Энэ үйлчилгээг үзүүлдэг салон одоогоор бүртгэгдээгүй байна.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}