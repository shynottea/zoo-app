import React, { useState,useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input, Row, Col, Button, Space, message } from 'antd';
import zooLogo from './static/media/zoo-logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './redux/slices/authSlice';
import './static/css/Navbar.css';

const { Search } = Input;

const Navbar = ({ onSearch }) => {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const userRole = useSelector((state) => state.auth.role);
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const requestNotificationPermission = async () => {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        message.success('Notifications enabled!');
      } else if (permission === 'denied') {
        console.error('Notification permission denied.');
        message.error('Notifications are blocked. Please allow them in your browser settings.');
      }
    } else if (Notification.permission === 'granted') {
      console.log('Notifications already enabled.');
    } else {
      console.error('Notifications are already blocked.');
    }
  };
  useEffect(() => {
    requestNotificationPermission();
  }, []);
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

  const isActive = (path) => location.pathname === path;

  return (
      <div className="navbar">
        <Row align="middle" justify="space-between">
          {/* Logo */}
          <Col>
            <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
              <img src={zooLogo} alt="Logo" style={{ height: '40px' }} />
            </div>
          </Col>

          {/* Search Bar */}
          <Col xs={24} sm={12} md={8} lg={8} xl={8} style={{ textAlign: 'center' }}>
            <Search
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onSearch={handleSearch}
                allowClear
                style={{
                  maxWidth: '300px',
                  width: '100%',
                }}
            />
          </Col>

          {/* Navigation Items */}
          <Col>
            <Space size="middle" className="navItems">
              {/* Products */}
              <Button
                  type="text"
                  onClick={() => navigate('/productlist')}
                  className={`navButton ${isActive('/productlist') ? 'active' : ''}`}
              >
                Products
              </Button>

              {/* Contacts */}
              <Button
                  type="text"
                  onClick={() => navigate('/contacts')}
                  className={`navButton ${isActive('/contacts') ? 'active' : ''}`}
              >
                Contacts
              </Button>

              {/* Cart (only if authenticated) */}
              {isAuth && (
                  <Button
                      type="text"
                      onClick={() => navigate('/cart')}
                      className={`navButton ${isActive('/cart') ? 'active' : ''}`}
                  >
                    Cart
                  </Button>
              )}

              {/* Admin Dashboard (only if admin) */}
              {isAuth && userRole === 'admin' && (
                  <Button
                      type="text"
                      onClick={() => navigate('/admin-dashboard')}
                      className={`navButton ${isActive('/admin-dashboard') ? 'active' : ''}`}
                  >
                    Admin Dashboard
                  </Button>
              )}

              {/* Manager Dashboard (only if manager) */}
              {isAuth && userRole === 'manager' && (
                  <Button
                      type="text"
                      onClick={() => navigate('/manager-dashboard')}
                      className={`navButton ${isActive('/manager-dashboard') ? 'active' : ''}`}
                  >
                    Manager Dashboard
                  </Button>
              )}

              {/* Login/Logout and Profile */}
              {isAuth ? (
                  <>
                    <Button
                        type="text"
                        onClick={() => navigate('/user-profile')} // Navigate to the profile route
                        className={`navButton ${isActive('/user-profile') ? 'active' : ''}`} // Highlight the button if active
                    >
                      Profile
                    </Button>
                    <Button
                        type="text"
                        onClick={() => {
                          dispatch(logout());
                          navigate('/login'); // Redirect to login after logout
                        }}
                        className="navButton"
                    >
                      Logout
                    </Button>
                  </>
              ) : (
                  <Button
                      type="text"
                      onClick={() => navigate('/login')}
                      className={`navButton ${isActive('/login') ? 'active' : ''}`}
                  >
                    Login
                  </Button>
              )}
            </Space>
          </Col>
        </Row>
      </div>
  );
};

export default Navbar;