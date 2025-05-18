import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const role = localStorage.getItem('userRole');
  const salonId = localStorage.getItem('salonId');

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-8">Salon Management</h2>
      <ul className="space-y-2">
        {(role === 'super_admin' ) && (
          <li>
            <Link to="/" className={isActive('/') ? 'bg-gray-900 px-4 py-2 block rounded' : 'hover:bg-gray-700 px-4 py-2 block rounded'}>
              Dashboard
            </Link>
          </li>
        )}

        {(role === 'super_admin' ) && (
          <li>
            <Link to="/salons" className={isActive('/salons') ? 'bg-gray-900 px-4 py-2 block rounded' : 'hover:bg-gray-700 px-4 py-2 block rounded'}>
              Salons
            </Link>
          </li>
        )}

        {role === 'super_admin' && (
          <li>
            <Link to="/category" className="hover:bg-gray-700 px-4 py-2 block rounded">
              Category
            </Link>
          </li>
        )}

        {role === 'salon_admin' && (
          <li>
            <Link to="/salondetail" className="hover:bg-gray-700 px-4 py-2 block rounded">
              My Salon
            </Link>
          </li>
        )}
        {role === 'salon_admin' && (
          <li>
            <Link to={`/services/${salonId}`} className="hover:bg-gray-700 px-4 py-2 block rounded">
              Services
            </Link>
          </li>
        )}
        {role === 'salon_admin' && (
          <li>
            <Link to={`/staff/${salonId}`} className="hover:bg-gray-700 px-4 py-2 block rounded">
              Staff
            </Link>
          </li>
        )}
        {role === 'salon_admin' && (
          <li>
            <Link to={`/orders/${salonId}`} className="hover:bg-gray-700 px-4 py-2 block rounded">
              Orders
            </Link>
          </li>
        )}

        {role === 'talent' && (
          <li>
            <Link to="/talent" className="hover:bg-gray-700 px-4 py-2 block rounded">
              My Profile
            </Link>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
