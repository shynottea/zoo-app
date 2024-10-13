// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';


import Navbar from './Navbar';
import Cart from './routes/Cart';
import ProductList from './routes/ProductList';
import Contacts from './routes/Contacts';
import Login from './routes/Login';

const { Header, Content } = Layout;

const App = () => {
  return (
    <Layout>
      <Header>
        <div className="demo-logo" />
        <Navbar />
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
            <Route path="/productlist" element={<ProductList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProductList />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
