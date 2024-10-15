import React, { useEffect } from 'react';
import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from 'antd';

import Navbar from './Navbar';
import Cart from './routes/Cart';
import ProductList from './routes/Product/ProductList';
import ProductDetails from './routes/Product/ProductDetails';
import Contacts from './routes/Contacts';
import Login from './routes/Login';

import { CartProvider } from './routes/CartContext';
import { AuthProvider } from './routes/AuthContext';

const { Header, Content } = Layout;

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation(); // Use useLocation to access the current route

  const handleSearch = (value) => {
    setSearchQuery(value.toLowerCase());
  };

  useEffect(() => {
    // Reset searchQuery when navigating to ProductList
    if (location.pathname === '/productlist') {
      setSearchQuery('');
    }
  }, [location.pathname]); // Depend on the pathname to reset search query

  return (
    <AuthProvider>
      <CartProvider>
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
                <Route path="/productlist" element={<ProductList searchQuery={searchQuery} />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/productlist" />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
