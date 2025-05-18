// src/pages/AdminSalonPage.tsx
import React, { useEffect, useState } from 'react';
import { Salon } from '../types';
import { Link } from 'react-router-dom';

const AdminSalonPage: React.FC = () => {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const salonId = localStorage.getItem('salonId');

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/salons/${salonId}`);
        const data = await res.json();
        setSalon(data);
      } catch (err) {
        console.error('Failed to load salon:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalon();
  }, [salonId]);

  if (loading) return <div className="p-8">Loading...</div>;

  if (!salon) return <div className="p-8 text-red-500">Salon not found</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Welcome, {salon.name}</h2>
      <p className="mb-2 text-gray-600">Location: {salon.location}</p>

      <div className="flex gap-4 mt-4">
        <Link to={`/services/${salon._id}`} className="bg-blue-500 text-white px-4 py-2 rounded">Services</Link>
        <Link to={`/staff/${salon._id}`} className="bg-green-500 text-white px-4 py-2 rounded">Staff</Link>
        <Link to={`/orders/${salon._id}`} className="bg-purple-500 text-white px-4 py-2 rounded">Orders</Link>
      </div>
    </div>
  );
};

export default AdminSalonPage;
