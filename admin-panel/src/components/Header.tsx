import React, { useEffect, useState } from 'react';

const Header: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('userRole');
    if (userData) {
      setUserName(userData);
    }
  }, []);

  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Salon Admin Panel</h1>
        <div className="flex items-center space-x-4">
          {userName && <span className="text-gray-600">{userName}</span>}
          <button
            onClick={() => {
              localStorage.removeItem('loggedIn');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="text-white bg-red-500 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
