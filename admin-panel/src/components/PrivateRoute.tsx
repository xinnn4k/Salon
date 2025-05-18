// src/components/PrivateRoute.tsx
import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: JSX.Element;
}

const PrivateRoute = ({ children, allowedRoles }: { children: JSX.Element; allowedRoles?: string[] }) => {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const role = localStorage.getItem('userRole');

  if (!loggedIn) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role || '')) return <Navigate to="/" />;

  return children;
};


export default PrivateRoute;
