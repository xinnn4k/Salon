import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const HomeHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  const toggleDropdown = () => setIsOpen(!isOpen);
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('.dropdown-container')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 shadow-sm py-3'
    }`}>
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <span className="text-black font-bold text-2xl">JinX</span>
          </a>
        </div>
        
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-4">
          <a href="/about" className="font-medium text-gray-700 hover:text-purple-700 transition-colors">Бидний тухай</a>
            <a href="/services" className="font-medium text-gray-700 hover:text-purple-700 transition-colors">Үйлчилгээнүүд</a>
          </nav>
          
          {!user && (
            <div className="hidden md:flex items-center space-x-3">
              <a href="/login" className="font-bold text-black hover:text-purple-700 transition-colors">Нэвтрэх</a>
              <span className="text-gray-400">/</span>
              <a href="/signup" className="font-bold text-gray-700 hover:text-purple-700 transition-colors">Бүртгүүлэх</a>
            </div>
          )}
          
          {user && (
            <div className="dropdown-container relative inline-block text-left">
              <div className="flex items-center gap-2">
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  {user.name || user.email.split('@')[0]}
                </span>
                <button
                  type="button"
                  className="flex items-center justify-center rounded-full bg-purple-100 p-2 text-purple-800 hover:bg-purple-200 transition-colors"
                  onClick={toggleDropdown}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                  <div className="py-2 px-4">
                    <p className="text-sm font-medium text-gray-900">{user.name || 'Хэрэглэгч'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/profile" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">                     <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Профайл
                    </Link> 
                    <Link to="/bookings" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Захиалга
                    </Link>
                    <Link to="/settings" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Тохиргоо
                    </Link>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={logout}
                      className="w-full text-left group flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <svg className="mr-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Гарах
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;