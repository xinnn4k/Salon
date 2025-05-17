import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SalonPage from './pages/SalonPage';
import ServicesPage from './pages/ServicesPage';
import StaffPage from './pages/StaffPage';
import OrdersPage from './pages/OrdersPage';
import Layout from './components/Layout';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/salons" element={<SalonPage />} />
          <Route path="/services/:salonId" element={<ServicesPage />} />
          <Route path="/staff/:salonId" element={<StaffPage />} />
          <Route path="/orders/:salonId" element={<OrdersPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;