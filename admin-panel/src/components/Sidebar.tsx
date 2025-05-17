import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Salon Management</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link 
              to="/" 
              className={`block px-4 py-2 rounded transition-colors ${
                isActive('/') ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/salons" 
              className={`block px-4 py-2 rounded transition-colors ${
                isActive('/salons') ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              Salons
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;