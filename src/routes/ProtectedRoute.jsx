import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ role }) => {
  const { isAuth, role: userRole } = useSelector((state) => state.auth);

  // If the user is authenticated and has the correct role, render child routes
  // Otherwise, redirect to the login page
  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  if (role && role !== userRole) {
    return <Navigate to="/home" />; // Redirect if user role does not match
  }

  return <Outlet />; // Render child routes if the user is authenticated
};

export default ProtectedRoute;
