import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Input, Row, Col, Button } from 'antd';
import zooLogo from './assets/zoo-logo.png';
import { AuthContext } from './routes/Authentication/AuthContext';

const { Search } = Input;

const Navbar = ({ onSearch }) => {
  const { isAuth, logout } = useContext(AuthContext);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

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
    setSearchValue('');
  };

  const handleLogout = () => {
    logout();
  };

  const items = [
    {
      key: 'products',
      label: (
          <span onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        Products
      </span>
      ),
    },
    { key: 'contacts', label: <Link to="/contacts">Contacts</Link> },
    isAuth && { key: 'cart', label: <Link to="/cart">Cart</Link> },
    isAuth ? (
        {
          key: 'logout',
          label: (
              <span onClick={handleLogout} style={{ cursor: 'pointer'}}>
          Logout
        </span>
          ),
        }
    ) : (
        { key: 'login', label: <Link to="/login">Login</Link> }
    ),
  ].filter(Boolean);


  return (
      <Row align="middle" justify="space-between" style={{ height: '100%', padding: '0 20px', display: 'flex' }}>
        <Col>
          <div
              className="logo"
              style={{ display: 'flex', alignItems: 'center', height: '100%', cursor: 'pointer' }}
              onClick={handleLogoClick}
          >
            <img src={zooLogo} alt="Logo" style={{ height: '40px' }} />
          </div>
        </Col>

        <Col span={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
              defaultSelectedKeys={['products']}
              items={items}
              style={{ border: 'none', display: 'flex', alignItems: 'center' }}
          />
        </Col>
      </Row>
  );
};

export default Navbar;
