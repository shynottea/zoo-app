import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ roles = [] }) => {
  const { isAuth, role: userRole } = useSelector((state) => state.auth);


  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !roles.includes(userRole)) {
    return <Navigate to="/home" />; 
  }

  return <Outlet />;
};

export default ProtectedRoute;
