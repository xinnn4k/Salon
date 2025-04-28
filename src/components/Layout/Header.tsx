import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="max-w-screen-lg mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="text-blue-600 font-semibold text-lg">Fresha</a>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="/barbershops" className="text-gray-700 hover:text-blue-600">Barbershops</a>
          <a href="/locations" className="text-gray-700 hover:text-blue-600">Locations</a>
        </nav>
        <div>
          <button className="text-blue-600 font-medium">Get the app</button>
        </div>
      </div>
    </header>
  );
};

export default Header;