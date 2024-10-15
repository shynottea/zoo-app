import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Input, Row, Col } from 'antd';
import zooLogo from './assets/zoo-logo.png';
import { AuthContext } from './routes/AuthContext';

const { Search } = Input;

const Navbar = ({ onSearch }) => {
  const { isAuth, logout } = useContext(AuthContext);
  const [searchValue, setSearchValue] = useState(''); // State for search input

  const items = [
    { key: 'products', label: <Link to="/productlist">Products</Link> },
    { key: 'contacts', label: <Link to="/contacts">Contacts</Link> },
    { key: 'cart', label: <Link to="/cart">Cart</Link> },
    isAuth
        ? { key: 'logout', label: <button onClick={logout}>Logout</button> }
        : { key: 'login', label: <Link to="/login">Login</Link> },
  ];

  const handleSearch = (value) => {
    if (onSearch) {
      onSearch(value);  // Pass the search query to the parent component
    }
    
    setSearchValue('');  // Clear the search input immediately
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
          value={searchValue} // Controlled input value
          onChange={(e) => setSearchValue(e.target.value)} // Update state on change
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
