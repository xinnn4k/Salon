import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Salon Admin Panel</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;