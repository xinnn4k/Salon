import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CategoryPage from './pages/CategoryPage';
import SubcategoryDetailPage from './pages/SubCatePage';
import SalonDetailPage from './pages/SalonDetailPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import { AuthProvider } from './contexts/AuthContext';
import BookingsPage from './pages/OrdersPage';
import BookingDetailPage from './pages/BookingDetailPage';
import ProfilePage from './pages/ProfilePage';
import PaymentPage from './pages/PaymentPage';
import SalonMap from './pages/SalonMapPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/subcategory/:subcategoryId" element={<SubcategoryDetailPage />} />
            <Route path="/salon/:id" element={<SalonDetailPage />} />
            <Route path="*" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/salon/:salonId/services/:serviceId" element={<ServiceDetailPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/booking/:orderId" element={<BookingDetailPage />} />
            <Route path="/payment/:orderId" element={<PaymentPage />} />
            <Route path="/map" element={<SalonMap/>} />
          </Routes>
        </Router>
    </AuthProvider>
  );
};

export default App;