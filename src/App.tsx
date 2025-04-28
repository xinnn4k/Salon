import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ShopDetailPage from './pages/ShopDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CategoryPage from './pages/CategoryPage';
import SubcategoryDetailPage from './pages/SubCatePage';
import OrderPage from './pages/OrderPage';
import SalonDetailPage from './pages/SalonDetailPage';
import ServiceDetailPage from './pages/ServiceDetailPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop/:shopId" element={<ShopDetailPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/subcategory/:subcategoryId" element={<SubcategoryDetailPage />} />
        <Route path="/salon/:id" element={<SalonDetailPage />} />
        <Route path="*" element={<HomePage />} />
        <Route path="/salon/:salonId/services/:serviceId" element={<ServiceDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;