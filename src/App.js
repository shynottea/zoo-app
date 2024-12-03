import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthFromCookie } from './redux/slices/authSlice';
import ProtectedRoute from './routes/ProtectedRoute';

import AdminDashboard from './routes/Admin/AdminDashboard';
import ManagerDashboard from './routes/Manager/ManagerDashboard';
import EditUser from './routes/Admin/EditUser';
import Navbar from './Navbar';
import Cart from './routes/Cart/Cart';
import ProductList from './routes/Product/ProductList';
import ProductDetails from './routes/Product/ProductDetails';
import Contacts from './routes/Contacts';
import Login from './routes/Authentication/Login';
import Register from './routes/Authentication/Register';
import UserProfile from './routes/UserProfile/UserProfile';

const { Header, Content } = Layout;

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const { isAuth, username, role: userRole } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setAuthFromCookie());
  }, [dispatch]);

  useEffect(() => {
    if (isAuth && username) {
      // Check Notification permissions
      if (Notification.permission === 'granted') {
        // Show a system notification
        new Notification('Welcome Back!', {
          body: `Hello, ${username}!`,
          icon: '/logo192.png', // Replace with your app's icon
        });
      } else if (Notification.permission === 'default') {
        // Request notification permissions
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('Welcome Back!', {
              body: `Hello, ${username}!`,
              icon: '/logo192.png',
            });
          }
        });
      }
    }
  }, [isAuth, username]);
  

  const handleSearch = (value) => {
    setSearchQuery(value.toLowerCase());
  };

  return (
    <Layout>
      <Header>
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
            <Route path="/productlist" element={<ProductList searchQuery={searchQuery} />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user-profile" element={isAuth && userRole !== 'admin' ? <UserProfile /> : <Navigate to="/" />} />
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-dashboard/:userId" element={<EditUser />} />
            </Route>
            <Route element={<ProtectedRoute roles={['manager']} />}>
              <Route path="/manager-dashboard" element={<ManagerDashboard />} />
            </Route>
            <Route path="/" element={<Navigate to="/productlist" />} />
            <Route path="*" element={<Navigate to="/productlist" />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
