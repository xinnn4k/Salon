// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        alert('Invalid email or password');
        return;
      }

      const data = await res.json();
      const { role, salonId, salonName, staffId, email: userEmail } = data.user;

      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', userEmail);

      if (salonId) localStorage.setItem('salonId', salonId);
      if (salonName) localStorage.setItem('salonName', salonName);
      if (staffId) localStorage.setItem('staffId', staffId);

      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      alert('Server error');
    }
  };



  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
