import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Input, Row, Col } from 'antd';
import zooLogo from './assets/zoo-logo.png';
import { AuthContext } from './routes/AuthContext';

const { Search } = Input;

const Navbar = () => {
  const { isAuth, logout } = useContext(AuthContext);

  // Conditionally render the cart menu item based on authentication
  const items = [
    { key: 'products', label: <Link to="/productlist">Products</Link> },
    { key: 'contacts', label: <Link to="/contacts">Contacts</Link> },
    isAuth && { key: 'cart', label: <Link to="/cart">Cart</Link> }, // Only show Cart if user is authenticated
    isAuth
      ? { key: 'logout', label: <button onClick={logout}>Logout</button> }
      : { key: 'login', label: <Link to="/login">Login</Link> },
  ].filter(Boolean); // Filter out `false` values

  const handleSearch = (value) => {
    console.log(value);
  };

  return (
    <Row
      align="middle"
      justify="space-between"
      style={{ height: '100%', padding: '0 20px', display: 'flex' }}
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
