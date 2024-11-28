import React, { useEffect } from 'react';
import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import { useDispatch } from 'react-redux';
import { setAuthFromCookie } from './redux/slices/authSlice';

import Navbar from './Navbar';
import Cart from './routes/Cart/Cart';
import ProductList from './routes/Product/ProductList';
import ProductDetails from './routes/Product/ProductDetails';
import Contacts from './routes/Contacts';
import Login from './routes/Authentication/Login';

const { Header, Content } = Layout;

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation(); 
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAuthFromCookie());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchQuery(value.toLowerCase());
  };

  useEffect(() => {
    if (location.pathname === '/products') {
      setSearchQuery('');
    }
  }, [location.pathname]); 
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
  );
};

export default App;
