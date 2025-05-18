import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SalonPage from './pages/SalonPage';
import ServicesPage from './pages/ServicesPage';
import StaffPage from './pages/StaffPage';
import OrdersPage from './pages/OrdersPage';
import Login from './pages/Login';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import SalonDashboard from './pages/SalonDashboard';
import TalentPage from './pages/TalentPage';
import CategoryPage from './pages/CategoryPage';


const RoleBasedRedirect = () => {
  const role = localStorage.getItem('userRole');

  switch (role) {
    case 'super_admin':
      return <Navigate to="/dashboard" />;
    case 'salon_admin':
      return <Navigate to="/salondetail" />;
    case 'talent':
      return <Navigate to="/talent" />;
    default:
      return <Navigate to="/login" />;
  }
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RoleBasedRedirect />} />
        <Route path="/*" element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/salondetail" element={<SalonDashboard />} />
                  <Route path="/talent" element={<TalentPage />} />
                  <Route path="/services/:salonId" element={<ServicesPage />} />
                  <Route path="/staff/:salonId" element={<StaffPage />} />
                  <Route path="/orders/:salonId" element={<OrdersPage />} />
                  <Route path="/talent" element={<TalentPage />} />
                  <Route path="/salons" element={
                        <PrivateRoute allowedRoles={['super_admin']}>
                          <SalonPage />
                        </PrivateRoute>
                      }
                    />
                  <Route path="/category" element={
                        <PrivateRoute allowedRoles={['super_admin']}>
                          <CategoryPage/>
                        </PrivateRoute>
                      }
                    />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
