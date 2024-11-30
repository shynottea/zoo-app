// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * @param {string[]} roles - Array of roles that are allowed to access the route.
 */
const ProtectedRoute = ({ roles = [] }) => {
  const { isAuth, role: userRole } = useSelector((state) => state.auth);

  // If not authenticated, redirect to login
  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  // If roles are specified and user's role is not in the allowed roles, redirect
  if (roles.length > 0 && !roles.includes(userRole)) {
    return <Navigate to="/home" />; // Adjust the redirect path as needed
  }

  // Else, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
