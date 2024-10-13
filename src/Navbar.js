import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Input, Row, Col } from 'antd';
import zooLogo from './assets/zoo-logo.png';

const { Search } = Input;

const Navbar = () => {
  const items = [
    { key: 'products', label: <Link to="/productlist">Products</Link> },
    { key: 'contacts', label: <Link to="/contacts">Contacts</Link> },
    { key: 'cart', label: <Link to="/cart">Cart</Link> },
    { key: 'login', label: <Link to="/login">Login</Link> },
  ];

  const handleSearch = (value) => {
    console.log(value); // Handle the search value
  };

  return (
    <Row
      align="middle"  // Vertically align the contents
      justify="space-between"
      style={{ height: '100%', padding: '0 20px', display: 'flex' }} // Set height to fill parent and use flexbox for alignment
    >
      <Col>
        <div className="logo" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <img src={zooLogo} alt="Logo" style={{ height: '40px' }} />
        </div>
      </Col>

      <Col span={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Search
          placeholder="Search products..."
          onSearch={handleSearch}
          style={{ width: '300px' }}
        />
      </Col>

      <Col>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['products']}
          items={items}
          style={{ border: 'none', display: 'flex', alignItems: 'center' }}
        />
      </Col>
    </Row>
  );
};

export default Navbar;
