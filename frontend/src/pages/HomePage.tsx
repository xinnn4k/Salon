import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';
import { useCategories } from '../hooks/useCategories';
import HorizontalCardList from '../components/UI/HorizontalCardList';
import { Calendar, MapPin, Search } from 'lucide-react';
import SearchSection from '../components/UI/SearchSection';


const HomePage: React.FC = () => {
  const categories = useCategories();

  return (
    <Layout>
      <section className="bg-gradient-to-r from-pink-300 via-pink-400 via-purple-400 to-purple-300 text-white py-16">
        <div className="max-w-screen-lg mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 md:text-center lg:text-start">
              Хэзээ ч, хаана ч байсан өөртөө анхаар
            </h1>
            <p className="mb-8 text-lg md:text-center lg:text-start">
            Гоо сайхны шилдэг үйлчилгээ үзүүлэгчдээс цагаа шууд захиал.
            </p>
            
            <SearchSection/>

          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Ангилал</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = category.icon as React.ElementType;
              return (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  state={{ name: category.name }}
                  className="block p-4 border rounded-lg hover:shadow-lg transition-shadow text-center"
                >
                  <Icon className="text-purple-500 text-3xl mx-auto mb-2" />
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <HorizontalCardList />
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Яагаад бидний үйлчилгээг сонгох вэ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-purple-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Цагийн хуваарь</h3>
              <p className="text-gray-600">24/7 онлайн захиалга хийх боломжтой, таны цагийг хэмнэнэ.</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-purple-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Хялбар хайлт</h3>
              <p className="text-gray-600">Таны хэрэгцээнд тохирсон мэргэжилтнийг олоход хялбар.</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-purple-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ойрхон байршил</h3>
              <p className="text-gray-600">Таны байршилд ойрхон үйлчилгээ үзүүлэгчдийг олоорой.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
