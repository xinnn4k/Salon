import React from 'react';
import LoginImage from '../assets/image.png';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
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

      <span className="block lg:hidden absolute top-4 right-4 text-3xl font-bold ">
        JinX
      </span>

      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8">
        <h1 className="text-3xl font-bold mb-6">Дахин тавтай морил</h1>
        <form className="w-full max-w-md">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 border rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 border rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold"
          >
            Нэвтрэх
          </button>

          <p className="mt-4 text-center">
            Таньд бүртгэл байгаа юу? <a href="/signup" className="text-blue-600 font-semibold"> Бүртгүүлэх</a>
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
