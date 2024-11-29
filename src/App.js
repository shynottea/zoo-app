// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { useDispatch } from 'react-redux';
import { setAuthFromCookie } from './redux/slices/authSlice';
import ProtectedRoute from './routes/ProtectedRoute'; // Ensure correct import

import AdminDashboard from './routes/Admin/AdminDashboard'; // Admin page for user management
import UserProfile from './routes/UserProfile/UserProfile'; // User Profile component

import EditUser from './routes/Admin/EditUser';
import Navbar from './Navbar'; // Ensure correct path
import Cart from './routes/Cart/Cart';
import ProductList from './routes/Product/ProductList';
import ProductDetails from './routes/Product/ProductDetails';
import Contacts from './routes/Contacts';
import Login from './routes/Authentication/Login';
import Register from './routes/Authentication/Register';

const { Header, Content } = Layout;

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAuthFromCookie());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchQuery(value.toLowerCase());
  };

  return (
    <Layout>
      <Header>
        <div className="demo-logo" />
        <Navbar onSearch={handleSearch} />
      </Header>
      <Layout>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <Routes>
            {/* Public routes */}
            <Route path="/productlist" element={<ProductList searchQuery={searchQuery} />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes for admin */}
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-dashboard/:userId" element={<EditUser />} />
            </Route>

            {/* Protected route for authenticated users */}
            <Route element={<ProtectedRoute isAuthenticated />}>
              <Route path="/user-profile" element={<UserProfile />} /> {/* Correct component */}
            </Route>

            {/* Redirect root to product list */}
            <Route path="/" element={<Navigate to="/productlist" />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
