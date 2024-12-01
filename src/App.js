// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { useDispatch } from 'react-redux';
import { setAuthFromCookie } from './redux/slices/authSlice';
import ProtectedRoute from './routes/ProtectedRoute'; // Ensure correct import

import AdminDashboard from './routes/Admin/AdminDashboard'; // Admin page for user management
import ManagerDashboard from './routes/Manager/ManagerDashboard'; // Manager page for product management

import EditUser from './routes/Admin/EditUser'; // Ensure correct path
import Navbar from './Navbar'; // Ensure correct path
import Cart from './routes/Cart/Cart';
import ProductList from './routes/Product/ProductList';
import ProductDetails from './routes/Product/ProductDetails';
import Contacts from './routes/Contacts';
import Login from './routes/Authentication/Login';
import Register from './routes/Authentication/Register';

const { Header, Content } = Layout;
// Helper function to convert Base64 string to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAuthFromCookie());
  }, [dispatch]);
  useEffect(() => {
    dispatch(setAuthFromCookie());
    requestPushPermission(); // Request push notification permission
  }, [dispatch]);

  const requestPushPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Push notification permission granted.');
      subscribeUserToPush();
    } else {
      console.error('Push notification permission denied.');
    }
  };

  const subscribeUserToPush = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('BJlXprab7YxbZfCCAmlOb3Nw1rcD-6wDHLCHWS6hze_43aB3zoJPMKUX7QcmQMGVZd_AvFZ4JfgGTHvwIIZOR7o'),
    });
    // Send subscription to your backend server to store it
    await fetch('http://localhost:5000/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
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
              <Route element={<ProtectedRoute roles={['admin']} />}>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin-dashboard/:userId" element={<EditUser />} />
              </Route>

              {/* Protected routes for manager */}
              <Route element={<ProtectedRoute roles={['manager']} />}>
                <Route path="/manager-dashboard" element={<ManagerDashboard />} />
                {/* Add more manager-specific routes here if needed */}
              </Route>

              {/* Redirect root to product list */}
              <Route path="/" element={<Navigate to="/productlist" />} />

              {/* Catch-all route for undefined paths */}
              <Route path="*" element={<Navigate to="/productlist" />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
  );
};

export default App;
