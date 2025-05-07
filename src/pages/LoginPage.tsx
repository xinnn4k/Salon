import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LoginImage from '../assets/image.png';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login failed in LoginPage:', err);
    }
  };
  

  return (
    <div className="min-h-screen flex relative">
      <Link to="/" className="block absolute top-4 left-4 text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Link>

      <span className="block lg:hidden absolute top-4 right-4 text-3xl font-bold">
        JinX
      </span>

      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8">
        <h1 className="text-3xl font-bold mb-6">Дахин тавтай морил</h1>

        
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          {(error || formError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {formError || error}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="mt-1 text-right">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200 disabled:bg-blue-400"
            disabled={loading}
            onClick={(e) => {console.log("Button clicked");}}
          >
            {loading ? 'Уншиж байна...' : 'Нэвтрэх'}
          </button>

          <p className="mt-4 text-center">
            Таньд бүртгэл байгаа юу?{' '}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
              Бүртгүүлэх
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden lg:block w-1/2">
        <img
          src={LoginImage}
          alt="Login illustration"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;