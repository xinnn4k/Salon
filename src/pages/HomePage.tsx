import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';
import { useCategories } from '../hooks/useCategories';
import HorizontalCardList from '../components/UI/HorizontalCardList';


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
            
            <div className="bg-white rounded-xl sm:mx-auto md:mx-28 lg:mx-0 p-3 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="md:col-span-2 lg:col-span-1" >
                  <input
                    type="text"
                    placeholder="Бүх үйлчилгээ, салон"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                  <input
                    type="text"
                    placeholder="Байршил"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-1">
                  <input
                    type="text"
                    placeholder="Огноо"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-1">
                  <input
                    type="text"
                    placeholder="Цаг"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div className="flex items-end rounded-3xl md:col-span-2 lg:col-span-1 flex justify-center">
                  <Button fullWidth className="bg-purple-500 hover:bg-purple-700 text-white">Хайх</Button>
                </div>
              </div>
            </div>
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
      

    </Layout>
  );
};

export default HomePage;
