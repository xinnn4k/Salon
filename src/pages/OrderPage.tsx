import { useNavigate, useParams } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import PaginationCardList from '../components/UI/PaginationCardList';
import { FaArrowLeft } from 'react-icons/fa';

// Assuming you have an Order interface
interface Order {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: string;
  // Other properties of the order
}

export default function OrderPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const categories = useCategories();
  const [orders, setOrders] = useState<Order[]>([]); // Holds orders fetched from an API or local data
  const [order, setOrder] = useState<Order | null>(null);

  // Fetch orders from an API or another source
  useEffect(() => {
    const fetchOrders = async () => {
      // Replace with your actual API endpoint or local fetch logic
      const response = await fetch('/api/orders'); // Example API endpoint
      const data: Order[] = await response.json();
      setOrders(data);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (orderId) {
      // Find the order by its ID from the fetched orders
      const foundOrder = orders.find((o) => o.id === orderId);
      setOrder(foundOrder || null);
    }
  }, [orderId, orders]);

  if (!order) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
        <div className="bg-white max-w-6xl w-full rounded-2xl shadow-xl p-8 space-y-12">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 transform shadow-md focus:outline-none"
          >
            {FaArrowLeft ({size: 15}) }
            Буцах
          </button>

          {/* Order Details */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <img
              src={order.imageUrl.startsWith('http') ? order.imageUrl : `${order.imageUrl}`}
              alt={order.name}
              className="w-48 h-48 object-cover rounded-2xl shadow-md"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{order.name}</h1>
              <p className="text-gray-600 mb-6">{order.description}</p>
            </div>
          </div>

          <hr className="border-gray-300" />

          <div>
            <PaginationCardList />
          </div>
        </div>
      </div>
    </Layout>
  );
}
