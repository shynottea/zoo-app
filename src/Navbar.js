// Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Input, Row, Col, Button } from 'antd';
import zooLogo from './assets/zoo-logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './redux/slices/authSlice';

const { Search } = Input;

const Navbar = ({ onSearch }) => {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    setSearchValue('');
    navigate('/productlist', { replace: true });
    if (onSearch) {
      onSearch('');
    }
  };

  const handleSearch = (value) => {
    if (onSearch) {
      onSearch(value);
    }
  };

  const items = [
    {
      key: 'productlist',
      label: (
        <span onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          Products
        </span>

      ),
    },
    { key: 'contacts', label: <Link to="/contacts">Contacts</Link> },
    isAuth && { key: 'cart', label: <Link to="/cart">Cart</Link> },
    isAuth
      ? {
          key: 'logout',
          label: (
            <Button onClick={() => dispatch(logout())}>Logout</Button>
          ),
        }
      : { key: 'login', label: <Link to="/login">Login</Link> },
  ].filter(Boolean);

  const selectedKeys = items
    .map((item) => item.key)
    .filter((key) => location.pathname.includes(key));

  return (
    <Row
      align="middle"
      justify="space-between"
      style={{ height: '100%', padding: '0 20px', display: 'flex' }}
    >
      <Col>
        <div
          className="logo"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            cursor: 'pointer',
          }}
          onClick={handleLogoClick}
        >
          <img src={zooLogo} alt="Logo" style={{ height: '40px' }} />
        </div>
      </Col>
      <Col
        span={12}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Search
          placeholder="Search products..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          style={{ width: '300px' }}
        />
      </Col>

      <Col>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={selectedKeys}
          items={items}
          style={{ border: 'none', display: 'flex', alignItems: 'center' }}
        />
      </Col>
    </Row>
  );
};

export default Navbar;
