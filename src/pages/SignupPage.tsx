import React, { useState } from 'react';
import LoginImage from '../assets/image.png';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !repeatPassword) {
      setError('Бүх талбарыг бөглөнө үү');
      return;
    }

    if (password !== repeatPassword) {
      setError('Нууц үг таарахгүй байна');
      return;
    }

    const userData = {
      id: Date.now().toString(),
      email,
      password,
    };

    localStorage.setItem('signupUser', JSON.stringify(userData));


    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));

    navigate('/login');
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Link>

      <span className="block lg:hidden absolute top-4 right-4 text-3xl font-bold ">JinX</span>

      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8">
        <h1 className="text-3xl font-bold mb-6">Сайн уу, тавтай морил!</h1>
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <div className="">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
               Имайл
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border rounded-md"
            />
          </div>
          <div className="">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Нууц үг
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 border rounded-md"
            />
          </div>
          <div className="">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Нууц үг давтах
            </label>
            <input
              type="password"
              placeholder="Repeat password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="w-full p-3 mb-4 border rounded-md"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold">
            Бүртгүүлэх
          </button>
          <p className="mt-4 text-center">
            Та бүртгэлтэй бол <Link to="/login" className="text-blue-600 font-semibold">Нэвтрэх</Link>
          </p>
        </form>
      </div>

      <div className="hidden lg:block w-1/2">
        <img src={LoginImage} alt="Login illustration" className="h-full w-full object-cover" />
      </div>
    </div>
  );
};

export default SignupPage;
